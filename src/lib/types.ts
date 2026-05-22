export type RegionKey = 'sudamerica' | 'norte' | 'caribe' | 'centro' | 'colombia' | 'europa';

export type Ciudad = {
  id: number;
  nombre: string;
  pais: string;
  region: RegionKey;
  x: number;
  y: number;
};

export type Ruta = {
  from: number;
  to: number;
  costoBase: number;
  duracionMin: number;
};

export type Region = { label: string; ids: number[] };
export type Regiones = Record<RegionKey, Region>;

export type Matriz<T extends Uint8Array | Float32Array> = T[];

export type Estado = {
  ciudades: Ciudad[];
  rutas: Ruta[];
  A: Uint8Array[];
  A2: Uint8Array[];
  A3: Uint8Array[];
  C: Float32Array[];
  T: Float32Array[];
  D: Float32Array[];
};

export type Clase = 'economica' | 'business';
export type Criterio = 'barata' | 'rapida' | 'balance';

export type TramoViaje = {
  from: number;
  to: number;
  costo: number;
  duracionMin: number;
};

export type OpcionViaje = {
  path: number[];
  tramos: TramoViaje[];
  costoTotal: number;
  tiempoTotalMin: number;
  escalas: number;
  criterios: Criterio[];
};

export type ReservaDemo = {
  codigo: string;
  origenId: number;
  destinoId: number;
  fecha: string;
  pasajeros: number;
  clase: Clase;
  opcion: OpcionViaje;
  createdAt: string;
};
