# SkyConnect — Guión Tutorial en Video

> Tono: cercano, claro y sin tecnicismos innecesarios.  
> Duración estimada total: 12–18 minutos  
> Cada sección indica el tiempo aproximado de grabación.

---

## INTRO — Presentación (1–2 min)

**[Mostrar pantalla de inicio de la app]**

"Hola, bienvenidos a este tutorial de **SkyConnect**, una plataforma que simula la red de vuelos de Avianca y TACA en América Latina y Europa.

Con esta herramienta vas a poder:
- Ver en un mapa todas las ciudades y rutas de la red
- Buscar si hay vuelo entre dos ciudades y con cuántas escalas
- Planificar un viaje comparando precios, tiempos y clases
- Hacer reservas y guardar tu historial
- Agregar nuevas ciudades y rutas a la red
- Y analizar toda la red con matrices y estadísticas

Vamos a recorrer cada sección de a poco. Empecemos."

---

## SECCIÓN 1 — Mapa de rutas (2–3 min)

**[Hacer clic en "Mapa de rutas" en el menú lateral]**

"Lo primero que vemos al abrir la app es el **Mapa de rutas**. Acá está representada toda la red: cada puntito es una ciudad y cada línea curva es una ruta de vuelo directa entre dos ciudades.

Hay ciudades que tienen más líneas que otras — esas son los **hubs**, los aeropuertos más importantes. Los van a reconocer porque tienen un punto más grande y su nombre siempre visible. Los tres más importantes son **Bogotá**, **Lima** y **San Salvador**.

**[Pasar el cursor sobre una ciudad]**

Si paso el cursor sobre cualquier ciudad, aparece un tooltip con el nombre, el país, cuántas rutas directas tiene y cuál es la tarifa promedio desde ahí.

**[Hacer clic en una ciudad, por ejemplo Bogotá]**

Si hago clic en una ciudad, el mapa resalta solo sus conexiones directas y atenúa todo lo demás. Así puedo ver de un vistazo a dónde vuela directamente esa ciudad. Hago clic de nuevo para deseleccionarla.

**[Usar la rueda del mouse para hacer zoom]**

También puedo hacer zoom con la rueda del mouse para acercarme a una región, y arrastrar el mapa para moverme. Y acá arriba a la derecha tengo los botones de acercar, alejar y restablecer la vista original.

Si en algún momento busco una ruta y hago clic en 'Ver en mapa', la ruta aparece resaltada en rojo acá, así puedo verla visualmente."

---

## SECCIÓN 2 — Ciudades de la red (1 min)

**[Hacer clic en "Ciudades" en el menú lateral]**

"En esta sección veo el listado completo de todas las ciudades, organizadas por región: Sudamérica, Colombia, Centroamérica, Caribe, Norteamérica y Europa.

Cada ciudad muestra cuántas rutas directas tiene. Si hago clic en cualquier ciudad, automáticamente la selecciona como punto de partida y me lleva a la sección de búsqueda para que pueda buscar vuelos desde ahí.

Si más adelante agrego ciudades nuevas, van a aparecer acá con un badge dorado que dice **NUEVA**, para distinguirlas de las 58 ciudades originales."

---

## SECCIÓN 3 — Matrices de la red (2–3 min)

**[Hacer clic en "Matrices" en el menú lateral]**

"Esta es una de las secciones más interesantes desde el punto de vista matemático. Vemos la red representada como **matrices**, que son básicamente tablas donde cada fila y cada columna es una ciudad.

Hay seis matrices y puedo cambiar entre ellas con estas pestañas de arriba.

**[Mostrar Matriz A]**

La **Matriz A** es la más básica: si una celda está negra, significa que hay vuelo directo entre esas dos ciudades. Si está vacía, no hay vuelo directo. Es un simple sí o no.

**[Mostrar Matriz A²]**

La **Matriz A²** me dice si puedo llegar de una ciudad a otra haciendo **exactamente una escala**. El sistema calculó esto multiplicando la Matriz A por sí misma.

**[Mostrar Matriz A³]**

Y la **Matriz A³** hace lo mismo pero con **dos escalas**. En conjunto, estas tres matrices me dicen si existe algún itinerario posible entre cualquier par de ciudades con hasta dos escalas.

**[Mostrar Matriz C]**

La **Matriz C** ya no es de sí/no. Muestra el **costo en dólares** del vuelo directo entre cada par de ciudades. El color azul más intenso indica rutas más caras, y si la celda está vacía es porque no hay vuelo directo.

**[Mostrar Matriz T]**

La **Matriz T** es igual pero con **tiempo en minutos** del vuelo directo. Color teal más intenso = vuelo más largo.

**[Mostrar Matriz D]**

Y la **Matriz D** es la más poderosa: muestra el **costo mínimo posible** para llegar de una ciudad a cualquier otra, usando la cantidad de escalas que sean necesarias. Esto se calculó con un algoritmo matemático llamado Floyd-Warshall.

**[Pasar el cursor sobre una celda de la Matriz D]**

Miren esto: si paso el cursor sobre cualquier celda de la Matriz D, aparece el detalle de cuánto cuesta y, lo más interesante, **cuál es la ruta exacta** del camino más barato. Por ejemplo, acá me dice que para ir de Iquitos a Londres la ruta más barata es Iquitos → Lima → Bogotá → Madrid → Londres, con ese costo total.

Eso es lo que calcula el algoritmo Floyd-Warshall: el mejor camino entre cada par de ciudades."

---

## SECCIÓN 4 — Buscar ruta (2–3 min)

**[Hacer clic en "Buscar ruta" en el menú lateral]**

"Esta sección es para buscar si existe alguna ruta entre dos ciudades específicas.

**[Hacer clic en el selector de origen y escribir 'bogo']**

Los selectores de ciudad tienen búsqueda: simplemente escribo el nombre o el país y filtra automáticamente. Selecciono **Bogotá** como origen.

**[Seleccionar Cusco como destino]**

Y **Cusco** como destino.

**[Mostrar los resultados]**

El sistema me da tres resultados:

Primero, **vuelo directo**: me dice si existe vuelo directo entre Bogotá y Cusco. En este caso vemos que no existe.

Segundo, **con una escala**: lista todas las ciudades intermedias por las que puedo pasar para llegar. Aquí veo varias opciones, como vía Lima. Puedo hacer clic en 'Ver' para que me muestre esa ruta en el mapa.

Tercero, **con dos escalas**: más opciones con dos paradas.

**[Mostrar la sección de Dijkstra]**

Y debajo aparece una sección especial en verde azulado: la **ruta más rápida**, calculada con el algoritmo de Dijkstra. Este algoritmo busca el camino que minimiza el tiempo total de vuelo. Me muestra la ruta ciudad por ciudad y el tiempo total.

**[Mostrar el botón de Planificar viaje]**

Al final, si hay rutas disponibles, aparece este botón rojo: **'Planificar viaje →'**. Al hacer clic me lleva directamente al Planificador con estas ciudades ya seleccionadas.

**[Mostrar el botón de Planificar viaje]**

Al final, si hay rutas disponibles, aparece este botón rojo: **'Planificar viaje →'**. Al hacer clic me lleva directamente al Planificador con estas ciudades ya seleccionadas.

### Ejemplo: solicitar una ruta que no existe

**[Limpiar la selección y buscar Arequipa → Londres]**

Ahora vamos a ver qué pasa cuando no existe ninguna conexión posible. Busco **Arequipa** como origen y **Londres** como destino.

**[Mostrar los tres bloques de resultados en cero]**

El sistema revisa vuelo directo, una escala y dos escalas — y en los tres casos no encuentra nada. Arequipa es una ciudad con pocas rutas directas, y con solo dos escalas no alcanza a llegar a Londres.

**[Mostrar el banner rojo de solicitud]**

Cuando esto pasa, aparece este banner rojo al final que dice **'No hay ruta disponible'**. El sistema me da la opción de **solicitar esta ruta** a la aerolínea para que evalúen abrirla.

**[Hacer clic en 'Solicitar nueva ruta']**

Hago clic en **'Solicitar nueva ruta'**. Aparece un mensaje de confirmación y el botón cambia a 'Ya solicitada' para que no pueda pedirla dos veces.

**[Hacer clic en "Agregar ciudad/ruta" en el menú lateral]**

Ahora voy a la sección **Agregar ciudad/ruta** para ver dónde aparece esa solicitud.

**[Mostrar la sección de Solicitudes pendientes al final de la página]**

Al final de la página, en la sección **Solicitudes pendientes**, aparece la solicitud que acabo de hacer: Arequipa → Londres, con la fecha en que se solicitó. Desde acá, como administrador, puedo ver el costo y la duración sugeridos automáticamente, y tengo dos opciones:

- **Aprobar**: confirma la ruta, la agrega a la red y desaparece de las solicitudes
- **Rechazar**: descarta la solicitud sin agregarla

Esto simula el flujo real de una aerolínea donde un pasajero pide un vuelo y el equipo interno lo evalúa."

---

## SECCIÓN 5 — Planificador de viaje (3–4 min)

**[Volver a Buscar ruta, seleccionar Bogotá → Lima, hacer clic en Planificar viaje]**

"Llegamos al **Planificador de viaje**. Esta es la sección donde comparo todas las opciones de viaje con sus precios reales.

Arriba veo la **ruta seleccionada** en formato de mini pase de abordaje, con los códigos de aeropuerto, el nombre de las ciudades y el ícono del avión. Si quiero cambiar las ciudades, hago clic en 'Cambiar →' y vuelvo a Buscar ruta.

**[Mostrar los filtros]**

Tengo varios filtros para ajustar la búsqueda:

- **Fecha**: al seleccionar una fecha el precio puede cambiar. Las fechas en temporada alta son más caras.
- **Pasajeros**: puedo poner de 1 a 9. El precio final se multiplica por la cantidad de personas.
- **Clase**: Económica o Business. Business multiplica el precio base por 2.8.
- **Presupuesto máximo**: si pongo un límite, el sistema descarta las rutas más caras.
- **Duración máxima**: descarta rutas que tarden más de lo que indico.
- **Máx escalas**: puedo limitar a solo vuelo directo, hasta 1 escala, o hasta 2 escalas.

**[Mostrar las opciones de viaje]**

Y abajo aparecen **todas las opciones disponibles**, ordenadas de menor a mayor precio. Cada tarjeta muestra:

- La ruta completa con todas las ciudades
- Si es vuelo directo o cuántas escalas tiene
- El tiempo total de vuelo
- El costo por persona y el costo total
- Un badge que indica si es la más barata, la más rápida o el mejor balance

**[Señalar los badges]**

Los badges funcionan así:
- **'LA MÁS BARATA'**: la opción de menor costo
- **'LA MÁS RÁPIDA'**: la que menos tiempo total tarda
- **'MEJOR BALANCE'**: la que tiene la mejor relación entre costo y tiempo — ni la más barata ni la más rápida, pero la más equilibrada

**[Cambiar a Business]**

Si cambio a clase Business, noten que los precios cambian y los badges pueden cambiar también, porque en Business el tiempo vale más que el costo al calcular el balance.

**[Hacer clic en Reservar]**

Cuando encuentro la opción que quiero, hago clic en **'Reservar esta opción'**. El sistema genera automáticamente un código de reserva único, como este SKY-BOGLIM-A3F2, y aparece un mensaje de confirmación. La ruta también se resalta en el mapa."

---

## SECCIÓN 6 — Mis reservas (1 min)

**[Hacer clic en "Mis reservas" en el menú lateral]**

"En **Mis reservas** veo el historial de todas las reservas que he hecho.

Cada reserva muestra: el código único, la clase, la fecha, el número de pasajeros, la ruta completa con todas las paradas, y el desglose de costos por tramo.

**[Hacer clic en Cancelar reserva]**

Si necesito cancelar una reserva, hago clic en 'Cancelar reserva'. Me pide confirmación antes de eliminarla, para que no sea por accidente."

---

## SECCIÓN 7 — Estadísticas (30 seg)

**[Hacer clic en "Estadísticas" en el menú lateral]**

"En **Estadísticas** veo métricas de la red: qué ciudades tienen más conexiones, cómo se distribuye la conectividad por región, y qué porcentaje de pares de ciudades son alcanzables con 0, 1 o 2 escalas. Es útil para entender qué tan densa y conectada es la red."

---

## SECCIÓN 8 — Vista de grafo (30 seg)

**[Hacer clic en "Vista grafo" en el menú lateral]**

"La **Vista de grafo** muestra la misma red pero como un grafo matemático puro, sin posición geográfica. Cada ciudad es un nodo y cada ruta una conexión. Sirve para analizar la estructura topológica de la red independientemente del mapa."

---

## SECCIÓN 9 — Agregar ciudad y ruta (3–4 min)

**[Hacer clic en "Agregar ciudad/ruta" en el menú lateral]**

"Esta es la sección de administración, donde puedo **expandir la red** agregando nuevas ciudades y rutas. Vamos a hacer un ejemplo completo paso a paso.

### Paso 1 — Agregar una ciudad nueva

**[Hacer clic en la pestaña 'Nueva ciudad']**

Voy a la pestaña **Nueva ciudad**. El sistema trae tres campos: nombre, país y región.

**[Escribir los datos]**

Ingreso:
- Nombre: **Buenos Aires**
- País: **Argentina**
- Región: **Sudamérica**

No necesito poner coordenadas — el sistema calcula automáticamente dónde ubicarla en el mapa, cerca de las demás ciudades de Sudamérica.

**[Hacer clic en 'Agregar ciudad']**

Hago clic en **'Agregar ciudad'** y aparece un mensaje de confirmación.

**[Ir al Mapa de rutas]**

Voy al **Mapa de rutas** para ver qué pasó.

**[Mostrar el punto dorado de Buenos Aires en el mapa]**

¡Ahí está! Buenos Aires aparece como un **punto dorado** con su nombre visible, claramente diferenciado de las ciudades originales. Está ubicada en la zona de Sudamérica.

Pero noten que no tiene ninguna línea conectada — nació sola, sin rutas. Vamos a conectarla.

### Paso 2 — Agregar una ruta para la ciudad nueva

**[Volver a Agregar ciudad/ruta, pestaña 'Nueva ruta']**

Vuelvo a **Agregar ciudad/ruta** y voy a la pestaña **Nueva ruta**.

**[Escribir 'Buenos' en el selector de origen]**

En el selector de origen escribo 'Buenos' y aparece Buenos Aires. La selecciono.

**[Seleccionar Lima como destino]**

Como destino selecciono **Lima**.

**[Mostrar los valores sugeridos]**

El sistema sugiere automáticamente un costo y una duración basados en la distancia entre las dos ciudades. Puedo dejarlo como está.

**[Hacer clic en 'Agregar ruta']**

Hago clic en **'Agregar ruta'**.

**[Ir al Mapa de rutas]**

Vuelvo al **Mapa de rutas**.

**[Mostrar la línea dorada entre Buenos Aires y Lima]**

¡Perfecto! Ahora Buenos Aires está conectada a Lima con una **línea dorada**, que indica que es una ruta nueva agregada por nosotros. El mapa se actualizó automáticamente.

**[Ir a Buscar ruta y buscar Buenos Aires → Bogotá]**

Y si voy a **Buscar ruta** y busco Buenos Aires → Bogotá, el sistema ya puede calcular el itinerario: Buenos Aires → Lima con vuelo directo, y Lima → Bogotá con otra escala. Todo funciona de inmediato.

### Historial y eliminación

**[Volver a Agregar ciudad/ruta]**

Si vuelvo a **Agregar ciudad/ruta**, en la pestaña Nueva ruta veo el **historial de rutas que agregué** con un botón de eliminar para cada una.

**[Mostrar historial de ciudades]**

Y en la pestaña Nueva ciudad veo el **historial de ciudades agregadas**. Hay un detalle importante: si elimino una ciudad, se eliminan también automáticamente todas las rutas que la conectan, para que la red no quede con rutas colgadas a ningún lado.

### Aprobar solicitudes de pasajeros

**[Bajar hasta la sección de Solicitudes pendientes]**

Al final de la página están las **Solicitudes pendientes** — las rutas que los pasajeros pidieron desde Buscar ruta y que aún no fueron aprobadas. Cada solicitud muestra el origen, el destino y la fecha en que se pidió.

Puedo ajustar el costo y la duración, y elegir **Aprobar** — que agrega la ruta a la red — o **Rechazar** para descartarla sin agregarla."

---

## CIERRE (30 seg)

**[Mostrar el mapa con algunas rutas resaltadas]**

"Y eso es todo lo que puedes hacer en SkyConnect. Desde buscar un vuelo hasta analizar la red completa con algoritmos matemáticos, todo en una sola plataforma.

Si tienes dudas sobre alguna funcionalidad, puedes volver a este video o explorar la app — cada sección tiene descripción de lo que hace.

¡Gracias por ver el tutorial!"

---

## NOTAS PARA LA GRABACIÓN

- **Orden sugerido:** seguir el orden del guión, que va de lo más visual a lo más técnico.
- **Estado inicial de la app:** antes de grabar, limpiar el localStorage para partir desde cero (sin ciudades ni rutas extra, sin reservas ni solicitudes). En Chrome: F12 → Application → Local Storage → clic derecho → Clear.
- **Para la sección Planificador:** seleccionar Bogotá → Lima en Buscar ruta y llegar al Planificador con el botón rojo, para mostrar ese flujo.
- **Para la sección Mis reservas:** hacer una reserva de prueba (Bogotá → Lima, clase Business) antes de grabar esa sección, para que no aparezca vacía.
- **Para la solicitud de ruta:** usar **Arequipa → Londres** — esa combinación no tiene ruta con 0, 1 ni 2 escalas, así que siempre dispara el banner de solicitud.
- **Para agregar ciudad:** usar **Buenos Aires / Argentina / Sudamérica** — no existe en las 58 ciudades base.
- **Para agregar ruta:** conectar Buenos Aires con Lima — aparece en dorado en el mapa de forma clara.
- **Resolución recomendada:** 1920×1080 con la app en pantalla completa.
- **Zoom del navegador:** 100% para que las matrices y el mapa se vean correctamente.
- **Tip de edición:** grabar cada sección por separado para facilitar el corte y montaje del video.
