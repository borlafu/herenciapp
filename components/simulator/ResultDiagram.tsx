'use client'

import { useState } from 'react'
import type { HeirShare, InheritanceResult } from '@/lib/inheritance-engine/types'

const SHARE_COLORS: Record<HeirShare['shareType'], string> = {
  'pleno-dominio': 'bg-blue-500',
  'nuda-propiedad': 'bg-indigo-400',
  usufructo: 'bg-amber-400',
}

const SHARE_LABELS: Record<HeirShare['shareType'], string> = {
  'pleno-dominio': 'Pleno dominio',
  'nuda-propiedad': 'Nuda propiedad',
  usufructo: 'Usufructo',
}

type PlenoSegment = { kind: 'pleno'; share: HeirShare }
type PairedSegment = {
  kind: 'paired'
  width: number
  usufructoShares: HeirShare[]
  nudaShares: HeirShare[]
}
type BarSegment = PlenoSegment | PairedSegment

type TooltipRow = {
  shareType: HeirShare['shareType']
  label: string
  fraction: { numerator: number; denominator: number }
  porcentaje: number
}

function buildBarSegments(shares: HeirShare[]): BarSegment[] {
  const usufructoShares = shares.filter(s => s.shareType === 'usufructo')
  const nudaShares = shares.filter(s => s.shareType === 'nuda-propiedad')

  if (usufructoShares.length === 0) {
    return shares
      .filter(s => s.shareType === 'pleno-dominio')
      .map(s => ({ kind: 'pleno', share: s }))
  }

  const width = usufructoShares.reduce((sum, s) => sum + s.porcentaje, 0)
  const paired: PairedSegment = { kind: 'paired', width, usufructoShares, nudaShares }

  const firstUsufructoIdx = shares.findIndex(s => s.shareType === 'usufructo')
  const result: BarSegment[] = []

  for (const s of shares.slice(0, firstUsufructoIdx)) {
    if (s.shareType === 'pleno-dominio') result.push({ kind: 'pleno', share: s })
  }

  result.push(paired)

  for (const s of shares.slice(firstUsufructoIdx)) {
    if (s.shareType === 'pleno-dominio') result.push({ kind: 'pleno', share: s })
  }

  return result
}

function groupByHeir(shares: HeirShare[]): [string, HeirShare[]][] {
  const map = new Map<string, HeirShare[]>()
  for (const share of shares) {
    const existing = map.get(share.label) ?? []
    map.set(share.label, [...existing, share])
  }
  return Array.from(map.entries())
}

interface ResultDiagramProps {
  result: InheritanceResult
}

export function ResultDiagram({ result }: ResultDiagramProps) {
  const [tooltipRows, setTooltipRows] = useState<TooltipRow[] | null>(null)
  const segments = buildBarSegments(result.shares)
  const heirEntries = groupByHeir(result.shares)

  const barAriaLabel = `Reparto de herencia: ${result.shares
    .map(s => `${s.label} ${s.porcentaje.toFixed(1)}% en ${SHARE_LABELS[s.shareType]}`)
    .join(', ')}`

  return (
    <section aria-label="Diagrama de reparto" className="w-full space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Cómo se reparte la herencia</h2>

      <div className="relative">
        {/* Floating tooltip above bar */}
        {tooltipRows && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[13rem] pointer-events-none">
            {tooltipRows.map((row, i) => (
              <div key={i} className="flex items-center gap-2 text-sm py-0.5">
                <span className={`h-3 w-3 flex-shrink-0 rounded-sm ${SHARE_COLORS[row.shareType]}`} aria-hidden="true" />
                <span className="text-gray-800 font-medium">{row.label}</span>
                <span className="ml-auto pl-3 text-gray-500 tabular-nums">
                  {row.fraction.numerator}/{row.fraction.denominator} · {row.porcentaje.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Proportional bar */}
        <div
          className="flex h-14 w-full rounded-lg overflow-hidden shadow-sm ring-1 ring-gray-200"
          role="img"
          aria-label={barAriaLabel}
          onMouseLeave={() => setTooltipRows(null)}
        >
          {segments.map((seg, i) => {
            if (seg.kind === 'pleno') {
              const rows: TooltipRow[] = [{
                shareType: 'pleno-dominio',
                label: seg.share.label,
                fraction: seg.share.fraction,
                porcentaje: seg.share.porcentaje,
              }]
              return (
                <div
                  key={i}
                  className={`${SHARE_COLORS['pleno-dominio']} flex items-center justify-center text-gray-900 text-xs font-semibold cursor-default border-r-2 border-white/40 last:border-r-0 hover:brightness-110 transition-[filter]`}
                  style={{ width: `${seg.share.porcentaje}%` }}
                  onMouseEnter={() => setTooltipRows(rows)}
                >
                  {seg.share.porcentaje >= 10 && `${seg.share.porcentaje.toFixed(0)}%`}
                </div>
              )
            }

            const pairedRows: TooltipRow[] = [
              ...seg.usufructoShares.map(s => ({ shareType: s.shareType, label: s.label, fraction: s.fraction, porcentaje: s.porcentaje })),
              ...seg.nudaShares.map(s => ({ shareType: s.shareType, label: s.label, fraction: s.fraction, porcentaje: s.porcentaje })),
            ]

            return (
              <div
                key={i}
                className="flex flex-col overflow-hidden border-r-2 border-white/40 last:border-r-0 hover:brightness-110 transition-[filter] cursor-default"
                style={{ width: `${seg.width}%` }}
                onMouseEnter={() => setTooltipRows(pairedRows)}
              >
                <div className="flex h-1/2">
                  {seg.usufructoShares.map((s, j) => (
                    <div
                      key={j}
                      className={`${SHARE_COLORS.usufructo} flex items-center justify-center text-gray-900 text-xs font-semibold border-b-2 border-white/40`}
                      style={{ width: `${(s.porcentaje / seg.width) * 100}%` }}
                    >
                      {s.porcentaje >= 5 && `${s.porcentaje.toFixed(0)}%`}
                    </div>
                  ))}
                </div>
                <div className="flex h-1/2">
                  {seg.nudaShares.map((s, j) => (
                    <div
                      key={j}
                      className={`${SHARE_COLORS['nuda-propiedad']} flex items-center justify-center text-gray-900 text-xs font-semibold`}
                      style={{ width: `${(s.porcentaje / seg.width) * 100}%` }}
                    >
                      {s.porcentaje >= 5 && `${s.porcentaje.toFixed(0)}%`}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* One card per heir */}
      <ul className="grid gap-3 sm:grid-cols-2" role="list">
        {heirEntries.map(([heirLabel, shares]) => (
          <li
            key={heirLabel}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="font-semibold text-gray-900 mb-2">{heirLabel}</p>
            <ul className="space-y-1.5">
              {shares.map((share, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span
                    className={`h-3 w-3 flex-shrink-0 rounded-sm ${SHARE_COLORS[share.shareType]}`}
                    aria-hidden="true"
                  />
                  <span className="text-gray-700">{SHARE_LABELS[share.shareType]}</span>
                  <span className="ml-auto text-gray-500 tabular-nums">
                    {share.fraction.numerator}/{share.fraction.denominator} · {share.porcentaje.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* Legend */}
      <div role="group" aria-label="Leyenda" className="flex flex-wrap gap-4 text-sm text-gray-700">
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
