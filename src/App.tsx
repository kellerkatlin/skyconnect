import { useState } from 'react';
import { Sidebar, type SectionId } from './components/Sidebar';
import { PageHeader, HEADS } from './components/PageHeader';
import { useEstado } from './lib/state';
import { totalRutasUnicas } from './lib/matrix';

export default function App() {
  const [section, setSection] = useState<SectionId>('mapa');
  const estado = useEstado();
  const n = estado.ciudades.length;
  const totalRutas = totalRutasUnicas(estado.A);
  const head = HEADS[section];

  return (
    <div className="app">
      <Sidebar section={section} setSection={setSection} n={n} totalRutas={totalRutas} />
      <main className="main">
        <div className="page" data-screen-label={`${head.eyebrow.split(' ')[0]} ${head.title}`}>
          <PageHeader {...head} n={n} totalRutas={totalRutas} />
          <div style={{ padding: 40, color: 'var(--ink-3)' }}>
            Vista <strong>{section}</strong> — pendiente de portar.
          </div>
        </div>
      </main>
    </div>
  );
}
