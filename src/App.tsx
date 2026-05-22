import { useState } from 'react';
import { Sidebar, type SectionId } from './components/Sidebar';
import { PageHeader, HEADS } from './components/PageHeader';
import { MapaRutas } from './components/MapaRutas';
import { MatrizInteractiva } from './components/MatrizInteractiva';
import { BuscadorRuta } from './components/BuscadorRuta';
import { VistaCiudades } from './components/VistaCiudades';
import { VistaStats } from './components/VistaStats';
import { useEstado } from './lib/state';
import { totalRutasUnicas } from './lib/matrix';

export default function App() {
  const [section, setSection] = useState<SectionId>('mapa');
  const [ciudadSel, setCiudadSel] = useState<number | null>(null);
  const [rutaResaltada, setRutaResaltadaState] = useState<number[] | null>(null);
  const [origen, setOrigen] = useState<number | null>(null);
  const [destino, setDestino] = useState<number | null>(null);
  const estado = useEstado();

  // Wrapper: cuando el buscador resalta una ruta truthy, navegar al mapa.
  const setRutaResaltada = (p: number[] | null) => {
    setRutaResaltadaState(p);
    if (p && p.length > 0) setSection('mapa');
  };
  const n = estado.ciudades.length;
  const totalRutas = totalRutasUnicas(estado.A);
  const head = HEADS[section];

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
          ) : section === 'stats' ? (
            <VistaStats estado={estado} />
          ) : section === 'ciudades' ? (
            <VistaCiudades estado={estado} setOrigen={setOrigen} setSection={setSection} />
          ) : section === 'buscar' ? (
            <BuscadorRuta
              estado={estado}
              origen={origen}
              setOrigen={setOrigen}
              destino={destino}
              setDestino={setDestino}
              setRutaResaltada={setRutaResaltada}
            />
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
