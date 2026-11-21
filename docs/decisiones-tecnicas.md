# Justificación de tecnologías y ejemplos del código

El criterio de selección es cubrir las necesidades de una aplicación con cuentas, formularios y registros personales: reutilizar interfaz, organizar operaciones, conservar relaciones entre datos y comprobar entradas. La familiaridad con una herramienta puede facilitar el desarrollo, pero la justificación técnica debe explicar qué necesidad resuelve y qué costo introduce.

Este documento justifica la arquitectura existente por su adecuación al proyecto. No afirma que se midieron todas las alternativas ni que estas tecnologías sean las únicas válidas. Las ubicaciones se pueden recorrer desde el [mapa del proyecto](mapa-del-proyecto.md); los términos se definen en el [glosario](glosario-y-diseno.md).

## 1. React: formularios y tarjetas reutilizables

**Necesidad:** mostrar muchas vacantes y reutilizar el formulario al crear o editar, manteniendo los datos de la pantalla sincronizados con las acciones de la persona.

**Justificación:** React divide la interfaz en componentes y actualiza su representación cuando cambia su estado. Un solo `JobForm` evita mantener dos formularios distintos con reglas y etiquetas que podrían divergir.

**Dónde y cómo se utiliza:**

| Archivo | Función, propiedad o atributo | Qué hace |
|---|---|---|
| [JobForm.tsx](../frontend/src/components/JobForm.tsx) | `useState`, `initialValues`, `handleChange` | Inicializa y actualiza los campos de creación o edición |
| Mismo archivo | `job`, `isSaving`, `onSubmit`, `onCancel` | Propiedades recibidas del panel; indican datos, carga y acciones |
| Mismo archivo | `name`, `value`, `onChange`, `required`, `maxLength`, `htmlFor` | Relacionan campos con datos, eventos, límites y etiquetas |
| [Dashboard.tsx](../frontend/src/pages/Dashboard.tsx) | `isCreating`, `editingId`, `jobs.map` | Decide qué formulario o tarjeta presentar |
| [JobCard.tsx](../frontend/src/components/JobCard.tsx) | `onStatusChange`, `onEdit`, `onDelete` | Comunica acciones de la tarjeta al panel |

**Alternativa y límite:** JavaScript sin React permitiría una interfaz más pequeña con menos dependencias. React se justifica aquí por los componentes y estados compartidos, pero exige organizar correctamente esos estados; no guarda nada en la base por sí mismo.

## 2. TypeScript: contratos de datos durante el desarrollo

**Necesidad:** que formularios, servicios y respuestas esperen campos compatibles al modificar una vacante.

**Justificación:** declarar tipos permite detectar muchos nombres, valores y llamadas incorrectos al revisar o compilar, antes de probar manualmente cada pantalla.

**Dónde:** [types/job.ts](../frontend/src/types/job.ts) define `Job`, `JobInput`, `JobStatus` y `STATUS_LABELS`; [types/auth.ts](../frontend/src/types/auth.ts) define `User`, `RegisterRequest` y `LoginRequest`. En [jobService.ts](../frontend/src/services/jobService.ts), `updateJob(id, input: Partial<JobInput>)` expresa que una edición puede enviar solo algunos campos. `AuthenticatedRequest` en [middleware/auth.ts](../backend/src/middleware/auth.ts) describe `req.user`.

**Ejemplo para explicar:** `Job.status` no debería aceptar un valor fuera de los estados declarados. `JobInput.appliedAt` representa texto de formulario, mientras `Job.appliedAt` representa la respuesta guardada o `null`.

**Alternativa y límite:** JavaScript con documentación y pruebas también es viable. TypeScript agrega revisión estática y configuración, pero sus tipos no validan automáticamente un JSON recibido de internet; para eso se utiliza Zod.

## 3. React Router: páginas dentro de la misma aplicación

**Necesidad:** distinguir registro, acceso y panel mediante direcciones navegables.

**Justificación:** centraliza qué pantalla corresponde a cada ruta y permite redirigir sin reconstruir toda la página.

**Dónde:** [main.tsx](../frontend/src/main.tsx) instala `BrowserRouter`; [App.tsx](../frontend/src/App.tsx) usa `Routes`, `Route` y `Navigate` para `/register`, `/login`, `/` y rutas desconocidas. [ProtectedRoute.tsx](../frontend/src/components/ProtectedRoute.tsx) consulta `useAuth` y redirige al acceso cuando no hay usuario.

**Alternativa y límite:** páginas HTML independientes simplificarían una aplicación estática. Aquí hay navegación dentro de una interfaz con sesión. La redirección visual no protege la API: esa comprobación se hace también en el servidor.

## 4. React Query y Axios: coordinar resultados y enviar solicitudes

**Necesidad:** consultar vacantes, presentar carga o error y volver a consultar después de guardar, editar o eliminar.

**Justificación:** React Query administra el estado de las consultas; Axios realiza el intercambio HTTP. Separarlos evita que cada componente repita la lógica de solicitudes y actualización de listas.

| Ubicación | Uso concreto |
|---|---|
| [main.tsx](../frontend/src/main.tsx) | `QueryClient` y `QueryClientProvider` ofrecen un gestor de consultas a la aplicación |
| [Dashboard.tsx](../frontend/src/pages/Dashboard.tsx) | `useQuery({ queryKey: ['jobs'], queryFn: getJobs })` consulta la lista; `useMutation` coordina cambios |
| Mismo archivo | `invalidateQueries({ queryKey: ['jobs'] })` permite refrescar la lista; `isLoading`, `isError`, `onSuccess` y `onError` controlan su presentación |
| [useAuth.ts](../frontend/src/lib/useAuth.ts) | Clave `['me']`, `getCurrentUser` y `retry: false` para la consulta de sesión |
| [api.ts](../frontend/src/lib/api.ts) | `axios.create({ withCredentials: true })` configura el cliente |
| [jobService.ts](../frontend/src/services/jobService.ts) | `api.get`, `api.post`, `api.patch` y `api.delete` envían las operaciones |
| [errors.ts](../frontend/src/lib/errors.ts) | `axios.isAxiosError` y `getErrorMessage` interpretan respuestas de error |

**Alternativa y límite:** `fetch` más estado manual evitaría estas dependencias. La elección reduce código repetido, pero requiere definir claves, invalidación y limpieza de caché al cerrar sesión; no reemplaza las pruebas de persistencia ni autorización.

## 5. Tailwind, CSS, Vite y PostCSS: estilos y preparación de la interfaz

**Necesidad:** mantener formularios y tarjetas con un aspecto consistente, y transformar React/TypeScript en archivos que pueda cargar el navegador.

**Justificación:** Tailwind proporciona reglas pequeñas que se combinan en componentes; Vite ofrece desarrollo y compilación; PostCSS procesa las reglas CSS, con Autoprefixer para compatibilidad donde corresponde.

**Dónde:** [styles/index.css](../frontend/src/styles/index.css) incluye las capas Tailwind; [tailwind.config.cjs](../frontend/tailwind.config.cjs) indica qué archivos analizar; [postcss.config.cjs](../frontend/postcss.config.cjs) configura sus complementos. `className="..."`, `text-2xl`, `rounded` y `md:grid-cols-2` aparecen en páginas y componentes. [vite.config.ts](../frontend/vite.config.ts) utiliza el complemento React y reenvía `/api` al servidor local.

**Alternativa y límite:** CSS escrito a mano permitiría más control directo sin utilidades. Tailwind acelera la consistencia, pero produce listas de clases largas y no garantiza accesibilidad. Vite prepara la interfaz; no sustituye al servidor de datos. La [guía de diseño](glosario-y-diseno.md) documenta la tipografía real, sin atribuir una fuente personalizada que no existe.

## 6. Node.js y Express: operaciones del servidor

**Necesidad:** atender solicitudes de cuentas y vacantes, aplicar validación y autorización y responder con datos estructurados.

**Justificación:** Node ejecuta JavaScript en el servidor y permite usar TypeScript en ambas partes del proyecto. Express permite separar las operaciones por rutas y añadir pasos comunes como leer JSON, interpretar cookies o comprobar sesión.

**Dónde:** [app.ts](../backend/src/app.ts) configura `express()`, `express.json({ limit: '10kb' })`, `cookieParser()` y las rutas. [server.ts](../backend/src/server.ts) ejecuta `app.listen`; separarlos permite reutilizar la aplicación en Vercel y en pruebas sin arrancar siempre el servidor local.

| Método y ruta | Función en el proyecto | Archivo |
|---|---|---|
| `POST /api/auth/register` | Crear una cuenta | [routes/auth.ts](../backend/src/routes/auth.ts) |
| `POST /api/auth/login` | Comprobar credenciales y establecer cookie | Mismo archivo |
| `POST /api/auth/logout` | Quitar la cookie | Mismo archivo |
| `GET /api/auth/me` | Devolver el usuario de la sesión | Mismo archivo |
| `GET /api/jobs` | Consultar vacantes propias | [routes/jobs.ts](../backend/src/routes/jobs.ts) |
| `POST /api/jobs` | Crear una vacante propia | Mismo archivo |
| `PATCH /api/jobs/:id` | Actualizar campos de una vacante propia | Mismo archivo |
| `DELETE /api/jobs/:id` | Eliminar una vacante propia | Mismo archivo |

`req.body` contiene los datos enviados, `req.params.id` el identificador de la dirección, `req.user` la sesión ya validada y `res.status(...).json(...)` construye la respuesta.

**Alternativa y límite:** Django o Laravel aportarían más funciones integradas con otro ecosistema. Express encaja en un servidor pequeño y explícito, pero requiere implementar y probar por separado validación, errores y autorización.

## 7. PostgreSQL y Prisma: relaciones y cambios de estructura

**Necesidad:** conservar usuarios y vacantes, relacionarlos y consultar solo lo que corresponde a cada persona.

**Justificación:** una base relacional representa directamente «un usuario tiene muchas vacantes» y puede imponer restricciones. Prisma describe esos modelos en código y genera un cliente de consultas; las migraciones registran cómo cambia la estructura.

| Elemento real | Ubicación y propósito |
|---|---|
| `User.email @unique` | [schema.prisma](../backend/prisma/schema.prisma): evita correos exactamente duplicados; no sustituye la normalización de mayúsculas pendiente |
| `User.passwordHash` | Guarda el resumen criptográfico, no una contraseña recuperable |
| `Job.createdBy` y `Job.user @relation(...)` | Relacionan cada vacante con su propietario; `onDelete: Cascade` elimina sus vacantes si se elimina el usuario |
| `Job.status` y `JobStatus` | Restringen los estados almacenados |
| `appliedAt @db.Date` | Guarda una fecha de calendario sin hora |
| `updatedAt @updatedAt` y `statusChangedAt` | Distinguen última edición y último cambio de estado; no crean un historial completo |
| `@@index([createdBy, status])` | Prepara un índice para consultas por propietario y estado; no equivale a un filtro de interfaz ya implementado |
| `new PrismaClient()` | [db.ts](../backend/src/db.ts): crea el cliente utilizado por las rutas |
| `findMany`, `create`, `findFirst`, `update`, `deleteMany` | [routes/jobs.ts](../backend/src/routes/jobs.ts): operaciones reales, con `createdBy` en los filtros pertinentes |
| Archivos SQL de migración | [prisma/migrations/](../backend/prisma/migrations): evolución registrada de la base |
| `upsert`, `deleteMany`, `createMany` | [seed.ts](../backend/prisma/seed.ts): prepara la cuenta y reemplaza sus ejemplos |

**Alternativa y límite:** una hoja de cálculo serviría para un control personal manual, pero no cubre la misma aplicación con cuentas y permisos; SQL directo sería una alternativa válida a Prisma. Prisma aporta tipos y migraciones, pero agrega generación de cliente y dependencias, y no verifica por sí mismo que una consulta filtre al propietario.

## 8. Zod: reglas durante la ejecución

**Necesidad:** rechazar entradas externas inválidas aunque no provengan del formulario oficial.

**Justificación:** las restricciones HTML y los tipos de TypeScript no bastan en el servidor; Zod ejecuta reglas al recibir una solicitud y devuelve errores manejables.

**Dónde:** [validation.ts](../backend/src/lib/validation.ts) define `registerSchema`, `loginSchema`, `createJobSchema` y `updateJobSchema`. Las rutas usan `safeParse(req.body)`, comprueban `success` y leen `parsed.data` o `error.issues`.

Ejemplos: `.trim().min(1).max(200)` para puesto y empresa, `z.nativeEnum(JobStatus)` para estado, comprobación de HTTP(S) para enlaces y `preprocess` para interpretar cadenas vacías como ausencia de valor. `parseId` es una función auxiliar propia, no un método de Zod. [env.ts](../backend/src/config/env.ts) también valida configuración al arrancar.

**Alternativa y límite:** condiciones manuales evitarían una biblioteca, pero repetirían reglas y construcción de errores. Las reglas actuales no deben considerarse perfectas por usar Zod: por ejemplo, se debe decidir cómo comprobar fechas imposibles que JavaScript puede normalizar.

## 9. Argon2, JWT y cookies: contraseñas y sesiones

**Necesidad:** comprobar credenciales sin guardar la contraseña original y reconocer solicitudes posteriores del mismo usuario.

**Justificación:** son dos problemas diferentes. Argon2 resuelve la verificación de contraseñas; JWT firma la identidad temporal de la sesión; la cookie transporta ese token entre navegador y servidor.

**Dónde:** [routes/auth.ts](../backend/src/routes/auth.ts) utiliza `argon2.hash(password)`, `argon2.verify(...)` y `jwt.sign(...)`. `res.cookie('auth_token', ...)` configura `httpOnly: true`, `sameSite: 'lax'`, `secure` en producción y `maxAge`. [middleware/auth.ts](../backend/src/middleware/auth.ts) usa `jwt.verify`, busca al usuario y asigna `req.user`. La autorización de vacantes se aplica después en `routes/jobs.ts` mediante `createdBy`.

**Ejemplo:** iniciar sesión no devuelve `passwordHash`; `userSafeSelect` limita los datos del registro. `httpOnly` impide que JavaScript de la página lea directamente la cookie; no representa una garantía completa contra todos los ataques.

**Alternativa y límite:** sesiones guardadas en servidor permitirían revocación centralizada. El diseño actual evita esa tabla de sesiones, pero `clearCookie` cierra la sesión del navegador sin revocar un JWT ya emitido. La duración del token es configurable y la de la cookie está fijada en siete días; hay que revisar su coherencia al ampliar la gestión de sesiones. La firma JWT no cifra su contenido.

## 10. Docker: base local reproducible

**Necesidad:** iniciar PostgreSQL con una versión y configuración conocidas sin que cada equipo lo instale de una forma distinta.

**Justificación:** [docker-compose.yml](../docker-compose.yml) declara `image: postgres:15`, puerto y volumen `postgres_data`. `npm run db:up` inicia ese servicio.

**Alternativa y límite:** una instalación nativa es válida, pero debe documentarse aparte. En este proyecto Docker aloja la base local, no toda la aplicación. El volumen conserva datos: reiniciar el contenedor no equivale a probar una base vacía.

## 11. Vercel y Neon: publicación y base alojada

**Necesidad:** disponer de una dirección pública para la interfaz y un servicio PostgreSQL que permanezca fuera del equipo local.

**Justificación:** Vercel publica la interfaz y dirige la API a una función; Neon proporciona PostgreSQL compatible con el modelo utilizado localmente. Compartir origen entre página y API simplifica el manejo de solicitudes y cookies.

**Dónde:** [vercel.json](../vercel.json) define compilación y redirecciones; [api/index.ts](../api/index.ts) reutiliza Express. [schema.prisma](../backend/prisma/schema.prisma) distingue `url` y `directUrl` mediante `DATABASE_URL` y `DATABASE_URL_UNPOOLED`. El comando `vercel-build` en [package.json](../package.json) aplica migraciones cuando `VERCEL_ENV` es `production` y luego compila.

**Alternativa y límite:** un servidor propio o una máquina virtual permitirían otra forma de operación. Los servicios administrados reducen administración inicial, pero introducen configuración externa, límites del proveedor y dependencia de red. La configuración guardada no demuestra por sí sola que una dirección pública esté disponible; eso requiere verificación.

## 12. npm, Git y documentación: repetición y trazabilidad

**Necesidad:** instalar versiones compatibles, coordinar cambios y explicar qué se hizo realmente.

**Justificación:** `package.json` declara comandos, `package-lock.json` fija resoluciones y `.nvmrc` señala Node. Git registra versiones y permite revisar diferencias. La documentación conecta decisiones y comprobaciones con esos cambios.

**Dónde:** archivos raíz, [docs/features/](features), [docs/sessions/](sessions) y [.github/pull_request_template.md](../.github/pull_request_template.md). Vitest aparece como dependencia de la interfaz, pero todavía no constituye una suite guardada ni un flujo automático de pruebas.

**Alternativa y límite:** copiar carpetas o instalar versiones sin registrar dificulta repetir el entorno y rastrear errores. Tener un repositorio y un archivo de versiones no sustituye revisar cambios, ejecutar pruebas ni documentar resultados.

## Guion para defender una elección

Para cada herramienta puedes seguir esta secuencia: **«Necesitaba resolver X; elegí Y porque permite Z; se ve en el archivo A y la función o propiedad B; la alternativa era C y el límite de mi elección es D».**

Ejemplo: «Necesitaba actualizar la lista después de guardar una vacante. Usé React Query para coordinar esa consulta y Axios para enviarla. En Dashboard, `onSuccess` llama a `invalidateQueries`, y el servicio vuelve a consultar con `getJobs`. Podía hacerlo con `fetch` y estado manual, pero eso repetiría lógica; aun así, debo probar que la API guarda y devuelve el cambio real».
