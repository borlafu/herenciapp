# PRD — Reparto claro de una propiedad heredada

## 1. Resumen del producto

Web app que representa de forma visual y sencilla el reparto de una propiedad entre propietarios plenos, nudos propietarios y usufructuarios. Incluye un preset por defecto de reparto "legal": descendientes a partes iguales como nudos propietarios y usufructo del tercio de mejora para el cónyuge viudo. No sustituye asesoramiento legal.

## 2. Objetivo de negocio

- Ayudar a usuarios no expertos a entender una herencia de forma visual.
- Reducir consultas repetidas por confusión sobre nuda propiedad y usufructo.
- Generar confianza en personas mayores y familiares gestionando una sucesión.
- Monetizar mediante publicidad y partnerships con notarías, despachos y gestorías.

## 3. Público objetivo

- Personas mayores que han heredado o van a heredar.
- Hijos y familiares que gestionan la herencia.
- Usuarios con nivel educativo medio o bajo.
- Asesores/notarios que quieran una herramienta visual de apoyo.

## 4. Problema que resuelve

Confusión habitual entre propiedad plena, nuda propiedad y usufructo; falta de claridad sobre qué recibe cada heredero y el cónyuge viudo.

## 5. Alcance funcional del MVP

- Selección de tipo de reparto, con preset "legal" seleccionado por defecto.
- Entrada de número de hijos/descendientes y existencia de cónyuge viudo.
- Cálculo 100% en el cliente (sin backend) del reparto resultante.
- Visualización del reparto en bloques/diagrama.
- Resumen textual en lenguaje simple.
- Glosario de términos básicos (propiedad, nuda propiedad, usufructo, tercio de mejora).
- Disclaimer legal visible en todo momento.
- Formulario "quiero ayuda profesional" gestionado vía servicio externo de formularios (sin backend propio).
- Anuncios display no intrusivos (AdSense/Ad Manager).

## 6. Casos cubiertos en el MVP

- Descendientes + cónyuge viudo.
- Descendientes sin cónyuge.
- Cónyuge viudo sin descendientes.
- Casos simples de copropiedad previa.

## 7. Fuera de alcance del MVP

- Testamentos complejos, sustituciones, fideicomisos.
- Conflictos entre herederos.
- Liquidación fiscal detallada.
- Cuentas de usuario / guardado de simulaciones.
- Matching automático de leads y facturación a partners.

## 8. Requisitos de UX y accesibilidad

- Lenguaje muy claro, sin tecnicismos sin explicar.
- Una pantalla, una idea; visual primero.
- Tipografía grande, alto contraste, botones amplios (mín. 44x44px).
- Compatible con lector de pantalla, navegación por teclado.
- Ads nunca superpuestos al diagrama de reparto.

## 9. Métricas de éxito del MVP

- Usuario entiende el reparto en menos de 30 segundos (medido por tiempo hasta interacción con el resultado).
- Baja tasa de abandono en la primera pantalla.
- Nº de leads generados vía formulario de "ayuda profesional".
- CTR e ingresos de los ads integrados.

## 10. Evolución posterior (ver ROADMAP.md y ARCHITECTURE.md)

- Fase 2: automatización parcial de leads, panel simple de partners.
- Fase 3: matching automático de leads, facturación, dashboard de partners.
- Fase 4: cuentas de usuario, guardado de simulaciones, servicios premium.

## 11. Riesgos

- Exceso de complejidad jurídica → mitigado limitando alcance y usando lenguaje llano.
- Confusión entre usufructo y propiedad → mitigado mostrando ambos conceptos siempre por separado.
- Expectativas legales del usuario → mitigado con disclaimer visible permanente.
