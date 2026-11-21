# Plan de trabajo

El objetivo y los criterios del MVP 1 están en [README.md](README.md). Cada hito tiene una condición de aceptación; solo se considera terminado cuando se cumple. Los hitos marcados como terminados conservan el estado recibido de trabajos anteriores.

## M0 — Base funcional (terminado)

- [x] Compilación de producción de ambos espacios de trabajo.
- [x] Migración inicial y carga repetible de datos de demostración guardadas.
- [x] Eliminación de código y dependencias sin uso.
- [x] Comandos raíz `dev`, `build`, `typecheck` y de base de datos.

Condición de aceptación: desde una copia nueva, `npm ci && npm run build` termina correctamente; `npm run db:deploy && npm run db:seed` crea una cuenta de demostración que permite iniciar sesión.

## M0.5 — Despliegue inicial (terminado)

- [x] Separación de `backend/src/index.ts` en `app.ts` y `server.ts`.
- [x] Solicitudes relativas `/api` y reenvío local mediante Vite.
- [x] PostgreSQL alojado con agrupación de conexiones.
- [x] Configuración de Vercel para servir interfaz y API desde un mismo origen.
- [x] Primer despliegue satisfactorio.
- [x] Rechazo del arranque si falta `JWT_SECRET`.

Condición de aceptación: registro e inicio de sesión funcionan en la dirección pública.

## M1 — Seguimiento de postulaciones (terminado)

- [x] Modelo `Job` con enumeración de estados, `notes`, `appliedAt`, `updatedAt` y `statusChangedAt`; eliminación de la tabla `Application` sin uso.
- [x] Rutas `PATCH` y `DELETE` que comprueban la propiedad del registro.
- [x] Selector de estado, formulario de edición y eliminación en cada tarjeta.
- [x] Errores de formularios y acciones visibles.
- [x] Enlaces limitados a HTTP(S) y límites de longitud para los textos.

Condición de aceptación: una vacante puede pasar de Guardada a Oferta recibida y eliminarse; otro usuario no puede leerla ni modificarla.

## Adaptación para la entrega escolar — Español de México

- [x] Documentación, historias, diagramas y pruebas de escritorio en español.
- [x] Interfaz, ayudas de accesibilidad, mensajes de error y datos de demostración en español.
- [x] Idioma `es-MX` en el documento y formato de fechas mexicano.
- [x] Convenciones de idioma guardadas en `AGENTS.md`.

La [bitácora de adaptación](docs/sessions/2026-11-21-espanol.md) registra la verificación y sus límites.

## M2 — Confiabilidad

- [ ] Pruebas de integración de API: autenticación, validación y aislamiento entre usuarios.
- [ ] Integración continua: instalación, revisión de tipos, compilación y pruebas.
- [ ] Manejo de errores: respuestas 4xx para entradas inválidas y registro de solicitudes. La adaptación al español ya unifica el mensaje genérico 500.
- [ ] Normalización de correos electrónicos a minúsculas.
- [ ] Enlaces entre registro e inicio de sesión y corrección del registro con nombre vacío.

Condición de aceptación: una solicitud de cambios con compilación o pruebas fallidas aparece como fallida en la integración continua.

## M3 — Preparación de la demostración

- [ ] Agrupación o filtros por estado, con conteos.
- [ ] Ampliación de los datos realistas y acceso de demostración.
- [ ] Captura de pantalla en el README.

Condición de aceptación: alguien que no conoce el proyecto completa el recorrido del MVP sin ayuda.

## Funciones pospuestas

| Función | Cuándo reconsiderarla |
|---|---|
| Contactos, entrevistas, cronología y historial completo de estados | Cuando dos semanas de uso diario demuestren la necesidad |
| Analítica y recomendaciones con aprendizaje automático | Cuando existan más de 50 registros reales |
| Paquete de esquemas compartidos | Cuando la interfaz valide con Zod |
| OAuth, recuperación de contraseña y renovación de sesiones | Cuando existan usuarios reales además del autor |
| Tablero de arrastrar y soltar | Después de la exposición escolar |
