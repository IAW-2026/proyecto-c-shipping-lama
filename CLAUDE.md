@AGENTS.md
@ENUNCIADO.md

# Lama Shipping App — Contexto del proyecto

## Proyecto académico

- **Materia:** Ingeniería de Aplicaciones Web 2026 (IAW)
- **Tipo:** C — Marketplace (estilo Mercado Libre)
- **Marca:** lama
- **Equipo:** 4 integrantes → 4 apps (sin Feedback App)
- **Esta app:** Shipping App — la hace Maximiliano

## Ecosistema completo (Tipo C, 4 integrantes)

| App | Responsable | Descripción |
|---|---|---|
| **Buyer App** | otro integrante | Búsqueda, carrito, seguimiento de compras |
| **Seller App** | otro integrante | Publicación de productos, gestión de ventas |
| **Shipping App** | **Maximiliano** | Panel de operadores logísticos (este repo) |
| **Payments App** | otro integrante | Cobros, acreditaciones, historial |

En Etapa 2 las llamadas inter-apps van a **mocks** — `SimularPedidoModal` simula que Seller App llama a `POST /api/envios`, y `SimularPagoModal` simula que Payments App llama a `PATCH /api/envios/orden/[id]/liquidacion-logistico`.

## Etapas y fechas

| Etapa | Entrega | Defensa | Estado |
|---|---|---|---|
| 1 — Planificación | 27 Abr 2026 | 30 Abr 2026 | ✅ Entregada |
| 2 — Implementación individual | 28 May 2026 | 1 y 4 Jun 2026 | 🔄 En curso |
| 3 — Integración + Control Plane + Analytics | 25 Jun 2026 | 29 Jun y 2 Jul 2026 | ⏳ Próxima |

## Requisitos Etapa 2 (checklist)

- ✅ Páginas y componentes reutilizables (Next.js App Router)
- ✅ API REST propia con endpoints documentados
- ✅ Base de datos PostgreSQL propia (Prisma)
- ✅ Autenticación con Clerk (login/logout)
- ✅ Panel de administración (dashboard con tabla, búsqueda, paginación)
- ✅ Búsqueda y paginación con parámetros en URL
- ✅ Consumo de API externa (notificaciones a Seller App y Payments App)
- ⚠️ Manejo de errores — revisar si hay página 404 y error boundaries
- ⚠️ Validación de formularios del lado del servidor — revisar en POST /api/envios y PATCHs
- ⚠️ Accesibilidad — buenas prácticas básicas (aria-labels, semántica)
- ⚠️ Datos precargados en producción para la defensa (envíos en distintos estados)

## Etapa 3 — qué cambiará (para tener en mente)

1. Reemplazar los modales mock por llamadas reales a Seller App y Payments App
2. `SELLER_APP_URL` y `PAYMENTS_APP_URL` en `.env` apuntarán a los deploys reales de los compañeros
3. Las rutas mock en `/api/mock/` posiblemente queden en desuso o como fallback
4. El flujo integrado esperado: Buyer App compra → Seller App despacha → **Shipping App gestiona** → Payments App acredita

---

## Stack

| Tecnología | Versión | Notas |
|---|---|---|
| Next.js | 16.2.4 | App Router — APIs pueden diferir del entrenamiento. Leer `node_modules/next/dist/docs/` ante dudas |
| React | 19.2.4 | |
| Prisma | 7.8.0 | Con `@prisma/adapter-pg` (PostgreSQL) |
| Clerk | 7.3.4 | Auth completo. Webhook en `/api/webhooks/clerk` crea `UsuarioLogistico` |
| Tailwind | v4 | Solo en landing (`app/page.tsx`). Dashboard usa CSS Modules |
| TypeScript | v5 | |

## Estructura de rutas

```
/                          → app/page.tsx (landing, "use client", Tailwind)
/dashboard                 → app/dashboard/(overview)/page.tsx (Server Component, CSS Modules)
/dashboard/envios/[id]     → app/dashboard/envios/[envio_id]/page.tsx
/sign-in, /sign-up         → Clerk catch-all pages
```

## API endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/envios` | No | Crear envío (simula Seller App) |
| PATCH | `/api/envios/[envio_id]/estado` | Sí | Cambiar estado (solo operador asignado) |
| PATCH | `/api/envios/[envio_id]/reclamar` | Sí | Asignarse un envío sin operador |
| GET | `/api/envios/orden/[orden_id]` | No | Consultar envío por orden (para Seller App) |
| PATCH | `/api/envios/orden/[orden_id]/liquidacion-logistico` | No | Registrar pago (simula Payments App) |
| POST | `/api/webhooks/clerk` | Svix | Crea UsuarioLogistico al registrarse un usuario |
| PATCH | `/api/mock/seller/...` | No | Mock respuesta de Seller App |
| POST | `/api/mock/payments/...` | No | Mock respuesta de Payments App |

## Modelos Prisma

**UsuarioLogistico**: `logistico_id` (CUID), `clerk_user_id` (unique), `nombre`, `email`, `empresa_logistica` (default: "lama")

**Envio**: `envio_id`, `orden_id`, `vendedor_id`, `estado_actual`, `direccion_destino`, `codigo_seguimiento` (unique), `logistico_id?`, `estado_liquidacion_logistico` (default: "pendiente"), `fecha_liquidacion_logistico?`

**HistorialEntrega**: `evento_id`, `envio_id` (FK), `estado`, `fecha`, `descripcion?`, `logistico_id?`

## Estado de envíos (máquina de estados)

```
en_preparacion → en_camino → entregado
       ↓              ↓
   cancelado      cancelado
```

Cada cambio crea un `HistorialEntrega`. Al cambiar estado se notifica a Seller App y Payments App por HTTP.

## Diseño / paleta de colores

Aplicar siempre estos colores — definidos en `globals.css` y `dashboard.module.css`:

- `#8fa18d` — verde principal (nav, acentos)
- `#6b7f6a` — verde oscuro (hover, texto sobre verde)
- `#f6f1e7` — crema claro (fondo hero landing, fondo main dashboard)
- `#ede6d8` — crema oscuro (cards landing)
- `#37413d` — texto oscuro principal
- `#2d2d2d` — texto en modales/componentes
- `#7a7a7a` — texto muted
- `#a8a8a8` — texto light

**Regla**: landing page usa Tailwind con estos valores inline (`bg-[#8fa18d]`). El dashboard usa CSS Modules (`dashboard.module.css` con variables CSS).

## Convenciones importantes

- **Modales** (`SimularPedidoModal`, `SimularPagoModal`): botón trigger con estilo glass para fondo verde (`border-white/30 bg-white/10 text-white/80`). Dentro del modal: inputs con `border-[#8fa18d]/30 focus:ring-[#8fa18d]/40`, botón primario `bg-[#8fa18d] hover:bg-[#6b7f6a]`.
- **Logo "lama"**: siempre letra por letra en `<span>` para la animación hover (ver `home.module.css .texto` y `dashboard.module.css .topBarLetter`).
- **SearchBar**: debounce 400ms, soporta búsqueda por código seguimiento, dirección, envio_id y fecha `YYYY-MM-DD`.
- **Paginación**: 10 envíos por página, máximo 5 botones visibles.
- **Skeleton loading**: `<ShipmentsTable envios={[]} isLoading />` mientras carga la tabla.
- `lib/prisma.ts` exporta el singleton de PrismaClient.
- `lib/calcularFechaEntrega.ts` calcula entrega: 24h hábiles para Bahía Blanca, 72h para el resto.

## Variables de entorno clave

```
DATABASE_URL              # PostgreSQL con pgbouncer
DATABASE_URL_UNPOOLED     # Sin pgbouncer (migraciones)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
WEBHOOK_SECRET            # Para validar webhooks de Clerk via Svix
SELLER_APP_URL            # Para notificar cambios de estado
PAYMENTS_APP_URL          # Para liberar pagos
```

## Comandos

```bash
pnpm dev          # Desarrollo
pnpm build        # Build de producción
pnpm prisma studio # Explorar DB
pnpm prisma migrate dev --name <nombre>  # Nueva migración
```
