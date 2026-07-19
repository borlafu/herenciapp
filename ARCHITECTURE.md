# ARCHITECTURE.md

## 1. Principio rector

El MVP se construye **sin backend propio**. El motor de cálculo del reparto es lógica pura ejecutada en el cliente. Se introduce backend únicamente cuando se cumplan criterios explícitos de una fase posterior (ver sección 4).

## 2. Arquitectura del MVP (Fase 1)

```
Usuario → CloudFront (CDN) → S3 (sitio estático SSG: Astro/Next.js)
                              └─ Motor de cálculo (TypeScript, cliente)
                              └─ Diagrama de reparto (Canvas/SVG, cliente)
                              └─ Ads (AdSense/Ad Manager, tags JS de terceros)
                              └─ Formulario de leads → Formspree/Formcarry (externo)
```

- **Frontend:** Astro o Next.js en modo SSG (Static Site Generation). TypeScript estricto.
- **Motor de cálculo (`inheritance-engine`):** módulo TypeScript aislado, testeado, sin dependencias externas, ejecutado 100% en el navegador.
- **Hosting:** Amazon S3 (bucket privado) + CloudFront (distribución con OAC) + Route 53 (DNS) + ACM (certificado TLS).
- **Leads:** formulario HTML que envía a un servicio externo (Formspree o Formcarry), GDPR-compliant por diseño, sin backend propio.
- **Ads:** integración directa de tags de AdSense/Ad Manager en el HTML estático, respetando el CMP de consentimiento.
- **Infraestructura como código:** AWS CDK (TypeScript), un único stack `WebAppStack` con bucket S3, distribución CloudFront, y configuración de dominio.
- **CI/CD:** GitHub Actions — build del sitio estático, tests del motor de cálculo, `cdk synth`/`diff`/`deploy`.

### Justificación de "sin backend"

El cálculo del reparto es una función determinista basada en reglas legales fijas (nº de descendientes, existencia de cónyuge). No requiere datos externos, autenticación, ni persistencia server-side. Toda la lógica puede y debe vivir en el cliente para minimizar coste, complejidad y superficie de ataque.

## 3. Criterios de paso a Fase 2 (backend ligero)

Se introduce backend (AWS Lambda + API Gateway) **solo si se cumple al menos uno**:

- Se necesita un panel de partners (notarías/despachos) con autenticación para ver y gestionar leads.
- El volumen de leads supera lo gestionable manualmente vía email/hoja de cálculo.
- Se requiere matching automático de leads por provincia/especialidad.
- Se necesita facturación automatizada (Stripe) ligada a leads o suscripciones.

## 4. Arquitectura Fase 2 — Backend ligero + panel de partners

```
Usuario → CloudFront → S3 (frontend estático, sin cambios)
Partner → CloudFront → S3 (portal de partners, SPA separada o ruta protegida)
                     → API Gateway (HTTP API) → Lambda (lead-service, matching-service)
                                                → DynamoDB (Leads, Partners)
                                                → Cognito (autenticación de partners)
                     → EventBridge (evento: nuevo lead) → Lambda (matching) → SNS/SES (notificación al partner)
```

- **Autenticación de partners:** Amazon Cognito (User Pool).
- **Datos:** DynamoDB single-table (`TENANT#<partnerId>` como partition key) para Leads y Partners.
- **Matching:** función Lambda desencadenada por EventBridge al recibir un nuevo lead; reglas simples (provincia + especialidad).
- **Notificaciones:** Amazon SNS o SES para avisar al partner de un nuevo lead.
- **Todo definido en CDK**, como stacks adicionales (`ApiStack`, `AuthStack`, `DataStack`) desplegados junto al `WebAppStack` existente.

## 5. Criterios de paso a Fase 3 (marketplace + facturación)

- Más de un puñado de partners activos pagando.
- Necesidad de cobro automático por lead o suscripción.
- Necesidad de métricas de conversión por partner.

### Arquitectura Fase 3 (incremental sobre Fase 2)

- **Stripe Billing / Stripe Connect** integrado vía Lambda (webhooks en API Gateway).
- **Aurora Serverless v2 (Postgres)** si el modelo relacional de facturación y reporting supera lo que DynamoDB gestiona cómodamente; o se mantiene DynamoDB si el volumen no lo justifica (decisión a validar en su momento, no antes).
- **Dashboard de partners** con métricas de leads/conversión (mismo frontend, ampliado).
- **Athena o QuickSight** sobre datos exportados a S3 para analítica agregada, si se necesita reporting avanzado.

## 6. Criterios de paso a Fase 4 (cuentas de usuario)

- Usuarios solicitan de forma recurrente guardar simulaciones o recibir seguimiento.
- Se decide ofrecer servicios premium (informes descargables, consulta con abogado).

### Cambios de Fase 4

- **Cognito** también para usuarios finales (no solo partners).
- Persistencia de simulaciones en DynamoDB, asociadas a `userId`.
- Posible capa de pagos para servicios premium (Stripe Checkout).

## 7. Entornos y despliegue

- Entornos: `dev`, `staging`, `prod`, cada uno como stack CDK independiente parametrizado por contexto (`cdk.json` / variables de entorno).
- Despliegue automático a `dev` en cada merge a `main`.
- Despliegue a `staging` y `prod` mediante GitHub Actions con aprobación manual (GitHub Environments con protección).
- `cdk diff` obligatorio y visible en cada PR que toque `/infra`.

## 8. Seguridad y cumplimiento

- **MVP:** sin datos personales gestionados directamente (los leads los procesa el servicio externo GDPR-compliant). CMP para consentimiento de cookies/ads.
- **Fase 2+:** cifrado en reposo (KMS) para DynamoDB/Aurora, WAF delante de API Gateway, consentimiento explícito y separado antes de compartir datos de contacto con partners.
- Principio de mínimo dato: nunca capturar más información personal de la estrictamente necesaria para generar el lead.

## 9. Observabilidad

- **MVP:** analítica de uso vía herramienta de analítica web (respetuosa con privacidad, ej. Plausible/GA4 detrás del CMP) + métricas de ads del propio proveedor.
- **Fase 2+:** CloudWatch Logs/Metrics, X-Ray para trazabilidad de Lambdas, alarmas básicas de error rate y latencia.

## 10. Resumen de decisiones de arquitectura (ADR resumidos)

| Decisión | Alternativa considerada | Motivo |
|---|---|---|
| Sin backend en MVP | Lambda + API desde el inicio | Minimizar coste/complejidad; el cálculo no lo requiere |
| Servicio externo de formularios para leads | Backend propio de leads | Evitar construir infraestructura antes de validar demanda |
| CDK (TypeScript) | Terraform | Coherencia de lenguaje con el resto del stack, mismo repositorio |
| S3 + CloudFront | Vercel/Netlify | Control total de infraestructura vía CDK, coherente con el resto de fases en AWS |
| DynamoDB en Fase 2 | Aurora desde el inicio | Menor coste operativo, suficiente para el volumen inicial de leads |
