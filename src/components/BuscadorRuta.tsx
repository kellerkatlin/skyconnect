import type { useEstado } from '../lib/state';
import { BuscadorPorEscalas } from './BuscadorPorEscalas';

type Estado = ReturnType<typeof useEstado>;

type Props = {
  estado: Estado;
  origen: number | null;
  setOrigen: (i: number | null) => void;
  destino: number | null;
  setDestino: (i: number | null) => void;
  setRutaResaltada: (p: number[] | null) => void;
};

// En Task 21 se rediseña con 2 pestañas (Por escalas / Planificador).
// Por ahora, Fase 1 solo expone el buscador clásico.
export function BuscadorRuta(props: Props) {
  return <BuscadorPorEscalas {...props} />;
}
