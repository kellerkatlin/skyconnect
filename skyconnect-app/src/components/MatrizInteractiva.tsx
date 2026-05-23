import { useMemo, useState } from 'react';
import type { useEstado } from '../lib/state';
import { reconstruirRuta } from '../lib/pathfinding';

type Estado = ReturnType<typeof useEstado>;
type Props = { estado: Estado };
type Hover = { i: number; j: number } | null;
type MatrixType = 'A' | 'A2' | 'A3' | 'C' | 'T' | 'D';
type MousePos = { x: number; y: number } | null;

function fmtMinutos(min: number): string {
  if (!isFinite(min)) return 'sin conexión';
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m}min`;
  return `${h}h ${m}min`;
}

function descripcionEscalas(n: number): string {
  if (n === 0) return 'sin escalas';
  if (n === 1) return '1 escala';
  return `${n} escalas`;
}

export function MatrizInteractiva({ estado }: Props) {
  const { ciudades, A, A2, A3, C, T, D, next } = estado;

  const [tipo, setTipo] = useState<MatrixType>('A');
  const [hover, setHover] = useState<Hover>(null);
  const [mousePos, setMousePos] = useState<MousePos>(null);

  const Mbool = tipo === 'A' ? A : tipo === 'A2' ? A2 : tipo === 'A3' ? A3 : null;
  const Mnum = tipo === 'C' ? C : tipo === 'T' ? T : tipo === 'D' ? D : null;
  const esNumerica = Mnum != null;

  const n = ciudades.length;

  const CELL = 11;
  const PAD_L = 96;
  const PAD_T = 96;
  const W = PAD_L + n * CELL + 12;
  const H = PAD_T + n * CELL + 12;

  const regBlocks = [
    { label: 'Perú+SA', start: 0, end: 11, color: '#C8102E' },
    { label: 'N+Caribe+CA', start: 12, end: 29, color: '#1F6B6B' },
    { label: 'Colombia', start: 30, end: 54, color: '#B8893A' },
    { label: 'Europa', start: 55, end: 57, color: '#2B4A6F' },
  ];

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
    if (escala.max === escala.min) return 0.7;
    return 0.42 + 0.58 * (v - escala.min) / (escala.max - escala.min);
  };

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
    : 'D = costos óptimos';

  const desc = tipo === 'A' ? 'Vuelos directos (1 tramo)'
    : tipo === 'A2' ? 'Alcanzable en ≤ 2 tramos (1 escala o directo)'
    : tipo === 'A3' ? 'Alcanzable en ≤ 3 tramos (hasta 2 escalas)'
    : tipo === 'C' ? 'Tarifa de cada vuelo directo'
    : tipo === 'T' ? 'Duración de cada vuelo directo'
    : 'Costo mínimo entre todo par (cualquier nº de escalas)';

  const explicacion: Record<MatrixType, { titulo: string; cuerpo: string }> = {
    A:  { titulo: 'Matriz de adyacencia A', cuerpo: 'Cada celda [i, j] vale 1 si existe un vuelo directo de la ciudad i a la ciudad j, y 0 en caso contrario. Es la representación booleana del grafo y define la red base.' },
    A2: { titulo: 'Potencia booleana A² · caminos de 2 tramos', cuerpo: 'A² = A ∘ A (producto booleano). La celda [i, j] vale 1 si se puede llegar de i a j haciendo como máximo una escala. Detecta cobertura indirecta de 1 salto.' },
    A3: { titulo: 'Potencia booleana A³ · caminos de 3 tramos', cuerpo: 'A³ = A² ∘ A. La celda [i, j] vale 1 si existe alguna ruta de i a j con hasta 2 escalas. Cuanto más densa, más conectada está la red.' },
    C:  { titulo: 'Matriz de costos C', cuerpo: 'Cada celda [i, j] muestra la tarifa en dólares del vuelo directo i → j (∞ si no hay vuelo directo). El mapa de calor identifica visualmente los tramos caros y baratos.' },
    T:  { titulo: 'Matriz de tiempos T', cuerpo: 'Cada celda [i, j] indica la duración en minutos del vuelo directo i → j. Es la base para calcular la ruta más rápida mediante Dijkstra.' },
    D:  { titulo: 'Matriz de costos óptimos D', cuerpo: 'D[i, j] es el costo MÍNIMO para ir de i a j usando cualquier número de escalas y combinaciones de rutas.' },
  };

  const fillNumerico = tipo === 'D' ? 'var(--sky-red)'
    : tipo === 'C' ? 'var(--sky)'
    : tipo === 'T' ? 'var(--teal)'
    : 'var(--ink)';

  // Tooltip: contenido según tipo y celda
  function buildTooltip(i: number, j: number): { breve: string; sub: string; detalle: string } | null {
    const orig = ciudades[i].nombre;
    const dest = ciudades[j].nombre;

    if (i === j) {
      return {
        breve: orig,
        sub: 'Ciudad origen = destino (diagonal)',
        detalle: tipo === 'D' || tipo === 'C' || tipo === 'T'
          ? 'La diagonal siempre es 0: el costo/tiempo de ir de una ciudad a sí misma es nulo.'
          : 'La diagonal de las matrices booleanas es 0 por definición (no hay autolazo).',
      };
    }

    if (Mbool) {
      const v = Mbool[i][j];
      if (tipo === 'A') {
        return v === 1
          ? { breve: `${orig} → ${dest}`, sub: '✓ Vuelo directo disponible', detalle: `A[${i+1},${j+1}] = 1. Existe un vuelo directo entre estas dos ciudades. Este tramo es parte de la red base.` }
          : { breve: `${orig} → ${dest}`, sub: '✗ Sin vuelo directo', detalle: `A[${i+1},${j+1}] = 0. No hay vuelo directo. Puede existir ruta con escalas — revisa A² o A³.` };
      }
      if (tipo === 'A2') {
        const directo = A[i][j] === 1;
        return v === 1
          ? { breve: `${orig} → ${dest}`, sub: '✓ Alcanzable en ≤ 2 tramos', detalle: directo ? `A²[${i+1},${j+1}] = 1. También aparece en A: hay vuelo directo. A² confirma la cobertura.` : `A²[${i+1},${j+1}] = 1. No hay vuelo directo, pero se puede llegar con exactamente 1 escala intermedia.` }
          : { breve: `${orig} → ${dest}`, sub: '✗ No alcanzable en 2 tramos', detalle: `A²[${i+1},${j+1}] = 0. No existe ruta en 1 ni 2 tramos. Verifica A³ para rutas de hasta 2 escalas.` };
      }
      if (tipo === 'A3') {
        const directo = A[i][j] === 1;
        const conUna = A2[i][j] === 1;
        return v === 1
          ? { breve: `${orig} → ${dest}`, sub: '✓ Alcanzable en ≤ 3 tramos', detalle: directo ? 'Vuelo directo (también en A y A²).' : conUna ? 'Alcanzable con 1 escala (también en A²).' : `A³[${i+1},${j+1}] = 1. Alcanzable exclusivamente con 2 escalas intermedias.` }
          : { breve: `${orig} → ${dest}`, sub: '✗ No conectados en la red', detalle: `A³[${i+1},${j+1}] = 0. Estas ciudades no están conectadas con hasta 2 escalas. La ruta no existe en la red actual.` };
      }
    }

    if (Mnum) {
      const v = Mnum[i][j];
      const isInf = !isFinite(v);

      if (tipo === 'C') {
        return isInf
          ? { breve: `${orig} → ${dest}`, sub: 'Sin vuelo directo', detalle: `No existe vuelo directo entre estas ciudades. C[${i+1},${j+1}] = ∞. Puede haber ruta con escalas — consúltala en la Matriz D.` }
          : { breve: `${orig} → ${dest}`, sub: `$${Math.round(v)} · vuelo directo`, detalle: `Tarifa base del vuelo directo. Los precios reales se multiplican por clase (Business ×2.8) y varían ligeramente según la fecha.` };
      }

      if (tipo === 'T') {
        return isInf
          ? { breve: `${orig} → ${dest}`, sub: 'Sin vuelo directo', detalle: `No existe vuelo directo. T[${i+1},${j+1}] = ∞. Consulta rutas con escalas en el Planificador de viaje.` }
          : { breve: `${orig} → ${dest}`, sub: `${fmtMinutos(v)} · vuelo directo`, detalle: `Duración del vuelo directo. El tiempo total con escalas incluye 90 min de conexión por escala adicional.` };
      }

      if (tipo === 'D') {
        if (isInf) {
          return { breve: `${orig} → ${dest}`, sub: 'Sin conexión posible', detalle: 'No existe ninguna ruta que conecte estas ciudades en la red actual. D[i,j] = ∞.' };
        }
        // Reconstruir la ruta óptima usando la matriz next
        const rutaIds = next ? reconstruirRuta(next, i, j) : [];
        const escalas = Math.max(0, rutaIds.length - 2);
        const esDirecto = rutaIds.length === 2 || (rutaIds.length === 0 && A[i][j] === 1);

        let rutaTxt = '';
        if (rutaIds.length >= 2) {
          rutaTxt = rutaIds.map(id => ciudades[id].nombre).join(' → ');
        }

        const subTxt = esDirecto
          ? `$${Math.round(v)} · vuelo directo`
          : `$${Math.round(v)} · con ${descripcionEscalas(escalas)}`;

        let detalleTxt = '';
        if (esDirecto) {
          detalleTxt = `Costo mínimo alcanzado con vuelo directo. No hay ruta más barata para este par de ciudades.`;
        } else if (rutaIds.length >= 3) {
          const intermedias = rutaIds.slice(1, -1).map(id => ciudades[id].nombre).join(', ');
          detalleTxt = `Ruta óptima: ${rutaTxt}. ${escalas === 1 ? 'Escala' : 'Escalas'} en ${intermedias}. Esta combinación minimiza el costo total.`;
        } else {
          detalleTxt = `Costo mínimo: $${Math.round(v)}.`;
        }

        return { breve: `${orig} → ${dest}`, sub: subTxt, detalle: detalleTxt };
      }
    }

    return null;
  }

  const tooltipData = hover ? buildTooltip(hover.i, hover.j) : null;

  // Posición del tooltip: aparece a la derecha del cursor, se voltea si está cerca del borde
  function calcTooltipStyle(): React.CSSProperties {
    if (!mousePos) return { display: 'none' };
    const TW = 220;
    const left = mousePos.x + 14 + TW > window.innerWidth - 8
      ? mousePos.x - TW - 8
      : mousePos.x + 14;
    const top = Math.min(mousePos.y - 4, window.innerHeight - 80);
    return {
      position: 'fixed',
      left,
      top,
      width: TW,
      zIndex: 1200,
      background: 'var(--paper)',
      border: '1px solid var(--paper-3)',
      borderRadius: 6,
      boxShadow: 'var(--shadow-sm)',
      padding: '7px 10px',
      pointerEvents: 'none',
    };
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div className="matrix-tabs">
          {(['A','A2','A3','C','T','D'] as MatrixType[]).map(t => (
            <button key={t} className={'matrix-tab' + (tipo === t ? ' active' : '')} onClick={() => setTipo(t)}>
              <span>Matriz </span>
              <span className="mono">{t === 'A2' ? 'A²' : t === 'A3' ? 'A³' : t}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: 'var(--paper-2)',
        borderLeft: '3px solid var(--sky-red)',
        padding: '12px 16px',
        borderRadius: 4,
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
          {explicacion[tipo].titulo}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          {explicacion[tipo].cuerpo}
        </div>
      </div>

      <div
        className="matrix-wrap"
        onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => { setHover(null); setMousePos(null); }}
      >
        <svg
          className="matrix-svg"
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
        >
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
                // C y T: binario negro — tiene valor o no tiene
                if (tipo === 'C' || tipo === 'T') {
                  const hasVal = !isDiag && isFinite(v);
                  return (
                    <rect
                      key={`${i}-${j}`}
                      x={PAD_L + j * CELL}
                      y={PAD_T + i * CELL}
                      width={CELL - 1}
                      height={CELL - 1}
                      className={'matrix-cell' + (isDiag ? ' diag' : '') + hoverCls}
                      fill={hasVal ? 'var(--ink)' : 'transparent'}
                      fillOpacity={hasVal ? 0.88 : 0}
                      onMouseEnter={() => setHover({ i, j })}
                    />
                  );
                }
                // D: mapa de calor
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
                  className={'matrix-cell' + (on ? ' on' : '') + (isDiag ? ' diag' : '') + hoverCls}
                  onMouseEnter={() => setHover({ i, j })}
                />
              );
            })
          )}

          {/* Ejes - filas */}
          {ciudades.map((c, i) => {
            const hl = !!hover && hover.i === i;
            return (
              <text key={'r' + i}
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
              <text key={'c' + j}
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

      {/* Tooltip flotante — solo identificación breve */}
      {tooltipData && mousePos && (
        <div style={calcTooltipStyle()}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
            {tooltipData.breve}
          </div>
          <div style={{ fontSize: 11, color: tipo === 'D' ? 'var(--sky-red)' : tipo === 'C' ? 'var(--sky)' : tipo === 'T' ? 'var(--teal)' : 'var(--ink-2)' }}>
            {tooltipData.sub}
          </div>
        </div>
      )}

      <div className="matrix-readout">
        <span className="formula">{formula}</span>
        <span>{desc}</span>
        <span className="spacer" />
        {!hover && (
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

      {/* Detalle inferior — aparece al hacer hover sobre una celda */}
      {tooltipData && hover && (
        <div style={{
          marginTop: 10,
          padding: '10px 14px',
          background: 'var(--paper-2)',
          borderRadius: 6,
          borderLeft: `3px solid ${tipo === 'D' ? 'var(--sky-red)' : tipo === 'C' ? 'var(--sky)' : tipo === 'T' ? 'var(--teal)' : 'var(--ink-3)'}`,
          fontSize: 13,
          color: 'var(--ink-2)',
          lineHeight: 1.6,
        }}>
          {tooltipData.detalle}
        </div>
      )}
    </div>
  );
}
