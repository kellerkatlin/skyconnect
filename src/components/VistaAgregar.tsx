import { useState, useMemo, useEffect } from 'react';
import type { useEstado } from '../lib/state';
import type { RegionKey, SolicitudRuta } from '../lib/types';
import type { ToastInfo } from './Toast';
import { generarCostoYTiempo } from '../lib/pricing';
import { Check, X } from './Icons';

type Estado = ReturnType<typeof useEstado>;

type Props = {
  estado: Estado;
  setToast: (t: ToastInfo) => void;
  solicitudes: SolicitudRuta[];
  aprobarSolicitud: (id: string, costo: number, duracion: number) => boolean;
  rechazarSolicitud: (id: string) => void;
};

export function VistaAgregar({ estado, setToast, solicitudes, aprobarSolicitud, rechazarSolicitud }: Props) {
  const { ciudades, regiones } = estado;
  const [tab, setTab] = useState<'ruta' | 'ciudad'>('ruta');

  // Form ciudad
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('');
  const [region, setRegion] = useState<RegionKey>('sudamerica');

  // Form ruta
  const [o, setO] = useState<string>('');
  const [d, setD] = useState<string>('');
  const [costo, setCosto] = useState<number>(0);
  const [duracion, setDuracion] = useState<number>(0);

  const sugerido = useMemo(() => {
    if (o === '' || d === '' || +o === +d) return { costoBase: 0, duracionMin: 0 };
    return generarCostoYTiempo(ciudades[+o], ciudades[+d]);
  }, [o, d, ciudades]);

  useEffect(() => {
    if (o !== '' && d !== '' && +o !== +d) {
      setCosto(sugerido.costoBase);
      setDuracion(sugerido.duracionMin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o, d]);

  function agregarCiudad() {
    if (!nombre.trim() || !pais.trim()) {
      setToast({ msg: 'Completa nombre y país', err: true });
      return;
    }
    const r = regiones[region];
    let x = 400;
    let y = 400;
    if (r.ids.length) {
      x = r.ids.reduce((s, i) => s + ciudades[i].x, 0) / r.ids.length + (Math.random() - 0.5) * 30;
      y = r.ids.reduce((s, i) => s + ciudades[i].y, 0) / r.ids.length + (Math.random() - 0.5) * 30;
    }
    const newId = estado.agregarCiudad({ nombre, pais, region, x, y });
    setNombre('');
    setPais('');
    setToast({ msg: `Ciudad "${nombre}" agregada (ID ${newId + 1})` });
  }

  function agregarRuta() {
    if (o === '' || d === '' || +o === +d) {
      setToast({ msg: 'Selecciona dos ciudades distintas', err: true });
      return;
    }
    const ok = estado.agregarRuta(+o, +d, costo, duracion);
    if (!ok) {
      setToast({ msg: 'Esa ruta ya existe', err: true });
      return;
    }
    setToast({ msg: `Ruta ${ciudades[+o].nombre} ↔ ${ciudades[+d].nombre} agregada` });
    setO('');
    setD('');
    setCosto(0);
    setDuracion(0);
  }

  return (
    <div>
      <div className="matrix-tabs" style={{ marginBottom: 20, width: 'fit-content' }}>
        <button className={'matrix-tab' + (tab === 'ruta' ? ' active' : '')} onClick={() => setTab('ruta')}>Nueva ruta</button>
        <button className={'matrix-tab' + (tab === 'ciudad' ? ' active' : '')} onClick={() => setTab('ciudad')}>Nueva ciudad</button>
      </div>

      {tab === 'ruta' ? (
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Agregar nueva ruta</div>
              <div className="card-sub">Crea un enlace bidireccional entre dos ciudades existentes. Los valores de costo y duración se sugieren automáticamente.</div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-row">
                <label className="label">Origen</label>
                <select className="select" value={o} onChange={e => setO(e.target.value)}>
                  <option value="">— Selecciona —</option>
                  {ciudades.map(c => (
                    <option key={c.id} value={c.id}>{String(c.id + 1).padStart(2, '0')} · {c.nombre}, {c.pais}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label className="label">Destino</label>
                <select className="select" value={d} onChange={e => setD(e.target.value)}>
                  <option value="">— Selecciona —</option>
                  {ciudades.map(c => (
                    <option key={c.id} value={c.id}>{String(c.id + 1).padStart(2, '0')} · {c.nombre}, {c.pais}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-grid" style={{ marginTop: 6 }}>
              <div className="form-row">
                <label className="label">Costo (USD)</label>
                <input className="input" type="number" min={0} value={costo}
                       onChange={e => setCosto(+e.target.value)} />
                <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>Sugerido: ${sugerido.costoBase}</div>
              </div>
              <div className="form-row">
                <label className="label">Duración (min)</label>
                <input className="input" type="number" min={0} value={duracion}
                       onChange={e => setDuracion(+e.target.value)} />
                <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>Sugerido: {sugerido.duracionMin} min</div>
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: 12 }}>
              <button className="btn primary" onClick={agregarRuta}>Agregar ruta</button>
              <button className="btn ghost" onClick={() => { setO(''); setD(''); setCosto(0); setDuracion(0); }}>Limpiar</button>
            </div>
            <div style={{ marginTop: 18, padding: 12, background: 'var(--paper-2)', borderRadius: 6, fontSize: 12, color: 'var(--ink-3)' }}>
              <strong style={{ color: 'var(--ink-2)' }}>Nota:</strong> La matriz A es simétrica (red no dirigida), por lo que se actualiza A[i][j] y A[j][i] = 1, y se recalculan A², A³, C, T y D automáticamente.
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Agregar nueva ciudad</div>
              <div className="card-sub">La ciudad nace aislada (grado 0). Luego puedes conectarla con rutas.</div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-row">
                <label className="label">Nombre de la ciudad</label>
                <input className="input" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Buenos Aires" />
              </div>
              <div className="form-row">
                <label className="label">País</label>
                <input className="input" value={pais} onChange={e => setPais(e.target.value)} placeholder="Ej. Argentina" />
              </div>
              <div className="form-row">
                <label className="label">Región</label>
                <select className="select" value={region} onChange={e => setRegion(e.target.value as RegionKey)}>
                  {Object.entries(regiones).map(([k, r]) => (
                    <option key={k} value={k}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: 12 }}>
              <button className="btn primary" onClick={agregarCiudad}>Agregar ciudad</button>
              <button className="btn ghost" onClick={() => { setNombre(''); setPais(''); }}>Limpiar</button>
            </div>
          </div>
        </div>
      )}

      {/* Bandeja de solicitudes de pasajeros */}
      <SolicitudesPendientes
        solicitudes={solicitudes}
        estado={estado}
        aprobarSolicitud={aprobarSolicitud}
        rechazarSolicitud={rechazarSolicitud}
        setToast={setToast}
      />
    </div>
  );
}

type SolProps = {
  solicitudes: SolicitudRuta[];
  estado: Estado;
  aprobarSolicitud: (id: string, costo: number, duracion: number) => boolean;
  rechazarSolicitud: (id: string) => void;
  setToast: (t: ToastInfo) => void;
};

function SolicitudesPendientes({ solicitudes, estado, aprobarSolicitud, rechazarSolicitud, setToast }: SolProps) {
  return (
    <div className="card" style={{ marginTop: 24 }}>
      <div className="card-head">
        <div>
          <div className="card-title">
            Solicitudes pendientes de pasajeros
            {solicitudes.length > 0 && (
              <span style={{
                marginLeft: 10, fontSize: 12, fontWeight: 600,
                background: 'var(--sky-red)', color: 'white',
                padding: '2px 8px', borderRadius: 10,
              }}>{solicitudes.length}</span>
            )}
          </div>
          <div className="card-sub">
            Cuando un pasajero busca una ruta inexistente, puede solicitarla aquí.
            Aprueba (✓) ajustando costo y duración, o rechaza (✕) para descartar.
          </div>
        </div>
      </div>
      <div className="card-body">
        {solicitudes.length === 0 ? (
          <div className="empty-state" style={{ padding: 20, textAlign: 'center', color: 'var(--ink-3)' }}>
            No hay solicitudes pendientes en este momento.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {solicitudes.map(sol => (
              <SolicitudRow
                key={sol.id}
                sol={sol}
                estado={estado}
                onAprobar={(costo, duracion) => {
                  const ok = aprobarSolicitud(sol.id, costo, duracion);
                  if (ok) {
                    const o = estado.ciudades[sol.origenId];
                    const d = estado.ciudades[sol.destinoId];
                    setToast({ msg: `Ruta ${o.nombre} ↔ ${d.nombre} aprobada y agregada` });
                  }
                }}
                onRechazar={() => {
                  rechazarSolicitud(sol.id);
                  setToast({ msg: 'Solicitud rechazada' });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type RowProps = {
  sol: SolicitudRuta;
  estado: Estado;
  onAprobar: (costo: number, duracion: number) => void;
  onRechazar: () => void;
};

function SolicitudRow({ sol, estado, onAprobar, onRechazar }: RowProps) {
  const sugerido = useMemo(
    () => generarCostoYTiempo(estado.ciudades[sol.origenId], estado.ciudades[sol.destinoId]),
    [sol.origenId, sol.destinoId, estado.ciudades],
  );
  const [costo, setCosto] = useState(sugerido.costoBase);
  const [duracion, setDuracion] = useState(sugerido.duracionMin);
  const o = estado.ciudades[sol.origenId];
  const d = estado.ciudades[sol.destinoId];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto auto auto',
      gap: 12,
      alignItems: 'center',
      padding: 12,
      background: 'var(--paper-2)',
      borderRadius: 6,
      borderLeft: '3px solid var(--sky-red)',
    }}>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
          {o.nombre}, {o.pais} <span style={{ color: 'var(--sky-red)', margin: '0 6px' }}>→</span> {d.nombre}, {d.pais}
        </div>
        <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
          ID {sol.id} · solicitada {new Date(sol.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label className="label" style={{ fontSize: 10 }}>Costo (USD)</label>
        <input
          className="input"
          type="number"
          min={0}
          style={{ width: 90 }}
          value={costo}
          onChange={e => setCosto(+e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label className="label" style={{ fontSize: 10 }}>Duración (min)</label>
        <input
          className="input"
          type="number"
          min={0}
          style={{ width: 90 }}
          value={duracion}
          onChange={e => setDuracion(+e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          className="btn primary sm"
          title="Aprobar y agregar a la red"
          onClick={() => onAprobar(costo, duracion)}
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <Check style={{ width: 14, height: 14 }} /> Aprobar
        </button>
        <button
          className="btn ghost sm"
          title="Rechazar solicitud"
          onClick={onRechazar}
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <X style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}

