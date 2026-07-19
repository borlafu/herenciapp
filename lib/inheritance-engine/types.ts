export type ShareType = 'pleno-dominio' | 'nuda-propiedad' | 'usufructo'

export type CasoHerencia =
  | 'descendientes-conyuge'
  | 'descendientes-sin-conyuge'
  | 'conyuge-sin-descendientes'
  | 'copropiedad'

export interface InheritanceInput {
  numDescendientes: number
  tieneConyuge: boolean
  coeficienteCopropiedad?: number
}

export interface HeirShare {
  label: string
  shareType: ShareType
  fraction: {
    numerator: number
    denominator: number
  }
  porcentaje: number
}

export interface InheritanceResult {
  input: InheritanceInput
  shares: HeirShare[]
  caso: CasoHerencia
}
