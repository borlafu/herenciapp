'use client'

import { useState } from 'react'

export function LeadForm() {
  const [sent, setSent] = useState(false)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!consent) {
      setError('Debes aceptar el tratamiento de tus datos para continuar.')
      return
    }

    const form = e.currentTarget
    const data = new FormData(form)

    const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })

    if (res.ok) {
      setSent(true)
    } else {
      setError('No se pudo enviar el formulario. Inténtalo de nuevo.')
    }
  }

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center text-green-900"
      >
        <p className="text-lg font-semibold">¡Mensaje enviado!</p>
        <p className="mt-1 text-sm">Un profesional se pondrá en contacto contigo pronto.</p>
      </div>
    )
  }

  return (
    <section
      aria-label="Solicitar ayuda profesional"
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-900">¿Quieres ayuda de un profesional?</h2>
      <p className="text-sm text-gray-600">
        Te ponemos en contacto con notarías y despachos especializados en herencias. Sin compromiso.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="lead-nombre" className="block text-sm font-medium text-gray-800">
            Nombre
          </label>
          <input
            id="lead-nombre"
            name="nombre"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="lead-email" className="block text-sm font-medium text-gray-800">
            Correo electrónico
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="lead-telefono" className="block text-sm font-medium text-gray-800">
            Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            id="lead-telefono"
            name="telefono"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            id="lead-consent"
            type="checkbox"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="lead-consent" className="text-sm text-gray-700">
            Acepto que mis datos se utilicen para contactarme con profesionales relacionados con mi
            consulta. Puedo retirar este consentimiento en cualquier momento.
          </label>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="min-h-[44px] w-full rounded-xl bg-gray-900 px-6 py-3 text-base font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Quiero hablar con un profesional
        </button>
      </form>
    </section>
  )
}
