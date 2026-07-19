import type { InheritanceResult } from '@/lib/inheritance-engine/types'
import { GlossaryTooltip } from '@/components/simulator/GlossaryTooltip'

interface ResultSummaryProps {
  result: InheritanceResult
}

function buildSummary(result: InheritanceResult): React.ReactNode {
  const { caso, input, shares } = result
  const n = input.numDescendientes

  if (caso === 'descendientes-sin-conyuge') {
    return (
      <p>
        La herencia se reparte entre {n} {n === 1 ? 'hijo/a' : 'hijos/as'} a partes iguales.
        Cada uno/a recibe el {shares[0].porcentaje.toFixed(1)}% en{' '}
        <GlossaryTooltip termId="propiedad-plena">propiedad plena</GlossaryTooltip>, lo que
        significa que pueden usar el bien, alquilarlo o venderlo libremente.
      </p>
    )
  }

  if (caso === 'descendientes-conyuge') {
    return (
      <p>
        Los {n} {n === 1 ? 'hijo/a hereda' : 'hijos/as heredan'} la{' '}
        <GlossaryTooltip termId="nuda-propiedad">nuda propiedad</GlossaryTooltip> a partes
        iguales ({shares[0].porcentaje.toFixed(1)}% cada uno/a). El/la cónyuge viudo/a recibe el{' '}
        <GlossaryTooltip termId="usufructo">usufructo</GlossaryTooltip> del{' '}
        <GlossaryTooltip termId="tercio-mejora">tercio de mejora</GlossaryTooltip> (un tercio de
        la herencia), lo que le permite vivir en el inmueble o cobrar el alquiler de por vida.
      </p>
    )
  }

  if (caso === 'conyuge-sin-descendientes') {
    return (
      <p>
        Sin hijos/as, el/la cónyuge viudo/a recibe el{' '}
        <GlossaryTooltip termId="usufructo">usufructo</GlossaryTooltip> universal: puede usar
        el bien y obtener rentas durante toda su vida.
      </p>
    )
  }

  const coef = (input.coeficienteCopropiedad! * 100).toFixed(0)
  return (
    <p>
      La herencia corresponde solo al {coef}% del bien (el resto ya era de otra persona). Ese{' '}
      {coef}% se reparte entre los herederos según las reglas habituales.
    </p>
  )
}

export function ResultSummary({ result }: ResultSummaryProps) {
  return (
    <section aria-label="Resumen del reparto" className="rounded-xl bg-blue-50 border border-blue-100 p-5 text-base leading-7 text-gray-800">
      <h2 className="mb-2 text-lg font-bold text-gray-900">En pocas palabras</h2>
      {buildSummary(result)}
    </section>
  )
}
