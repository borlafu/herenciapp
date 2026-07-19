# CONTRIBUTING.md

## Flujo de trabajo

Este proyecto sigue **trunk-based development** con **Pull Requests obligatorios**. Ver `AGENTS.md` para el detalle completo de convenciones.

### Pasos para contribuir

1. Elige o crea un issue en GitHub (user story, tarea o bug) usando la plantilla correspondiente.
2. Crea una rama desde `main`: `feat/<issue-id>-descripcion-corta`, `fix/<issue-id>-descripcion-corta` o `chore/<issue-id>-descripcion-corta`.
3. Desarrolla el cambio en la rama, manteniendo el alcance acotado al issue.
4. Ejecuta localmente lint y tests antes de subir cambios.
5. Abre un Pull Request contra `main`, referenciando el issue (`Closes #123`).
6. Espera a que el pipeline de GitHub Actions pase en verde (lint, tests, build, `cdk synth`/`diff` si aplica).
7. Solicita revisión. Ningún PR se mergea sin al menos 1 aprobación.
8. Usa `squash merge` al integrar.

## Plantillas de issues

### User story (`story.yml`)
- Como [tipo de usuario], quiero [objetivo], para [beneficio].
- Criterios de aceptación (lista).
- Referencia a la sección del `PRD.md`.

### Tarea técnica (`task.yml`)
- Descripción del trabajo técnico.
- Motivación (deuda técnica, infraestructura, refactor).
- Referencia a `ARCHITECTURE.md` si aplica.

### Bug (`bug.yml`)
- Pasos de reproducción.
- Comportamiento esperado vs. observado.
- Severidad (crítica/alta/media/baja).
- Entorno donde se detectó.

## Convenciones de commits

Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.

Ejemplo: `feat: añade preset de reparto legal con tercio de mejora`

## Etiquetas de issues

`mvp`, `fase-2`, `fase-3`, `fase-4`, `frontend`, `infra`, `contenido`, `accesibilidad`, `monetizacion`, `bug`, `deuda-tecnica`.

## Checklist antes de abrir un PR

- [ ] El cambio está dentro del alcance de la fase actual (ver `ROADMAP.md`).
- [ ] Tests añadidos/actualizados si se tocó el motor de cálculo.
- [ ] Lint y build pasan localmente.
- [ ] `cdk diff` revisado si se tocó infraestructura.
- [ ] Documentación (`PRD.md`/`ARCHITECTURE.md`) actualizada si el alcance cambió.
- [ ] Accesibilidad verificada (contraste, tamaño de fuente, navegación por teclado).
