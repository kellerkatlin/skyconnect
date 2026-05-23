import { useState, useEffect } from 'react';
import { Sidebar, type SectionId } from './components/Sidebar';
import { PageHeader, HEADS } from './components/PageHeader';
import { MapaRutas } from './components/MapaRutas';
import { MatrizInteractiva } from './components/MatrizInteractiva';
import { BuscadorRuta } from './components/BuscadorRuta';
import { Planificador } from './components/Planificador';
import { VistaCiudades } from './components/VistaCiudades';
import { VistaStats } from './components/VistaStats';
import { VistaGrafo } from './components/VistaGrafo';
import { VistaAgregar } from './components/VistaAgregar';
import { VistaReservas } from './components/VistaReservas';
import { Toast, type ToastInfo } from './components/Toast';
import { useEstado } from './lib/state';
import { totalRutasUnicas } from './lib/matrix';
import { loadSolicitudes, saveSolicitudes } from './lib/storage';
import type { SolicitudRuta } from './lib/types';

export default function App() {
  const [section, setSection] = useState<SectionId>('mapa');
  const [ciudadSel, setCiudadSel] = useState<number | null>(null);
  const [rutaResaltada, setRutaResaltadaState] = useState<number[] | null>(null);
  const [origen, setOrigen] = useState<number | null>(null);
  const [destino, setDestino] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastInfo>(null);
  const [solicitudes, setSolicitudes] = useState<SolicitudRuta[]>(() => loadSolicitudes());
  const estado = useEstado();

  useEffect(() => { saveSolicitudes(solicitudes); }, [solicitudes]);

  function pedirRuta(origenId: number, destinoId: number) {
    if (solicitudes.some(s => s.origenId === origenId && s.destinoId === destinoId)) {
      setToast({ msg: 'Esta ruta ya fue solicitada', err: true });
      return;
    }
    const nueva: SolicitudRuta = {
      id: `SOL-${Date.now().toString(36).toUpperCase()}`,
      origenId, destinoId,
      createdAt: new Date().toISOString(),
    };
    setSolicitudes(prev => [...prev, nueva]);
    setToast({ msg: 'Solicitud enviada. La aerolínea la revisará en "Agregar ciudad/ruta".' });
  }

  function aprobarSolicitud(id: string, costo: number, duracion: number): boolean {
    const sol = solicitudes.find(s => s.id === id);
    if (!sol) return false;
    const ok = estado.agregarRuta(sol.origenId, sol.destinoId, costo, duracion);
    if (!ok) {
      setToast({ msg: 'La ruta ya existe en la red', err: true });
      return false;
    }
    setSolicitudes(prev => prev.filter(s => s.id !== id));
    return true;
  }

  function rechazarSolicitud(id: string) {
    setSolicitudes(prev => prev.filter(s => s.id !== id));
  }

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
          ) : section === 'agregar' ? (
            <VistaAgregar
              estado={estado}
              setToast={setToast}
              solicitudes={solicitudes}
              aprobarSolicitud={aprobarSolicitud}
              rechazarSolicitud={rechazarSolicitud}
            />
          ) : section === 'grafo' ? (
            <VistaGrafo estado={estado} />
          ) : section === 'stats' ? (
            <VistaStats estado={estado} />
          ) : section === 'ciudades' ? (
            <VistaCiudades estado={estado} setOrigen={setOrigen} setSection={setSection} />
          ) : section === 'reservas' ? (
            <VistaReservas estado={estado} />
          ) : section === 'buscar' ? (
            <BuscadorRuta
              estado={estado}
              origen={origen}
              setOrigen={setOrigen}
              destino={destino}
              setDestino={setDestino}
              setRutaResaltada={setRutaResaltada}
              solicitudes={solicitudes}
              pedirRuta={pedirRuta}
              setSection={setSection}
            />
          ) : section === 'planificador' ? (
            <Planificador
              estado={estado}
              origen={origen}
              destino={destino}
              setRutaResaltada={setRutaResaltada}
              setToast={setToast}
              setSection={setSection}
            />
          ) : (
            <div style={{ padding: 40, color: 'var(--ink-3)' }}>
              Vista <strong>{section}</strong> — pendiente de portar.
            </div>
          )}
        </div>
      </main>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
