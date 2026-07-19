import { calcularReparto } from '@/lib/inheritance-engine/calculator'
import type { InheritanceInput, InheritanceResult } from '@/lib/inheritance-engine/types'

describe('calcularReparto', () => {
  describe('caso: descendientes con cónyuge viudo', () => {
    it('divide herencia entre 3 hijos como nudos propietarios y usufructo del tercio de mejora al cónyuge', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 3, tieneConyuge: true }

      // Act
      const result: InheritanceResult = calcularReparto(input)

      // Assert
      expect(result.caso).toBe('descendientes-conyuge')
      const nudaShares = result.shares.filter(s => s.shareType === 'nuda-propiedad')
      const usufructoShares = result.shares.filter(s => s.shareType === 'usufructo')
      expect(nudaShares).toHaveLength(3)
      expect(usufructoShares).toHaveLength(1)
      nudaShares.forEach(s => {
        expect(s.porcentaje).toBeCloseTo(100 / 3, 1)
      })
      expect(usufructoShares[0].porcentaje).toBeCloseTo(100 / 3, 1)
    })

    it('divide herencia entre 2 hijos como nudos propietarios con cónyuge', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 2, tieneConyuge: true }

      // Act
      const result = calcularReparto(input)

      // Assert
      expect(result.caso).toBe('descendientes-conyuge')
      const nudaShares = result.shares.filter(s => s.shareType === 'nuda-propiedad')
      expect(nudaShares).toHaveLength(2)
      nudaShares.forEach(s => {
        expect(s.porcentaje).toBeCloseTo(50, 1)
      })
    })
  })

  describe('caso: descendientes sin cónyuge', () => {
    it('reparte propiedad plena a partes iguales entre 4 hijos', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 4, tieneConyuge: false }

      // Act
      const result = calcularReparto(input)

      // Assert
      expect(result.caso).toBe('descendientes-sin-conyuge')
      expect(result.shares).toHaveLength(4)
      result.shares.forEach(s => {
        expect(s.shareType).toBe('plena-propiedad')
        expect(s.porcentaje).toBeCloseTo(25, 1)
      })
    })

    it('reparte propiedad plena a partes iguales entre 1 hijo', () => {
      // Arrange
      const input: InheritanceInput = { numDescendientes: 1, tieneConyuge: false }

      // Act
      const result = calcularReparto(input)

      // Assert
      expect(result.caso).toBe('descendientes-sin-conyuge')
      expect(result.shares).toHaveLength(1)
      expect(result.shares[0].shareType).toBe('plena-propiedad')
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
    it('aplica coeficiente de copropiedad sobre el reparto', () => {
      // Arrange
      const input: InheritanceInput = {
        numDescendientes: 2,
        tieneConyuge: false,
        coeficienteCopropiedad: 0.5,
      }

      // Act
      const result = calcularReparto(input)

      // Assert
      expect(result.caso).toBe('copropiedad')
      result.shares.forEach(s => {
        expect(s.porcentaje).toBeCloseTo(25, 1)
      })
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
