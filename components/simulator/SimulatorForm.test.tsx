import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SimulatorForm } from './SimulatorForm'

describe('SimulatorForm', () => {
  it('renders with default values', () => {
    render(<SimulatorForm />)
    expect(screen.getByRole('form', { name: /simulador/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/número de hijos/i)).toHaveValue(2)
    expect(screen.getByLabelText(/cónyuge viudo/i)).toBeChecked()
    expect(screen.getByLabelText(/bien era de copropiedad/i)).not.toBeChecked()
  })

  it('submits form and shows result with default inputs', async () => {
    const user = userEvent.setup()
    render(<SimulatorForm />)

    await user.click(screen.getByRole('button', { name: /ver el reparto/i }))

    expect(screen.getByRole('region', { name: /resumen del reparto/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /diagrama de reparto/i })).toBeInTheDocument()
  })

  it('calls calcularReparto with 0 descendientes and cónyuge', async () => {
    const user = userEvent.setup()
    render(<SimulatorForm />)

    const numInput = screen.getByLabelText(/número de hijos/i)
    await user.clear(numInput)
    await user.type(numInput, '0')

    await user.click(screen.getByRole('button', { name: /ver el reparto/i }))

    const summary = screen.getByRole('region', { name: /resumen del reparto/i })
    expect(within(summary).getByText(/usufructo/i)).toBeInTheDocument()
    expect(within(summary).getByText(/universal/i)).toBeInTheDocument()
  })

  it('shows error for out-of-range descendientes', async () => {
    const user = userEvent.setup()
    render(<SimulatorForm />)

    const numInput = screen.getByLabelText(/número de hijos/i)
    await user.clear(numInput)
    await user.type(numInput, '25')

    await user.click(screen.getByRole('button', { name: /ver el reparto/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/entre 0 y 20/i)
  })

  it('shows copropiedad input when checkbox is checked', async () => {
    const user = userEvent.setup()
    render(<SimulatorForm />)

    const copropiedadCheckbox = screen.getByLabelText(/bien era de copropiedad/i)
    await user.click(copropiedadCheckbox)

    expect(screen.getByLabelText(/porcentaje que pertenecía/i)).toBeInTheDocument()
  })

  it('submits with copropiedad correctly', async () => {
    const user = userEvent.setup()
    render(<SimulatorForm />)

    await user.click(screen.getByLabelText(/bien era de copropiedad/i))

    const coefInput = screen.getByLabelText(/porcentaje que pertenecía/i)
    await user.clear(coefInput)
    await user.type(coefInput, '60')

    await user.click(screen.getByRole('button', { name: /ver el reparto/i }))

    expect(screen.getByRole('region', { name: /resumen del reparto/i })).toBeInTheDocument()
  })

  it('result disappears when form is resubmitted with new values', async () => {
    const user = userEvent.setup()
    render(<SimulatorForm />)

    await user.click(screen.getByRole('button', { name: /ver el reparto/i }))
    expect(screen.getByRole('region', { name: /diagrama de reparto/i })).toBeInTheDocument()

    const numInput = screen.getByLabelText(/número de hijos/i)
    await user.clear(numInput)
    await user.type(numInput, '3')

    await user.click(screen.getByRole('button', { name: /ver el reparto/i }))
    expect(screen.getByRole('region', { name: /diagrama de reparto/i })).toBeInTheDocument()
  })
})
