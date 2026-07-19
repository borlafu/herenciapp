import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SimulatorForm } from './SimulatorForm'

describe('SimulatorForm — preset reparto legal', () => {
  it('shows "Preset legal" badge on initial render', () => {
    render(<SimulatorForm />)
    expect(screen.getByLabelText('Preset reparto legal activo')).toBeInTheDocument()
  })

  it('shows preset info banner with "Reparto legal español" text', () => {
    render(<SimulatorForm />)
    expect(screen.getByText(/reparto legal español/i)).toBeInTheDocument()
  })

  it('shows "Configurar manualmente" button when preset is active', () => {
    render(<SimulatorForm />)
    expect(
      screen.getByRole('button', { name: /configurar manualmente/i }),
    ).toBeInTheDocument()
  })

  it('hides preset badge and banner after clicking "Configurar manualmente"', async () => {
    const user = userEvent.setup()
    render(<SimulatorForm />)

    await user.click(screen.getByRole('button', { name: /configurar manualmente/i }))

    expect(screen.queryByLabelText('Preset reparto legal activo')).not.toBeInTheDocument()
    expect(screen.queryByText(/reparto legal español/i)).not.toBeInTheDocument()
  })

  it('preserves form values after deactivating preset', async () => {
    const user = userEvent.setup()
    render(<SimulatorForm />)

    await user.click(screen.getByRole('button', { name: /configurar manualmente/i }))

    expect(screen.getByLabelText(/número de hijos/i)).toHaveValue(2)
    expect(screen.getByLabelText(/cónyuge viudo/i)).toBeChecked()
  })

  it('loads with 2 descendants and cónyuge checked by default', () => {
    render(<SimulatorForm />)
    expect(screen.getByLabelText(/número de hijos/i)).toHaveValue(2)
    expect(screen.getByLabelText(/cónyuge viudo/i)).toBeChecked()
  })

  it('shows plain description text after deactivating preset', async () => {
    const user = userEvent.setup()
    render(<SimulatorForm />)

    await user.click(screen.getByRole('button', { name: /configurar manualmente/i }))

    expect(screen.getByText(/rellena los datos/i)).toBeInTheDocument()
  })
})
