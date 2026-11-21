# Sesión: glosario, directorio y justificación técnica

Fecha: 21 de noviembre de 2026 (America/Mexico_City).
Versión inicial: `d2438e4`, sin cambios locales.

## Solicitud y aclaración

Ampliar la documentación para poder explicar el proyecto en clase: términos y tipografía, razones técnicas de cada herramienta con métodos y propiedades reales, significado de M, contenido y propósito de las carpetas, y preguntas previas de las siguientes etapas. El usuario aclaró que desea tanto la tipografía visual como las convenciones de lectura de documentación.

## Plan editorial

1. Revisar código, tipos, atributos, estilos y configuración antes de describirlos.
2. Mantener el README como entrada sencilla y agregar documentos especializados enlazados.
3. Crear un glosario que distinga conceptos parecidos y explique la tipografía real.
4. Crear un directorio de archivos con responsabilidad y momento de modificación.
5. Justificar herramientas mediante necesidad, uso real, alternativa y límite, sin inventar evaluaciones comparativas.
6. Reordenar las etapas con nombres claros y desglosar ubicación, preguntas previas, procedimiento y cierre.
7. Revisar enlaces, coherencia y referencias al código; no cambiar la aplicación.

## Cambios

- `docs/glosario-y-diseno.md`: términos, siglas, formato Markdown, tipografía predeterminada del sistema y equivalencias históricas.
- `docs/mapa-del-proyecto.md`: carpetas, archivos, funciones relevantes, responsabilidades y recorrido de guardar una vacante.
- `docs/decisiones-tecnicas.md`: doce grupos de decisiones con ejemplos concretos, ubicaciones, alternativas y límites.
- README: acceso a las nuevas explicaciones sin incorporar todo el detalle técnico en la introducción.
- PLAN: cinco etapas en orden de trabajo: base, funciones, confiabilidad, publicación y demostración. Se explica la equivalencia con las claves históricas M0, M1, M2, M0.5 y M3, sin reescribir bitácoras anteriores.
- Cada etapa identifica dónde trabajar, preguntas que deben contestarse antes de modificar código, procedimiento y criterio de cierre.
- Carpetas de pruebas, flujo automático y capturas marcados como propuestas nuevas, no como archivos existentes.

## Criterios de precisión

Se distingue función, método de objeto, método HTTP, propiedad, atributo y prop de React. Se distingue estado de pantalla de estado laboral. No se atribuye validación de ejecución a TypeScript, autorización automática a Prisma ni cifrado al JWT. La fuente concreta de la interfaz depende del sistema; no hay una fuente externa personalizada configurada.

El objetivo es argumentar adecuación técnica; no se inventan motivos personales del autor, comparativas de rendimiento ni certificaciones de accesibilidad.

## Comprobaciones

- Revisión de enlaces locales y bloques de código en los seis documentos modificados o agregados: correcta.
- Revisión automática de etapas y su orden: coinciden en README y PLAN.
- Las cinco etapas contienen ubicación, preguntas previas, procedimiento y criterio de cierre.
- Contraste de funciones, propiedades, atributos y consultas descritas con nueve archivos de código: correcto.
- Inspección del CSS generado existente: confirma las familias predeterminadas `ui-sans-serif`, `system-ui`, `sans-serif` y una familia monoespaciada para elementos de código. No se atribuye una fuente externa a la aplicación.
- `git diff --check`: correcto.
- No se ejecutaron compilaciones ni pruebas de la aplicación porque los cambios son exclusivamente documentales.

## Estado al cierre

Al terminar la edición los cambios quedaron locales; posteriormente el usuario autorizó hacer commit y push a `origin/main` para leerlos en GitHub. No se modificó código, dependencias, base de datos ni despliegue. Las propuestas de pruebas y próximos cambios siguen pendientes de decisión e implementación.
