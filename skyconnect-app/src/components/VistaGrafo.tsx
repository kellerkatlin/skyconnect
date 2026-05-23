import { useState, useMemo } from 'react';
import type { useEstado } from '../lib/state';
import type { RegionKey } from '../lib/types';

type Estado = ReturnType<typeof useEstado>;

type Props = { estado: Estado };

type Pos = { x: number; y: number };

const clusterCenters: Record<RegionKey, Pos> = {
  sudamerica: { x: 380, y: 480 },
  norte:      { x: 180, y: 180 },
  caribe:     { x: 380, y: 200 },
  centro:     { x: 230, y: 320 },
  colombia:   { x: 540, y: 360 },
  europa:     { x: 760, y: 200 },
};

export function VistaGrafo({ estado }: Props) {
  const { ciudades, regiones, A } = estado;
  const n = ciudades.length;
  const W = 900;
  const H = 620;

  const clusters = Object.entries(regiones) as [RegionKey, { label: string; ids: number[] }][];

  const positions = useMemo(() => {
    const pos: Record<number, Pos> = {};
    clusters.forEach(([key, r]) => {
      const cc = clusterCenters[key];
      const radius = Math.min(120, 22 + r.ids.length * 4);
      r.ids.forEach((id, idx) => {
        const angle = (idx / r.ids.length) * Math.PI * 2;
        pos[id] = {
          x: cc.x + Math.cos(angle) * radius,
          y: cc.y + Math.sin(angle) * radius,
        };
      });
    });
    return pos;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const [hover, setHover] = useState<number | null>(null);
  const grados = ciudades.map((_, i) => A[i].reduce((a: number, b: number) => a + b, 0));

  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (A[i][j]) edges.push([i, j]);

  return (
    <div className="graph-wrap" style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        {/* Nubes regionales */}
        {clusters.map(([key, r]) => {
          const cc = clusterCenters[key];
          const radius = Math.min(140, 40 + r.ids.length * 4.5);
          return (
            <g key={key}>
              <circle cx={cc.x} cy={cc.y} r={radius} fill="rgba(26,22,20,0.025)" stroke="var(--paper-3)" />
              <text x={cc.x} y={cc.y - radius - 6} textAnchor="middle"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 13, fill: 'var(--ink-3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                {r.label}
              </text>
            </g>
          );
        })}

        {/* Edges */}
        {edges.map(([i, j], k) => {
          const p1 = positions[i];
          const p2 = positions[j];
          if (!p1 || !p2) return null;
          const hl = hover != null && (hover === i || hover === j);
          return (
            <line key={k} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  className={'graph-edge' + (hl ? ' hl' : '')} />
          );
        })}

        {/* Nodes */}
        {ciudades.map((c, i) => {
          const p = positions[i];
          if (!p) return null;
          const hub = grados[i] >= 8;
          const dim = hover != null && hover !== i && A[hover] && A[hover][i] !== 1;
          return (
            <g key={c.id}
               onMouseEnter={() => setHover(i)}
               onMouseLeave={() => setHover(h => (h === i ? null : h))}>
              <circle cx={p.x} cy={p.y} r={hub ? 5 : 3.2}
                      className={'graph-node' + (hub ? ' hub' : '') + (dim ? ' dim' : '')} />
              {(hub || hover === i) && (
                <text x={p.x + 7} y={p.y + 3}
                      style={{ fontSize: 9, fill: 'var(--ink-2)', fontWeight: hub ? 600 : 400, paintOrder: 'stroke', stroke: 'white', strokeWidth: 2.5 }}>
                  {c.nombre}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="map-legend">
        <div className="legend-row"><span className="legend-dot" /> Hub (≥8 conexiones)</div>
        <div className="legend-row"><span className="legend-dot city" /> Nodo</div>
      </div>
    </div>
  );
}
