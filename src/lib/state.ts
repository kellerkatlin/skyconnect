import { useMemo, useState, useCallback } from 'react';
import type { Ciudad, Regiones, Estado } from './types';
import { ciudadesSeed, regionesSeed } from '../data/cities';
import { construirMatrizDesdeRutas, productoBooleano } from './matrix';
import { loadUserData, saveUserData } from './storage';

// Rutas Fase 1 (sin costos/tiempos todavía — Task 22 las reemplaza con datos ponderados).
// Mientras tanto, generamos rutas placeholder con costoBase=0 y duracionMin=0.
import { rutasParesSeed } from '../data/routes';

export type EstadoFase1 = Omit<Estado, 'C' | 'T' | 'D' | 'rutas'> & {
  ciudades: Ciudad[];
  regiones: Regiones;
  rutasPares: [number, number][];
};

export function useEstado() {
  const [version, setVersion] = useState(0);

  const data = useMemo(() => {
    const ud = loadUserData();
    const ciudades = [...ciudadesSeed, ...ud.ciudadesExtra];
    const regiones: Regiones = JSON.parse(JSON.stringify(regionesSeed));
    for (const c of ud.ciudadesExtra) {
      regiones[c.region].ids.push(c.id);
    }
    // En Fase 1, rutas ponderadas se reducen a pares
    const rutasPares: [number, number][] = [
      ...rutasParesSeed,
      ...ud.rutasExtra.map(r => [r.from, r.to] as [number, number]),
    ];
    const n = ciudades.length;
    const A = construirMatrizDesdeRutas(
      rutasPares.map(([from, to]) => ({ from, to, costoBase: 0, duracionMin: 0 })),
      n
    );
    const A2 = productoBooleano(A, A);
    const A3 = productoBooleano(A2, A);
    return { ciudades, regiones, rutasPares, A, A2, A3 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const recargar = useCallback(() => setVersion(v => v + 1), []);

  const agregarCiudad = useCallback((c: Omit<Ciudad, 'id'>) => {
    const ud = loadUserData();
    const id = ciudadesSeed.length + ud.ciudadesExtra.length;
    ud.ciudadesExtra.push({ ...c, id });
    saveUserData(ud);
    setVersion(v => v + 1);
    return id;
  }, []);

  const agregarRuta = useCallback((from: number, to: number, costoBase = 0, duracionMin = 0) => {
    const ud = loadUserData();
    const yaExiste = (a: number, b: number) =>
      rutasParesSeed.some(([x, y]) => (x === a && y === b) || (x === b && y === a)) ||
      ud.rutasExtra.some(r => (r.from === a && r.to === b) || (r.from === b && r.to === a));
    if (yaExiste(from, to)) return false;
    ud.rutasExtra.push({ from, to, costoBase, duracionMin });
    saveUserData(ud);
    setVersion(v => v + 1);
    return true;
  }, []);

  return { ...data, recargar, agregarCiudad, agregarRuta };
}
