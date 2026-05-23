import type { useEstado } from '../lib/state';

type Estado = ReturnType<typeof useEstado>;

type Props = { estado: Estado };

export function VistaStats({ estado }: Props) {
  const { ciudades, regiones, A, A2, A3 } = estado;
  const n = ciudades.length;

  // Métricas
  let directos = 0;
  let alc1 = 0;
  let alc2 = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (i === j) continue;
    if (A[i][j]) directos++;
    if (A2[i][j]) alc1++;
    if (A3[i][j]) alc2++;
  }
  const totalPares = n * (n - 1);
  const totalRutasUnicasVal = directos / 2;

  const grados = ciudades.map((c, i) => ({ ...c, grado: A[i].reduce((a: number, b: number) => a + b, 0) }));
  grados.sort((a, b) => b.grado - a.grado);
  const maxG = grados[0].grado;

  // ciudades aisladas
  const aisladas = grados.filter(g => g.grado === 0);

  // Métricas con pesos (Fase 2)
  const rutas = estado.rutas;
  const costoPromedio = rutas.length ? rutas.reduce((s, r) => s + r.costoBase, 0) / rutas.length : 0;
  const duracionPromedio = rutas.length ? rutas.reduce((s, r) => s + r.duracionMin, 0) / rutas.length : 0;
  const tramoMasCaro = rutas.length
    ? rutas.reduce((max, r) => r.costoBase > max.costoBase ? r : max, rutas[0])
    : null;

  // Hub más eficiente (tarifa promedio más baja entre top 5 hubs)
  const topHubs = grados.slice(0, 5);
  const hubEficiente = topHubs.length
    ? topHubs.reduce((best, h) => {
        const salidas = rutas.filter(r => r.from === h.id || r.to === h.id);
        const prom = salidas.length ? salidas.reduce((s, r) => s + r.costoBase, 0) / salidas.length : Infinity;
        return prom < best.prom ? { c: h, prom } : best;
      }, { c: topHubs[0], prom: Infinity })
    : null;

  return (
    <div>
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat">
          <div className="l">Ciudades en la red</div>
          <div className="v tabular">{n}</div>
          <div className="s">Distribuidas en {Object.keys(regiones).length} regiones</div>
        </div>
        <div className="stat">
          <div className="l">Rutas únicas</div>
          <div className="v tabular">{totalRutasUnicasVal}</div>
          <div className="s">{directos} entradas en A (no dirigida)</div>
        </div>
        <div className="stat">
          <div className="l">Cobertura A²</div>
          <div className="v tabular">{(alc1 / totalPares * 100).toFixed(0)}%</div>
          <div className="s">Pares alcanzables ≤ 2 tramos</div>
        </div>
        <div className="stat">
          <div className="l">Cobertura A³</div>
          <div className="v tabular">{(alc2 / totalPares * 100).toFixed(0)}%</div>
          <div className="s">Pares alcanzables ≤ 3 tramos</div>
        </div>
        <div className="stat">
          <div className="l">Costo promedio directo</div>
          <div className="v tabular">${Math.round(costoPromedio)}</div>
          <div className="s">Tarifa media por vuelo</div>
        </div>
        <div className="stat">
          <div className="l">Duración promedio</div>
          <div className="v tabular">{(duracionPromedio / 60).toFixed(1)}h</div>
          <div className="s">Vuelo directo medio</div>
        </div>
        {tramoMasCaro && (
          <div className="stat">
            <div className="l">Tramo más caro</div>
            <div className="v tabular">${tramoMasCaro.costoBase}</div>
            <div className="s">{ciudades[tramoMasCaro.from].nombre} ↔ {ciudades[tramoMasCaro.to].nombre}</div>
          </div>
        )}
        {hubEficiente && isFinite(hubEficiente.prom) && (
          <div className="stat">
            <div className="l">Hub más eficiente</div>
            <div className="v tabular" style={{ fontSize: 22 }}>{hubEficiente.c.nombre}</div>
            <div className="s">Tarifa promedio: ${Math.round(hubEficiente.prom)}</div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-head">
          <div>
            <div className="card-title">Hubs principales</div>
            <div className="card-sub">Ranking por número de conexiones directas (grado del nodo)</div>
          </div>
          <span className="pill red dot">Top {Math.min(10, grados.length)}</span>
        </div>
        <div className="card-body">
          {grados.slice(0, 10).map((c, idx) => (
            <div className="hub-row" key={c.id}>
              <div className={'hub-rank' + (idx < 3 ? ' top' : '')}>{idx + 1}</div>
              <div className="hub-name">
                {c.nombre}<span className="pais">{c.pais}</span>
              </div>
              <div className="hub-bar">
                <div style={{ width: `${(c.grado / maxG) * 100}%` }} />
              </div>
              <div className="hub-count">{c.grado} rutas</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Análisis de conectividad</div>
            <div className="card-sub">Cómo crece el alcance de la red al permitir más escalas</div>
          </div>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Matriz</th>
                <th>Significado</th>
                <th>Pares alcanzables</th>
                <th>% de la red</th>
                <th>Δ vs anterior</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">A</td>
                <td>Vuelo directo (1 tramo)</td>
                <td className="mono">{directos.toLocaleString()}</td>
                <td>{(directos / totalPares * 100).toFixed(1)}%</td>
                <td className="muted">—</td>
              </tr>
              <tr>
                <td className="mono">A²</td>
                <td>Hasta 1 escala (≤ 2 tramos)</td>
                <td className="mono">{alc1.toLocaleString()}</td>
                <td>{(alc1 / totalPares * 100).toFixed(1)}%</td>
                <td>+{((alc1 - directos) / totalPares * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="mono">A³</td>
                <td>Hasta 2 escalas (≤ 3 tramos)</td>
                <td className="mono">{alc2.toLocaleString()}</td>
                <td>{(alc2 / totalPares * 100).toFixed(1)}%</td>
                <td>+{((alc2 - alc1) / totalPares * 100).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
          {aisladas.length > 0 && (
            <div style={{ marginTop: 16, padding: 12, background: 'var(--paper-2)', borderRadius: 6, fontSize: 13 }}>
              <strong>Ciudades sin rutas:</strong> {aisladas.map(c => c.nombre).join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
