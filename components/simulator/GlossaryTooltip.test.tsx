import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GlossaryTooltip } from './GlossaryTooltip'

describe('GlossaryTooltip', () => {
  it('renders children as button when term exists', () => {
    render(<GlossaryTooltip termId="pleno-dominio">pleno dominio</GlossaryTooltip>)
    expect(screen.getByRole('button', { name: /pleno dominio/i })).toBeInTheDocument()
  })

  it('renders children as plain span when term does not exist', () => {
    render(<GlossaryTooltip termId="inexistente">texto</GlossaryTooltip>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('texto')).toBeInTheDocument()
  })

  it('tooltip is hidden by default (aria-expanded false)', () => {
    render(<GlossaryTooltip termId="usufructo">usufructo</GlossaryTooltip>)
    const button = screen.getByRole('button', { name: /usufructo/i })
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens tooltip on click and sets aria-expanded true', async () => {
    const user = userEvent.setup()
    render(<GlossaryTooltip termId="usufructo">usufructo</GlossaryTooltip>)

    const button = screen.getByRole('button', { name: /usufructo/i })
    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    expect(screen.getByRole('tooltip')).toHaveTextContent(/usar el bien/i)
  })

  it('closes tooltip on second click', async () => {
    const user = userEvent.setup()
    render(<GlossaryTooltip termId="usufructo">usufructo</GlossaryTooltip>)

    const button = screen.getByRole('button', { name: /usufructo/i })
    await user.click(button)
    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('closes tooltip on Escape key', async () => {
    const user = userEvent.setup()
    render(<GlossaryTooltip termId="pleno-dominio">pleno dominio</GlossaryTooltip>)

    const button = screen.getByRole('button', { name: /pleno dominio/i })
    await user.click(button)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('tooltip has aria-describedby linking button to tooltip', async () => {
    const user = userEvent.setup()
    render(<GlossaryTooltip termId="nuda-propiedad">nuda propiedad</GlossaryTooltip>)

    const button = screen.getByRole('button', { name: /nuda propiedad/i })
    await user.click(button)

    const tooltipId = button.getAttribute('aria-describedby')
    expect(tooltipId).toBeTruthy()
    const tooltip = document.getElementById(tooltipId!)
    expect(tooltip).toBeInTheDocument()
  })

  it('shows term label in tooltip', async () => {
    const user = userEvent.setup()
    render(<GlossaryTooltip termId="legitima">legítima</GlossaryTooltip>)

    await user.click(screen.getByRole('button', { name: /legítima/i }))
    expect(screen.getByRole('tooltip')).toHaveTextContent(/Legítima/i)
  })
})
