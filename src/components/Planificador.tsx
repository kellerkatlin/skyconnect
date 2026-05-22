import { useState, useMemo } from 'react';
import type { Clase } from '../lib/types';
import { topKRutas } from '../lib/pathfinding';
import { multiplicadorClase, multiplicadorFecha } from '../lib/pricing';
import { saveReserva } from '../lib/storage';
import { OpcionViajeCard } from './OpcionViajeCard';
import type { useEstado } from '../lib/state';

type Props = {
  estado: ReturnType<typeof useEstado>;
  origen: number | null;
  setOrigen: (v: number | null) => void;
  destino: number | null;
  setDestino: (v: number | null) => void;
  setRutaResaltada: (path: number[] | null) => void;
  setToast: (t: { msg: string; err?: boolean } | null) => void;
};

function generarCodigo(origenNombre: string, destinoNombre: string): string {
  const code = (s: string) => s.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3);
  const r = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
  return `SKY-${code(origenNombre)}${code(destinoNombre)}-${r}`;
}

export function Planificador({ estado, origen, setOrigen, destino, setDestino, setRutaResaltada, setToast }: Props) {
  const { ciudades, rutas } = estado;
  const [fecha, setFecha] = useState<string>('');
  const [pasajeros, setPasajeros] = useState<number>(1);
  const [clase, setClase] = useState<Clase>('economica');
  const [presupuesto, setPresupuesto] = useState<number | ''>('');
  const [duracionMax, setDuracionMax] = useState<number | ''>('');
  const [maxEscalas, setMaxEscalas] = useState<0 | 1 | 2>(2);

  const multPrecio = multiplicadorClase(clase) * multiplicadorFecha(fecha || null);

  const resultado = useMemo(() => {
    if (origen == null || destino == null || origen === destino) return null;
    return topKRutas(rutas, origen, destino, {
      maxEscalas,
      presupuestoMax: presupuesto === '' ? undefined : (presupuesto / multPrecio / pasajeros),
      duracionMaxMin: duracionMax === '' ? undefined : duracionMax * 60,
    });
  }, [rutas, origen, destino, maxEscalas, presupuesto, duracionMax, multPrecio, pasajeros]);

  // Deduplica opciones por path (cuando la misma ruta cae en varios criterios)
  const opcionesUnicas = useMemo(() => {
    if (!resultado) return [];
    const orden = [resultado.barata, resultado.rapida, resultado.balance];
    const seen = new Map<string, typeof resultado.barata>();
    for (const opc of orden) {
      if (!opc) continue;
      const key = opc.path.join('-');
      const prev = seen.get(key);
      if (prev) {
        // mergear criterios para no perder etiquetas
        const merged = { ...prev, criterios: Array.from(new Set([...(prev.criterios), ...opc.criterios])) };
        seen.set(key, merged);
      } else {
        seen.set(key, opc);
      }
    }
    return Array.from(seen.values()).filter((x): x is NonNullable<typeof x> => x != null);
  }, [resultado]);

  function reservar(opcionIdx: number) {
    if (!resultado) return;
    const opcion = opcionesUnicas[opcionIdx];
    if (!opcion) return;
    const o = ciudades[origen!], d = ciudades[destino!];
    const codigo = generarCodigo(o.nombre, d.nombre);
    saveReserva({
      codigo,
      origenId: origen!,
      destinoId: destino!,
      fecha: fecha || new Date().toISOString().slice(0, 10),
      pasajeros,
      clase,
      opcion,
      createdAt: new Date().toISOString(),
    });
    setToast({ msg: `Reserva confirmada: ${codigo}` });
    setRutaResaltada(opcion.path);
  }

  return (
    <div className="search-grid">
      <div>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Itinerario</div>
              <div className="card-sub">Compara las 3 mejores opciones: la más barata, la más rápida y el mejor balance</div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-row">
              <label className="label">Origen</label>
              <select className="select" value={origen ?? ''}
                      onChange={e => setOrigen(e.target.value === '' ? null : +e.target.value)}>
                <option value="">— Selecciona —</option>
                {ciudades.map(c => (
                  <option key={c.id} value={c.id}>{String(c.id + 1).padStart(2, '0')} · {c.nombre}, {c.pais}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label className="label">Destino</label>
              <select className="select" value={destino ?? ''}
                      onChange={e => setDestino(e.target.value === '' ? null : +e.target.value)}>
                <option value="">— Selecciona —</option>
                {ciudades.map(c => (
                  <option key={c.id} value={c.id}>{String(c.id + 1).padStart(2, '0')} · {c.nombre}, {c.pais}</option>
                ))}
              </select>
            </div>
            <div className="form-grid-3">
              <div className="form-row">
                <label className="label">Fecha</label>
                <input className="input" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
              </div>
              <div className="form-row">
                <label className="label">Pasajeros</label>
                <input className="input" type="number" min={1} max={9} value={pasajeros}
                       onChange={e => setPasajeros(Math.max(1, Math.min(9, +e.target.value || 1)))} />
              </div>
              <div className="form-row">
                <label className="label">Clase</label>
                <select className="select" value={clase} onChange={e => setClase(e.target.value as Clase)}>
                  <option value="economica">Económica</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
            <div className="form-grid-3" style={{ marginTop: 4 }}>
              <div className="form-row">
                <label className="label">Presupuesto máx (USD)</label>
                <input className="input" type="number" min={0} placeholder="sin límite"
                       value={presupuesto}
                       onChange={e => setPresupuesto(e.target.value === '' ? '' : +e.target.value)} />
              </div>
              <div className="form-row">
                <label className="label">Duración máx (h)</label>
                <input className="input" type="number" min={0} placeholder="sin límite"
                       value={duracionMax}
                       onChange={e => setDuracionMax(e.target.value === '' ? '' : +e.target.value)} />
              </div>
              <div className="form-row">
                <label className="label">Máx escalas</label>
                <select className="select" value={maxEscalas} onChange={e => setMaxEscalas(+e.target.value as 0|1|2)}>
                  <option value={0}>Solo directo</option>
                  <option value={1}>Hasta 1 escala</option>
                  <option value={2}>Hasta 2 escalas</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="results">
        {origen == null || destino == null ? (
          <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: 48, color: 'var(--ink-3)' }}>
            Selecciona origen y destino para comparar opciones.
          </div></div>
        ) : origen === destino ? (
          <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: 32, color: 'var(--sky-red)' }}>
            Origen y destino no pueden ser la misma ciudad.
          </div></div>
        ) : !resultado || resultado.total === 0 ? (
          <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: 32, color: 'var(--ink-3)' }}>
            No hay rutas que cumplan los filtros. Prueba ampliar el presupuesto o número de escalas.
          </div></div>
        ) : (
          <>
            {opcionesUnicas.length === 1 && resultado.total >= 1 && (
              <div className="card" style={{ background: 'var(--paper-2)', marginBottom: 12 }}>
                <div className="card-body" style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                  Solo existe <strong>1 itinerario</strong> compatible con tus filtros, por lo que se etiqueta como la más barata, la más rápida y el mejor balance simultáneamente. Amplía el presupuesto, la duración o el nº de escalas para ver alternativas.
                </div>
              </div>
            )}
            {opcionesUnicas.map((opc, idx) => (
              <OpcionViajeCard
                key={opc.path.join('-')}
                opcion={opc}
                ciudades={ciudades}
                pasajeros={pasajeros}
                multiplicadorPrecio={multPrecio}
                onSeleccionar={() => reservar(idx)}
              />
            ))}
            <div className="muted" style={{ fontSize: 12, marginTop: 8, textAlign: 'right' }}>
              {opcionesUnicas.length} {opcionesUnicas.length === 1 ? 'opción única' : 'opciones distintas'} · {resultado.total} {resultado.total === 1 ? 'ruta evaluada' : 'rutas evaluadas'}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
