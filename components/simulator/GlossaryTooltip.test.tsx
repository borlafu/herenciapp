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
    expect(screen.getByRole('definition')).toBeInTheDocument()
    expect(screen.getByRole('definition')).toHaveTextContent(/usar el bien/i)
  })

  it('closes tooltip on second click', async () => {
    const user = userEvent.setup()
    render(<GlossaryTooltip termId="usufructo">usufructo</GlossaryTooltip>)

    const button = screen.getByRole('button', { name: /usufructo/i })
    await user.click(button)
    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'false')
    // definition element stays in DOM (hidden), verify it is not visible
    const definition = document.getElementById('tooltip-usufructo')
    expect(definition).toHaveAttribute('hidden')
  })

  it('closes tooltip on Escape key', async () => {
    const user = userEvent.setup()
    render(<GlossaryTooltip termId="pleno-dominio">pleno dominio</GlossaryTooltip>)

    const button = screen.getByRole('button', { name: /pleno dominio/i })
    await user.click(button)
    expect(screen.getByRole('definition')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(document.getElementById('tooltip-pleno-dominio')).toHaveAttribute('hidden')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('button has aria-controls linking to definition element', async () => {
    const user = userEvent.setup()
    render(<GlossaryTooltip termId="nuda-propiedad">nuda propiedad</GlossaryTooltip>)

    const button = screen.getByRole('button', { name: /nuda propiedad/i })
    await user.click(button)

    const controlsId = button.getAttribute('aria-controls')
    expect(controlsId).toBeTruthy()
    const definition = document.getElementById(controlsId!)
    expect(definition).toBeInTheDocument()
  })

  it('shows term label in definition', async () => {
    const user = userEvent.setup()
    render(<GlossaryTooltip termId="legitima">legítima</GlossaryTooltip>)

    await user.click(screen.getByRole('button', { name: /legítima/i }))
    expect(screen.getByRole('definition')).toHaveTextContent(/Legítima/i)
  })
})
