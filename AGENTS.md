# AGENTS.md

Este documento define cómo cualquier agente de IA (Claude Code, Copilot, Cursor, etc.) debe operar en este repositorio. Es la fuente única de verdad sobre convenciones, arquitectura y flujo de trabajo. Otros ficheros de configuración de agentes (p. ej. `CLAUDE.md`) deben referenciar este documento en lugar de duplicar su contenido.

## 1. Contexto del proyecto

Aplicación web para explicar de forma clara y visual el reparto de una propiedad heredada entre propietarios plenos, nudos propietarios y usufructuarios, con un preset de "reparto legal" (partes iguales entre descendientes + usufructo del tercio de mejora al cónyuge viudo). Público objetivo: personas mayores o con nivel educativo medio-bajo. Ver `PRD.md` para el detalle funcional y `ARCHITECTURE.md` para el detalle técnico.

Monetización: publicidad (AdSense/Ad Manager) + partnerships con notarías/despachos vía captura de leads.

## 2. Principios no negociables

- **Claridad sobre complejidad.** Ninguna funcionalidad debe complicar la comprensión del reparto. Si una función jurídica avanzada no aporta claridad al usuario mayor, no se implementa en el MVP.
- **MVP sin backend propio.** El motor de cálculo del reparto corre 100% en el cliente. No añadir servicios backend salvo que estén explícitamente aprobados en `ARCHITECTURE.md` (ver fases de evolución).
- **Accesibilidad no es opcional.** Contraste alto, tipografía grande, navegación simple, compatible con lector de pantalla. Cualquier PR que rompa accesibilidad debe rechazarse.
- **No sustituye asesoramiento legal.** Cualquier texto o funcionalidad nueva debe mantener el disclaimer legal visible.

## 3. Stack tecnológico

- **Frontend:** Astro o Next.js (SSG), TypeScript, sin frameworks pesados de estado.
- **Infraestructura:** AWS CDK (TypeScript) para todo despliegue de infraestructura.
- **Hosting MVP:** S3 + CloudFront (estático).
- **CI/CD:** GitHub Actions.
- **Gestión de trabajo:** GitHub Issues (user stories, tareas, bugs) + GitHub Projects para el tablero.
- **Control de versiones:** GitHub, trunk-based development, PRs obligatorios sobre `main`.
- **Leads (MVP):** servicio externo de formularios (Formspree/Formcarry) sin backend propio.
- **Backend (fases posteriores):** AWS Lambda + API Gateway + DynamoDB/Aurora Serverless, introducido solo cuando se cumplan los criterios definidos en `ARCHITECTURE.md`.

## 4. Flujo de trabajo Git (trunk-based)

- `main` es la única rama larga y siempre debe estar desplegable.
- Toda tarea se desarrolla en una rama de corta duración: `feat/<issue-id>-descripcion`, `fix/<issue-id>-descripcion`, `chore/<issue-id>-descripcion`.
- **PRs obligatorios.** Ningún commit directo a `main`. Toda rama se integra vía Pull Request.
- Cada PR debe:
  - Referenciar el issue de GitHub que resuelve (`Closes #123`).
  - Pasar el pipeline de GitHub Actions (lint, tests, build, CDK synth) antes de poder mergearse.
  - Tener al menos 1 revisión aprobada (o autorevisión documentada si se trabaja en solitario, dejando constancia de qué se validó).
  - Mantener el PR pequeño y de alcance único; si crece, se divide en varios issues/PRs.
- Preferir `squash merge` para mantener el historial de `main` limpio.
- Feature flags (no ramas largas) para funcionalidades incompletas que deban convivir en `main`.

## 5. Gestión de trabajo (GitHub Issues)

- **User story:** plantilla `story.yml` — describe valor de usuario, criterios de aceptación, referencia al PRD.
- **Tarea técnica:** plantilla `task.yml` — trabajo de infraestructura, refactor, deuda técnica.
- **Bug:** plantilla `bug.yml` — pasos de reproducción, comportamiento esperado vs. real, severidad.
- Etiquetas mínimas: `mvp`, `fase-2`, `fase-3`, `frontend`, `infra`, `contenido`, `accesibilidad`, `monetizacion`.
- Todo issue debe poder trazarse a una sección del `PRD.md` o del `ROADMAP.md`.

## 6. Convenciones de código

- TypeScript estricto (`strict: true`) en frontend e infraestructura CDK.
- Commits en formato Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- Lint y formateo automatizados (ESLint + Prettier) ejecutados en cada PR vía GitHub Actions.
- Tests obligatorios para el motor de cálculo del reparto (`inheritance-engine`): es la lógica más crítica del producto y cualquier error rompe la confianza del usuario.
- Nombrado de componentes visuales alineado con los conceptos del dominio (`NudaPropiedadBlock`, `UsufructoBlock`, `RepartoLegalPreset`), no genérico (`Box1`, `Card2`).

## 7. Infraestructura (AWS CDK)

- Todo recurso de AWS se define como código en el stack de CDK, nunca se crea manualmente en la consola.
- Estructura de stacks por entorno: `dev`, `staging`, `prod`, desplegados desde GitHub Actions según la rama/tag.
- Cualquier cambio de infraestructura debe pasar por `cdk diff` visible en el PR antes de aprobarse.
- No introducir servicios con coste recurrente (bases de datos, cómputo siempre activo) sin justificación explícita ligada a una fase del `ARCHITECTURE.md`.

## 8. Qué debe hacer un agente antes de escribir código

1. Leer `PRD.md` y `ARCHITECTURE.md` para confirmar que el cambio está dentro del alcance de la fase actual.
2. Verificar si existe un issue de GitHub relacionado; si no existe, proponer su creación antes de codificar.
3. Confirmar que el cambio no introduce backend/infraestructura no aprobada para la fase MVP.
4. Escribir o actualizar tests del motor de cálculo si se toca lógica de reparto.
5. Actualizar documentación (`PRD.md`, `ARCHITECTURE.md`, `ROADMAP.md`) si el cambio altera alcance o arquitectura.

## 9. Qué NO debe hacer un agente

- No añadir dependencias de backend, bases de datos o autenticación en la fase MVP.
- No mergear directamente a `main`.
- No eliminar el disclaimer legal ni simplificar el lenguaje de advertencia.
- No introducir textos jurídicos complejos sin una explicación en lenguaje llano equivalente.
- No añadir anuncios que se superpongan al diagrama de reparto o interrumpan el flujo principal.

## 10. Documentos relacionados

- `PRD.md` — Alcance funcional y de producto.
- `ARCHITECTURE.md` — Arquitectura técnica y fases de evolución.
- `ROADMAP.md` — Fases del proyecto y criterios de paso entre fases.
- `CONTRIBUTING.md` — Flujo de trabajo detallado, plantillas de PR/issue, convenciones de commits.
- `CLAUDE.md` — Punto de entrada específico para Claude Code, referencia a este fichero.
