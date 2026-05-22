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

export function Planificador(_props: Props) {
  return <div className="card"><div className="card-body">Planificador — pendiente (Task 22).</div></div>;
}
