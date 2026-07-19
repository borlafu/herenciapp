# ROADMAP.md

## Fase 1 — MVP (sin backend propio)

**Objetivo:** validar que el usuario entiende el reparto y que existe demanda real de leads por parte de notarías/despachos.

- Simulador de reparto con preset "legal" por defecto.
- Diagrama visual + explicación textual en lenguaje llano.
- Glosario de términos.
- Ads display no intrusivos.
- Formulario de captura de leads vía servicio externo (Formspree/Formcarry).
- SEO vía landings estáticas por caso típico.

**Criterio de salida de fase:** tráfico orgánico estable, primeros leads generados, feedback positivo de usuabilidad con usuarios mayores.

## Fase 2 — Backend ligero + panel de partners

**Se activa cuando:** el volumen de leads no es gestionable manualmente, o se necesita un panel para partners.

- API Gateway + Lambda + DynamoDB para leads y partners.
- Cognito para autenticación de partners.
- Matching básico por provincia/especialidad vía EventBridge.
- Notificaciones automáticas a partners (SNS/SES).

## Fase 3 — Marketplace + facturación

**Se activa cuando:** hay varios partners pagando y se necesita automatizar el cobro.

- Integración con Stripe Billing/Connect.
- Dashboard de métricas de conversión por partner.
- Posible migración/ampliación a Aurora Serverless si el modelo relacional lo justifica.

## Fase 4 — Cuentas de usuario y servicios premium

**Se activa cuando:** hay demanda recurrente de guardar simulaciones o de servicios adicionales.

- Cognito para usuarios finales.
- Persistencia de simulaciones.
- Servicios premium de pago (informes, consulta con abogado).

## Principio general de evolución

Nunca se adelanta infraestructura de una fase posterior sin que se cumplan los criterios de activación definidos en `ARCHITECTURE.md`. Cada paso de fase debe registrarse como un ADR (Architecture Decision Record) breve dentro de `ARCHITECTURE.md`, sección 10.
