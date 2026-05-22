import { Fragment } from 'react';
import type { useEstado } from '../lib/state';

type Estado = ReturnType<typeof useEstado>;

type Props = { estado: Estado };

export function VistaRedes({ estado }: Props) {
  const { ciudades, A, A2 } = estado;
  const n = ciudades.length;

  let directos = 0;
  let alc1 = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (i === j) continue;
    if (A[i][j]) directos++;
    if (A2[i][j]) alc1++;
  }
  const grados = ciudades.map((c, i) => ({ ...c, grado: A[i].reduce((a: number, b: number) => a + b, 0) }))
    .sort((a, b) => b.grado - a.grado);

  const filas: [string, string][] = [
    ['Ciudad / Aeropuerto', 'Nodo / Router'],
    ['Ruta aérea directa', 'Enlace de datos (1 hop)'],
    ['1 escala', '2 hops · 1 nodo intermedio'],
    ['2 escalas', '3 hops · 2 nodos intermedios'],
    ['Hubs (Lima, Bogotá, San Salvador)', 'Routers core / backbone'],
    ['Matriz A', 'Tabla de adyacencia / enrutamiento'],
    ['Producto booleano A²', 'Cálculo de rutas de 2 saltos'],
    ['Conectividad de la red', 'Alcanzabilidad / reachability'],
  ];

  return (
    <div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <div>
            <div className="card-title">Mapeo de conceptos</div>
            <div className="card-sub">Una red de aerolíneas y una red informática se modelan con la misma matemática</div>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="compare-table">
            <div className="compare-cell h">Red aérea</div>
            <div className="compare-cell h">Red informática</div>
            {filas.map(([a, b], i) => (
              <Fragment key={i}>
                <div className={'compare-cell' + (i === filas.length - 1 ? ' compare-row-last' : '')}>{a}</div>
                <div className={'compare-cell' + (i === filas.length - 1 ? ' compare-row-last' : '')}>{b}</div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat">
          <div className="l">Enlaces directos (1 hop)</div>
          <div className="v tabular">{directos / 2}</div>
          <div className="s">Aristas de la red</div>
        </div>
        <div className="stat">
          <div className="l">Pares alcanzables ≤ 2 hops</div>
          <div className="v tabular">{(alc1 / (n * (n - 1)) * 100).toFixed(0)}%</div>
          <div className="s">Cobertura efectiva</div>
        </div>
        <div className="stat">
          <div className="l">Routers core (top 3)</div>
          <div className="v tabular">{grados.slice(0, 3).reduce((s, c) => s + c.grado, 0)}</div>
          <div className="s">Conexiones acumuladas</div>
        </div>
        <div className="stat">
          <div className="l">Diámetro estimado</div>
          <div className="v tabular">3</div>
          <div className="s">Saltos máximos en la red</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Routers centrales del backbone</div>
            <div className="card-sub">Las ciudades-hub funcionan como routers core: concentran tráfico y reducen el número de saltos</div>
          </div>
        </div>
        <div className="card-body">
          {grados.slice(0, 5).map((c, idx) => (
            <div className="hub-row" key={c.id}>
              <div className={'hub-rank top'}>R{idx + 1}</div>
              <div className="hub-name">
                {c.nombre} <span className="pais">{c.pais}</span>
              </div>
              <div className="hub-bar">
                <div style={{ width: `${(c.grado / grados[0].grado) * 100}%` }} />
              </div>
              <div className="hub-count">{c.grado} enlaces</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
