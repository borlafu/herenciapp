import type { HeirShare, InheritanceResult } from '@/lib/inheritance-engine/types'

const SHARE_COLORS: Record<HeirShare['shareType'], string> = {
  'plena-propiedad': 'bg-blue-500',
  'nuda-propiedad': 'bg-indigo-400',
  usufructo: 'bg-amber-400',
}

const SHARE_LABELS: Record<HeirShare['shareType'], string> = {
  'plena-propiedad': 'Propiedad plena',
  'nuda-propiedad': 'Nuda propiedad',
  usufructo: 'Usufructo',
}

interface ResultDiagramProps {
  result: InheritanceResult
}

export function ResultDiagram({ result }: ResultDiagramProps) {
  return (
    <section aria-label="Diagrama de reparto" className="w-full space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Cómo se reparte la herencia</h2>

      {/* Proportional bar */}
      <div
        className="flex h-14 w-full rounded-lg overflow-hidden shadow-sm"
        role="img"
        aria-label="Barra proporcional del reparto"
      >
        {result.shares.map((share, i) => (
          <div
            key={i}
            className={`${SHARE_COLORS[share.shareType]} flex items-center justify-center text-white text-xs font-semibold`}
            style={{ width: `${share.porcentaje}%` }}
            title={`${share.label}: ${share.porcentaje.toFixed(1)}%`}
          >
            {share.porcentaje >= 12 && `${share.porcentaje.toFixed(0)}%`}
          </div>
        ))}
      </div>

      {/* Cards per heir */}
      <ul className="grid gap-3 sm:grid-cols-2" role="list">
        {result.shares.map((share, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <span
              className={`mt-1 h-4 w-4 flex-shrink-0 rounded-sm ${SHARE_COLORS[share.shareType]}`}
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-gray-900">{share.label}</p>
              <p className="text-sm text-gray-600">{SHARE_LABELS[share.shareType]}</p>
              <p className="text-sm font-medium text-gray-800">
                {share.fraction.numerator}/{share.fraction.denominator} de la propiedad
                {' · '}
                <span className="text-gray-500">{share.porcentaje.toFixed(1)}%</span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-700" aria-label="Leyenda">
        {(Object.keys(SHARE_COLORS) as HeirShare['shareType'][]).map(type => (
          <span key={type} className="flex items-center gap-1.5">
            <span className={`inline-block h-3 w-3 rounded-sm ${SHARE_COLORS[type]}`} aria-hidden="true" />
            {SHARE_LABELS[type]}
          </span>
        ))}
      </div>
    </section>
  )
}
