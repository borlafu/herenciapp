import { SimulatorForm } from '@/components/simulator/SimulatorForm'
import { LeadForm } from '@/components/layout/LeadForm'

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
          ¿Cómo se reparte una herencia?
        </h1>
        <p className="text-gray-600 text-base">
          Introduce los datos básicos y te explicamos el reparto en lenguaje sencillo, con un
          diagrama visual.
        </p>
      </header>

      <SimulatorForm />

      <hr className="border-gray-200" />

      <LeadForm />
    </div>
  )
}
