import type { Ciudad, Clase } from './types';

const CONEXION_MIN = 90;

function distanciaEsquematica(a: Ciudad, b: Ciudad): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function hashDeterminista(i: number, j: number): number {
  const lo = Math.min(i, j), hi = Math.max(i, j);
  const seed = (lo * 1000 + hi) * 2654435761 >>> 0;
  return ((seed % 1000) / 1000) - 0.5;
}

export function generarCostoYTiempo(a: Ciudad, b: Ciudad): { costoBase: number; duracionMin: number } {
  const d = distanciaEsquematica(a, b);
  const ruido = hashDeterminista(a.id, b.id);
  const costoBase = Math.round(40 + d * 0.25 * (1 + ruido * 0.3));
  const duracionMin = Math.round(30 + d * 0.6 * (1 + ruido * 0.2));
  return { costoBase, duracionMin };
}

function hashFecha(yyyymmdd: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < yyyymmdd.length; i++) {
    h ^= yyyymmdd.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

export function multiplicadorFecha(fechaISO: string | null): number {
  if (!fechaISO) return 1.0;
  const r = hashFecha(fechaISO);
  return 0.85 + r * 0.4;
}

export function multiplicadorClase(c: Clase): number {
  return c === 'business' ? 2.8 : 1.0;
}

export const TIEMPO_CONEXION_MIN = CONEXION_MIN;
