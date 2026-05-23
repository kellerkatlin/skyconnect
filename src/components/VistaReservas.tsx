import { useState, useCallback } from 'react';
import { loadReservas, deleteReserva } from '../lib/storage';
import type { ReservaDemo } from '../lib/types';
import type { useEstado } from '../lib/state';
import { Trash } from './Icons';
import { multiplicadorClase } from '../lib/pricing';

type Props = { estado: ReturnType<typeof useEstado> };

const CLASE_LABEL: Record<string, string> = {
  economica: 'Económica',
  business: 'Business',
};

function fmtMin(min: number): string {
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

function fmtFecha(iso: string): string {
  const [y, mo, d] = iso.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${+d} ${months[+mo - 1]} ${y}`;
}

export function VistaReservas({ estado }: Props) {
  const { ciudades } = estado;
  const [reservas, setReservas] = useState<ReservaDemo[]>(() => loadReservas().reverse());
  const [confirmando, setConfirmando] = useState<string | null>(null);

  const cancelar = useCallback((codigo: string) => {
    deleteReserva(codigo);
    setReservas(prev => prev.filter(r => r.codigo !== codigo));
    setConfirmando(null);
  }, []);

  if (reservas.length === 0) {
    return (
      <div className="card">
        <div className="card-body" style={{ textAlign: 'center', padding: 56, color: 'var(--ink-3)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✈</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No hay reservas aún</div>
          <div style={{ fontSize: 13 }}>Usa el Planificador de viaje para crear tu primera reserva.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {reservas.map(r => {
        const o = ciudades[r.origenId];
        const d = ciudades[r.destinoId];
        const mult = multiplicadorClase(r.clase);
        const costoTotal = r.opcion.costoTotal * mult * r.pasajeros;
        const esConfirmando = confirmando === r.codigo;

        return (
          <div key={r.codigo} className="card">
            <div className="card-head" style={{ paddingBottom: 0 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div className="card-title" style={{ fontFamily: 'var(--font-mono)', letterSpacing: 0.5 }}>
                    {r.codigo}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
                    padding: '2px 7px', borderRadius: 3,
                    background: r.clase === 'business' ? 'var(--sky)' : 'var(--paper-3)',
                    color: r.clase === 'business' ? 'white' : 'var(--ink-2)',
                  }}>
                    {CLASE_LABEL[r.clase]}
                  </span>
                  <span style={{ color: 'var(--ink-4)', fontSize: 12 }}>
                    {fmtFecha(r.fecha)} · {r.pasajeros} {r.pasajeros === 1 ? 'pasajero' : 'pasajeros'}
                  </span>
                </div>
                <div style={{ marginTop: 6, fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                  {o?.nombre ?? `#${r.origenId}`}
                  <span style={{ color: 'var(--sky-red)', margin: '0 10px' }}>→</span>
                  {d?.nombre ?? `#${r.destinoId}`}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                  ${costoTotal.toLocaleString('es', { maximumFractionDigits: 0 })}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>USD total</div>
              </div>
            </div>

            <div className="card-body" style={{ paddingTop: 12 }}>
              {/* Ruta detallada */}
              <div style={{
                background: 'var(--paper-2)', borderRadius: 6, padding: '10px 14px',
                display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 12,
              }}>
                {r.opcion.path.map((cityId, idx) => (
                  <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {idx > 0 && <span style={{ color: 'var(--ink-4)', fontSize: 12 }}>→</span>}
                    <span style={{
                      fontSize: 12,
                      fontWeight: idx === 0 || idx === r.opcion.path.length - 1 ? 600 : 400,
                      color: idx === 0 || idx === r.opcion.path.length - 1 ? 'var(--ink)' : 'var(--ink-3)',
                    }}>
                      {ciudades[cityId]?.nombre ?? `#${cityId}`}
                    </span>
                  </span>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-4)', whiteSpace: 'nowrap' }}>
                  {r.opcion.escalas === 0 ? 'Vuelo directo' : `${r.opcion.escalas} ${r.opcion.escalas === 1 ? 'escala' : 'escalas'}`}
                  {' · '}{fmtMin(r.opcion.tiempoTotalMin)}
                </span>
              </div>

              {/* Tramos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {r.opcion.tramos.map((t, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 12, color: 'var(--ink-3)', padding: '4px 0',
                    borderBottom: idx < r.opcion.tramos.length - 1 ? '1px solid var(--paper-3)' : 'none',
                  }}>
                    <span>
                      {ciudades[t.from]?.nombre ?? `#${t.from}`}
                      <span style={{ color: 'var(--ink-4)', margin: '0 8px' }}>→</span>
                      {ciudades[t.to]?.nombre ?? `#${t.to}`}
                    </span>
                    <span style={{ display: 'flex', gap: 16, fontVariantNumeric: 'tabular-nums' }}>
                      <span>${(t.costo * mult).toLocaleString('es', { maximumFractionDigits: 0 })} c/u</span>
                      <span style={{ color: 'var(--ink-4)' }}>{fmtMin(t.duracionMin)}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Acciones */}
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                {esConfirmando ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>¿Cancelar esta reserva?</span>
                    <button className="btn ghost sm" onClick={() => setConfirmando(null)}>No</button>
                    <button
                      className="btn sm"
                      style={{ background: 'var(--sky-red)', color: 'white', border: 'none' }}
                      onClick={() => cancelar(r.codigo)}
                    >
                      Sí, cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn ghost sm"
                    style={{ color: 'var(--sky-red)', display: 'flex', alignItems: 'center', gap: 6 }}
                    onClick={() => setConfirmando(r.codigo)}
                  >
                    <Trash style={{ width: 13, height: 13 }} />
                    Cancelar reserva
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
