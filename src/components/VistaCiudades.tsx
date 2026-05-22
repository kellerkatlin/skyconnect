import type { useEstado } from '../lib/state';
import type { SectionId } from './Sidebar';

type Estado = ReturnType<typeof useEstado>;

type Props = {
  estado: Estado;
  setOrigen: (i: number | null) => void;
  setSection: (s: SectionId) => void;
};

export function VistaCiudades({ estado, setOrigen, setSection }: Props) {
  const { ciudades, regiones, A } = estado;

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
              return (
                <div className="city-cell" key={id}
                     onClick={() => { setOrigen(id); setSection('buscar'); }}
                     title="Usar como origen">
                  <div className="id">{String(id + 1).padStart(2, '0')}</div>
                  <div>
                    <div className="nm">{c.nombre}</div>
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
