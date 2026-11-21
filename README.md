# Seguimiento de postulaciones — h777.dev

Aplicación web para organizar la búsqueda de empleo: guardar vacantes, registrar postulaciones y dar seguimiento a su estado, desde **Guardada** hasta **Oferta recibida** o **Rechazada**.

También se utiliza como proyecto final escolar en México. La documentación y los textos de la interfaz están en español de México. Los identificadores técnicos, comandos y valores internos de la API conservan sus nombres para mantener la compatibilidad.

## Estado del proyecto

La versión recibida marca como terminados M0 (base funcional), M0.5 (despliegue en Vercel con Neon) y M1 (estados, edición y eliminación). El siguiente hito es M2: pruebas, integración continua y manejo de errores. Consulta [PLAN.md](PLAN.md).

Estas marcas reflejan el estado registrado por los trabajos anteriores; la [sesión de adaptación al español](docs/sessions/2026-11-21-espanol.md) detalla qué se comprobó nuevamente.

## Criterios del producto mínimo viable (MVP 1)

- [x] Una copia nueva permite instalar, compilar, aplicar migraciones y cargar datos de demostración con los comandos indicados.
- [x] Se puede crear una cuenta, iniciar y cerrar sesión, agregar vacantes y consultar las propias.
- [x] Cada vacante tiene un estado modificable.
- [x] Se pueden editar y eliminar vacantes.
- [ ] Se puede agrupar o filtrar la lista por estado.
- [ ] Las pruebas de API cubren autenticación, validación y aislamiento entre usuarios, y se ejecutan en integración continua.
- [x] La aplicación está desplegada en una dirección pública.

## Tecnologías

- Servidor: TypeScript, Express 4, Prisma 5 y PostgreSQL 15.
- Interfaz: Vite, React 18, React Query 4 y Tailwind.
- Autenticación: JWT en una cookie `httpOnly`; contraseñas protegidas con Argon2.
- Validación: Zod.

## Instalación local

Requisitos: Node 24 (`nvm use`), npm y Docker para la base de datos. Ejecuta desde la raíz:

```bash
npm ci
cp backend/.env.example backend/.env
npm run db:up
npm run db:deploy
npm run db:seed
npm run dev
```

Abre http://localhost:5173. La cuenta de demostración es `demo@example.com` con contraseña `Passw0rd!`. Puedes definir `SEED_PASSWORD` al cargar los datos para cambiarla. La carga de datos reemplaza las vacantes de esa cuenta: úsala solo para demostración.

## Comandos

| Comando | Función |
|---|---|
| `npm run dev` | Inicia el servidor de la API y la interfaz |
| `npm run build` | Compila ambos espacios de trabajo para producción |
| `npm run typecheck` | Revisa los tipos sin generar archivos |
| `npm run db:up` | Inicia PostgreSQL en Docker |
| `npm run db:deploy` | Aplica las migraciones guardadas |
| `npm run db:migrate` | Crea una migración después de modificar `schema.prisma` |
| `npm run db:seed` | Restablece la cuenta y las vacantes de demostración |
| `npm run vercel-build` | Aplica migraciones solo en producción y después compila |

## Variables de entorno

Se definen en `backend/.env`; consulta `backend/.env.example`.

| Variable | Propósito |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL para la aplicación; usa agrupación de conexiones en producción |
| `DATABASE_URL_UNPOOLED` | Conexión directa para migraciones; localmente coincide con `DATABASE_URL` |
| `JWT_SECRET` | Clave para firmar sesiones, con al menos 16 caracteres; es obligatoria |
| `JWT_EXPIRES_IN` | Duración de la sesión; valor predeterminado: `7d` |
| `PORT` | Puerto local de la API; valor predeterminado: `4000` |

No publiques archivos `.env` ni claves reales. En producción sustituye el valor de ejemplo de `JWT_SECRET` por una clave segura.

## Arquitectura y recorrido de las solicitudes

El navegador utiliza rutas relativas `/api/...`; interfaz y API comparten origen y no necesitan cookies entre sitios diferentes.

- **Local:** Vite sirve la interfaz en el puerto 5173 y reenvía `/api` al servidor del puerto 4000, según `frontend/vite.config.ts`.
- **Vercel:** sirve la interfaz compilada como archivos estáticos y dirige `/api/*` a `api/index.ts`, que utiliza la misma aplicación Express, según `vercel.json`.

## Despliegue: Vercel y Neon

Un proyecto de Vercel utiliza PostgreSQL de Neon conectado mediante su catálogo de integraciones. Neon proporciona `DATABASE_URL` y `DATABASE_URL_UNPOOLED`; `JWT_SECRET` debe configurarse por separado. Cada despliegue ejecuta `npm run vercel-build`. En producción se aplican migraciones pendientes y se compila; las vistas previas solo compilan, ya que la base está conectada únicamente al entorno de producción.

## Rutas de la API

| Método | Ruta | Requiere sesión | Función |
|---|---|---|---|
| GET | `/api/health` | No | Comprueba que la API responde |
| POST | `/api/auth/register` | No | Crea una cuenta |
| POST | `/api/auth/login` | No | Inicia sesión y establece la cookie |
| POST | `/api/auth/logout` | No | Elimina la cookie de sesión |
| GET | `/api/auth/me` | Sí | Devuelve el usuario actual |
| GET | `/api/jobs` | Sí | Lista las vacantes del usuario |
| POST | `/api/jobs` | Sí | Crea una vacante |
| PATCH | `/api/jobs/:id` | Sí | Actualiza una vacante propia |
| DELETE | `/api/jobs/:id` | Sí | Elimina una vacante propia |

Una vacante ajena responde con 404 para no revelar que existe.

## Vocabulario de estados

| Valor interno | Etiqueta visible |
|---|---|
| `SAVED` | Guardada |
| `APPLIED` | Postulada |
| `INTERVIEWING` | En entrevista |
| `OFFER` | Oferta recibida |
| `REJECTED` | Rechazada |
| `ARCHIVED` | Archivada |

Las fechas visibles utilizan `es-MX`. Las fechas de postulación conservan su día de calendario mediante UTC.

## Documentación

- [Plan de trabajo](PLAN.md): hitos y funciones pospuestas.
- [Funcionalidades](docs/features): historias de usuario, pseudocódigo, diagramas y pruebas de escritorio.
- [Plan histórico de instalación](docs/setup/installation-plan.md).
- [Bitácoras de sesiones](docs/sessions).
- [Convenciones del proyecto](AGENTS.md): idioma y prácticas para futuros cambios.
