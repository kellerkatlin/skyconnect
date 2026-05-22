import { useState } from 'react';
import type { useEstado } from '../lib/state';

type Estado = ReturnType<typeof useEstado>;

type Props = { estado: Estado };

type Hover = { i: number; j: number } | null;
type MatrixType = 'A' | 'A2' | 'A3';

export function MatrizInteractiva({ estado }: Props) {
  const { ciudades } = estado;
  const { A, A2, A3 } = estado;

  const [tipo, setTipo] = useState<MatrixType>('A');
  const [hover, setHover] = useState<Hover>(null);

  const M = tipo === 'A' ? A : tipo === 'A2' ? A2 : A3;
  const n = ciudades.length;

  const CELL = 11;
  const PAD_L = 96;
  const PAD_T = 96;
  const W = PAD_L + n * CELL + 12;
  const H = PAD_T + n * CELL + 12;

  // Bloques de regiones (ranges)
  const regBlocks = [
    { label: 'Perú+SA', start: 0, end: 11, color: '#C8102E' },
    { label: 'N+Caribe+CA', start: 12, end: 29, color: '#1F6B6B' },
    { label: 'Colombia', start: 30, end: 54, color: '#B8893A' },
    { label: 'Europa', start: 55, end: 57, color: '#2B4A6F' },
  ];

  // contar 1's
  let total = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (M[i][j]) total++;

  const formula = tipo === 'A' ? 'A = adyacencia' : tipo === 'A2' ? 'A² = A ∘ A' : 'A³ = A² ∘ A';
  const desc = tipo === 'A' ? 'Vuelos directos (1 tramo)'
              : tipo === 'A2' ? 'Alcanzable en ≤ 2 tramos (1 escala o directo)'
              : 'Alcanzable en ≤ 3 tramos (hasta 2 escalas)';

  return (
    <div>
      <div className="between" style={{ marginBottom: 16 }}>
        <div className="matrix-tabs">
          <button className={'matrix-tab' + (tipo === 'A' ? ' active' : '')} onClick={() => setTipo('A')}>
            <span>Matriz </span><span className="mono">A</span>
          </button>
          <button className={'matrix-tab' + (tipo === 'A2' ? ' active' : '')} onClick={() => setTipo('A2')}>
            <span>Matriz </span><span className="mono">A²</span>
          </button>
          <button className={'matrix-tab' + (tipo === 'A3' ? ' active' : '')} onClick={() => setTipo('A3')}>
            <span>Matriz </span><span className="mono">A³</span>
          </button>
        </div>
        <div className="muted" style={{ fontSize: 12 }}>
          Pasa el cursor sobre una celda para ver el par origen–destino.
        </div>
      </div>

      <div className="matrix-wrap">
        <svg className="matrix-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* Bloques de región */}
          {regBlocks.map(b => (
            <rect key={b.label}
              x={PAD_L + b.start * CELL}
              y={PAD_T + b.start * CELL}
              width={(b.end - b.start + 1) * CELL}
              height={(b.end - b.start + 1) * CELL}
              fill={b.color}
              opacity="0.04"
            />
          ))}

          {/* Celdas */}
          {Array.from({ length: n }).map((_, i) =>
            Array.from({ length: n }).map((__, j) => {
              const on = M[i][j] === 1;
              const isDiag = i === j;
              const hr = !!hover && hover.i === i;
              const hc = !!hover && hover.j === j;
              const hx = hr && hc;
              return (
                <rect
                  key={`${i}-${j}`}
                  x={PAD_L + j * CELL}
                  y={PAD_T + i * CELL}
                  width={CELL - 1}
                  height={CELL - 1}
                  className={
                    'matrix-cell' +
                    (on ? ' on' : '') +
                    (isDiag ? ' diag' : '') +
                    (hx ? ' hover-cross' : hr ? ' hover-row' : hc ? ' hover-col' : '')
                  }
                  onMouseEnter={() => setHover({ i, j })}
                />
              );
            })
          )}

          {/* Ejes - filas */}
          {ciudades.map((c, i) => {
            const hl = !!hover && hover.i === i;
            return (
              <text
                key={'r' + i}
                x={PAD_L - 6}
                y={PAD_T + i * CELL + CELL * 0.7}
                textAnchor="end"
                className={'matrix-tick' + (hl ? ' hi' : '')}
              >
                {String(i + 1).padStart(2, '0')} {c.nombre.length > 12 ? c.nombre.slice(0, 12) : c.nombre}
              </text>
            );
          })}
          {/* Ejes - columnas */}
          {ciudades.map((c, j) => {
            const hl = !!hover && hover.j === j;
            return (
              <text
                key={'c' + j}
                x={PAD_L + j * CELL + CELL * 0.5}
                y={PAD_T - 6}
                transform={`rotate(-60 ${PAD_L + j * CELL + CELL * 0.5} ${PAD_T - 6})`}
                textAnchor="start"
                className={'matrix-tick' + (hl ? ' hi' : '')}
              >
                {String(j + 1).padStart(2, '0')} {c.nombre.length > 12 ? c.nombre.slice(0, 12) : c.nombre}
              </text>
            );
          })}

          {/* Bordes de bloques */}
          {regBlocks.map(b => (
            <rect key={'br' + b.label}
              x={PAD_L + b.start * CELL}
              y={PAD_T + b.start * CELL}
              width={(b.end - b.start + 1) * CELL - 1}
              height={(b.end - b.start + 1) * CELL - 1}
              className="matrix-region"
            />
          ))}
        </svg>
      </div>

      <div className="matrix-readout">
        <span className="formula">{formula}</span>
        <span>{desc}</span>
        <span className="spacer" />
        {hover ? (
          <span>
            <strong style={{ color: 'var(--ink)' }}>
              [{hover.i + 1},{hover.j + 1}] = {M[hover.i][hover.j]}
            </strong>{' — '}
            {ciudades[hover.i].nombre} → {ciudades[hover.j].nombre}{' '}
            {hover.i === hover.j ? '(diagonal)' :
              M[hover.i][hover.j] === 1 ?
                <span style={{ color: 'var(--sky-red)' }}>✓ alcanzable</span> :
                <span className="muted">sin conexión</span>}
          </span>
        ) : (
          <span className="muted">Total de unos: <strong style={{ color: 'var(--ink)' }}>{total.toLocaleString()}</strong></span>
        )}
      </div>
    </div>
  );
}
