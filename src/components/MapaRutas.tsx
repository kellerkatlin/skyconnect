import { useState, useRef, useMemo, useEffect } from 'react';
import type { MouseEvent as ReactMouseEvent, WheelEvent as ReactWheelEvent } from 'react';
import { ZoomIn, ZoomOut, Reset } from './Icons';
import type { useEstado } from '../lib/state';

type Estado = ReturnType<typeof useEstado>;

type Props = {
  estado: Estado;
  ciudadSel: number | null;
  setCiudadSel: (i: number | null) => void;
  rutaResaltada: number[] | null;
};

type DragState = { x: number; y: number; panX: number; panY: number } | null;

export function MapaRutas({ estado, ciudadSel, setCiudadSel, rutaResaltada }: Props) {
  const { ciudades } = estado;
  const { A } = estado;

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<DragState>(null);
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const VB_W = 1000;
  const VB_H = 720;

  // Hubs según grado
  const grados = useMemo(() => {
    return ciudades.map((_, i) => A[i].reduce((a: number, b: number) => a + b, 0));
  }, [A, ciudades]);
  const isHub = (i: number) => grados[i] >= 8;

  // Curva entre dos puntos (arco)
  function curva(c1: { x: number; y: number }, c2: { x: number; y: number }) {
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;
    const dist = Math.hypot(dx, dy);
    const mx = (c1.x + c2.x) / 2;
    const my = (c1.y + c2.y) / 2;
    const nx = -dy / dist;
    const ny = dx / dist;
    const offset = Math.min(dist * 0.18, 60);
    const cx = mx + nx * offset;
    const cy = my + ny * offset;
    return `M ${c1.x} ${c1.y} Q ${cx} ${cy} ${c2.x} ${c2.y}`;
  }

  // Rutas a dibujar
  const rutas = useMemo(() => {
    const list: [number, number][] = [];
    for (let i = 0; i < ciudades.length; i++) {
      for (let j = i + 1; j < ciudades.length; j++) {
        if (A[i][j] === 1) list.push([i, j]);
      }
    }
    return list;
  }, [A, ciudades]);

  // Pan / zoom
  const onMouseDown = (e: ReactMouseEvent<SVGSVGElement>) => {
    setDrag({ x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y });
  };

  const onWheel = (e: ReactWheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.5, Math.min(4, z * delta)));
  };

  useEffect(() => {
    if (!drag) return;
    const mv = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const sx = VB_W / rect.width;
      const sy = VB_H / rect.height;
      setPan({
        x: drag.panX + (e.clientX - drag.x) * sx,
        y: drag.panY + (e.clientY - drag.y) * sy,
      });
    };
    const up = () => setDrag(null);
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', mv);
      window.removeEventListener('mouseup', up);
    };
  }, [drag]);

  const vbW = VB_W / zoom;
  const vbH = VB_H / zoom;
  const vbX = (VB_W - vbW) / 2 - pan.x;
  const vbY = (VB_H - vbH) / 2 - pan.y;

  // Determinar qué rutas están en el path resaltado
  const pathEdges = new Set<string>();
  if (rutaResaltada && rutaResaltada.length > 1) {
    for (let k = 0; k < rutaResaltada.length - 1; k++) {
      const a = rutaResaltada[k];
      const b = rutaResaltada[k + 1];
      pathEdges.add(`${Math.min(a, b)}-${Math.max(a, b)}`);
    }
  }

  // Etiquetas región
  const regionLabels = [
    { x: 200, y: 200, label: 'Norteamérica' },
    { x: 215, y: 350, label: 'Centroamérica' },
    { x: 350, y: 260, label: 'Caribe' },
    { x: 460, y: 410, label: 'Colombia' },
    { x: 410, y: 660, label: 'Sudamérica' },
    { x: 820, y: 140, label: 'Europa' },
  ];

  return (
    <div className="map-wrap">
      <svg
        ref={svgRef}
        className={'map-svg' + (drag ? ' dragging' : '')}
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ aspectRatio: '1000 / 720' }}
        onMouseDown={onMouseDown}
        onWheel={onWheel}
      >
        {/* Grilla suave */}
        <g className="map-grid">
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={'v' + i} x1={i * 100} y1={0} x2={i * 100} y2={VB_H} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={'h' + i} x1={0} y1={i * 100} x2={VB_W} y2={i * 100} />
          ))}
        </g>

        {/* Ecuador / trópicos */}
        <line x1={0} y1={420} x2={VB_W} y2={420} className="map-graticule" />
        <line x1={0} y1={250} x2={VB_W} y2={250} className="map-graticule" />
        <line x1={0} y1={580} x2={VB_W} y2={580} className="map-graticule" />

        {/* Etiquetas de región */}
        {regionLabels.map(r => (
          <text key={r.label} x={r.x} y={r.y} className="region-label">{r.label}</text>
        ))}

        {/* Rutas */}
        <g>
          {rutas.map(([i, j]) => {
            const c1 = ciudades[i];
            const c2 = ciudades[j];
            const key = `${i}-${j}`;
            const inPath = pathEdges.has(key);
            const dim = (ciudadSel != null && ciudadSel !== i && ciudadSel !== j && !inPath) ||
                        (!!rutaResaltada && rutaResaltada.length > 1 && !inPath);
            const hl = (ciudadSel != null && (ciudadSel === i || ciudadSel === j)) ||
                       (hover != null && (hover === i || hover === j));
            return (
              <path
                key={key}
                d={curva(c1, c2)}
                className={
                  'route-line' +
                  (inPath ? ' path-leg' : '') +
                  (hl && !inPath ? ' highlighted' : '') +
                  (dim ? ' dim' : '')
                }
              />
            );
          })}
        </g>

        {/* Ciudades */}
        <g>
          {ciudades.map((c, i) => {
            const hub = isHub(i);
            const sel = ciudadSel === i;
            const r = sel ? 5.5 : hub ? 4.5 : 2.6;
            return (
              <g
                key={c.id}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(h => (h === i ? null : h))}
                onClick={(e) => { e.stopPropagation(); setCiudadSel(sel ? null : i); }}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={c.x} cy={c.y} r={r}
                  className={'city-dot' + (hub ? ' hub' : '') + (sel ? ' selected' : '')}
                />
                {(hub || sel || hover === i) && (
                  <text
                    x={c.x + (hub ? 7 : 5)}
                    y={c.y + 2}
                    className={'city-label' + (hub ? ' hub-label' : '')}
                  >
                    {c.nombre}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {hover != null && (() => {
        const c = ciudades[hover];
        const grado = grados[hover];
        const salidas = estado.rutas.filter(r => r.from === hover || r.to === hover);
        const costoProm = salidas.length
          ? Math.round(salidas.reduce((s, r) => s + r.costoBase, 0) / salidas.length)
          : 0;
        return (
          <div className="tooltip" style={{
            left: `${((c.x - vbX) / vbW) * 100}%`,
            top: `${((c.y - vbY) / vbH) * 100}%`,
          }}>
            <div className="t-name">{c.nombre}</div>
            <div className="t-meta">{c.pais} · {grado} {grado === 1 ? 'ruta' : 'rutas'}</div>
            {salidas.length > 0 && (
              <div className="t-meta" style={{ marginTop: 4 }}>Tarifa promedio: ${costoProm}</div>
            )}
          </div>
        );
      })()}

      {/* Controles */}
      <div className="map-controls">
        <button className="map-ctrl" onClick={() => setZoom(z => Math.min(4, z * 1.25))} title="Acercar">
          <ZoomIn style={{ width: 16, height: 16 }} />
        </button>
        <button className="map-ctrl" onClick={() => setZoom(z => Math.max(0.5, z / 1.25))} title="Alejar">
          <ZoomOut style={{ width: 16, height: 16 }} />
        </button>
        <button className="map-ctrl" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} title="Restablecer">
          <Reset style={{ width: 16, height: 16 }} />
        </button>
      </div>

      <div className="map-legend">
        <div className="legend-row"><span className="legend-dot" /> Hub principal (≥8 rutas)</div>
        <div className="legend-row"><span className="legend-dot city" /> Ciudad</div>
        <div className="legend-row"><span className="legend-line" /> Vuelo directo</div>
      </div>
    </div>
  );
}
