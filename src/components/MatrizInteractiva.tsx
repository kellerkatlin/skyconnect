import { useMemo, useState } from 'react';
import type { useEstado } from '../lib/state';

type Estado = ReturnType<typeof useEstado>;

type Props = { estado: Estado };

type Hover = { i: number; j: number } | null;
type MatrixType = 'A' | 'A2' | 'A3' | 'C' | 'T' | 'D';

function fmtMinutos(min: number): string {
  if (!isFinite(min)) return 'sin conexión';
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m}min`;
  return `${h}h ${m}min`;
}

export function MatrizInteractiva({ estado }: Props) {
  const { ciudades } = estado;
  const { A, A2, A3, C, T, D } = estado;

  const [tipo, setTipo] = useState<MatrixType>('A');
  const [hover, setHover] = useState<Hover>(null);

  const Mbool = tipo === 'A' ? A : tipo === 'A2' ? A2 : tipo === 'A3' ? A3 : null;
  const Mnum = tipo === 'C' ? C : tipo === 'T' ? T : tipo === 'D' ? D : null;
  const esNumerica = Mnum != null;

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

  // Calcular escala de calor para matrices numéricas
  const escala = useMemo(() => {
    if (!Mnum) return { min: 0, max: 0 };
    let mn = Infinity, mx = -Infinity;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const v = Mnum[i][j];
        if (isFinite(v)) {
          if (v < mn) mn = v;
          if (v > mx) mx = v;
        }
      }
    }
    if (!isFinite(mn)) mn = 0;
    if (!isFinite(mx)) mx = 0;
    return { min: mn, max: mx };
  }, [Mnum, n]);

  const opacidad = (v: number) => {
    if (!isFinite(v)) return 0;
    if (escala.max === escala.min) return 0.5;
    return 0.1 + 0.9 * (v - escala.min) / (escala.max - escala.min);
  };

  // contar 1's (solo para booleanas) o nº de celdas finitas (para numéricas)
  let total = 0;
  if (Mbool) {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (Mbool[i][j]) total++;
  } else if (Mnum) {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j && isFinite(Mnum[i][j])) total++;
  }

  const formula = tipo === 'A' ? 'A = adyacencia'
    : tipo === 'A2' ? 'A² = A ∘ A'
    : tipo === 'A3' ? 'A³ = A² ∘ A'
    : tipo === 'C' ? 'C = costos directos (USD)'
    : tipo === 'T' ? 'T = tiempos directos (min)'
    : 'D = Floyd-Warshall(C)';

  const desc = tipo === 'A' ? 'Vuelos directos (1 tramo)'
    : tipo === 'A2' ? 'Alcanzable en ≤ 2 tramos (1 escala o directo)'
    : tipo === 'A3' ? 'Alcanzable en ≤ 3 tramos (hasta 2 escalas)'
    : tipo === 'C' ? 'Tarifa de cada vuelo directo'
    : tipo === 'T' ? 'Duración de cada vuelo directo'
    : 'Costo mínimo entre todo par (cualquier nº de escalas)';

  // Color base para celdas numéricas: D usa sky-red, C/T usan ink
  const fillNumerico = tipo === 'D' ? 'var(--sky-red)' : 'var(--ink)';

  function renderHoverValor() {
    if (!hover) return null;
    if (Mbool) {
      const v = Mbool[hover.i][hover.j];
      return (
        <span>
          <strong style={{ color: 'var(--ink)' }}>
            [{hover.i + 1},{hover.j + 1}] = {v}
          </strong>{' — '}
          {ciudades[hover.i].nombre} → {ciudades[hover.j].nombre}{' '}
          {hover.i === hover.j ? '(diagonal)' :
            v === 1 ?
              <span style={{ color: 'var(--sky-red)' }}>✓ alcanzable</span> :
              <span className="muted">sin conexión</span>}
        </span>
      );
    }
    if (Mnum) {
      const v = Mnum[hover.i][hover.j];
      const isInf = !isFinite(v);
      let valTxt: string;
      if (hover.i === hover.j) valTxt = '0';
      else if (isInf) valTxt = '∞';
      else if (tipo === 'T') valTxt = fmtMinutos(v);
      else if (tipo === 'D') valTxt = `$${Math.round(v)} (mín)`;
      else valTxt = `$${Math.round(v)}`;
      return (
        <span>
          <strong style={{ color: 'var(--ink)' }}>
            [{hover.i + 1},{hover.j + 1}] = {valTxt}
          </strong>{' — '}
          {ciudades[hover.i].nombre} → {ciudades[hover.j].nombre}{' '}
          {hover.i === hover.j ? '(diagonal)' :
            isInf ? <span className="muted">sin conexión</span> :
            <span style={{ color: tipo === 'D' ? 'var(--sky-red)' : 'var(--ink-2)' }}>✓</span>}
        </span>
      );
    }
    return null;
  }

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
          <button className={'matrix-tab' + (tipo === 'C' ? ' active' : '')} onClick={() => setTipo('C')}>
            <span>Matriz </span><span className="mono">C</span>
          </button>
          <button className={'matrix-tab' + (tipo === 'T' ? ' active' : '')} onClick={() => setTipo('T')}>
            <span>Matriz </span><span className="mono">T</span>
          </button>
          <button className={'matrix-tab' + (tipo === 'D' ? ' active' : '')} onClick={() => setTipo('D')}>
            <span>Matriz </span><span className="mono">D</span>
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
              const isDiag = i === j;
              const hr = !!hover && hover.i === i;
              const hc = !!hover && hover.j === j;
              const hx = hr && hc;
              const hoverCls = hx ? ' hover-cross' : hr ? ' hover-row' : hc ? ' hover-col' : '';

              if (esNumerica && Mnum) {
                const v = Mnum[i][j];
                const op = isDiag ? 0 : opacidad(v);
                return (
                  <rect
                    key={`${i}-${j}`}
                    x={PAD_L + j * CELL}
                    y={PAD_T + i * CELL}
                    width={CELL - 1}
                    height={CELL - 1}
                    className={'matrix-cell' + (isDiag ? ' diag' : '') + hoverCls}
                    fill={op > 0 ? fillNumerico : 'transparent'}
                    fillOpacity={op}
                    onMouseEnter={() => setHover({ i, j })}
                  />
                );
              }

              const on = Mbool ? Mbool[i][j] === 1 : false;
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
                    hoverCls
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
        {hover ? renderHoverValor() : (
          <span className="muted">
            {esNumerica ? (
              <>Celdas con valor: <strong style={{ color: 'var(--ink)' }}>{total.toLocaleString()}</strong>
              {' '}· rango {tipo === 'T' ? `${fmtMinutos(escala.min)}–${fmtMinutos(escala.max)}`
                : `$${Math.round(escala.min)}–$${Math.round(escala.max)}`}</>
            ) : (
              <>Total de unos: <strong style={{ color: 'var(--ink)' }}>{total.toLocaleString()}</strong></>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
