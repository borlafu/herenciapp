# CLAUDE.md

Este proyecto usa **AGENTS.md** como fuente única de verdad para convenciones, arquitectura, flujo de trabajo Git y reglas de contribución.

**Antes de realizar cualquier cambio, lee y sigue `AGENTS.md` en la raíz del repositorio.**

## Notas específicas para Claude Code

- Ejecuta siempre `npm run lint` y `npm run test` antes de proponer un commit.
- Al abrir una rama, usa el prefijo correcto (`feat/`, `fix/`, `chore/`) seguido del número de issue de GitHub, según lo definido en `AGENTS.md`, sección 4.
- Nunca hagas commit directo a `main`. Trabaja siempre contra una rama de feature y abre un Pull Request.
- Si el cambio afecta al motor de cálculo (`inheritance-engine`), añade o actualiza los tests correspondientes antes de dar la tarea por terminada.
- Si el cambio implica infraestructura (`/infra`, CDK), ejecuta `cdk synth` y `cdk diff` localmente y describe el resultado en el PR.
- Si tienes dudas sobre si una funcionalidad pertenece al MVP o a una fase posterior, consulta `ROADMAP.md` antes de implementarla.
- Para cualquier duda de alcance de producto, consulta `PRD.md`. Para cualquier duda de infraestructura o stack, consulta `ARCHITECTURE.md`.

Toda regla, convención o restricción no cubierta explícitamente aquí se rige por `AGENTS.md`.
