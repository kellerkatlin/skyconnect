import { useState } from 'react';
import type { useEstado } from '../lib/state';
import type { RegionKey } from '../lib/types';
import type { ToastInfo } from './Toast';

type Estado = ReturnType<typeof useEstado>;

type Props = {
  estado: Estado;
  setToast: (t: ToastInfo) => void;
};

export function VistaAgregar({ estado, setToast }: Props) {
  const { ciudades, regiones } = estado;
  const [tab, setTab] = useState<'ruta' | 'ciudad'>('ruta');

  // Form ciudad
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('');
  const [region, setRegion] = useState<RegionKey>('sudamerica');

  // Form ruta
  const [o, setO] = useState<string>('');
  const [d, setD] = useState<string>('');

  function agregarCiudad() {
    if (!nombre.trim() || !pais.trim()) {
      setToast({ msg: 'Completa nombre y país', err: true });
      return;
    }
    const r = regiones[region];
    // Posición aproximada (centro de la región) con jitter
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
    const ok = estado.agregarRuta(+o, +d);
    if (!ok) {
      setToast({ msg: 'Esa ruta ya existe', err: true });
      return;
    }
    setToast({ msg: `Ruta ${ciudades[+o].nombre} ↔ ${ciudades[+d].nombre} agregada` });
    setO('');
    setD('');
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
              <div className="card-sub">Crea un enlace bidireccional entre dos ciudades existentes</div>
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
            <div className="form-actions" style={{ marginTop: 12 }}>
              <button className="btn primary" onClick={agregarRuta}>Agregar ruta</button>
              <button className="btn ghost" onClick={() => { setO(''); setD(''); }}>Limpiar</button>
            </div>
            <div style={{ marginTop: 18, padding: 12, background: 'var(--paper-2)', borderRadius: 6, fontSize: 12, color: 'var(--ink-3)' }}>
              <strong style={{ color: 'var(--ink-2)' }}>Nota:</strong> La matriz A es simétrica (red no dirigida), por lo que se actualiza A[i][j] y A[j][i] = 1, y se recalculan A² y A³ automáticamente.
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
    </div>
  );
}
