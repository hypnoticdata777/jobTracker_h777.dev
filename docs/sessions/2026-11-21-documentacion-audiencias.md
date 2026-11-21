# Sesión: alineación de documentos y explicación para la entrega escolar

Fecha: 21 de noviembre de 2026 (America/Mexico_City).
Versión inicial: `8873801`, rama `main`, sin cambios locales.

## Solicitud

Hacer el README más sencillo para un público escolar, alinearlo con PLAN.md y explicar qué es el proyecto, qué se planea y por qué se eligieron sus componentes. La entrega de hoy es documentación del proyecto en desarrollo, no una afirmación de que el sistema ya esté terminado.

## Criterio editorial previo

- README: descripción accesible para quien necesita entender y explicar el proyecto sin conocer sus comandos o rutas de API.
- PLAN.md: tareas técnicas, orden de trabajo, evidencia y criterios para cerrar las etapas.
- Guía técnica: instrucciones de instalación y operación que antes ocupaban la mayor parte del README.
- Estado coherente en ambos documentos: separar implementación, comprobación y tareas pendientes.

No se cambia ninguna funcionalidad de la aplicación.

## Cambios

- README reescrito alrededor del problema, destinatarios, objetivo, ejemplo de uso, avances, plan y justificación de las tecnologías.
- Explicación breve preparada como apoyo para una exposición; no se inventaron resultados, requisitos de una materia ni datos de la escuela.
- PLAN.md conserva los identificadores M0, M0.5, M1, M2 y M3, pero distingue la existencia de código de su verificación integral.
- Las marcas anteriores de etapas terminadas se explican como estado histórico; las comprobaciones pendientes quedan explícitas.
- Instrucciones, variables, despliegue y rutas movidos a `docs/setup/guia-tecnica.md` para conservar su disponibilidad.
- Se evita mantener dos listas distintas de cierre del MVP: el README resume el estado y remite a los criterios del plan vigente.

## Comprobaciones

- Lectura cruzada de README y PLAN: mismas etapas, mismo estado y mismos límites de verificación.
- Comprobación automática de enlaces locales y bloques de código en los cuatro documentos: correcta.
- Comprobación de que M0, M0.5, M1, M2 y M3 aparecen en ambos documentos: correcta.
- Confirmación de que las rutas de API siguen disponibles en la guía técnica y ya no ocupan el README introductorio.
- `git diff --check`: correcto.
- No se ejecutaron compilaciones ni pruebas de aplicación: solo se modificó documentación.

## Estado al cierre

Al terminar la edición los cambios quedaron locales. Posteriormente el usuario autorizó hacer commit y push a `origin/main` para revisarlos en GitHub. No se modificó código ni base de datos, ni se verificó un nuevo despliegue público. La guía técnica conserva las instrucciones existentes; no se presenta su traslado como una nueva verificación del entorno.

## Integración antes de publicar

El primer push fue rechazado porque `origin/main` tenía el cambio `5f454cd`, que eliminaba una frase redundante del README. Se integró mediante rebase; el README simplificado conserva esa eliminación. También se quitó una línea vacía sobrante al final de la guía técnica.
