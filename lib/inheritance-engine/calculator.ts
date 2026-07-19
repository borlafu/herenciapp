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
  coeficiente = 1,
): HeirShare {
  const basePorcentaje = (numerator / denominator) * 100
  return {
    label,
    shareType,
    fraction: { numerator, denominator },
    porcentaje: basePorcentaje * coeficiente,
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

function calcularDescendientesConyuge(input: InheritanceInput): HeirShare[] {
  const n = input.numDescendientes
  const shares: HeirShare[] = []

  for (let i = 1; i <= n; i++) {
    shares.push(makeShare(`Hijo/a ${i}`, 'nuda-propiedad', 1, n))
  }

  shares.push(makeShare('Cónyuge viudo/a', 'usufructo', 1, 3))

  return shares
}

function calcularDescendientesSinConyuge(input: InheritanceInput): HeirShare[] {
  const n = input.numDescendientes
  return Array.from({ length: n }, (_, i) =>
    makeShare(`Hijo/a ${i + 1}`, 'plena-propiedad', 1, n),
  )
}

function calcularConyugeSinDescendientes(): HeirShare[] {
  return [makeShare('Cónyuge viudo/a', 'usufructo', 1, 1)]
}

function calcularCopropiedad(input: InheritanceInput): HeirShare[] {
  const coef = input.coeficienteCopropiedad!
  const n = input.numDescendientes
  const shareType: ShareType = input.tieneConyuge ? 'nuda-propiedad' : 'plena-propiedad'

  const shares: HeirShare[] = Array.from({ length: n }, (_, i) =>
    makeShare(`Hijo/a ${i + 1}`, shareType, 1, n, coef),
  )

  if (input.tieneConyuge) {
    shares.push(makeShare('Cónyuge viudo/a', 'usufructo', 1, 3, coef))
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
