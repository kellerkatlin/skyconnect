import type { Ciudad, Ruta, ReservaDemo, SolicitudRuta } from './types';

const KEY_USER = 'skyconnect:user-data';
const KEY_RES = 'skyconnect:reservas';
const KEY_SOL = 'skyconnect:solicitudes';

export type UserData = {
  ciudadesExtra: Ciudad[];
  rutasExtra: Ruta[];
};

export function loadUserData(): UserData {
  try {
    const raw = localStorage.getItem(KEY_USER);
    if (!raw) return { ciudadesExtra: [], rutasExtra: [] };
    const parsed = JSON.parse(raw);
    return {
      ciudadesExtra: Array.isArray(parsed.ciudadesExtra) ? parsed.ciudadesExtra : [],
      rutasExtra: Array.isArray(parsed.rutasExtra) ? parsed.rutasExtra : [],
    };
  } catch {
    return { ciudadesExtra: [], rutasExtra: [] };
  }
}

export function saveUserData(d: UserData): void {
  localStorage.setItem(KEY_USER, JSON.stringify(d));
}

export function clearUserData(): void {
  localStorage.removeItem(KEY_USER);
}

export function loadReservas(): ReservaDemo[] {
  try {
    const raw = localStorage.getItem(KEY_RES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReserva(r: ReservaDemo): void {
  const list = loadReservas();
  list.push(r);
  localStorage.setItem(KEY_RES, JSON.stringify(list));
}

export function deleteReserva(codigo: string): void {
  const list = loadReservas().filter(r => r.codigo !== codigo);
  localStorage.setItem(KEY_RES, JSON.stringify(list));
}

export function loadSolicitudes(): SolicitudRuta[] {
  try {
    const raw = localStorage.getItem(KEY_SOL);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSolicitudes(list: SolicitudRuta[]): void {
  localStorage.setItem(KEY_SOL, JSON.stringify(list));
}
