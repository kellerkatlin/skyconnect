import { useState } from 'react';
import { Sidebar, type SectionId } from './components/Sidebar';
import { PageHeader, HEADS } from './components/PageHeader';
import { MapaRutas } from './components/MapaRutas';
import { MatrizInteractiva } from './components/MatrizInteractiva';
import { useEstado } from './lib/state';
import { totalRutasUnicas } from './lib/matrix';

export default function App() {
  const [section, setSection] = useState<SectionId>('mapa');
  const [ciudadSel, setCiudadSel] = useState<number | null>(null);
  const [rutaResaltada, setRutaResaltada] = useState<number[] | null>(null);
  const estado = useEstado();
  const n = estado.ciudades.length;
  const totalRutas = totalRutasUnicas(estado.A);
  const head = HEADS[section];

  // silence unused (for now, until later sections wire them up)
  void setRutaResaltada;

  return (
    <div className="app">
      <Sidebar section={section} setSection={setSection} n={n} totalRutas={totalRutas} />
      <main className="main">
        <div className="page" data-screen-label={`${head.eyebrow.split(' ')[0]} ${head.title}`}>
          <PageHeader {...head} n={n} totalRutas={totalRutas} />
          {section === 'mapa' ? (
            <MapaRutas
              estado={estado}
              ciudadSel={ciudadSel}
              setCiudadSel={setCiudadSel}
              rutaResaltada={rutaResaltada}
            />
          ) : section === 'matriz' ? (
            <MatrizInteractiva estado={estado} />
          ) : (
            <div style={{ padding: 40, color: 'var(--ink-3)' }}>
              Vista <strong>{section}</strong> — pendiente de portar.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
