# Plan técnico de trabajo

Este documento detalla cómo completar y verificar el proyecto descrito en el [README](README.md). Las instrucciones de operación están en la [guía técnica](docs/setup/guia-tecnica.md).

## Estado y criterio de avance

Corte documental: **21 de noviembre de 2026**, versión de referencia `d2438e4`.

Se distingue entre **implementado** (el código o la configuración existen), **verificado** (hay una comprobación registrada) y **pendiente** (falta desarrollar o verificar). Una etapa solo se cierra cuando cumple todos sus criterios de aceptación.

Los registros anteriores usaban claves con M, por «milestone» o hito, y marcaban la base, la publicación y las funciones principales como terminadas. La [equivalencia de nombres](docs/glosario-y-diseno.md) permite leer esas bitácoras; el plan vigente presenta las etapas en orden de trabajo. Se reconocen los avances y se distinguen de las verificaciones integrales que no se repitieron en la última sesión. No se interpreta una prueba con respuestas simuladas como evidencia de persistencia o aislamiento real.

| Etapa | Estado de implementación | Verificación pendiente para cerrarla |
|---|---|---|
| Etapa 1 — Base del proyecto | Implementada | Inicialización de una base nueva, migraciones, datos de demostración e inicio de sesión |
| Etapa 2 — Funciones principales | Implementadas | Recorrido completo con PostgreSQL y aislamiento entre dos usuarios |
| Etapa 3 — Confiabilidad | Pendiente; siguiente etapa de desarrollo | Pruebas reproducibles e integración continua |
| Etapa 4 — Publicación en internet | Configurada; despliegue previo reportado | Disponibilidad actual, sesión y persistencia en la dirección pública |
| Etapa 5 — Demostración | Pendiente | Filtros, conteos y recorrido documentado por una persona nueva |

La adaptación al español está implementada y cuenta con comprobaciones de idioma. Se mantiene como requisito transversal.

## Evidencia disponible y límites

La [bitácora de adaptación al español](docs/sessions/2026-11-21-espanol.md) registra:

- Instalación limpia, generación del cliente Prisma, revisión de tipos y compilación satisfactorias.
- Comprobaciones de respuestas y validación de la API que no requieren consultas a la base de datos.
- Revisión en Chromium de formularios, estados, fechas, errores y presentación móvil, con respuestas de API simuladas.

Esa sesión no comprobó persistencia en PostgreSQL, autenticación completa con usuarios reales ni el despliegue público. Los programas temporales de comprobación no sustituyen una suite de pruebas guardada y ejecutable en integración continua.

## Orden de ejecución

Antes de cada cambio se identifica el archivo y la necesidad en el [mapa del proyecto](docs/mapa-del-proyecto.md), se revisa su [justificación técnica](docs/decisiones-tecnicas.md) y se responden las preguntas de la etapa correspondiente. Las opciones todavía abiertas no se presentan como decisiones ya implementadas.

1. Repetir las verificaciones pendientes de las etapas 1 y 2 en una base local de desarrollo; registrar resultados reales y corregir los bloqueos encontrados.
2. Desarrollar la etapa 3 y convertir las comprobaciones críticas en pruebas reproducibles.
3. Revisar la etapa 4 en el despliegue público, con cuentas de prueba y su configuración real.
4. Completar la etapa 5 y preparar la demostración final.

Este orden separa el cierre de verificaciones pendientes del desarrollo de nuevas funciones. La entrega documental actual explica el proyecto y el plan; no exige presentar hoy el sistema como terminado.

## Etapa 1 — Base del proyecto

**Propósito:** hacer reproducible el entorno para que los demás hitos se puedan ejecutar y comprobar.

Implementado:

- Espacios de trabajo para servidor e interfaz; dependencias y archivo de versiones fijas.
- Comandos raíz `dev`, `build`, `typecheck` y de base de datos.
- PostgreSQL mediante Docker, migraciones y carga de datos de demostración.
- Compilación y revisión de tipos; eliminación de estructura compartida sin uso.

Pendiente de verificar:

- [ ] Desde una copia nueva, seguir la guía de instalación con una base vacía.
- [ ] Aplicar migraciones y ejecutar la carga de demostración; repetirla y confirmar que no duplica las vacantes.
- [ ] Iniciar sesión con la cuenta generada y registrar la evidencia.

### Dónde se trabajará

`docker-compose.yml`, `backend/.env.example`, `backend/prisma/schema.prisma`, `backend/prisma/seed.ts`, `backend/prisma/migrations/`, comandos de `package.json` y `docs/setup/guia-tecnica.md`.

### Preguntas antes de escribir o editar

- ¿Qué base será exclusivamente local y qué datos puede reemplazar la carga de demostración?
- ¿El volumen contiene datos anteriores o se probará una base realmente nueva?
- ¿Las variables y versiones indicadas bastan para ejecutar los comandos sin pasos ocultos?
- Si falla una migración, ¿es un problema de conexión, de permisos o de estructura? ¿Hace falta código nuevo o solo corregir la configuración?

### Cómo se hará

Primero registrar el entorno y usar una base local aislada. Ejecutar instalación, compilación, migraciones y carga; repetir la carga para comprobar su comportamiento. No editar migraciones aplicadas para ocultar un fallo: si cambia el modelo, crear una migración nueva. Corregir únicamente el archivo responsable y actualizar la guía con el procedimiento comprobado. Registrar comandos, resultados y límites en una bitácora.

**Criterio de cierre:** instalación, compilación, migraciones y datos de demostración funcionan siguiendo la guía, sin pasos manuales omitidos.

## Etapa 2 — Funciones principales

**Propósito:** permitir que cada usuario gestione su lista personal de oportunidades.

Implementado:

- Registro, inicio y cierre de sesión, y rutas protegidas.
- Modelo `Job` con `status`, `notes`, `appliedAt`, `updatedAt` y `statusChangedAt`; retiro del modelo `Application` sin uso.
- Creación y listado de vacantes; actualización mediante `PATCH` y eliminación mediante `DELETE`, con filtros de propietario.
- Tarjetas, formulario de edición, selector de estado y confirmación de eliminación.
- Validación de longitudes y enlaces HTTP(S); errores visibles.

Los estados internos siguen siendo `SAVED`, `APPLIED`, `INTERVIEWING`, `OFFER`, `REJECTED` y `ARCHIVED`. Sus etiquetas son Guardada, Postulada, En entrevista, Oferta recibida, Rechazada y Archivada. Se permite cambiar entre cualquiera de ellos.

Pendiente de verificar con persistencia real:

- [ ] Crear una cuenta, iniciar sesión, crear y consultar una vacante.
- [ ] Editarla, cambiar su estado, recargar y comprobar que los cambios se conservan.
- [ ] Verificar que `statusChangedAt` solo cambia cuando se modifica el estado.
- [ ] Eliminar la vacante y comprobar que ya no aparece.
- [ ] Con un segundo usuario, intentar listar, modificar y eliminar registros ajenos; comprobar que no puede acceder a ellos.

### Dónde se trabajará

Diseño en `docs/features/`; pantallas en `frontend/src/pages/`; `JobForm.tsx` y `JobCard.tsx` en `frontend/src/components/`; contratos en `frontend/src/types/` y `frontend/src/services/`. Reglas y consultas en `backend/src/lib/validation.ts`, `backend/src/middleware/auth.ts` y `backend/src/routes/`. Solo si cambia la estructura persistida, revisar también `backend/prisma/`.

### Preguntas antes de escribir o editar

- ¿Qué campos son obligatorios, cuáles opcionales y qué debe significar una cadena vacía frente a `null`?
- ¿Puede cualquier estado pasar a otro? Actualmente sí; ¿el cambio solicitado pretende modificar esa regla?
- ¿Se conservará exactamente la fecha de postulación en zonas horarias mexicanas?
- ¿Cómo se mantiene la sesión al recargar y cómo se limpia la información al salir o cambiar de cuenta?
- ¿Se filtra por `createdBy` en cada operación y qué respuesta debe recibir un usuario ajeno?
- ¿Qué caso reproducible demuestra el fallo y qué resultado contará como corrección?

### Cómo se hará

Completar primero la historia y casos en `docs/features`. Crear dos cuentas locales y probar solicitudes reales a la API además del navegador. Seguir el recorrido del mapa para ubicar el fallo: formulario → servicio → sesión → validación → consulta. Mantener alineados tipo, formulario y esquema cuando cambie un campo. Registrar resultados antes y después; convertir los casos críticos en pruebas permanentes durante la etapa 3.

**Criterio de cierre:** el recorrido completo funciona con PostgreSQL y el aislamiento se comprueba con dos usuarios diferentes. Las pruebas de autorización deben inspeccionar las respuestas de la API, no solo la interfaz.

## Etapa 3 — Confiabilidad

**Propósito:** detectar fallas y evitar que futuros cambios dañen funciones existentes.

Tareas:

- [ ] Guardar pruebas de integración de API para autenticación, validación y aislamiento entre usuarios, con una base de pruebas separada.
- [ ] Agregar integración continua que instale, revise tipos, compile y ejecute pruebas en cada solicitud de cambios.
- [ ] Responder con 4xx ante entradas inválidas, incluido JSON mal formado; conservar respuestas 500 genéricas para errores inesperados.
- [ ] Incorporar registro de solicitudes sin contraseñas ni tokens.
- [ ] Normalizar los correos electrónicos a minúsculas y comprobar duplicados.
- [ ] Resolver el registro con nombre opcional vacío y agregar enlaces entre registro e inicio de sesión.

### Dónde se trabajará

Los siguientes destinos son **propuestos, todavía no existen**: `backend/tests/` para pruebas de API y `backend/tests/helpers/` para datos y limpieza; `.github/workflows/ci.yml` para integración continua. El ejecutor y sus archivos de configuración se elegirán antes de agregarlos.

Archivos existentes que pueden cambiar: `backend/package.json` y `package.json` para comandos; `backend/src/app.ts` para errores y registro de solicitudes; `backend/src/lib/validation.ts` y `backend/src/routes/auth.ts` para entradas y correo; `frontend/src/pages/LoginPage.tsx` y `RegisterPage.tsx` para navegación y nombre vacío. También `docs/features/` y la guía técnica para documentar los contratos y comandos.

### Preguntas antes de escribir o editar

- ¿Qué ejecutor admite TypeScript, pruebas HTTP y ejecución no interactiva? ¿Conviene reutilizar una dependencia existente o introducir otra, y por qué?
- ¿Cómo crear y limpiar una base de pruebas separada sin tocar desarrollo ni producción? ¿Quién aplica sus migraciones y cuándo se cierra la conexión?
- ¿Qué casos deben cubrir sesión ausente, vencida, credenciales incorrectas, datos inválidos y vacantes ajenas?
- ¿Un correo con espacios o mayúsculas representa la misma cuenta? ¿Hay registros existentes que puedan entrar en conflicto al normalizarlo?
- ¿El nombre vacío se omite o se rechaza? ¿Qué mostrarán el formulario y la API en cada caso?
- ¿Cómo distinguir JSON inválido, cuerpo demasiado grande y errores inesperados? ¿Qué datos del registro de solicitudes deben omitirse?
- ¿Qué comprobaciones deben impedir aceptar un cambio y qué configuración no secreta necesita el flujo automático?

### Cómo se hará

Definir una matriz de casos con entrada, código HTTP y resultado esperado. Elegir el ejecutor con esos requisitos y registrar la decisión; guardar pruebas antes de corregir cada fallo reproducible. Configurar la base aislada y comandos de preparación, ejecución y limpieza. Añadir el flujo automático con instalación reproducible, migración de la base de pruebas, revisión de tipos, compilación y pruebas. Comprobarlo también con una prueba intencionalmente fallida en una rama de trabajo y restaurarla antes de integrar. No utilizar credenciales de producción para esta tarea.

**Criterio de cierre:** las pruebas se ejecutan de forma repetible; un cambio que rompe la compilación o una prueba aparece como fallido en la integración continua.

## Etapa 4 — Publicación en internet

**Propósito:** permitir el uso de la aplicación fuera del entorno de desarrollo local.

Implementado o reportado previamente:

- Aplicación Express separada de su servidor local (`app.ts` y `server.ts`).
- Rutas relativas `/api` y reenvío local mediante Vite.
- Configuración de Vercel y entrada `api/index.ts` para servir interfaz y API desde el mismo origen.
- Configuración de conexiones agrupada y directa para PostgreSQL de Neon.
- Comprobación de `JWT_SECRET` al arrancar; despliegue previo reportado.

Pendiente de verificar:

- [ ] Registrar la dirección pública y comprobar que corresponde a la versión revisada.
- [ ] Comprobar registro, inicio y cierre de sesión, así como conservación de vacantes entre recargas.
- [ ] Confirmar variables de entorno, cookie de producción y aplicación de migraciones en el entorno correcto.

### Dónde se trabajará

`vercel.json`, `api/index.ts`, `backend/src/config/env.ts`, `backend/src/routes/auth.ts`, `backend/prisma/schema.prisma`, el comando `vercel-build` de `package.json` y la guía técnica. Las variables reales se configuran en Vercel/Neon, no dentro de estos documentos.

### Preguntas antes de escribir o editar

- ¿Cuál es la dirección y revisión exacta que se evaluará? ¿La aplicación publicada incorpora estos cambios?
- ¿Qué base pertenece a producción y qué usan las vistas previas? ¿Qué operación puede aplicar migraciones?
- ¿Coinciden el origen de la interfaz y la API, y funciona la cookie con HTTPS y sus atributos actuales?
- ¿Cómo se conserva la información entre solicitudes a la función y recargas de página?
- Si una publicación falla, ¿cómo volver a la versión anterior y qué cambios de base requieren tratamiento aparte?

### Cómo se hará

Revisar primero la configuración sin revelar valores secretos. Confirmar la revisión desplegada y el destino de migraciones antes de aplicarlas. Comprobar salud de la API y el recorrido con cuentas de prueba autorizadas, registrando URL, revisión, fecha y resultado sin contraseñas. Si el fallo solo aparece en alojamiento, comparar rutas, configuración y registros con el entorno local antes de cambiar código. Una compilación correcta por sí sola no cierra esta etapa.

**Criterio de cierre:** el recorrido principal funciona en la dirección pública y su resultado queda documentado, sin publicar secretos.

## Etapa 5 — Demostración

**Propósito:** facilitar la consulta y preparar una versión que otra persona pueda utilizar y entender.

Tareas:

- [ ] Agregar filtros o agrupación por estado, con conteos.
- [ ] Revisar los ejemplos de demostración en español y documentar cómo acceder a ellos.
- [ ] Agregar una captura actual y un recorrido breve a la documentación.
- [ ] Pedir a una persona que no conoce el proyecto que complete el recorrido y registrar las dificultades.

### Dónde se trabajará

`frontend/src/pages/Dashboard.tsx` y los componentes de vacantes; si se decide filtrar en el servidor, `frontend/src/services/jobService.ts` y `backend/src/routes/jobs.ts`. Ejemplos en `backend/prisma/seed.ts`, contratos en `frontend/src/types/job.ts` y documentación en README/`docs/features/`.

Una carpeta `docs/imagenes/` sería **nueva** para capturas sin información personal, si se decide guardarlas en el repositorio.

### Preguntas antes de escribir o editar

- ¿Se filtrará la lista ya descargada o se enviará un parámetro a la API? ¿El volumen esperado justifica consultas adicionales?
- ¿Los conteos representan todas las vacantes del usuario o solo el resultado visible?
- ¿Qué debe mostrarse cuando no hay registros o no hay coincidencias con el filtro?
- ¿Qué datos ficticios permiten explicar todos los estados sin cargar información personal?
- ¿La demostración usa una cuenta local o pública y quién puede restablecer sus datos?
- ¿Qué recorrido necesita la persona evaluadora y qué evidencia corresponde a cada criterio escolar disponible?

### Cómo se hará

Diseñar ejemplos de filtros, conteos y resultados vacíos antes del componente. Si se filtra localmente, obtener la lista visible a partir de `jobs` sin alterar la original. Si se filtra por API, validar el parámetro, conservar siempre el filtro de propietario y considerar el estado en la clave de React Query. Probar ambos casos de lista vacía, los conteos y la presentación móvil. Preparar ejemplos ficticios, capturas actuales y un guion; observar a una persona nueva y corregir los obstáculos encontrados. Actualizar tipos, documentación y pruebas según la alternativa elegida.

**Criterio de cierre:** esa persona puede crear o utilizar una cuenta de prueba, registrar una vacante, encontrarla por su estado, editarla y eliminarla siguiendo la documentación.

## Requisito transversal — Español de México

Implementado y comprobado en la sesión de adaptación:

- Documentación y textos visibles en español; convenciones en `AGENTS.md`.
- Idioma HTML `es-MX`, fechas mexicanas y conservación del día UTC para fechas de postulación.
- Traducción de ayudas de accesibilidad, datos de demostración y errores.
- Mensajes genéricos en español para errores inesperados y rutas desconocidas de API.

**Criterio de mantenimiento:** cada cambio nuevo conserva estas convenciones y documenta las verificaciones que le corresponden.

## Alcance y funciones pospuestas

La primera versión se centra en cuentas, seguimiento manual de vacantes, validación y consulta por estado. Las siguientes funciones no forman parte de los criterios actuales de cierre:

| Función | Motivo para posponerla | Cuándo reconsiderarla |
|---|---|---|
| Contactos, agenda de entrevistas y cronología completa | Añaden modelos y recorridos nuevos | Cuando el uso cotidiano demuestre su necesidad |
| Analítica y recomendaciones con aprendizaje automático | Requieren datos suficientes y evaluación propia | Después de validar el seguimiento principal y reunir datos reales |
| Integración con bolsas de trabajo y envío automático | Añaden dependencias externas y procesos distintos | Con requisitos y alcance definidos por separado |
| OAuth, recuperación de contraseña y renovación de sesiones | Amplían la autenticación más allá del alcance actual | Antes de ampliar el uso a más personas y según sus necesidades |
| Paquete de esquemas compartidos | No es necesario para el funcionamiento actual | Cuando la interfaz valide también con Zod |
| Tablero de arrastrar y soltar | No es necesario para comprobar el seguimiento | Después de completar filtros, pruebas y demostración |

## Registro de trabajo

Antes de modificar una funcionalidad se documentan historia de usuario, pseudocódigo, diagrama y prueba de escritorio en `docs/features`. Al cerrar una sesión se registra qué cambió, qué se comprobó y qué sigue pendiente en `docs/sessions`.

El [plan histórico de instalación](docs/setup/installation-plan.md) conserva la secuencia de las sesiones iniciales. El presente archivo es el plan vigente; las bitácoras históricas no deben actualizarse para atribuirles pruebas que no se realizaron.
