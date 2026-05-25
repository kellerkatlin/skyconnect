import { Plane2, Map, Grid, Search, List, Network, Stats, Plus, Ticket } from './Icons';

export type SectionId = 'mapa' | 'ciudades' | 'matriz' | 'buscar' | 'planificador' | 'reservas' | 'stats' | 'grafo' | 'agregar';

type Props = {
  section: SectionId;
  setSection: (s: SectionId) => void;
  n: number;
  totalRutas: number;
};

type NavItem =
  | { group: string }
  | { id: SectionId; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; num: string };

const items: NavItem[] = [
  { group: 'Red' },
  { id: 'mapa',     label: 'Mapa de rutas',        icon: Map,     num: '01' },
  { id: 'ciudades', label: 'Ciudades',             icon: List,    num: '02' },
  { id: 'matriz',   label: 'Matrices',             icon: Grid,    num: '03' },
  { group: 'Análisis' },
  { id: 'buscar',        label: 'Buscar ruta',           icon: Search,  num: '04' },
  { id: 'planificador',  label: 'Planificador de viaje', icon: Plane2,  num: '05' },
  { id: 'reservas',      label: 'Mis reservas',          icon: Ticket,  num: '06' },
  { id: 'stats',         label: 'Estadísticas',          icon: Stats,   num: '07' },
  { id: 'grafo',         label: 'Vista grafo',           icon: Network, num: '08' },
  { group: 'Edición' },
  { id: 'agregar',       label: 'Agregar ciudad/ruta',   icon: Plus,    num: '09' },
];

export function Sidebar({ section, setSection, n, totalRutas }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Plane2 /></div>
        <div className="brand-text">
          <div className="brand-name">SkyConnect</div>
          <div className="brand-tag">Red Avianca · TACA</div>
        </div>
      </div>

      {items.map((it, i) => 'group' in it ? (
        <div key={'g' + i} className="nav-label">{it.group}</div>
      ) : (
        <button
          key={it.id}
          className={'nav-btn' + (section === it.id ? ' active' : '')}
          onClick={() => setSection(it.id)}
        >
          <it.icon className="nav-icon" />
          <span>{it.label}</span>
          <span className="nav-num">{it.num}</span>
        </button>
      ))}

      <div className="sidebar-foot">
        <div>
          <strong>Matemática Discreta</strong>
          1AMA0708<br />
          UPC · Grupo 1 · 2026<br />
          {n} ciudades · {totalRutas} rutas
        </div>
        <img src="/upc-logo.png" alt="UPC" style={{ width: 64, height: 64, objectFit: 'contain', flexShrink: 0, marginRight: 8 }} />
      </div>
    </aside>
  );
}
