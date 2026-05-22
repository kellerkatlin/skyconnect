import { useMemo, useState, useCallback } from 'react';
import type { Ciudad, Regiones, Ruta } from './types';
import { ciudadesSeed, regionesSeed } from '../data/cities';
import { rutasSeed } from '../data/routes';
import { construirMatrizDesdeRutas, productoBooleano } from './matrix';
import { matrizCostos, matrizTiempos, floydWarshall } from './pathfinding';
import { loadUserData, saveUserData } from './storage';
import { generarCostoYTiempo } from './pricing';

export function useEstado() {
  const [version, setVersion] = useState(0);

  const data = useMemo(() => {
    const ud = loadUserData();
    const ciudades: Ciudad[] = [...ciudadesSeed, ...ud.ciudadesExtra];
    const regiones: Regiones = JSON.parse(JSON.stringify(regionesSeed));
    for (const c of ud.ciudadesExtra) regiones[c.region].ids.push(c.id);

    const rutas: Ruta[] = [...rutasSeed, ...ud.rutasExtra];
    const n = ciudades.length;

    const A = construirMatrizDesdeRutas(rutas, n);
    const A2 = productoBooleano(A, A);
    const A3 = productoBooleano(A2, A);
    const C = matrizCostos(rutas, n);
    const T = matrizTiempos(rutas, n);
    const D = floydWarshall(C);

    return { ciudades, regiones, rutas, A, A2, A3, C, T, D };
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

  const agregarRuta = useCallback((from: number, to: number, costoBase?: number, duracionMin?: number) => {
    const ud = loadUserData();
    const yaExiste = (a: number, b: number) =>
      rutasSeed.some(r => (r.from === a && r.to === b) || (r.from === b && r.to === a)) ||
      ud.rutasExtra.some(r => (r.from === a && r.to === b) || (r.from === b && r.to === a));
    if (yaExiste(from, to)) return false;

    let cb = costoBase, dm = duracionMin;
    if (cb == null || dm == null) {
      const all = [...ciudadesSeed, ...ud.ciudadesExtra];
      const a = all.find(x => x.id === from)!;
      const b = all.find(x => x.id === to)!;
      const auto = generarCostoYTiempo(a, b);
      if (cb == null) cb = auto.costoBase;
      if (dm == null) dm = auto.duracionMin;
    }
    ud.rutasExtra.push({ from, to, costoBase: cb!, duracionMin: dm! });
    saveUserData(ud);
    setVersion(v => v + 1);
    return true;
  }, []);

  return { ...data, recargar, agregarCiudad, agregarRuta };
}
