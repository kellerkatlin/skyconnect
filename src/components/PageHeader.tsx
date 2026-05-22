type Props = {
  eyebrow: string;
  title: string;
  sub: string;
  n: number;
  totalRutas: number;
};

export function PageHeader({ eyebrow, title, sub, n, totalRutas }: Props) {
  return (
    <div className="page-head">
      <div>
        <div className="page-eyebrow">{eyebrow}</div>
        <h1 className="page-title">{title}</h1>
        <p className="page-sub">{sub}</p>
      </div>
      <div className="page-meta">
        <div className="page-meta-item">
          <span className="v tabular">{n}</span>
          <span className="l">Ciudades</span>
        </div>
        <div className="page-meta-item">
          <span className="v tabular">{totalRutas}</span>
          <span className="l">Rutas</span>
        </div>
      </div>
    </div>
  );
}

export const HEADS: Record<string, { eyebrow: string; title: string; sub: string }> = {
  mapa: {
    eyebrow: '01 · Red de rutas',
    title: 'Mapa de la red',
    sub: 'Visualización esquemática de las 58 ciudades operadas por SkyConnect (Avianca/TACA), conectadas por sus rutas directas.',
  },
  ciudades: {
    eyebrow: '02 · Inventario',
    title: 'Ciudades de la red',
    sub: 'Listado completo agrupado por región. Haz clic en una ciudad para usarla como origen en el buscador.',
  },
  matriz: {
    eyebrow: '03 · Matriz de adyacencia',
    title: 'Matriz A, A² y A³',
    sub: 'Representación matricial de la red. La matriz A modela vuelos directos; sus potencias booleanas, conexiones con escalas.',
  },
  buscar: {
    eyebrow: '04 · Buscador',
    title: 'Buscar ruta entre dos ciudades',
    sub: 'Calcula rutas con 0, 1 y 2 escalas evaluando A, A² y A³. Si no existe ruta, puedes solicitarla para que la aerolínea la habilite.',
  },
  planificador: {
    eyebrow: '05 · Planificador',
    title: 'Planificador de viaje · costo y tiempo',
    sub: 'Compara hasta 3 opciones óptimas (más barata, más rápida y mejor balance) según presupuesto, duración máxima, clase y número de escalas.',
  },
  stats: {
    eyebrow: '06 · Análisis',
    title: 'Estadísticas de la red',
    sub: 'Métricas de conectividad, hubs principales y crecimiento de la cobertura por número de escalas.',
  },
  grafo: {
    eyebrow: '07 · Estructura',
    title: 'Vista de grafo',
    sub: 'Cada ciudad es un nodo y cada ruta una arista. Distribución por región, sin restricción geográfica.',
  },
  redes: {
    eyebrow: '08 · Aplicación',
    title: 'Relación con redes informáticas',
    sub: 'El mismo modelo matemático describe una red aérea y una red de routers. Mismas matrices, distintos significados.',
  },
  agregar: {
    eyebrow: '09 · Edición',
    title: 'Agregar ciudad o ruta',
    sub: 'Modifica la red en vivo. Las matrices A, A² y A³ se recalculan automáticamente. Aquí también aparecen las solicitudes de los pasajeros para ser aprobadas.',
  },
};
