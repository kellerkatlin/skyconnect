import type { useEstado } from '../lib/state';
import type { SectionId } from './Sidebar';

type Estado = ReturnType<typeof useEstado>;

type Props = {
  estado: Estado;
  setOrigen: (i: number | null) => void;
  setSection: (s: SectionId) => void;
};

export function VistaCiudades({ estado, setOrigen, setSection }: Props) {
  const { ciudades, regiones, A, ciudadesExtra } = estado;

  const extraIds = new Set(ciudadesExtra.map(c => c.id));
  const grados = ciudades.map((_, i) => A[i].reduce((a: number, b: number) => a + b, 0));

  return (
    <div>
      {Object.entries(regiones).map(([key, r]) => (
        <div className="city-region-block" key={key}>
          <div className="city-region-head">
            <h3>{r.label}</h3>
            <span className="count">{r.ids.length} ciudades</span>
          </div>
          <div className="city-grid">
            {r.ids.map(id => {
              const c = ciudades[id];
              const esNueva = extraIds.has(id);
              return (
                <div className="city-cell" key={id}
                     onClick={() => { setOrigen(id); setSection('buscar'); }}
                     title="Usar como origen"
                     style={esNueva ? { borderLeft: '3px solid var(--gold)' } : undefined}>
                  <div className="id" style={esNueva ? { color: 'var(--gold)' } : undefined}>
                    {String(id + 1).padStart(2, '0')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="nm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {c.nombre}
                      {esNueva && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                          background: 'var(--gold)', color: 'white',
                          padding: '1px 5px', borderRadius: 3,
                        }}>NUEVA</span>
                      )}
                    </div>
                    <div className="pa">{c.pais} · {grados[id]} {grados[id] === 1 ? 'ruta' : 'rutas'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
