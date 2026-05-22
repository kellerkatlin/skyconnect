import { useState } from 'react';
import { BuscadorPorEscalas } from './BuscadorPorEscalas';
import { Planificador } from './Planificador';
import type { useEstado } from '../lib/state';

type Props = {
  estado: ReturnType<typeof useEstado>;
  origen: number | null;
  setOrigen: (v: number | null) => void;
  destino: number | null;
  setDestino: (v: number | null) => void;
  setRutaResaltada: (path: number[] | null) => void;
  setToast: (t: { msg: string; err?: boolean } | null) => void;
};

export function BuscadorRuta(props: Props) {
  const [tab, setTab] = useState<'escalas' | 'planificador'>('escalas');

  return (
    <div>
      <div className="matrix-tabs" style={{ marginBottom: 20, width: 'fit-content' }}>
        <button className={'matrix-tab' + (tab === 'escalas' ? ' active' : '')}
                onClick={() => setTab('escalas')}>
          Por escalas
          <span className="muted" style={{ marginLeft: 8, fontSize: 11 }}>A · A² · A³</span>
        </button>
        <button className={'matrix-tab' + (tab === 'planificador' ? ' active' : '')}
                onClick={() => setTab('planificador')}>
          Planificador
          <span className="muted" style={{ marginLeft: 8, fontSize: 11 }}>costo + tiempo</span>
        </button>
      </div>

      {tab === 'escalas' ? <BuscadorPorEscalas {...props} /> : <Planificador {...props} />}
    </div>
  );
}
