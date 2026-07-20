# CONTRIBUTING.md

## Flujo de trabajo

Este proyecto sigue **trunk-based development** con **Pull Requests obligatorios**. Ver `AGENTS.md` para el detalle completo de convenciones y el modelo multi-agente.

### Pasos para contribuir

1. Elige o crea un issue en GitHub (user story, tarea o bug) usando la plantilla correspondiente.
2. Crea una rama desde `main`: `feat/<issue-id>-descripcion-corta`, `fix/<issue-id>-descripcion-corta` o `chore/<issue-id>-descripcion-corta`.
3. Desarrolla el cambio en la rama, manteniendo el alcance acotado al issue.
4. Ejecuta localmente lint, tipos y tests antes de subir cambios:
   ```bash
   pnpm lint
   pnpm tsc --noEmit
   pnpm test
   ```
5. Abre un Pull Request contra `main`, referenciando el issue (`Closes #123`).
6. Espera a que el pipeline de GitHub Actions pase en verde: lint → tsc → test:ci → build.
7. Solicita revisión. Ningún PR se mergea sin al menos 1 aprobación (humana o del agente revisor).
8. Usa `squash merge` al integrar.

### Gestor de paquetes

Usar **pnpm** exclusivamente. No usar `npm` ni `yarn`.

```bash
pnpm install          # instalar dependencias
pnpm dev              # servidor de desarrollo
pnpm build            # build de producción
pnpm lint             # ESLint
pnpm tsc --noEmit     # comprobación de tipos
pnpm test             # tests (watch mode)
pnpm test:ci          # tests con cobertura (modo CI)
```

## Modelo multi-agente

Cuando se trabaja con varios agentes en paralelo:

- **Agente revisor** — revisa cada PR antes del merge, ejecuta la checklist de `AGENTS.md` sección 6, crea issues de bugs si los detecta. No toca código.
- **Agentes implementadores** — cada uno trabaja en un issue distinto sobre su propia rama. Abren PR al terminar y esperan la aprobación del revisor.

Los agentes no deben bloquearse entre sí: trabajan en ramas independientes y solo convergen en el momento del merge a `main`.

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
- [ ] Tests añadidos/actualizados si se tocó el motor de cálculo (`lib/inheritance-engine/`).
- [ ] Cobertura ≥ 80 % (`pnpm test:ci`).
- [ ] `pnpm lint` y `pnpm build` pasan sin errores.
- [ ] `pnpm tsc --noEmit` sin errores.
- [ ] `cdk diff` revisado si se tocó infraestructura.
- [ ] Documentación (`PRD.md`/`ARCHITECTURE.md`) actualizada si el alcance cambió.
- [ ] Accesibilidad verificada (contraste, tamaño de fuente, navegación por teclado).
- [ ] Disclaimer legal sigue visible en la UI.
