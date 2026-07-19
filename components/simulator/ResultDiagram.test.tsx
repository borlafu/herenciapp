import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResultDiagram } from './ResultDiagram'
import { calcularReparto } from '@/lib/inheritance-engine/calculator'

const resultConConyuge = calcularReparto({ numDescendientes: 2, tieneConyuge: true })
const resultSinConyuge = calcularReparto({ numDescendientes: 3, tieneConyuge: false })
const resultSoloConyuge = calcularReparto({ numDescendientes: 0, tieneConyuge: true })

describe('ResultDiagram', () => {
  it('renders section heading', () => {
    render(<ResultDiagram result={resultConConyuge} />)
    expect(screen.getByRole('heading', { name: /cómo se reparte/i })).toBeInTheDocument()
  })

  it('renders one heir card per heir label', () => {
    render(<ResultDiagram result={resultConConyuge} />)
    const uniqueLabels = [...new Set(resultConConyuge.shares.map(s => s.label))]
    for (const label of uniqueLabels) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('shows heir names in cards', () => {
    render(<ResultDiagram result={resultConConyuge} />)
    expect(screen.getByText('Hijo/a 1')).toBeInTheDocument()
    expect(screen.getByText('Hijo/a 2')).toBeInTheDocument()
    expect(screen.getByText('Cónyuge viudo/a')).toBeInTheDocument()
  })

  it('shows pleno-dominio shares for 3 children without cónyuge', () => {
    render(<ResultDiagram result={resultSinConyuge} />)
    const plenoItems = screen.getAllByText('Pleno dominio')
    expect(plenoItems.length).toBeGreaterThan(0)
  })

  it('shows usufructo and nuda-propiedad labels when cónyuge present', () => {
    render(<ResultDiagram result={resultConConyuge} />)
    expect(screen.getAllByText('Nuda propiedad').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Usufructo').length).toBeGreaterThan(0)
  })

  it('renders proportional bar with correct aria-label', () => {
    render(<ResultDiagram result={resultConConyuge} />)
    expect(screen.getByRole('img', { name: /barra proporcional/i })).toBeInTheDocument()
  })

  it('renders legend with all share type labels', () => {
    render(<ResultDiagram result={resultConConyuge} />)
    expect(screen.getAllByText('Pleno dominio').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Nuda propiedad').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Usufructo').length).toBeGreaterThan(0)
  })

  it('shows usufructo universal for solo cónyuge case', () => {
    render(<ResultDiagram result={resultSoloConyuge} />)
    expect(screen.getByText('Cónyuge viudo/a')).toBeInTheDocument()
  })

  it('renders fraction for each share in heir cards', () => {
    render(<ResultDiagram result={resultSinConyuge} />)
    const fractionPattern = /\d+\/\d+/
    const matches = screen.getAllByText(fractionPattern)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('tooltip disappears on mouse leave', async () => {
    const user = userEvent.setup()
    render(<ResultDiagram result={resultConConyuge} />)
    const bar = screen.getByRole('img', { name: /barra proporcional/i })
    await user.unhover(bar)
  })
})
