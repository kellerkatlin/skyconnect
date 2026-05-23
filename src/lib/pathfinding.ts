import type { Ruta, Criterio, OpcionViaje, TramoViaje } from './types';
import { TIEMPO_CONEXION_MIN } from './pricing';

export function matrizCostos(rutas: Ruta[], n: number): Float32Array[] {
  const C = Array.from({ length: n }, () => new Float32Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) C[i][i] = 0;
  for (const r of rutas) {
    C[r.from][r.to] = r.costoBase;
    C[r.to][r.from] = r.costoBase;
  }
  return C;
}

export function matrizTiempos(rutas: Ruta[], n: number): Float32Array[] {
  const T = Array.from({ length: n }, () => new Float32Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) T[i][i] = 0;
  for (const r of rutas) {
    T[r.from][r.to] = r.duracionMin;
    T[r.to][r.from] = r.duracionMin;
  }
  return T;
}

export function floydWarshall(W: Float32Array[]): Float32Array[] {
  return floydWarshallWithNext(W).D;
}

export function floydWarshallWithNext(W: Float32Array[]): { D: Float32Array[]; next: Int16Array[] } {
  const n = W.length;
  const D = W.map(row => new Float32Array(row));
  const next = Array.from({ length: n }, () => new Int16Array(n).fill(-1));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && W[i][j] < Infinity) next[i][j] = j;
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      const dik = D[i][k];
      if (dik === Infinity) continue;
      for (let j = 0; j < n; j++) {
        const cand = dik + D[k][j];
        if (cand < D[i][j]) {
          D[i][j] = cand;
          next[i][j] = next[i][k];
        }
      }
    }
  }
  return { D, next };
}

export function reconstruirRuta(next: Int16Array[], i: number, j: number): number[] {
  if (i === j) return [i];
  if (next[i][j] < 0) return [];
  const path: number[] = [i];
  let cur = i;
  for (let guard = 0; guard < next.length + 1; guard++) {
    const nxt = next[cur][j];
    if (nxt < 0) return [];
    cur = nxt;
    path.push(cur);
    if (cur === j) return path;
  }
  return [];
}

export function dijkstra(W: Float32Array[], origen: number): Float32Array {
  const n = W.length;
  const dist = new Float32Array(n).fill(Infinity);
  const visit = new Uint8Array(n);
  dist[origen] = 0;
  for (let iter = 0; iter < n; iter++) {
    let u = -1, best = Infinity;
    for (let i = 0; i < n; i++) {
      if (!visit[i] && dist[i] < best) { best = dist[i]; u = i; }
    }
    if (u === -1) break;
    visit[u] = 1;
    const row = W[u];
    for (let v = 0; v < n; v++) {
      const cand = dist[u] + row[v];
      if (cand < dist[v]) dist[v] = cand;
    }
  }
  return dist;
}

// Adjacency list (id → vecinos con tramo) construida una vez para enumeración
type Adj = Map<number, { vecino: number; tramo: TramoViaje }[]>;

function construirAdj(rutas: Ruta[]): Adj {
  const adj: Adj = new Map();
  const push = (a: number, b: number, costo: number, duracionMin: number) => {
    if (!adj.has(a)) adj.set(a, []);
    adj.get(a)!.push({ vecino: b, tramo: { from: a, to: b, costo, duracionMin } });
  };
  for (const r of rutas) {
    push(r.from, r.to, r.costoBase, r.duracionMin);
    push(r.to, r.from, r.costoBase, r.duracionMin);
  }
  return adj;
}

export type PathBase = { path: number[]; tramos: TramoViaje[] };

export function enumerarPaths(
  rutas: Ruta[], origen: number, destino: number, maxEscalas: 0 | 1 | 2
): PathBase[] {
  if (origen === destino) return [];
  const adj = construirAdj(rutas);
  const maxLen = maxEscalas + 1;
  const out: PathBase[] = [];

  function dfs(actual: number, path: number[], tramos: TramoViaje[]) {
    if (tramos.length > maxLen) return;
    if (actual === destino && tramos.length > 0) {
      out.push({ path: [...path], tramos: [...tramos] });
      return;
    }
    if (tramos.length === maxLen) return;
    const vecinos = adj.get(actual) ?? [];
    for (const { vecino, tramo } of vecinos) {
      if (path.includes(vecino)) continue; // sin ciclos
      path.push(vecino);
      tramos.push(tramo);
      dfs(vecino, path, tramos);
      path.pop();
      tramos.pop();
    }
  }

  dfs(origen, [origen], []);
  return out;
}

function scoreCosto(p: PathBase): number {
  return p.tramos.reduce((s, t) => s + t.costo, 0);
}
function scoreTiempo(p: PathBase): number {
  const vuelo = p.tramos.reduce((s, t) => s + t.duracionMin, 0);
  return vuelo + Math.max(0, p.tramos.length - 1) * TIEMPO_CONEXION_MIN;
}

function toOpcion(p: PathBase, criterios: Criterio[]): OpcionViaje {
  return {
    path: p.path,
    tramos: p.tramos,
    costoTotal: scoreCosto(p),
    tiempoTotalMin: scoreTiempo(p),
    escalas: Math.max(0, p.tramos.length - 1),
    criterios,
  };
}

export type FiltrosBusqueda = {
  maxEscalas?: 0 | 1 | 2;
  presupuestoMax?: number;
  duracionMaxMin?: number;
  multiplicadorPrecio?: number;
};

export type ResultadoBusqueda = {
  barata: OpcionViaje | null;
  rapida: OpcionViaje | null;
  balance: OpcionViaje | null;
  todas: OpcionViaje[];
  total: number;
};

export function topKRutas(
  rutas: Ruta[], origen: number, destino: number, filtros: FiltrosBusqueda = {}
): ResultadoBusqueda {
  const max = filtros.maxEscalas ?? 2;
  const mult = filtros.multiplicadorPrecio ?? 1;
  let paths = enumerarPaths(rutas, origen, destino, max);
  if (filtros.presupuestoMax != null) paths = paths.filter(p => scoreCosto(p) <= filtros.presupuestoMax!);
  if (filtros.duracionMaxMin != null) paths = paths.filter(p => scoreTiempo(p) <= filtros.duracionMaxMin!);
  if (paths.length === 0) return { barata: null, rapida: null, balance: null, todas: [], total: 0 };

  const pickBy = (scoreFn: (p: PathBase) => number) => {
    let best = paths[0], bestScore = scoreFn(best);
    for (const p of paths) {
      const s = scoreFn(p);
      if (s < bestScore) { bestScore = s; best = p; }
    }
    return best;
  };

  // Balance pondera costo con el multiplicador real de clase para que
  // en Business se prefieran rutas más rápidas frente a las más baratas.
  const scoreBalanceMult = (p: PathBase) =>
    scoreCosto(p) * mult + (scoreTiempo(p) / 60) * 30;

  const pBarata = pickBy(scoreCosto);
  const pRapida = pickBy(scoreTiempo);
  const pBalance = pickBy(scoreBalanceMult);

  const key = (p: PathBase) => p.path.join('-');
  const kB = key(pBarata), kR = key(pRapida), kBal = key(pBalance);

  // Construir lista completa ordenada por costo con badges asignados
  const todas: OpcionViaje[] = [...paths]
    .sort((a, b) => scoreCosto(a) - scoreCosto(b))
    .map(p => {
      const k = key(p);
      const criterios: Criterio[] = [];
      if (k === kB) criterios.push('barata');
      if (k === kR) criterios.push('rapida');
      if (k === kBal) criterios.push('balance');
      return toOpcion(p, criterios);
    });

  // Mantener campos legacy barata/rapida/balance para compatibilidad
  const tagBarata: Criterio[] = ['barata'];
  if (kBal === kB) tagBarata.push('balance');
  const tagRapida: Criterio[] = ['rapida'];
  if (kBal === kR) tagRapida.push('balance');

  return {
    barata: toOpcion(pBarata, tagBarata),
    rapida: kR === kB ? null : toOpcion(pRapida, tagRapida),
    balance: (kBal === kB || kBal === kR) ? null : toOpcion(pBalance, ['balance']),
    todas,
    total: paths.length,
  };
}
