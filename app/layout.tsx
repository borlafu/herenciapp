import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Disclaimer from '@/components/layout/Disclaimer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Herenciapp — Entiende tu herencia en minutos',
  description:
    'Calcula y visualiza cómo se reparte una propiedad heredada entre hijos, nudos propietarios y el cónyuge viudo. Gratis, sin registro y en lenguaje claro.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <main className="flex-1">{children}</main>
        <Disclaimer />
      </body>
    </html>
  )
}
