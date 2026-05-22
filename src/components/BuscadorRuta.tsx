import { BuscadorPorEscalas } from './BuscadorPorEscalas';
import type { useEstado } from '../lib/state';
import type { SolicitudRuta } from '../lib/types';
import type { SectionId } from './Sidebar';

type Props = {
  estado: ReturnType<typeof useEstado>;
  origen: number | null;
  setOrigen: (v: number | null) => void;
  destino: number | null;
  setDestino: (v: number | null) => void;
  setRutaResaltada: (path: number[] | null) => void;
  solicitudes: SolicitudRuta[];
  pedirRuta: (origenId: number, destinoId: number) => void;
  setSection: (s: SectionId) => void;
};

export function BuscadorRuta(props: Props) {
  return <BuscadorPorEscalas {...props} />;
}
