import type {
  CasoHerencia,
  HeirShare,
  InheritanceInput,
  InheritanceResult,
  ShareType,
} from '@/lib/inheritance-engine/types'

function makeShare(
  label: string,
  shareType: ShareType,
  numerator: number,
  denominator: number,
  porcentaje?: number,
): HeirShare {
  return {
    label,
    shareType,
    fraction: { numerator, denominator },
    porcentaje: porcentaje ?? (numerator / denominator) * 100,
  }
}

function validar(input: InheritanceInput): void {
  if (input.numDescendientes < 0) {
    throw new Error('numDescendientes no puede ser negativo')
  }
  if (input.numDescendientes === 0 && !input.tieneConyuge) {
    throw new Error('Debe haber al menos un heredero')
  }
  if (
    input.coeficienteCopropiedad !== undefined &&
    (input.coeficienteCopropiedad <= 0 || input.coeficienteCopropiedad > 1)
  ) {
    throw new Error('coeficienteCopropiedad debe estar en el rango (0, 1]')
  }
}

function detectarCaso(input: InheritanceInput): CasoHerencia {
  if (input.coeficienteCopropiedad !== undefined) return 'copropiedad'
  if (input.numDescendientes > 0 && input.tieneConyuge) return 'descendientes-conyuge'
  if (input.numDescendientes > 0 && !input.tieneConyuge) return 'descendientes-sin-conyuge'
  return 'conyuge-sin-descendientes'
}

/**
 * Descendientes + cónyuge viudo (derecho español):
 *   - Usufructo del 1/3 de mejora → cónyuge
 *   - Nuda propiedad del 1/3 de mejora → hijos a partes iguales
 *   - Pleno dominio de los 2/3 restantes → hijos a partes iguales
 *
 * Invariantes: Σ(usufructo) == Σ(nuda), Σ(pleno) + Σ(usufructo) == 100%
 */
function calcularDescendientesConyuge(input: InheritanceInput): HeirShare[] {
  const n = input.numDescendientes
  const shares: HeirShare[] = []

  // Cónyuge: usufructo de 1/3
  shares.push(makeShare('Cónyuge viudo/a', 'usufructo', 1, 3))

  // Cada hijo: nuda de (1/3)/n + pleno de (2/3)/n
  for (let i = 1; i <= n; i++) {
    shares.push(makeShare(`Hijo/a ${i}`, 'nuda-propiedad', 1, 3 * n, (1 / (3 * n)) * 100))
    shares.push(makeShare(`Hijo/a ${i}`, 'pleno-dominio', 2, 3 * n, (2 / (3 * n)) * 100))
  }

  return shares
}

function calcularDescendientesSinConyuge(input: InheritanceInput): HeirShare[] {
  const n = input.numDescendientes
  return Array.from({ length: n }, (_, i) =>
    makeShare(`Hijo/a ${i + 1}`, 'pleno-dominio', 1, n),
  )
}

function calcularConyugeSinDescendientes(): HeirShare[] {
  return [makeShare('Cónyuge viudo/a', 'usufructo', 1, 1)]
}

/**
 * Copropiedad (p.ej. gananciales): el coeficiente indica qué fracción de la propiedad
 * entra en la herencia.
 *
 * Sin cónyuge: todos los hijos reciben pleno dominio proporcional.
 *
 * Con cónyuge (gananciales, coef = 0.5 típico):
 *   1. Se disuelve la sociedad de gananciales:
 *      cónyuge retiene su parte en pleno dominio (1 - coef, p.ej. 50%).
 *   2. El resto (coef) es la herencia y se distribuye igual que descendientes+cónyuge:
 *      - usufructo 1/3 de coef → cónyuge
 *      - nuda 1/(3n) de coef por hijo
 *      - pleno 2/(3n) de coef por hijo
 */
function calcularCopropiedad(input: InheritanceInput): HeirShare[] {
  const coef = input.coeficienteCopropiedad!
  const n = input.numDescendientes
  const shares: HeirShare[] = []

  if (!input.tieneConyuge) {
    return Array.from({ length: n }, (_, i) =>
      makeShare(`Hijo/a ${i + 1}`, 'pleno-dominio', 1, n, (coef / n) * 100),
    )
  }

  // Gananciales: cónyuge retiene su mitad en pleno dominio
  const coefConyuge = 1 - coef
  if (coefConyuge > 0) {
    shares.push(
      makeShare('Cónyuge viudo/a', 'pleno-dominio', coefConyuge * 10, 10, coefConyuge * 100),
    )
  }

  // Reparto de la herencia (coef) con la misma lógica que descendientes+cónyuge
  shares.push(makeShare('Cónyuge viudo/a', 'usufructo', 1, 3, (coef / 3) * 100))

  for (let i = 1; i <= n; i++) {
    shares.push(
      makeShare(`Hijo/a ${i}`, 'nuda-propiedad', 1, 3 * n, (coef / (3 * n)) * 100),
    )
    shares.push(
      makeShare(`Hijo/a ${i}`, 'pleno-dominio', 2, 3 * n, ((2 * coef) / (3 * n)) * 100),
    )
  }

  return shares
}

export function calcularReparto(input: InheritanceInput): InheritanceResult {
  validar(input)

  const caso = detectarCaso(input)

  const sharesMap: Record<CasoHerencia, () => HeirShare[]> = {
    'descendientes-conyuge': () => calcularDescendientesConyuge(input),
    'descendientes-sin-conyuge': () => calcularDescendientesSinConyuge(input),
    'conyuge-sin-descendientes': () => calcularConyugeSinDescendientes(),
    copropiedad: () => calcularCopropiedad(input),
  }

  return {
    input,
    shares: sharesMap[caso](),
    caso,
  }
}
