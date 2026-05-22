import type { Ciudad, OpcionViaje, Criterio } from '../lib/types';

type Props = {
  opcion: OpcionViaje;
  ciudades: Ciudad[];
  pasajeros: number;
  multiplicadorPrecio: number;
  onSeleccionar?: () => void;
};

function codeOf(nombre: string): string {
  return nombre.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3);
}

function fmtDuracion(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

const LABELS: Record<Criterio, string> = {
  barata: 'LA MÁS BARATA',
  rapida: 'LA MÁS RÁPIDA',
  balance: 'MEJOR BALANCE',
};

const TIEMPO_CONEXION_MIN = 90;

export function OpcionViajeCard({ opcion, ciudades, pasajeros, multiplicadorPrecio, onSeleccionar }: Props) {
  const ciudadesPath = opcion.path.map(id => ciudades[id]);
  const costoFinal = Math.round(opcion.costoTotal * multiplicadorPrecio * pasajeros);

  return (
    <div className="opcion-card">
      <div className="opcion-card-head">
        <div className="opcion-badges">
          {opcion.criterios.map(c => (
            <span key={c} className={'opcion-badge ' + c}>{LABELS[c]}</span>
          ))}
        </div>
        {onSeleccionar && (
          <button className="btn primary sm" onClick={onSeleccionar}>Seleccionar</button>
        )}
      </div>

      <div className="opcion-route">
        {ciudadesPath.map((c, idx) => (
          <span key={`s-${idx}`} className="opcion-route-step">
            <span className="opcion-route-block">
              <span className="opcion-route-code">{codeOf(c.nombre)}</span>
              <span className="opcion-route-city">{c.nombre}</span>
            </span>
            {idx < ciudadesPath.length - 1 && (
              <span className="opcion-route-sep">→</span>
            )}
          </span>
        ))}
      </div>

      <div className="opcion-tramos">
        {opcion.tramos.map((t, idx) => {
          const co = ciudades[t.from];
          const cd = ciudades[t.to];
          return (
            <div key={idx}>
              <div className="opcion-tramo">
                <span className="opcion-tramo-num">Tramo {idx + 1}</span>
                <span className="opcion-tramo-route">
                  {co.nombre.toUpperCase()} → {cd.nombre.toUpperCase()}
                </span>
                <span className="opcion-tramo-meta">
                  ${Math.round(t.costo)} · {fmtDuracion(t.duracionMin)}
                </span>
              </div>
              {idx < opcion.tramos.length - 1 && (
                <div className="opcion-conexion">
                  ↳ Conexión {TIEMPO_CONEXION_MIN}min en {ciudades[opcion.tramos[idx + 1].from].nombre}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="opcion-footer">
        <div className="opcion-footer-meta">
          <div className="opcion-footer-cell">
            <div className="l">Duración total</div>
            <div className="v">{fmtDuracion(opcion.tiempoTotalMin)}</div>
          </div>
          <div className="opcion-footer-cell">
            <div className="l">Escalas</div>
            <div className="v">{opcion.escalas === 0 ? 'Directo' : `${opcion.escalas}`}</div>
          </div>
          <div className="opcion-footer-cell">
            <div className="l">Pasajeros × tarifa</div>
            <div className="v">{pasajeros} × ${Math.round(opcion.costoTotal * multiplicadorPrecio)}</div>
          </div>
        </div>
        <div className="opcion-total">
          <div className="opcion-total-l">Total</div>
          <div className="opcion-total-v">${costoFinal.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
