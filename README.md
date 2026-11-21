# Seguimiento de postulaciones — h777.dev

**Una aplicación web para llevar el control de la búsqueda de empleo en un solo lugar.** Permite guardar vacantes, anotar información y consultar en qué etapa está cada postulación.

El proyecto está en desarrollo y también se utiliza como trabajo final escolar en México. Esta documentación presenta su propósito, sus avances y el plan para completarlo; no representa una entrega final del sistema terminado.

Si encuentras una palabra técnica o una sigla nueva, el [glosario y guía de diseño](docs/glosario-y-diseno.md) explica su significado, el formato de los documentos y la tipografía de las pantallas.

## ¿Qué problema busca resolver?

Al buscar empleo es común enviar varias solicitudes y guardar información en correos, notas o distintas páginas. Esto dificulta recordar a qué empresa se envió una solicitud, cuándo se hizo o qué ocurrió después.

La propuesta es reunir esa información en una lista personal que se pueda mantener actualizada. Está dirigida a personas que buscan empleo, incluidos estudiantes que buscan sus primeras oportunidades laborales.

## Objetivo

Desarrollar una herramienta sencilla para registrar vacantes y dar seguimiento a las postulaciones de cada usuario. Como proyecto escolar, permite aplicar conocimientos de interfaces web, programación del servidor, bases de datos, autenticación y validación de información.

## ¿Cómo se utiliza?

1. La persona crea una cuenta e inicia sesión.
2. Agrega una vacante con el puesto, la empresa y, si lo necesita, el enlace, la ubicación y sus notas.
3. Registra la fecha de postulación y actualiza su estado conforme avanza el proceso.
4. Consulta, edita o elimina los registros de su lista.

Por ejemplo: una persona guarda una vacante de desarrollo web, cambia su estado a **Postulada** cuando envía su solicitud y a **En entrevista** cuando recibe una invitación. Sus notas pueden contener temas que desea preparar para la entrevista.

Los estados disponibles son **Guardada, Postulada, En entrevista, Oferta recibida, Rechazada y Archivada**. Se pueden corregir en cualquier momento; no es obligatorio seguir una secuencia fija.

## ¿Qué hay actualmente y qué falta?

El código ya incluye cuentas de usuario, inicio y cierre de sesión, registro de vacantes, edición, eliminación y cambios de estado. La interfaz y la documentación están en español de México.

Se comprobaron la instalación, la compilación, los tipos y los textos de las pantallas. Las comprobaciones recientes del navegador utilizaron respuestas simuladas: **todavía falta verificar el recorrido completo con una base de datos real y revisar el despliegue público**. Tener una función programada no significa que todas sus pruebas estén terminadas.

## Plan para continuar

| Etapa | Propósito | Situación actual |
|---|---|---|
| Etapa 1 — Base del proyecto | Organizar el código, la instalación y la base de datos | Implementada; falta repetir la inicialización completa de una base nueva |
| Etapa 2 — Funciones principales | Crear y administrar vacantes personales | Implementadas; falta comprobar el recorrido completo y la separación entre usuarios con datos reales |
| Etapa 3 — Confiabilidad | Detectar errores y comprobar que los cambios no rompan la aplicación | Pendiente; es la siguiente etapa de desarrollo |
| Etapa 4 — Publicación en internet | Preparar el alojamiento de la aplicación | Configurada, con despliegue previo reportado; falta revisar su funcionamiento actual |
| Etapa 5 — Demostración | Facilitar la consulta y preparar una explicación clara del producto | Pendiente; incluirá filtros, conteos y una demostración documentada |

Los números indican el orden de trabajo, no porcentajes de avance. Las claves antiguas con M significaban «milestone» (hito); su equivalencia está en el glosario.

La adaptación al español ya se realizó y se mantendrá en las siguientes etapas. El [plan técnico](PLAN.md) contiene las tareas, evidencias y condiciones para dar por terminada cada etapa.

## ¿Cómo funciona por dentro?

La aplicación tiene tres partes: una **interfaz**, que es lo que ve y utiliza la persona; un **servidor**, que recibe sus solicitudes y aplica las reglas; y una **base de datos**, que guarda las cuentas y las vacantes. El servidor comprueba la sesión y qué registros pertenecen a cada usuario antes de permitir su acceso.

## ¿Por qué se utilizan estas tecnologías?

| Elección | Para qué sirve y por qué es útil aquí |
|---|---|
| React, Tailwind y React Query | Construyen pantallas y formularios, dan estilo y mantienen la lista actualizada después de guardar cambios |
| TypeScript | Ayuda a detectar inconsistencias en los datos durante el desarrollo, antes de ejecutar la aplicación |
| Node.js y Express | Ejecutan el servidor y organizan las solicitudes de registro, sesión y vacantes usando el mismo lenguaje base que la interfaz |
| PostgreSQL y Prisma | Guardan información relacionada —usuarios y sus vacantes— y permiten mantener la estructura de la base mediante cambios registrados |
| Zod, Argon2 y JWT | Revisan los datos recibidos, protegen las contraseñas y permiten reconocer una sesión; cada herramienta cumple una función distinta |
| Vite y Docker | Facilitan el trabajo local: Vite prepara la interfaz y Docker permite iniciar PostgreSQL con una configuración definida |
| Vercel y Neon | Proporcionan alojamiento para la aplicación y PostgreSQL, respectivamente, para poder utilizarla desde internet |

La [justificación detallada de tecnologías](docs/decisiones-tecnicas.md) explica qué necesidad resuelve cada una, dónde aparece en el código, qué funciones o propiedades utiliza y qué alternativa se consideraría. El [mapa del proyecto](docs/mapa-del-proyecto.md) sirve como directorio de carpetas, páginas y archivos.

Estas elecciones permiten construir primero una versión pequeña y útil. Las pruebas pendientes servirán para comprobar su funcionamiento; utilizar estas herramientas por sí solo no garantiza que todo esté correcto.

## Alcance de la primera versión

La prioridad es completar y comprobar el registro de cuentas y el seguimiento manual de vacantes. Después se añadirán filtros por estado y conteos para facilitar la consulta.

Por ahora no se incluyen recomendaciones con inteligencia artificial, envío automático de solicitudes, gestión completa de entrevistas ni integración con bolsas de trabajo. Esas funciones aumentarían el alcance antes de validar la utilidad de la herramienta principal.

## Para revisar o continuar el proyecto

- [Plan técnico](PLAN.md): tareas, archivos afectados, preguntas previas, forma de trabajo y criterios de aceptación.
- [Glosario y diseño](docs/glosario-y-diseno.md): vocabulario, siglas, formato y tipografía.
- [Mapa del proyecto](docs/mapa-del-proyecto.md): qué contiene cada carpeta, por qué existe y cuándo modificarla.
- [Justificación de tecnologías](docs/decisiones-tecnicas.md): argumentos técnicos con ejemplos del código.
- [Guía técnica](docs/setup/guia-tecnica.md): requisitos, instalación, comandos y rutas de la API.
- [Documentación de funcionalidades](docs/features): historias de usuario, diagramas y pruebas de escritorio.
- [Bitácoras](docs/sessions): cambios realizados y comprobaciones de cada sesión.

Para una exposición breve: **«Mi proyecto es una aplicación web para organizar la búsqueda de empleo. Ya tiene las funciones principales de registro y seguimiento de vacantes. El siguiente paso es comprobar el recorrido completo, automatizar las pruebas y mejorar la consulta antes de presentar la versión terminada».**
