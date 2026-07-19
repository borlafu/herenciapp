export interface GlossaryTerm {
  id: string
  label: string
  definition: string
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'pleno-dominio',
    label: 'Pleno dominio',
    definition:
      'Ser dueño/a completo del bien: puedes usarlo, obtener rentas y venderlo libremente.',
  },
  {
    id: 'nuda-propiedad',
    label: 'Nuda propiedad',
    definition:
      'Ser dueño/a del bien "en papel", pero sin poder usarlo ni obtener rentas mientras viva el/la usufructuario/a.',
  },
  {
    id: 'usufructo',
    label: 'Usufructo',
    definition:
      'Derecho a usar el bien y obtener sus rentas (por ejemplo, alquilarlo) durante toda la vida, aunque no seas el dueño/a.',
  },
  {
    id: 'tercio-mejora',
    label: 'Tercio de mejora',
    definition:
      'Una de las tres partes en que se divide la herencia con descendientes. La ley la reserva para mejorar a algún hijo/a o al cónyuge viudo/a.',
  },
  {
    id: 'legitima',
    label: 'Legítima',
    definition:
      'Parte mínima de la herencia que la ley reserva obligatoriamente a los hijos/as. No puede quitarse en testamento.',
  },
]

export function findTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find(t => t.id === id)
}
