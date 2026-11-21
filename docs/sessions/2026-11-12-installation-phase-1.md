# Sesión: estabilización de la instalación, fase 1

Fecha: 12 de noviembre de 2026 (America/Mexico_City).

Registro histórico traducido al español el 21 de noviembre de 2026. Describe la versión y las comprobaciones de aquella sesión; no el estado actual del proyecto.

## Solicitud y alcance

Explorar el repositorio, planear las correcciones de instalación antes de modificar código y completar la primera fase. Consulta el [plan](../setup/installation-plan.md).

Versión inicial: `c62c2aa`, rama `main`, sin cambios locales. Entorno: Node 24.22.1 y npm 11.9.0.

## Hallazgos iniciales

- El archivo `backend/package.json` contenía texto tipo YAML y no era JSON válido.
- Vite importaba `@vitejs/plugin-react` sin declararlo.
- El panel usaba `isPending` de React Query 5 con una dependencia de la versión 4.
- Un auxiliar de PostgreSQL importaba `pg` sin declararlo.
- Faltaba el archivo raíz de versiones fijas.
- README y PLAN mencionaban archivos de datos de demostración y SQL que no existían.

## Cambios realizados

Fase uno terminada.

- Conversión del manifiesto del servidor a JSON, conservando comandos de desarrollo, compilación, ejecución y Prisma.
- Corrección de versiones inexistentes: `cookie-parser` de `^1.9.1` a `^1.4.7`, sus tipos a `^1.4.8`, `ts-node-dev` a `^2.0.0` y Tailwind a `^3.4.17`.
- Incorporación de `@vitejs/plugin-react ^4.3.4`, `pg ^8.13.1` y `@types/pg ^8.11.10`.
- Alineación de `@types/express` con Express 4 mediante `^4.17.21`.
- Sustitución de tres usos de `isPending` por `isLoading`.
- Incorporación de `package-lock.json`, `.nvmrc`, rangos de Node/npm y metadatos `packageManager`.
- Enlaces al plan y la bitácora desde README, con aclaraciones sobre tareas históricas sin verificar.

Node 24 fue la versión validada; no se afirmó que todas las anteriores fueran incompatibles.

## Verificaciones

- Lectura JSON de los cuatro manifiestos: correcta.
- La instalación inicial encontró `ETARGET` para `cookie-parser` y sus tipos; se corrigieron las declaraciones.
- `npm install --no-audit --no-fund --cache /tmp/jobtracker-npm-cache`: correcto.
- `npm ci --no-audit --no-fund --cache /tmp/jobtracker-npm-cache`: correcto, 384 paquetes instalados.
- `npm run prisma:generate --workspace backend`: correcto; cliente Prisma 5.22.0 generado sin base activa.
- `npm ls --depth=0`: correcto; tres espacios de trabajo resueltos sin errores.
- `git diff --check`: correcto.

La ruta temporal de caché era específica de ese entorno; normalmente basta con `npm ci`. No se agregaron secretos ni archivos de entorno. El usuario autorizó después guardar y publicar esta fase en `origin/main`; el cambio incluyó el plan, la bitácora y las correcciones.

## Límites al terminar aquella sesión

- Las compilaciones, la inicialización de la base y los recorridos del navegador no se habían verificado.
- Existían avisos de dependencias transitivas obsoletas: inflight, glob 7 y rimraf 2. No se realizó auditoría de seguridad.
- Las exportaciones del paquete compartido apuntaban a archivos inexistentes; se dejaron para la fase 2.
- Faltaban migraciones y datos de demostración; se dejaron para la fase 3.

## Continuación prevista

Ejecutar ambas compilaciones, registrar errores reales y resolver los necesarios para la fase 2. Una instalación satisfactoria no equivale a un MVP completo verificado.
