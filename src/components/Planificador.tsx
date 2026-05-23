import { useState, useMemo } from 'react';
import type { Clase } from '../lib/types';
import type { SectionId } from './Sidebar';
import { topKRutas } from '../lib/pathfinding';
import { multiplicadorClase, multiplicadorFecha } from '../lib/pricing';
import { saveReserva } from '../lib/storage';
import { OpcionViajeCard } from './OpcionViajeCard';
import type { useEstado } from '../lib/state';

type Props = {
  estado: ReturnType<typeof useEstado>;
  origen: number | null;
  destino: number | null;
  setRutaResaltada: (path: number[] | null) => void;
  setToast: (t: { msg: string; err?: boolean } | null) => void;
  setSection: (s: SectionId) => void;
};

function generarCodigo(origenNombre: string, destinoNombre: string): string {
  const code = (s: string) => s.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3);
  const r = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
  return `SKY-${code(origenNombre)}${code(destinoNombre)}-${r}`;
}

function iata(nombre: string): string {
  return nombre.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3);
}

export function Planificador({ estado, origen, destino, setRutaResaltada, setToast, setSection }: Props) {
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
      multiplicadorPrecio: multPrecio,
    });
  }, [rutas, origen, destino, maxEscalas, presupuesto, duracionMax, multPrecio, pasajeros]);

  function reservar(opcion: NonNullable<typeof resultado>['todas'][number]) {
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
              <div className="card-sub">Todas las rutas disponibles ordenadas de menor a mayor precio</div>
            </div>
          </div>
          <div className="card-body">
            {/* Ruta seleccionada desde Buscar ruta — solo lectura */}
            {origen == null || destino == null ? (
              <div style={{
                padding: '16px 20px', marginBottom: 16,
                background: 'var(--paper-2)', borderRadius: 8,
                border: '1px dashed var(--paper-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>
                  Primero selecciona un origen y destino en <strong>Buscar ruta</strong>.
                </div>
                <button className="btn ghost sm" onClick={() => setSection('buscar')}>
                  Ir a Buscar ruta →
                </button>
              </div>
            ) : (
              <div style={{
                marginBottom: 16, borderRadius: 8, overflow: 'hidden',
                border: '1px solid var(--paper-3)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                {/* Header rojo */}
                <div style={{
                  background: 'var(--sky-red)', padding: '7px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>
                    Ruta seleccionada
                  </div>
                  <button
                    className="btn ghost sm"
                    onClick={() => setSection('buscar')}
                    style={{ color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.35)', fontSize: 11, padding: '2px 10px' }}
                  >
                    Cambiar →
                  </button>
                </div>
                {/* Cuerpo mini boarding pass */}
                <div style={{ background: 'var(--paper-2)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'center', minWidth: 64 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 1, fontFamily: 'var(--font-mono)', color: 'var(--ink)', lineHeight: 1 }}>
                      {iata(ciudades[origen].nombre)}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>
                      {ciudades[origen].nombre}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--ink-4)' }}>{ciudades[origen].pais}</div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--paper-3)' }} />
                    <span style={{ fontSize: 18, color: 'var(--sky-red)', lineHeight: 1 }}>✈</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--paper-3)' }} />
                  </div>

                  <div style={{ textAlign: 'center', minWidth: 64 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 1, fontFamily: 'var(--font-mono)', color: 'var(--ink)', lineHeight: 1 }}>
                      {iata(ciudades[destino].nombre)}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>
                      {ciudades[destino].nombre}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--ink-4)' }}>{ciudades[destino].pais}</div>
                  </div>
                </div>
              </div>
            )}
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
                <label className="label" style={{ minHeight: 34 }}>Presupuesto máx (USD)</label>
                <input className="input" type="number" min={0} placeholder="sin límite"
                       value={presupuesto}
                       onChange={e => setPresupuesto(e.target.value === '' ? '' : +e.target.value)} />
              </div>
              <div className="form-row">
                <label className="label" style={{ minHeight: 34 }}>Duración máx (h)</label>
                <input className="input" type="number" min={0} placeholder="sin límite"
                       value={duracionMax}
                       onChange={e => setDuracionMax(e.target.value === '' ? '' : +e.target.value)} />
              </div>
              <div className="form-row">
                <label className="label" style={{ minHeight: 34 }}>Máx escalas</label>
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
            {resultado.todas.map((opc, idx) => (
              <OpcionViajeCard
                key={opc.path.join('-')}
                opcion={opc}
                ciudades={ciudades}
                pasajeros={pasajeros}
                multiplicadorPrecio={multPrecio}
                clase={clase}
                posicion={idx + 1}
                totalOpciones={resultado.todas.length}
                onSeleccionar={() => reservar(opc)}
              />
            ))}
            <div className="muted" style={{ fontSize: 12, marginTop: 8, textAlign: 'right' }}>
              {resultado.total} {resultado.total === 1 ? 'ruta encontrada' : 'rutas encontradas'} · ordenadas por precio
            </div>
          </>
        )}
      </div>
    </div>
  );
}
