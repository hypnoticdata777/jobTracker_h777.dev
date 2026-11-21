# Plan histórico de estabilización de la instalación

## Objetivo
Permitir instalar, compilar y ejecutar una copia nueva antes de ampliar las funcionalidades. Las fases se realizan en orden; instalar correctamente no demuestra el funcionamiento completo de la aplicación.

Este documento conserva el plan de la sesión del 12 de noviembre de 2026. El [plan actual](../../PLAN.md) refleja los avances posteriores; las tareas descritas como pendientes aquí corresponden a ese momento histórico.

## Fase 1 — Instalación reproducible de dependencias (terminada)

- Corregir el manifiesto del servidor, que tenía contenido tipo YAML en un archivo JSON.
- Comparar las dependencias declaradas con las importaciones y el uso de sus API.
- Conservar React Query 4 y utilizar su propiedad de carga compatible.
- Agregar el archivo de versiones fijas de npm y declarar la versión validada de Node/npm.
- Comprobar `npm ci` y la generación del cliente Prisma sin una base de datos activa.
- Registrar cambios, verificaciones y riesgos restantes.

Criterio cumplido: los manifiestos se pueden interpretar como JSON, la instalación limpia funciona y Prisma genera su cliente. Consulta la [bitácora](../sessions/2026-11-12-installation-phase-1.md).

## Fase 2 — Compilación y comandos de desarrollo

- Compilar servidor e interfaz y corregir errores de TypeScript o configuración.
- Agregar comandos raíz y evitar archivos generados dentro del control de versiones.
- Verificar las exportaciones del paquete compartido o retirar su estructura sin uso.

Criterio de aceptación: ambas compilaciones de producción funcionan con el procedimiento documentado.

## Fase 3 — Base de datos y ejecución

- Agregar una migración inicial y una carga repetible de datos de demostración.
- Alinear los ejemplos de entorno y las instrucciones con los archivos reales.
- Iniciar PostgreSQL y la API; verificar migraciones, datos y ruta de estado.

Criterio de aceptación: una base nueva puede inicializarse y la API arranca con los comandos documentados.

## Fase 4 — Verificación del recorrido completo

- Probar registro, inicio de sesión, restauración de sesión, creación y listado de vacantes, y cierre de sesión.
- Verificar entradas inválidas, acceso sin sesión y aislamiento entre usuarios.
- Corregir problemas que bloqueen el recorrido y registrar las evidencias.

Criterio de aceptación: el recorrido principal funciona en el navegador y está respaldado por comprobaciones de la API.

## Preparación de la fase 1, escrita antes de modificar código

Historia de usuario: como colaborador, quiero instalar todos los espacios de trabajo desde una copia nueva utilizando un único archivo de versiones fijas.

Pseudocódigo:
1. Leer los manifiestos y comparar dependencias con importaciones.
2. Reparar la sintaxis y las declaraciones ausentes o incompatibles.
3. Instalar desde la raíz para resolver las dependencias del conjunto.
4. Generar el cliente Prisma y repetir con `npm ci`.
5. Registrar resultados y dejar compilación y ejecución para sus fases.

Flujo: revisar → corregir declaraciones → instalar → generar cliente → instalación limpia → documentar.

Prueba de escritorio:
- Antes: el manifiesto empieza con `name:`; falla la lectura JSON y la instalación no puede continuar.
- Después: el manifiesto es un objeto JSON; npm resuelve los tres espacios que existían entonces; el archivo de versiones permite repetir la instalación con `npm ci`.
- Caso de error: una versión inexistente produce un error de resolución; se corrige la declaración correspondiente y se repite la comprobación.
