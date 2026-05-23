import type { Ruta } from './types';

export function construirMatrizDesdeRutas(rutas: Ruta[], n: number): Uint8Array[] {
  const A = Array.from({ length: n }, () => new Uint8Array(n));
  for (const r of rutas) {
    A[r.from][r.to] = 1;
    A[r.to][r.from] = 1;
  }
  return A;
}

export function productoBooleano(M1: Uint8Array[], M2: Uint8Array[]): Uint8Array[] {
  const n = M1.length;
  const C = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      if (M1[i][k] === 1) {
        const fila = M2[k];
        const out = C[i];
        for (let j = 0; j < n; j++) {
          if (fila[j] === 1) out[j] = 1;
        }
      }
    }
  }
  return C;
}

export function hallar1Escala(A: Uint8Array[], i: number, j: number): number[] {
  if (i === j) return [];
  const n = A.length;
  const res: number[] = [];
  for (let k = 0; k < n; k++) {
    if (k !== i && k !== j && A[i][k] === 1 && A[k][j] === 1) res.push(k);
  }
  return res;
}

export function hallar2Escalas(
  A: Uint8Array[], i: number, j: number, limite = 50
): [number, number][] {
  if (i === j) return [];
  const n = A.length;
  const res: [number, number][] = [];
  for (let k1 = 0; k1 < n; k1++) {
    if (k1 === i || k1 === j || A[i][k1] !== 1) continue;
    for (let k2 = 0; k2 < n; k2++) {
      if (k2 === i || k2 === j || k2 === k1) continue;
      if (A[k1][k2] === 1 && A[k2][j] === 1) {
        res.push([k1, k2]);
        if (res.length >= limite) return res;
      }
    }
  }
  return res;
}

export function gradoNodos(A: Uint8Array[]): number[] {
  return A.map(fila => fila.reduce((s, v) => s + v, 0));
}

export function totalRutasUnicas(A: Uint8Array[]): number {
  const n = A.length;
  let t = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) if (A[i][j] === 1) t++;
  }
  return t;
}
