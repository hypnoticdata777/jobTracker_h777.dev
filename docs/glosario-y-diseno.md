# Glosario, formato de lectura y diseño visual

Esta guía explica las palabras y convenciones del [README](../README.md) y del [plan](../PLAN.md). Los ejemplos corresponden al código del proyecto.

## Cómo leer la documentación

| Elemento | Qué significa | Ejemplo |
|---|---|---|
| Título y subtítulo | Organizan el documento; no son instrucciones de programa | «Objetivo», «Plan para continuar» |
| **Negritas** | Destacan un concepto o una conclusión | **Pendiente de verificar** |
| `Texto de código` | Nombre literal de archivo, campo, función, comando o valor | `JobForm.tsx`, `createdBy`, `npm run build` |
| Bloque de código | Ejemplo o comando para ejecutar en el contexto indicado | Los comandos de la guía de instalación |
| Enlace | Lleva al archivo o documento que sirve de referencia | [Mapa del proyecto](mapa-del-proyecto.md) |
| `[ ]` y `[x]` | Tarea pendiente o realizada según el alcance expresado | Una tarea de programación realizada no sustituye la verificación integral |
| Diagrama de flujo | Representa el orden y las decisiones de un proceso | Validar sesión → validar datos → guardar |

Los nombres técnicos permanecen en inglés para coincidir con el código. La explicación y las etiquetas visibles se escriben en español. `Job` es el modelo de vacante; no es una segunda función distinta del seguimiento de postulaciones.

## ¿Qué significaba la M de las etapas?

**M significaba «milestone», es decir, hito o punto de control.** Era una etiqueta del plan, no una función del programa, una versión de la base de datos ni una unidad escolar. `M0.5` representaba un hito intermedio para publicar la aplicación; no quería decir «50 % de avance».

El plan vigente usa nombres y números más claros:

| Nombre actual | Clave histórica que puede aparecer en bitácoras |
|---|---|
| Etapa 1 — Base del proyecto | M0 |
| Etapa 2 — Funciones principales | M1 |
| Etapa 3 — Confiabilidad | M2 |
| Etapa 4 — Publicación en internet | M0.5 |
| Etapa 5 — Demostración | M3 |

Los números actuales indican el orden de trabajo: base, funciones, confiabilidad, publicación y demostración. Se reordenaron los nombres para comprobar el recorrido local antes de revisar la publicación. Estas etapas tampoco reemplazan las cuatro fases históricas de corrección de instalación, que documentan otro trabajo.

## Términos del producto

| Término | Significado en este proyecto |
|---|---|
| Vacante | Oportunidad laboral que se guarda, incluso antes de solicitarla |
| Postulación | Solicitud enviada para una vacante; la misma tarjeta conserva su seguimiento |
| Estado de una vacante | Etapa laboral: Guardada, Postulada, En entrevista, Oferta recibida, Rechazada o Archivada |
| Cuenta | Registro de una persona con correo y contraseña protegida |
| Sesión | Identificación temporal de la persona que inició sesión |
| Propietario | Usuario que creó la vacante; se identifica con `createdBy` |
| MVP | Producto mínimo viable: primera versión con un alcance reducido que permite comprobar su utilidad |
| Implementado | El código o la configuración existen |
| Verificado | Hay una comprobación registrada, con alcance y resultado |
| Pendiente | Falta desarrollar algo o comprobarlo; debe aclararse cuál de las dos cosas |

## Términos de programación y datos

| Término | Explicación y ejemplo real |
|---|---|
| Interfaz o frontend | Pantallas que utiliza la persona, en `frontend/` |
| Servidor o backend | Código que valida solicitudes y accede a los datos, en `backend/` |
| API | Conjunto de rutas para comunicarse con el servidor; aquí `/api/jobs` y `/api/auth/...` |
| Ruta o endpoint | Dirección y operación ofrecida por la API, como `GET /api/jobs`; una ruta de página como `/login` tiene otra función |
| HTTP y HTTPS | Protocolos de comunicación; HTTPS agrega protección del transporte mediante TLS |
| Método HTTP | Acción de una solicitud: `GET` consulta, `POST` crea o ejecuta una acción, `PATCH` actualiza parte de un registro y `DELETE` elimina |
| Código de respuesta | Resultado de la solicitud: 200 correcto, 201 creado, 204 correcto sin cuerpo, 400 entrada inválida, 401 sin sesión válida, 404 no encontrado, 409 conflicto y 500 error inesperado |
| JSON | Formato de intercambio de datos; por ejemplo `{"status":"APPLIED"}` |
| Función | Operación definida en el código; `createJob(input)` envía una vacante a la API |
| Método de objeto | Función que se llama mediante un objeto; `prisma.job.findMany(...)` consulta registros |
| Propiedad | Dato de un objeto o de un tipo; `job.title`, `job.status` y `JobInput.company` |
| Atributo de interfaz | Configuración de un elemento; `required` exige un campo y `maxLength={200}` limita su longitud en el formulario |
| Prop de React | Información que un componente recibe: `isSaving` deshabilita guardar en `JobForm`; `onSubmit` recibe una función |
| Componente | Parte reutilizable de la interfaz; `JobCard` muestra una tarjeta |
| Estado de React | Información de una pantalla que puede cambiar; `form` guarda lo escrito. No es lo mismo que el estado laboral `SAVED` |
| Hook | Función de React o su ecosistema para manejar comportamiento; `useState` mantiene datos locales y `useQuery` gestiona una consulta |
| Tipo o interfaz de TypeScript | Descripción esperada de datos durante el desarrollo, como `JobInput`; no valida por sí sola solicitudes externas |
| Esquema de validación | Reglas comprobadas durante la ejecución, como `createJobSchema` de Zod |
| Modelo de datos | Estructura persistida; `User` y `Job` están definidos en Prisma |
| SQL y base relacional | Lenguaje de consulta y almacenamiento en tablas relacionadas; una persona puede tener varias vacantes |
| ORM | Herramienta que conecta modelos del programa con la base; en este proyecto se utiliza Prisma |
| Migración | Cambio registrado de estructura de la base; no es un dato de una vacante |
| Seed o carga de demostración | Programa que prepara una cuenta y vacantes de ejemplo |
| Middleware | Función que interviene antes de una ruta; `requireAuth` valida la sesión |
| Autenticación y autorización | Comprobar quién es la persona y qué registros puede consultar o modificar, respectivamente |
| Hash o resumen criptográfico | Representación no reversible usada para verificar contraseñas con Argon2 |
| JWT o token | Datos firmados para reconocer la sesión; la firma comprueba integridad, no cifra su contenido |
| Cookie | Dato que el navegador conserva y envía al servidor según sus reglas; aquí contiene `auth_token` |
| Caché e invalidación | Conservación temporal de resultados; invalidar `['jobs']` permite volver a consultar la lista después de cambiarla |
| Persistencia | Conservar datos en la base después de una recarga o de reiniciar el servidor |
| Prueba simulada | Sustituye una respuesta externa para comprobar una parte; no prueba que la base guarde datos |
| CI o integración continua | Ejecución automática de comprobaciones al enviar cambios al repositorio |
| Despliegue | Publicación de una versión de la aplicación en un servicio de alojamiento |
| Variable de entorno | Configuración externa al código, como `DATABASE_URL`; sus valores reales pueden ser secretos |
| UTC y es-MX | Referencia horaria universal y configuración regional de español de México. No son equivalentes: una regula la interpretación horaria y la otra el formato visible |

## Tipografía y jerarquía visual reales

La interfaz no carga una fuente externa ni define una familia personalizada. [La configuración de Tailwind](../frontend/tailwind.config.cjs) conserva el tema predeterminado (`extend: {}`) y [los estilos](../frontend/src/styles/index.css) incluyen su capa base. Se utiliza la familia sans serif predeterminada de Tailwind, que comienza con `ui-sans-serif`, `system-ui` y `sans-serif`; la fuente concreta depende del sistema del usuario.

La justificación de conservar esta configuración es ofrecer una lectura familiar y evitar una descarga adicional de fuentes durante esta primera versión. Es una decisión de alcance y legibilidad, no una afirmación de que se realizó un estudio tipográfico.

| Recurso | Uso actual | Dónde comprobarlo |
|---|---|---|
| `text-2xl font-bold` | Encabezado principal del panel y títulos de acceso | `Dashboard.tsx`, `LoginPage.tsx`, `RegisterPage.tsx` dentro de `frontend/src/pages/` |
| `text-xl font-semibold` | Puesto de una vacante | [JobCard.tsx](../frontend/src/components/JobCard.tsx) |
| `text-sm` y colores `text-slate-*` | Etiquetas, empresa, fechas y textos de apoyo | Formularios y tarjetas |
| `bg-blue-600` | Acción principal, como guardar o agregar | Panel y formulario |
| Tonos azules, ámbar, verdes y rojos | Apoyo visual de los estados laborales | `STATUS_STYLES` en `JobCard.tsx` |
| Etiquetas de texto | Identifican cada estado además del color | `STATUS_LABELS` en [types/job.ts](../frontend/src/types/job.ts) |
| `md:grid-cols-2` | Distribuye campos en dos columnas cuando hay espacio | [JobForm.tsx](../frontend/src/components/JobForm.tsx) |

Los controles también usan etiquetas y ayudas como `htmlFor`, `id`, `aria-label` y `role="alert"`. Su presencia ayuda a identificar campos y mensajes; una evaluación completa de accesibilidad sigue requiriendo pruebas específicas.

La tipografía de los archivos Markdown al verlos en GitHub depende de GitHub. La de la aplicación depende de su CSS: cambiar el formato del README no cambia la fuente de las pantallas.
