import { calcularReparto } from '@/lib/inheritance-engine/calculator'
import type { InheritanceInput, InheritanceResult } from '@/lib/inheritance-engine/types'

function sumByType(result: InheritanceResult, type: string) {
  return result.shares
    .filter(s => s.shareType === type)
    .reduce((acc, s) => acc + s.porcentaje, 0)
}

describe('calcularReparto', () => {
  describe('término legal correcto', () => {
    it('usa pleno-dominio (no plena-propiedad) para descendientes sin cónyuge', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 2, tieneConyuge: false }

      // Act
      const result = calcularReparto(input)

      // Assert — "plena-propiedad" es incorrecto; el término legal es "pleno-dominio"
      result.shares.forEach(s => {
        expect(s.shareType).toBe('pleno-dominio')
      })
    })

    it('usa pleno-dominio en la parte libre del hijo cuando hay cónyuge', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 1, tieneConyuge: true }

      // Act
      const result = calcularReparto(input)

      // Assert — el hijo tiene pleno-dominio de los 2/3 libres de usufructo
      const pleno = result.shares.filter(s => s.shareType === 'pleno-dominio')
      expect(pleno.length).toBeGreaterThan(0)
    })
  })

  describe('invariantes de reparto', () => {
    it('suma de usufructos == suma de nudas propiedades (1 hijo + cónyuge)', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 1, tieneConyuge: true }

      // Act
      const result = calcularReparto(input)

      // Assert
      expect(sumByType(result, 'usufructo')).toBeCloseTo(sumByType(result, 'nuda-propiedad'), 5)
    })

    it('suma de usufructos == suma de nudas propiedades (3 hijos + cónyuge)', () => {
      const result = calcularReparto({ numDescendientes: 3, tieneConyuge: true })
      expect(sumByType(result, 'usufructo')).toBeCloseTo(sumByType(result, 'nuda-propiedad'), 5)
    })

    it('suma plenos + usufructos == 100% (1 hijo + cónyuge)', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 1, tieneConyuge: true }

      // Act
      const result = calcularReparto(input)

      // Assert
      const total = sumByType(result, 'pleno-dominio') + sumByType(result, 'usufructo')
      expect(total).toBeCloseTo(100, 5)
    })

    it('suma plenos + usufructos == 100% (3 hijos + cónyuge)', () => {
      const result = calcularReparto({ numDescendientes: 3, tieneConyuge: true })
      const total = sumByType(result, 'pleno-dominio') + sumByType(result, 'usufructo')
      expect(total).toBeCloseTo(100, 5)
    })

    it('suma plenos == 100% cuando no hay cónyuge', () => {
      const result = calcularReparto({ numDescendientes: 4, tieneConyuge: false })
      expect(sumByType(result, 'pleno-dominio')).toBeCloseTo(100, 5)
    })
  })

  describe('caso: descendientes con cónyuge viudo', () => {
    it('asigna nuda-propiedad (1/3) y pleno-dominio (2/3) al hijo único, usufructo (1/3) al cónyuge', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 1, tieneConyuge: true }

      // Act
      const result: InheritanceResult = calcularReparto(input)

      // Assert
      expect(result.caso).toBe('descendientes-conyuge')

      const nudaHijo = result.shares.filter(s => s.shareType === 'nuda-propiedad')
      const plenoHijo = result.shares.filter(s => s.shareType === 'pleno-dominio')
      const usufructoConyuge = result.shares.filter(s => s.shareType === 'usufructo')

      expect(nudaHijo).toHaveLength(1)
      expect(plenoHijo).toHaveLength(1)
      expect(usufructoConyuge).toHaveLength(1)

      // Hijo recibe nuda de 1/3 y pleno de 2/3
      expect(nudaHijo[0].porcentaje).toBeCloseTo(100 / 3, 1)
      expect(plenoHijo[0].porcentaje).toBeCloseTo(200 / 3, 1)
      // Cónyuge recibe usufructo de 1/3 (tercio de mejora)
      expect(usufructoConyuge[0].porcentaje).toBeCloseTo(100 / 3, 1)
    })

    it('divide herencia entre 3 hijos con cónyuge — cada hijo recibe nuda (1/9) y pleno (2/9)', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 3, tieneConyuge: true }

      // Act
      const result: InheritanceResult = calcularReparto(input)

      // Assert
      expect(result.caso).toBe('descendientes-conyuge')
      const nudaShares = result.shares.filter(s => s.shareType === 'nuda-propiedad')
      const plenoShares = result.shares.filter(s => s.shareType === 'pleno-dominio')
      const usufructoShares = result.shares.filter(s => s.shareType === 'usufructo')

      expect(nudaShares).toHaveLength(3)
      expect(plenoShares).toHaveLength(3)
      expect(usufructoShares).toHaveLength(1)

      nudaShares.forEach(s => expect(s.porcentaje).toBeCloseTo(100 / 9, 2))
      plenoShares.forEach(s => expect(s.porcentaje).toBeCloseTo(200 / 9, 2))
      expect(usufructoShares[0].porcentaje).toBeCloseTo(100 / 3, 1)
    })

    it('fracciones correctas: 1 hijo tiene nuda 1/3 y pleno 2/3', () => {
      const result = calcularReparto({ numDescendientes: 1, tieneConyuge: true })
      const nuda = result.shares.find(s => s.shareType === 'nuda-propiedad')!
      const pleno = result.shares.find(s => s.shareType === 'pleno-dominio')!
      expect(nuda.fraction).toEqual({ numerator: 1, denominator: 3 })
      expect(pleno.fraction).toEqual({ numerator: 2, denominator: 3 })
    })
  })

  describe('caso: descendientes sin cónyuge', () => {
    it('reparte pleno dominio a partes iguales entre 4 hijos', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 4, tieneConyuge: false }

      // Act
      const result = calcularReparto(input)

      // Assert
      expect(result.caso).toBe('descendientes-sin-conyuge')
      expect(result.shares).toHaveLength(4)
      result.shares.forEach(s => {
        expect(s.shareType).toBe('pleno-dominio')
        expect(s.porcentaje).toBeCloseTo(25, 1)
      })
    })

    it('reparte pleno dominio a partes iguales entre 1 hijo', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 1, tieneConyuge: false }

      // Act
      const result = calcularReparto(input)

      // Assert
      expect(result.caso).toBe('descendientes-sin-conyuge')
      expect(result.shares).toHaveLength(1)
      expect(result.shares[0].shareType).toBe('pleno-dominio')
      expect(result.shares[0].porcentaje).toBeCloseTo(100, 1)
    })
  })

  describe('caso: cónyuge viudo sin descendientes', () => {
    it('asigna usufructo universal al cónyuge', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 0, tieneConyuge: true }

      // Act
      const result = calcularReparto(input)

      // Assert
      expect(result.caso).toBe('conyuge-sin-descendientes')
      expect(result.shares).toHaveLength(1)
      expect(result.shares[0].shareType).toBe('usufructo')
      expect(result.shares[0].porcentaje).toBeCloseTo(100, 1)
    })
  })

  describe('caso: copropiedad previa', () => {
    it('sin cónyuge: reparte pleno dominio proporcional al coeficiente', () => {
      // Arrange — 2 hijos, sin cónyuge, 50% de la propiedad en la herencia
      const input: InheritanceInput = {
        numDescendientes: 2,
        tieneConyuge: false,
        coeficienteCopropiedad: 0.5,
      }

      // Act
      const result = calcularReparto(input)

      // Assert — cada hijo recibe 25% (50% / 2)
      expect(result.caso).toBe('copropiedad')
      result.shares.forEach(s => {
        expect(s.shareType).toBe('pleno-dominio')
        expect(s.porcentaje).toBeCloseTo(25, 1)
      })
    })

    it('con cónyuge (gananciales): cónyuge recibe pleno dominio de su mitad + usufructo de la herencia', () => {
      // Arrange — 1 hijo, propiedad ganancial al 50%
      // Primero se disuelve la sociedad de gananciales: cónyuge se queda su 50% en pleno dominio.
      // El 50% restante es la herencia: usufructo 1/3 al cónyuge, nuda 1/3 al hijo, pleno 2/3 al hijo.
      const input: InheritanceInput = {
        numDescendientes: 1,
        tieneConyuge: true,
        coeficienteCopropiedad: 0.5,
      }

      // Act
      const result = calcularReparto(input)

      // Assert
      expect(result.caso).toBe('copropiedad')

      // Cónyuge: pleno dominio 50% (gananciales) + usufructo 1/6 (1/3 de 50%)
      const conyugePleno = result.shares.find(
        s => s.shareType === 'pleno-dominio' && s.label.includes('ónyuge'),
      )!
      const conyugeUsufructo = result.shares.find(s => s.shareType === 'usufructo')!
      expect(conyugePleno).toBeDefined()
      expect(conyugePleno.porcentaje).toBeCloseTo(50, 1)
      expect(conyugeUsufructo.porcentaje).toBeCloseTo(100 / 6, 1) // 1/3 × 50% = 1/6

      // Hijo: nuda 1/6 + pleno 1/3 (2/3 × 50%)
      const hijoNuda = result.shares.find(s => s.shareType === 'nuda-propiedad')!
      const hijoPleno = result.shares.find(
        s => s.shareType === 'pleno-dominio' && !s.label.includes('ónyuge'),
      )!
      expect(hijoNuda.porcentaje).toBeCloseTo(100 / 6, 1)
      expect(hijoPleno.porcentaje).toBeCloseTo(100 / 3, 1) // 2/3 × 50% = 1/3

      // Invariante: Σ(usufructo) == Σ(nuda)
      expect(sumByType(result, 'usufructo')).toBeCloseTo(sumByType(result, 'nuda-propiedad'), 5)
      // Invariante: Σ(pleno) + Σ(usufructo) == 100%
      expect(sumByType(result, 'pleno-dominio') + sumByType(result, 'usufructo')).toBeCloseTo(
        100,
        5,
      )
    })
  })

  describe('validación de entrada', () => {
    it('lanza error si numDescendientes es negativo', () => {
      const input: InheritanceInput = { numDescendientes: -1, tieneConyuge: false }
      expect(() => calcularReparto(input)).toThrow()
    })

    it('lanza error si no hay herederos (0 descendientes y sin cónyuge)', () => {
      const input: InheritanceInput = { numDescendientes: 0, tieneConyuge: false }
      expect(() => calcularReparto(input)).toThrow()
    })

    it('lanza error si coeficienteCopropiedad está fuera de rango (0,1]', () => {
      const input: InheritanceInput = {
        numDescendientes: 2,
        tieneConyuge: false,
        coeficienteCopropiedad: 1.5,
      }
      expect(() => calcularReparto(input)).toThrow()
    })
  })
})
