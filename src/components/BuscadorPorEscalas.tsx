import type { useEstado } from '../lib/state';
import type { Ciudad, SolicitudRuta } from '../lib/types';
import { ArrowRight } from './Icons';
import { hallar1Escala, hallar2Escalas } from '../lib/matrix';
import type { SectionId } from './Sidebar';

type Estado = ReturnType<typeof useEstado>;

type Props = {
  estado: Estado;
  origen: number | null;
  setOrigen: (i: number | null) => void;
  destino: number | null;
  setDestino: (i: number | null) => void;
  setRutaResaltada: (p: number[] | null) => void;
  solicitudes?: SolicitudRuta[];
  pedirRuta?: (origenId: number, destinoId: number) => void;
  setSection?: (s: SectionId) => void;
};

export function BuscadorPorEscalas({
  estado, origen, setOrigen, destino, setDestino, setRutaResaltada,
  solicitudes, pedirRuta, setSection,
}: Props) {
  const { ciudades, A, A2, A3 } = estado;

  // Resultados
  const directo = origen != null && destino != null && origen !== destino && A[origen][destino] === 1;
  const escalas1 = origen != null && destino != null && origen !== destino
    ? hallar1Escala(A, origen, destino) : [];
  const escalas2 = origen != null && destino != null && origen !== destino
    ? hallar2Escalas(A, origen, destino, 25) : [];

  // Genera código IATA simulado a partir del nombre
  function code(c: Ciudad | null) {
    if (!c) return '—';
    const sin = c.nombre.replace(/[^A-Za-z]/g, '').toUpperCase();
    return sin.slice(0, 3);
  }

  const cO = origen != null ? ciudades[origen] : null;
  const cD = destino != null ? ciudades[destino] : null;

  function intercambiar() {
    setOrigen(destino);
    setDestino(origen);
    setRutaResaltada(null);
  }

  function destacar(path: number[]) {
    setRutaResaltada(path);
  }

  return (
    <div className="search-grid">
      {/* Boarding pass + selector */}
      <div>
        <div className="boarding-pass">
          <div className="bp-head">
            <div className="bp-brand">SkyConnect</div>
            <div className="bp-tag">PASE DE BÚSQUEDA</div>
          </div>
          <div className="bp-body">
            <div className="bp-route">
              <div className="bp-end">
                <div className="code">{code(cO)}</div>
                <div className="city">{cO ? cO.nombre.toUpperCase() : 'ORIGEN'}</div>
              </div>
              <div className="bp-arrow">
                <ArrowRight />
              </div>
              <div className="bp-end">
                <div className="code">{code(cD)}</div>
                <div className="city">{cD ? cD.nombre.toUpperCase() : 'DESTINO'}</div>
              </div>
            </div>

            <div className="bp-divider" />

            <div className="bp-fields">
              <div className="bp-field">
                <div className="l">País origen</div>
                <div className="v">{cO ? cO.pais : '—'}</div>
              </div>
              <div className="bp-field">
                <div className="l">País destino</div>
                <div className="v">{cD ? cD.pais : '—'}</div>
              </div>
              <div className="bp-field">
                <div className="l">Vuelo directo</div>
                <div className="v" style={{ color: directo ? 'var(--ok)' : 'var(--ink-3)' }}>
                  {origen == null || destino == null ? '—' : directo ? 'SÍ' : 'NO'}
                </div>
              </div>
              <div className="bp-field">
                <div className="l">Conexiones</div>
                <div className="v">
                  {origen == null || destino == null ? '—' :
                   directo ? '0 escalas' :
                   escalas1.length ? `${escalas1.length} con 1 escala` :
                   escalas2.length ? `${escalas2.length} con 2 escalas` : 'Sin ruta'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-head">
            <div>
              <div className="card-title">Selección</div>
              <div className="card-sub">Elige origen y destino</div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-row">
              <label className="label">Ciudad de origen</label>
              <select className="select" value={origen ?? ''}
                      onChange={e => { setOrigen(e.target.value === '' ? null : +e.target.value); setRutaResaltada(null); }}>
                <option value="">— Selecciona —</option>
                {ciudades.map(c => (
                  <option key={c.id} value={c.id}>{String(c.id + 1).padStart(2, '0')} · {c.nombre}, {c.pais}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label className="label">Ciudad de destino</label>
              <select className="select" value={destino ?? ''}
                      onChange={e => { setDestino(e.target.value === '' ? null : +e.target.value); setRutaResaltada(null); }}>
                <option value="">— Selecciona —</option>
                {ciudades.map(c => (
                  <option key={c.id} value={c.id}>{String(c.id + 1).padStart(2, '0')} · {c.nombre}, {c.pais}</option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button className="btn ghost sm" onClick={intercambiar} disabled={origen == null && destino == null}>
                ⇄ Intercambiar
              </button>
              <button className="btn ghost sm" onClick={() => { setOrigen(null); setDestino(null); setRutaResaltada(null); }}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="results">
        {origen == null || destino == null ? (
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: 48, color: 'var(--ink-3)' }}>
              Selecciona origen y destino para calcular las rutas posibles.
              <div style={{ marginTop: 12, fontSize: 12 }}>
                Se evaluarán las matrices <span className="mono">A</span>, <span className="mono">A²</span> y <span className="mono">A³</span>.
              </div>
            </div>
          </div>
        ) : origen === destino ? (
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: 32, color: 'var(--sky-red)' }}>
              Origen y destino no pueden ser la misma ciudad.
            </div>
          </div>
        ) : (
          <>
            {/* 1. Vuelo directo */}
            <div className="result-section">
              <div className="result-section-head">
                <div className={'step ' + (directo ? 'found' : 'empty')}>1</div>
                <div>
                  <div className="step-title">Vuelo directo</div>
                  <div className="card-sub">Sin escalas — relación R</div>
                </div>
                <div className="step-formula">A[i,j] = {A[origen][destino]}</div>
              </div>
              <div className="result-section-body">
                {directo ? (
                  <div className="path">
                    <div className="path-stop">
                      <div>{ciudades[origen].nombre}</div>
                      <div className="code">{ciudades[origen].pais.toUpperCase()}</div>
                    </div>
                    <ArrowRight className="path-arrow" style={{ width: 16, height: 16 }} />
                    <div className="path-stop">
                      <div>{ciudades[destino].nombre}</div>
                      <div className="code">{ciudades[destino].pais.toUpperCase()}</div>
                    </div>
                    <button className="btn ghost sm" style={{ marginLeft: 'auto' }}
                      onClick={() => destacar([origen, destino])}>
                      Ver en mapa
                    </button>
                  </div>
                ) : (
                  <div className="empty-state">No existe vuelo directo.</div>
                )}
              </div>
            </div>

            {/* 2. Una escala */}
            <div className="result-section">
              <div className="result-section-head">
                <div className={'step ' + (escalas1.length ? 'found' : 'empty')}>2</div>
                <div>
                  <div className="step-title">Con 1 escala</div>
                  <div className="card-sub">{escalas1.length} {escalas1.length === 1 ? 'ruta' : 'rutas'} encontradas</div>
                </div>
                <div className="step-formula">A²[i,j] = {A2[origen][destino]}</div>
              </div>
              <div className="result-section-body">
                {escalas1.length === 0 ? (
                  <div className="empty-state">No hay rutas con exactamente 1 escala.</div>
                ) : (
                  escalas1.slice(0, 12).map((k, idx) => (
                    <div className="path" key={idx}>
                      <div className="path-stop">
                        <div>{ciudades[origen].nombre}</div>
                        <div className="code">{ciudades[origen].pais.toUpperCase()}</div>
                      </div>
                      <ArrowRight className="path-arrow" style={{ width: 14, height: 14 }} />
                      <div className="path-stop">
                        <div>{ciudades[k].nombre}</div>
                        <div className="code">ESCALA</div>
                      </div>
                      <ArrowRight className="path-arrow" style={{ width: 14, height: 14 }} />
                      <div className="path-stop">
                        <div>{ciudades[destino].nombre}</div>
                        <div className="code">{ciudades[destino].pais.toUpperCase()}</div>
                      </div>
                      <button className="btn ghost sm" style={{ marginLeft: 'auto' }}
                        onClick={() => destacar([origen, k, destino])}>
                        Ver
                      </button>
                    </div>
                  ))
                )}
                {escalas1.length > 12 && (
                  <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
                    Mostrando 12 de {escalas1.length} rutas posibles.
                  </div>
                )}
              </div>
            </div>

            {/* 3. Dos escalas */}
            <div className="result-section">
              <div className="result-section-head">
                <div className={'step ' + (escalas2.length ? 'found' : 'empty')}>3</div>
                <div>
                  <div className="step-title">Con 2 escalas</div>
                  <div className="card-sub">{escalas2.length} {escalas2.length === 1 ? 'ruta' : 'rutas'} encontradas{escalas2.length >= 25 ? ' (limitado)' : ''}</div>
                </div>
                <div className="step-formula">A³[i,j] = {A3[origen][destino]}</div>
              </div>
              <div className="result-section-body">
                {escalas2.length === 0 ? (
                  <div className="empty-state">No hay rutas con 2 escalas.</div>
                ) : (
                  escalas2.slice(0, 8).map(([k1, k2], idx) => (
                    <div className="path" key={idx}>
                      <div className="path-stop">
                        <div>{ciudades[origen].nombre}</div>
                        <div className="code">{ciudades[origen].pais.toUpperCase()}</div>
                      </div>
                      <ArrowRight className="path-arrow" style={{ width: 12, height: 12 }} />
                      <div className="path-stop">
                        <div>{ciudades[k1].nombre}</div>
                        <div className="code">ESCALA 1</div>
                      </div>
                      <ArrowRight className="path-arrow" style={{ width: 12, height: 12 }} />
                      <div className="path-stop">
                        <div>{ciudades[k2].nombre}</div>
                        <div className="code">ESCALA 2</div>
                      </div>
                      <ArrowRight className="path-arrow" style={{ width: 12, height: 12 }} />
                      <div className="path-stop">
                        <div>{ciudades[destino].nombre}</div>
                        <div className="code">{ciudades[destino].pais.toUpperCase()}</div>
                      </div>
                      <button className="btn ghost sm" style={{ marginLeft: 'auto' }}
                        onClick={() => destacar([origen, k1, k2, destino])}>
                        Ver
                      </button>
                    </div>
                  ))
                )}
                {escalas2.length > 8 && (
                  <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
                    Mostrando 8 de {escalas2.length} rutas posibles.
                  </div>
                )}
              </div>
            </div>

            {/* CTA: solicitar nueva ruta si no hay conexión */}
            {!directo && escalas1.length === 0 && escalas2.length === 0 && origen != null && destino != null && (
              (() => {
                const yaPedida = solicitudes?.some(s => s.origenId === origen && s.destinoId === destino);
                return (
                  <div className="card" style={{ marginTop: 16, borderLeft: '4px solid var(--sky-red)' }}>
                    <div className="card-body" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div className="card-title" style={{ marginBottom: 4 }}>
                          {yaPedida ? 'Ruta ya solicitada' : 'No hay ruta disponible'}
                        </div>
                        <div className="card-sub">
                          {yaPedida
                            ? `Tu solicitud para ${ciudades[origen].nombre} → ${ciudades[destino].nombre} está pendiente de aprobación por la aerolínea.`
                            : `${ciudades[origen].nombre} → ${ciudades[destino].nombre} no tiene ningún itinerario posible con 0, 1 o 2 escalas. Puedes solicitar que la aerolínea evalúe abrir este vuelo.`}
                        </div>
                      </div>
                      {!yaPedida && pedirRuta && (
                        <button className="btn primary" onClick={() => pedirRuta(origen, destino)}>
                          Solicitar nueva ruta
                        </button>
                      )}
                      {yaPedida && setSection && (
                        <button className="btn ghost sm" onClick={() => setSection('agregar')}>
                          Ver solicitudes
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()
            )}
          </>
        )}
      </div>
    </div>
  );
}
