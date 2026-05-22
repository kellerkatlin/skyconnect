<div align="center">

# ✈️ SkyConnect

**Plataforma de análisis de red aérea y planificador multi-criterio**

*Trabajo 04 · Matemática Discreta · 1AMA0708 · UPC · Grupo 1 · 2026*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Docker](https://img.shields.io/badge/Docker-multi--stage-2496ED?logo=docker&logoColor=white)](./Dockerfile)

</div>

---

## 📌 Resumen

SkyConnect modela la red de rutas de **Avianca / TACA** como un **grafo dirigido ponderado** y la explota con herramientas de matemática discreta y algoritmos clásicos de caminos óptimos. La app ofrece dos audiencias:

- 🧑‍✈️ **Pasajero** → un planificador que le devuelve **3 opciones personalizadas** de viaje (más barata · más rápida · balanceada) con costo, duración, escalas y código de reserva.
- 🏢 **Aerolínea / analista** → mapa interactivo, matrices `A`, `A²`, `A³`, estadísticas de red, identificación del hub más eficiente y un explicador didáctico de **Dijkstra / OSPF**.

---

## 🚀 Inicio rápido

### Desarrollo local

```bash
npm install
npm run dev          # http://localhost:5173
```

### Build de producción

```bash
npm run build        # genera dist/
npm run preview      # sirve el build local
```

### Con Docker 🐳

```bash
docker build -t skyconnect .
docker run -p 8080:80 skyconnect
# → http://localhost:8080
```

> El contenedor expone el puerto **80** (Nginx). Si lo deployas en un PaaS, ese es el *container port*.

---

## 🧭 Tour por la aplicación

La barra lateral organiza el sistema en tres bloques: **Red**, **Análisis** y **Edición**.

### 🔴 Red

| # | Sección | Qué hace |
|---|---|---|
| **01** | **Mapa de rutas** | Mapa esquemático interactivo (zoom, paneo) con las 58 ciudades y 49 rutas. Tooltip por ciudad con **tarifa promedio**. |
| **02** | **Ciudades** | Listado de aeropuertos con grado de entrada/salida y región. |
| **03** | **Matriz A / A² / A³** | Matrices de conectividad. Tabs **C · T · D** (Costo, Tiempo, Distancia) con celdas en heat-map. |

### 🔵 Análisis

| # | Sección | Qué hace |
|---|---|---|
| **04** | **Buscar ruta** | Dos pestañas:<br>• **Escalas** — búsqueda clásica de rutas con métricas por tramo.<br>• **Planificador** ⭐ — devuelve **3 opciones de viaje** (barata/rápida/balanceada) + código de reserva. |
| **05** | **Estadísticas** | Costo y duración promedio, ruta más larga/corta, **hub más eficiente** de la red. |
| **06** | **Vista grafo** | Renderiza el grafo dirigido completo con etiquetas. |
| **07** | **Redes informáticas** | Explicador didáctico de **Dijkstra** y **OSPF** aplicados al grafo aéreo. |

### 🟢 Edición

| # | Sección | Qué hace |
|---|---|---|
| **08** | **Agregar ciudad/ruta** | Formulario para extender la red. Inputs de costo y duración con **sugerencias deterministas** basadas en el par origen-destino. |

---

## 📁 Estructura del proyecto

```
skyconnect-app/
│
├── 🐳 Dockerfile               Multi-stage Node 20 → Nginx 1.27 (imagen ~25 MB)
├── 🌐 nginx.conf               Config de Nginx: SPA fallback + cache de assets
├── 📄 .dockerignore            Excluye node_modules, dist, .git, etc.
│
├── 📄 index.html               Entry HTML (Vite inyecta el bundle aquí)
├── 📄 package.json             Dependencias y scripts
├── 📄 vite.config.ts           Configuración de Vite
├── 📄 tsconfig*.json           TypeScript (app / node / base)
├── 📄 eslint.config.js         Reglas de lint
│
├── 📁 public/                  Assets estáticos servidos tal cual (favicons, etc.)
│
└── 📁 src/                     Código fuente de la app
    │
    ├── 📄 main.tsx             Bootstrap de React (createRoot)
    ├── 📄 App.tsx              Layout principal + router por sección activa
    ├── 📄 styles.css           Estilos globales (paleta, tipografía, layout)
    │
    ├── 📁 components/          🧩 UI — un componente por sección + auxiliares
    │   ├── Sidebar.tsx             Navegación lateral (3 grupos · 8 items)
    │   ├── PageHeader.tsx          Cabecera de cada vista (número + título + bajada)
    │   ├── Icons.tsx               Set de iconos SVG inline
    │   ├── Toast.tsx               Notificaciones flotantes
    │   │
    │   ├── MapaRutas.tsx           01 · Mapa SVG interactivo con zoom/pan
    │   ├── VistaCiudades.tsx       02 · Listado de aeropuertos
    │   ├── MatrizInteractiva.tsx   03 · Matrices A/A²/A³ con tabs C/T/D
    │   │
    │   ├── BuscadorRuta.tsx        04a · Pestaña "Escalas"
    │   ├── BuscadorPorEscalas.tsx  04a · Lógica de búsqueda por escalas
    │   ├── Planificador.tsx        04b · Pestaña "Planificador" (⭐ feature estrella)
    │   ├── OpcionViajeCard.tsx     04b · Tarjeta de cada una de las 3 opciones
    │   │
    │   ├── VistaStats.tsx          05 · Métricas + hub eficiente
    │   ├── VistaGrafo.tsx          06 · Renderizado del grafo
    │   ├── VistaRedes.tsx          07 · Dijkstra / OSPF didáctico
    │   └── VistaAgregar.tsx        08 · Formulario de alta de ciudades/rutas
    │
    ├── 📁 data/                💾 Datos del dominio (semilla)
    │   ├── cities.ts               Catálogo de 58 aeropuertos (código, nombre, región, coords)
    │   └── routes.ts               49 rutas directas con costo y duración deterministas
    │
    └── 📁 lib/                 🧠 Lógica de negocio y algoritmos (sin UI, testeable)
        ├── types.ts                Tipos compartidos (Ciudad, Ruta, OpcionViaje, …)
        ├── state.ts                Estado global + construcción de matrices C/T/D
        ├── matrix.ts               Operaciones sobre matrices (A, A², A³, suma booleana)
        ├── pathfinding.ts          Dijkstra · Floyd-Warshall · enumeración acotada
        ├── pricing.ts              Generador determinista de costo/duración por par O-D
        └── storage.ts              Persistencia en localStorage
```

---

## 🧠 Algoritmos y matemática detrás

| Concepto | Archivo | Para qué |
|---|---|---|
| **Matriz de adyacencia A** | `lib/matrix.ts` | Representa el grafo dirigido base. |
| **Potencias A², A³** | `lib/matrix.ts` | Cuentan caminos de 2 y 3 escalas entre cada par. |
| **Dijkstra** | `lib/pathfinding.ts` | Camino óptimo único en grafo ponderado (C o T). |
| **Floyd-Warshall** | `lib/pathfinding.ts` | Todos-contra-todos para estadísticas de red. |
| **Enumeración acotada** | `lib/pathfinding.ts` | Genera múltiples caminos candidatos → alimenta el Planificador. |
| **Pricing determinista** | `lib/pricing.ts` | Hash estable del par O-D → costo y duración reproducibles. |

---

## 🛠️ Stack técnico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19 · TypeScript 6 |
| **Build / Dev server** | Vite 8 |
| **Lint** | ESLint 10 + typescript-eslint |
| **Persistencia local** | `localStorage` |
| **Servidor de producción** | Nginx 1.27 Alpine |
| **Contenerización** | Docker multi-stage |

Sin dependencias de UI pesadas (no Tailwind, no MUI) — todo el styling es CSS plano en `src/styles.css`, lo que mantiene el bundle compacto.

---

## 📦 Deploy

El `Dockerfile` (en la **raíz del repo**) hace un build en dos etapas:

1. **`build`** — `node:20-alpine` instala dependencias (`npm ci`) y compila (`npm run build`).
2. **`runtime`** — `nginx:1.27-alpine` sirve el `dist/` resultante con la config de `nginx.conf` (incluye SPA fallback y cache de assets estáticos por 30 días).

**Container port: `80`** — apunta tu dominio o reverse proxy a ese puerto.

---

## 👥 Equipo

UPC · Matemática Discreta · **1AMA0708** · Grupo 1 · 2026

---

<div align="center">
<sub>Hecho con ✈️ y un poquito de teoría de grafos.</sub>
</div>
