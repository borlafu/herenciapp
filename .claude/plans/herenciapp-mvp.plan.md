# Plan: Herenciapp MVP

**Source PRD**: PRD.md
**Selected Milestone**: Fase 1 — MVP (sin backend propio)
**Complexity**: Medium

## Summary

Build a fully client-side Next.js 16 (App Router, SSG) web app that computes and visualises how an inherited property is divided among heirs and a surviving spouse. The inheritance calculation engine (`inheritance-engine`) runs 100% in the browser. The UI targets older, lower-literacy users: large text, high contrast, one idea per screen.

## Patterns to Mirror

No production code exists yet — scaffold is a bare Next.js 16 App Router template.

| Category | Source | Pattern |
|---|---|---|
| Naming | `app/layout.tsx:1` | Server Components by default, `"use client"` only when needed |
| Components | `app/page.tsx:3` | Named `export default function`, no `React.FC` |
| Styling | `app/globals.css` + `tailwind` | Tailwind v4 utility classes |
| Types | `tsconfig.json` | `strict: true`, path alias `@/*` |
| Tests | none yet | Jest + `@testing-library/react` (to install) |

## Files to Change

| File | Action | Why |
|---|---|---|
| `lib/inheritance-engine/types.ts` | CREATE | Domain types: `Heir`, `Share`, `InheritanceInput`, `InheritanceResult` |
| `lib/inheritance-engine/calculator.ts` | CREATE | Pure calculation functions — all 4 PRD cases |
| `lib/inheritance-engine/calculator.test.ts` | CREATE | Unit tests (TDD, RED first) |
| `lib/glossary.ts` | CREATE | Glosario terms data (static, typed) |
| `components/simulator/SimulatorForm.tsx` | CREATE | Input form: n° herederos, cónyuge viudo toggle |
| `components/simulator/ResultDiagram.tsx` | CREATE | Visual blocks for nuda propiedad / usufructo / plena propiedad |
| `components/simulator/ResultSummary.tsx` | CREATE | Plain-language textual summary |
| `components/simulator/GlossaryTooltip.tsx` | CREATE | Inline term definition tooltip (accessible) |
| `components/layout/Disclaimer.tsx` | CREATE | Legal disclaimer — always visible |
| `components/layout/LeadForm.tsx` | CREATE | Formspree/Formcarry iframe/embed |
| `app/page.tsx` | UPDATE | Replace scaffold content with simulator page |
| `app/layout.tsx` | UPDATE | Update metadata (title, lang="es"), keep Disclaimer always mounted |
| `app/globals.css` | UPDATE | Accessibility tokens: min font-size, high-contrast, focus ring |
| `package.json` | UPDATE | Add `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `jest-environment-jsdom` |

## Tasks

### Task 1: Install test tooling (TDD prerequisite)
- **Action**: `pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom ts-jest`; add `jest.config.ts`
- **Mirror**: TypeScript strict, path alias `@/*` in moduleNameMapper
- **Validate**: `pnpm test -- --passWithNoTests`

### Task 2: Define domain types (RED)
- **Action**: Create `lib/inheritance-engine/types.ts` with `InheritanceInput`, `InheritanceResult`, `ShareType` union
- **Mirror**: `type` for unions, `interface` for object shapes (react/coding-style.md)
- **Validate**: `pnpm tsc --noEmit`

### Task 3: Write calculator tests first (RED)
- **Action**: Create `lib/inheritance-engine/calculator.test.ts` covering all 4 PRD cases:
  1. Descendientes + cónyuge viudo
  2. Descendientes sin cónyuge
  3. Cónyuge sin descendientes
  4. Copropiedad previa simple
- **Mirror**: AAA pattern, descriptive test names (common/testing.md)
- **Validate**: `pnpm test` — all tests FAIL (expected RED)

### Task 4: Implement inheritance engine (GREEN)
- **Action**: Create `lib/inheritance-engine/calculator.ts` — pure functions, no side effects, immutable return values
- **Mirror**: Immutability (common/coding-style.md), no `any`, Zod for input validation
- **Validate**: `pnpm test` — all tests PASS

### Task 5: SimulatorForm component
- **Action**: Client component (`"use client"`), controlled inputs, `useState` for result; validates input (1–10 heirs)
- **Mirror**: `react/coding-style.md` — named interface for props, no `React.FC`, Tailwind classes
- **Validate**: `pnpm tsc --noEmit`; manual a11y check (label+input pairing, 44px min touch targets)

### Task 6: ResultDiagram component
- **Action**: Server or Client component rendering proportional blocks (SVG or CSS Flexbox) per share; colour-coded by type; never overlaps disclaimer
- **Mirror**: Tailwind v4, web/design-quality.md — intentional hierarchy, not default card grid
- **Validate**: `pnpm build`; visual check at 320px and 1024px

### Task 7: ResultSummary + GlossaryTooltip
- **Action**: Plain-language summary text assembled from engine result; tooltip on jargon terms linking to `lib/glossary.ts`; tooltip keyboard-accessible (focus, Escape to close)
- **Mirror**: `react/hooks.md` — custom `useTooltip` hook if reused 2+ places
- **Validate**: keyboard navigation test; `pnpm tsc --noEmit`

### Task 8: Disclaimer + layout wiring
- **Action**: `Disclaimer.tsx` — sticky footer or top banner, always visible; update `app/layout.tsx` metadata (`lang="es"`, product title, description)
- **Mirror**: Semantic HTML first (web/coding-style.md): `<footer>`, `role="note"` on disclaimer
- **Validate**: Lighthouse accessibility score ≥ 90

### Task 9: LeadForm embed
- **Action**: `LeadForm.tsx` — Formspree/Formcarry embed; no backend; GDPR consent checkbox; no overlap with diagram
- **Mirror**: `react/security.md` — no secrets in client bundle; `rel="noopener noreferrer"` on any external links
- **Validate**: form submission test (manual); `pnpm build`

### Task 10: Page assembly + SSG verification
- **Action**: Wire all components into `app/page.tsx`; run `next build` and confirm static export; check `next.config.ts` for `output: 'export'` if deploying to S3
- **Mirror**: RSC default, Client boundary only on SimulatorForm
- **Validate**: `pnpm build` clean; `pnpm start` + smoke test in browser at localhost:3000

## Validation

```bash
pnpm test                        # unit tests green, coverage >= 80% on engine
pnpm tsc --noEmit                # no type errors
pnpm lint                        # no lint errors
pnpm build                       # production build clean
```

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Spanish inheritance law edge cases (mejora, legitima estricta) | Medium | Scope MVP strictly to 4 PRD cases; disclaimer covers common cases only |
| Accessibility gaps for older users | High | Test with keyboard and screen reader before task 10; WCAG AA target |
| Tailwind v4 API differences from v3 | Medium | Check `@tailwindcss/postcss` docs; avoid v3-only utilities |
| No test framework yet | Low | Task 1 installs it before any implementation |

## Acceptance

- [ ] All 4 PRD cases calculate correctly (unit tests green)
- [ ] Test coverage >= 80% on `lib/inheritance-engine/`
- [ ] Disclaimer visible on every viewport
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] Touch targets >= 44x44px on all interactive elements
- [ ] `pnpm build` clean, no type errors, no lint errors
- [ ] Keyboard navigable end-to-end
- [ ] `lang="es"` set on `<html>`
