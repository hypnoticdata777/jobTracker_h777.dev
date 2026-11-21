# Plan técnico de trabajo

Este documento detalla cómo completar y verificar el proyecto descrito en el [README](README.md). Las instrucciones de operación están en la [guía técnica](docs/setup/guia-tecnica.md).

## Estado y criterio de avance

Corte documental: **21 de noviembre de 2026**, versión de referencia `8873801`.

Se distingue entre **implementado** (el código o la configuración existen), **verificado** (hay una comprobación registrada) y **pendiente** (falta desarrollar o verificar). Una etapa solo se cierra cuando cumple todos sus criterios de aceptación.

Los registros anteriores marcaban M0, M0.5 y M1 como terminados. Aquí se conserva el reconocimiento de sus avances, pero se separan de las verificaciones integrales que no se repitieron en la última sesión. No se interpreta una prueba con respuestas simuladas como evidencia de persistencia o aislamiento real.

| Etapa | Estado de implementación | Verificación pendiente para cerrarla |
|---|---|---|
| M0 — Base del proyecto | Implementada | Inicialización de una base nueva, migraciones, datos de demostración e inicio de sesión |
| M0.5 — Publicación en internet | Configurada; despliegue previo reportado | Disponibilidad actual, sesión y persistencia en la dirección pública |
| M1 — Funciones principales | Implementadas | Recorrido completo con PostgreSQL y aislamiento entre dos usuarios |
| M2 — Confiabilidad | Pendiente; siguiente etapa de desarrollo | Pruebas reproducibles e integración continua |
| M3 — Demostración | Pendiente | Filtros, conteos y recorrido documentado por una persona nueva |

La adaptación al español está implementada y cuenta con comprobaciones de idioma. Se mantiene como requisito transversal.

## Evidencia disponible y límites

La [bitácora de adaptación al español](docs/sessions/2026-11-21-espanol.md) registra:

- Instalación limpia, generación del cliente Prisma, revisión de tipos y compilación satisfactorias.
- Comprobaciones de respuestas y validación de la API que no requieren consultas a la base de datos.
- Revisión en Chromium de formularios, estados, fechas, errores y presentación móvil, con respuestas de API simuladas.

Esa sesión no comprobó persistencia en PostgreSQL, autenticación completa con usuarios reales ni el despliegue público. Los programas temporales de comprobación no sustituyen una suite de pruebas guardada y ejecutable en integración continua.

## Orden de ejecución

1. Repetir las verificaciones pendientes de M0 y M1 en una base local de desarrollo; registrar resultados reales y corregir los bloqueos encontrados.
2. Desarrollar M2 y convertir las comprobaciones críticas en pruebas reproducibles.
3. Revisar M0.5 en el despliegue público, con cuentas de prueba y su configuración real.
4. Completar M3 y preparar la demostración final.

Este orden separa el cierre de verificaciones pendientes del desarrollo de nuevas funciones. La entrega documental actual explica el proyecto y el plan; no exige presentar hoy el sistema como terminado.

## M0 — Base del proyecto

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

**Criterio de cierre:** instalación, compilación, migraciones y datos de demostración funcionan siguiendo la guía, sin pasos manuales omitidos.

## M0.5 — Publicación en internet

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

**Criterio de cierre:** el recorrido principal funciona en la dirección pública y su resultado queda documentado, sin publicar secretos.

## M1 — Funciones principales

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

**Criterio de cierre:** el recorrido completo funciona con PostgreSQL y el aislamiento se comprueba con dos usuarios diferentes. Las pruebas de autorización deben inspeccionar las respuestas de la API, no solo la interfaz.

## Requisito transversal — Español de México

Implementado y comprobado en la sesión de adaptación:
- Documentación y textos visibles en español; convenciones en `AGENTS.md`.
- Idioma HTML `es-MX`, fechas mexicanas y conservación del día UTC para fechas de postulación.
- Traducción de ayudas de accesibilidad, datos de demostración y errores.
- Mensajes genéricos en español para errores inesperados y rutas desconocidas de API.

**Criterio de mantenimiento:** cada cambio nuevo conserva estas convenciones y documenta las verificaciones que le corresponden.

## M2 — Confiabilidad

**Propósito:** detectar fallas y evitar que futuros cambios dañen funciones existentes.

Tareas:
- [ ] Guardar pruebas de integración de API para autenticación, validación y aislamiento entre usuarios, con una base de pruebas separada.
- [ ] Agregar integración continua que instale, revise tipos, compile y ejecute pruebas en cada solicitud de cambios.
- [ ] Responder con 4xx ante entradas inválidas, incluido JSON mal formado; conservar respuestas 500 genéricas para errores inesperados.
- [ ] Incorporar registro de solicitudes sin contraseñas ni tokens.
- [ ] Normalizar los correos electrónicos a minúsculas y comprobar duplicados.
- [ ] Resolver el registro con nombre opcional vacío y agregar enlaces entre registro e inicio de sesión.

**Criterio de cierre:** las pruebas se ejecutan de forma repetible; un cambio que rompe la compilación o una prueba aparece como fallido en la integración continua.

## M3 — Demostración

**Propósito:** facilitar la consulta y preparar una versión que otra persona pueda utilizar y entender.

Tareas:
- [ ] Agregar filtros o agrupación por estado, con conteos.
- [ ] Revisar los ejemplos de demostración en español y documentar cómo acceder a ellos.
- [ ] Agregar una captura actual y un recorrido breve a la documentación.
- [ ] Pedir a una persona que no conoce el proyecto que complete el recorrido y registrar las dificultades.

**Criterio de cierre:** esa persona puede crear o utilizar una cuenta de prueba, registrar una vacante, encontrarla por su estado, editarla y eliminarla siguiendo la documentación.

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
