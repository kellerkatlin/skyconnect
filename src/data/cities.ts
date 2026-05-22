import type { Ciudad, Regiones } from '../lib/types';

export const ciudadesSeed: Ciudad[] = [
  // Perú
  { id: 0,  nombre: 'Lima',              pais: 'Perú',       region: 'sudamerica', x: 360, y: 540 },
  { id: 1,  nombre: 'Iquitos',           pais: 'Perú',       region: 'sudamerica', x: 415, y: 480 },
  { id: 2,  nombre: 'Piura',             pais: 'Perú',       region: 'sudamerica', x: 335, y: 470 },
  { id: 3,  nombre: 'Chiclayo',          pais: 'Perú',       region: 'sudamerica', x: 345, y: 490 },
  { id: 4,  nombre: 'Trujillo',          pais: 'Perú',       region: 'sudamerica', x: 350, y: 510 },
  { id: 5,  nombre: 'Puerto Maldonado',  pais: 'Perú',       region: 'sudamerica', x: 440, y: 565 },
  { id: 6,  nombre: 'Cusco',             pais: 'Perú',       region: 'sudamerica', x: 410, y: 575 },
  { id: 7,  nombre: 'Juliaca',           pais: 'Perú',       region: 'sudamerica', x: 425, y: 605 },
  { id: 8,  nombre: 'Arequipa',          pais: 'Perú',       region: 'sudamerica', x: 395, y: 615 },
  // Ecuador
  { id: 9,  nombre: 'Quito',             pais: 'Ecuador',    region: 'sudamerica', x: 330, y: 410 },
  { id: 10, nombre: 'Guayaquil',         pais: 'Ecuador',    region: 'sudamerica', x: 310, y: 440 },
  // Venezuela
  { id: 11, nombre: 'Caracas',           pais: 'Venezuela',  region: 'sudamerica', x: 460, y: 340 },
  // México
  { id: 12, nombre: 'Ciudad de México',  pais: 'México',     region: 'norte',      x: 175, y: 245 },
  { id: 13, nombre: 'Cancún',            pais: 'México',     region: 'norte',      x: 245, y: 240 },
  // Caribe
  { id: 14, nombre: 'La Habana',         pais: 'Cuba',              region: 'caribe', x: 290, y: 235 },
  { id: 15, nombre: 'Punta Cana',        pais: 'Rep. Dominicana',   region: 'caribe', x: 425, y: 280 },
  { id: 16, nombre: 'Santo Domingo',     pais: 'Rep. Dominicana',   region: 'caribe', x: 410, y: 290 },
  { id: 17, nombre: 'San Juan',          pais: 'Puerto Rico',       region: 'caribe', x: 460, y: 285 },
  // Centroamérica
  { id: 18, nombre: 'Belice',            pais: 'Belice',     region: 'centro', x: 220, y: 270 },
  { id: 19, nombre: 'Flores',            pais: 'Guatemala',  region: 'centro', x: 215, y: 285 },
  { id: 20, nombre: 'Ciudad de Guatemala', pais: 'Guatemala',region: 'centro', x: 210, y: 305 },
  { id: 21, nombre: 'San Pedro Sula',    pais: 'Honduras',   region: 'centro', x: 240, y: 305 },
  { id: 22, nombre: 'Roatán',            pais: 'Honduras',   region: 'centro', x: 250, y: 290 },
  { id: 23, nombre: 'La Ceiba',          pais: 'Honduras',   region: 'centro', x: 245, y: 315 },
  { id: 24, nombre: 'San Salvador',      pais: 'El Salvador',region: 'centro', x: 220, y: 320 },
  { id: 25, nombre: 'Tegucigalpa',       pais: 'Honduras',   region: 'centro', x: 235, y: 325 },
  { id: 26, nombre: 'Managua',           pais: 'Nicaragua',  region: 'centro', x: 250, y: 350 },
  { id: 27, nombre: 'Liberia',           pais: 'Costa Rica', region: 'centro', x: 260, y: 370 },
  { id: 28, nombre: 'San José',          pais: 'Costa Rica', region: 'centro', x: 275, y: 385 },
  { id: 29, nombre: 'Panamá',            pais: 'Panamá',     region: 'centro', x: 305, y: 395 },
  // Colombia
  { id: 30, nombre: 'Bogotá',            pais: 'Colombia',   region: 'colombia', x: 380, y: 400 },
  { id: 31, nombre: 'Medellín',          pais: 'Colombia',   region: 'colombia', x: 360, y: 380 },
  { id: 32, nombre: 'Cali',              pais: 'Colombia',   region: 'colombia', x: 355, y: 415 },
  { id: 33, nombre: 'San Andrés',        pais: 'Colombia',   region: 'colombia', x: 320, y: 335 },
  { id: 34, nombre: 'Barranquilla',      pais: 'Colombia',   region: 'colombia', x: 370, y: 340 },
  { id: 35, nombre: 'Cartagena',         pais: 'Colombia',   region: 'colombia', x: 360, y: 350 },
  { id: 36, nombre: 'Montería',          pais: 'Colombia',   region: 'colombia', x: 355, y: 365 },
  { id: 37, nombre: 'Manizales',         pais: 'Colombia',   region: 'colombia', x: 365, y: 395 },
  { id: 38, nombre: 'Pereira',           pais: 'Colombia',   region: 'colombia', x: 360, y: 402 },
  { id: 39, nombre: 'Armenia',           pais: 'Colombia',   region: 'colombia', x: 358, y: 410 },
  { id: 40, nombre: 'Ibagué',            pais: 'Colombia',   region: 'colombia', x: 372, y: 410 },
  { id: 41, nombre: 'Popayán',           pais: 'Colombia',   region: 'colombia', x: 358, y: 425 },
  { id: 42, nombre: 'Tumaco',            pais: 'Colombia',   region: 'colombia', x: 340, y: 435 },
  { id: 43, nombre: 'Pasto',             pais: 'Colombia',   region: 'colombia', x: 350, y: 435 },
  { id: 44, nombre: 'Neiva',             pais: 'Colombia',   region: 'colombia', x: 380, y: 425 },
  { id: 45, nombre: 'Florencia',         pais: 'Colombia',   region: 'colombia', x: 378, y: 440 },
  { id: 46, nombre: 'Leticia',           pais: 'Colombia',   region: 'colombia', x: 425, y: 470 },
  { id: 47, nombre: 'Villavicencio',     pais: 'Colombia',   region: 'colombia', x: 395, y: 405 },
  { id: 48, nombre: 'Yopal',             pais: 'Colombia',   region: 'colombia', x: 400, y: 390 },
  { id: 49, nombre: 'Barrancabermeja',   pais: 'Colombia',   region: 'colombia', x: 380, y: 375 },
  { id: 50, nombre: 'Bucaramanga',       pais: 'Colombia',   region: 'colombia', x: 392, y: 370 },
  { id: 51, nombre: 'Cúcuta',            pais: 'Colombia',   region: 'colombia', x: 410, y: 365 },
  { id: 52, nombre: 'Valledupar',        pais: 'Colombia',   region: 'colombia', x: 395, y: 348 },
  { id: 53, nombre: 'Santa Marta',       pais: 'Colombia',   region: 'colombia', x: 380, y: 343 },
  { id: 54, nombre: 'Riohacha',          pais: 'Colombia',   region: 'colombia', x: 395, y: 338 },
  // Europa
  { id: 55, nombre: 'Madrid',            pais: 'España',     region: 'europa',   x: 815, y: 235 },
  { id: 56, nombre: 'Barcelona',         pais: 'España',     region: 'europa',   x: 845, y: 225 },
  { id: 57, nombre: 'Londres',           pais: 'Reino Unido',region: 'europa',   x: 800, y: 175 },
];

export const regionesSeed: Regiones = {
  sudamerica: { label: 'Sudamérica',    ids: [0,1,2,3,4,5,6,7,8,9,10,11] },
  norte:      { label: 'Norteamérica',  ids: [12,13] },
  caribe:     { label: 'Caribe',        ids: [14,15,16,17] },
  centro:     { label: 'Centroamérica', ids: [18,19,20,21,22,23,24,25,26,27,28,29] },
  colombia:   { label: 'Colombia',      ids: [30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54] },
  europa:     { label: 'Europa',        ids: [55,56,57] },
};
