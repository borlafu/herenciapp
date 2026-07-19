'use client'

import { useState } from 'react'
import type { InheritanceInput, InheritanceResult } from '@/lib/inheritance-engine/types'
import { calcularReparto } from '@/lib/inheritance-engine/calculator'
import { ResultDiagram } from '@/components/simulator/ResultDiagram'
import { ResultSummary } from '@/components/simulator/ResultSummary'

interface FormState {
  numDescendientes: string
  tieneConyuge: boolean
  coeficienteCopropiedad: string
  tieneCopropiedad: boolean
}

const PRESET_LEGAL: FormState = {
  numDescendientes: '2',
  tieneConyuge: true,
  coeficienteCopropiedad: '50',
  tieneCopropiedad: false,
}

export function SimulatorForm() {
  const [form, setForm] = useState<FormState>(PRESET_LEGAL)
  const [presetActivo, setPresetActivo] = useState(true)
  const [result, setResult] = useState<InheritanceResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const num = parseInt(form.numDescendientes, 10)
    if (isNaN(num) || num < 0 || num > 20) {
      setError('El número de descendientes debe estar entre 0 y 20.')
      return
    }

    const input: InheritanceInput = {
      numDescendientes: num,
      tieneConyuge: form.tieneConyuge,
      ...(form.tieneCopropiedad && {
        coeficienteCopropiedad: parseFloat(form.coeficienteCopropiedad) / 100,
      }),
    }

    try {
      setResult(calcularReparto(input))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido.')
    }
  }

  function handleDesactivarPreset() {
    setPresetActivo(false)
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Simulador de reparto de herencia"
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6"
      >
        <div className="flex flex-wrap items-start gap-3">
          <h2 className="text-2xl font-bold text-gray-900 leading-snug flex-1">
            ¿Cómo se reparte la herencia?
          </h2>
          {presetActivo && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-green-100 border border-green-300 px-3 py-1 text-xs font-semibold text-green-800"
              aria-label="Preset reparto legal activo"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
              Preset legal
            </span>
          )}
        </div>

        {presetActivo ? (
          <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-800 flex items-start gap-3">
            <span className="mt-0.5 text-blue-500" aria-hidden="true">ℹ</span>
            <div className="flex-1">
              <strong className="font-semibold">Reparto legal español</strong> — 2 hijos/as, cónyuge
              viudo/a con usufructo del tercio de mejora. Es el caso más habitual.{' '}
              <button
                type="button"
                className="underline decoration-dotted hover:text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                onClick={handleDesactivarPreset}
                aria-label="Desactivar preset y configurar manualmente"
              >
                Configurar manualmente
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-base">
            Rellena los datos y te explicamos el reparto en lenguaje claro.
          </p>
        )}

        {/* Descendientes */}
        <div className="space-y-1">
          <label htmlFor="numDescendientes" className="block text-base font-medium text-gray-800">
            Número de hijos/as u otros descendientes directos
          </label>
          <input
            id="numDescendientes"
            type="number"
            min={0}
            max={20}
            value={form.numDescendientes}
            onChange={e => setForm(f => ({ ...f, numDescendientes: e.target.value }))}
            className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-lg text-center focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-describedby="numDescendientesHelp"
          />
          <p id="numDescendientesHelp" className="text-sm text-gray-500">
            Pon 0 si no hay hijos ni nietos herederos.
          </p>
        </div>

        {/* Cónyuge */}
        <div className="flex items-center gap-3">
          <input
            id="tieneConyuge"
            type="checkbox"
            checked={form.tieneConyuge}
            onChange={e => setForm(f => ({ ...f, tieneConyuge: e.target.checked }))}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="tieneConyuge" className="text-base font-medium text-gray-800">
            Hay cónyuge viudo/a
          </label>
        </div>

        {/* Copropiedad */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              id="tieneCopropiedad"
              type="checkbox"
              checked={form.tieneCopropiedad}
              onChange={e => setForm(f => ({ ...f, tieneCopropiedad: e.target.checked }))}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="tieneCopropiedad" className="text-base font-medium text-gray-800">
              El bien era de copropiedad previa
            </label>
          </div>
          {form.tieneCopropiedad && (
            <div className="ml-8 space-y-1">
              <label htmlFor="coeficienteCopropiedad" className="block text-sm font-medium text-gray-700">
                Porcentaje que pertenecía al fallecido (%)
              </label>
              <input
                id="coeficienteCopropiedad"
                type="number"
                min={1}
                max={100}
                value={form.coeficienteCopropiedad}
                onChange={e => setForm(f => ({ ...f, coeficienteCopropiedad: e.target.value }))}
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-lg text-center focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="min-h-[44px] w-full rounded-xl bg-blue-700 px-6 py-3 text-base font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Ver el reparto
        </button>
      </form>

      <div aria-live="polite" aria-atomic="true">
        {result && (
          <div className="space-y-6">
            <ResultSummary result={result} />
            <ResultDiagram result={result} />
          </div>
        )}
      </div>
    </div>
  )
}
