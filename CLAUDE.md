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

En Etapa 2 las llamadas inter-apps van a **mocks** — `SimularPedidoModal` simula que Seller App llama a `POST /api/envios`, y `SimularPagoModal` simula que Payments App llama a `PATCH /api/envios/orden/[id]/liquidacion-logistico`. Ambos modales viven en `/admin`.

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
- ✅ Autenticación con Clerk (login/logout + roles)
- ✅ Panel de administración (dashboard con tabla, búsqueda, paginación)
- ✅ Búsqueda y paginación con parámetros en URL
- ✅ Consumo de API externa (notificaciones a Seller App y Payments App)
- ✅ Manejo de errores — página 404 custom (`app/not-found.tsx`) y error boundary global (`app/error.tsx`)
- ✅ Accesibilidad — aria-label/aria-expanded en dropdown, aria-label en inputs, role="menu/menuitem/alert" en componentes interactivos
- ✅ Datos precargados en producción para la defensa (envíos en distintos estados)

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
| Clerk | 7.3.4 | Auth + roles. Webhook en `/api/webhooks/clerk` crea `UsuarioLogistico` |
| Tailwind | v4 | Solo en landing (`app/page.tsx`) y modales. Dashboard/Admin usan CSS Modules |
| TypeScript | v5 | |

## Roles de usuario (Clerk)

Los roles viven en `publicMetadata.roles` (array) de cada usuario en Clerk. El JWT los expone via **session template** con el claim `roles`.

| Rol | Acceso | Panel |
|---|---|---|
| `logistics` | `/dashboard` | Ve y gestiona solo sus envíos asignados |
| `super_admin` | `/admin` | Ve todos los envíos, asigna operadores |

- **Leer roles server-side**: `const { sessionClaims } = await auth(); const roles = (sessionClaims as { roles?: string[] })?.roles ?? []`
- **Leer roles client-side** (solo para UI, nunca para seguridad): `const { sessionClaims } = useAuth(); const roles = sessionClaims?.roles as string[]`
- El middleware protege las rutas por rol. Cada route handler sensible también verifica por su cuenta.
- `/auth-redirect` es el destino post-login: client component que lee roles y redirige (`super_admin` → `/admin`, `logistics` → `/dashboard`)

## Estructura de rutas

```
/                              → app/page.tsx (landing, "use client", Tailwind)
/auth-redirect                 → app/auth-redirect/page.tsx ("use client", redirige según rol)
/dashboard                     → app/dashboard/(overview)/page.tsx (Server Component, solo logistics)
/dashboard/envios/[id]         → app/dashboard/envios/[envio_id]/page.tsx (historial, verde)
/admin                         → app/admin/page.tsx (Server Component, solo super_admin)
/admin/envios/[id]             → app/admin/envios/[envio_id]/page.tsx (historial, mismo estilo que dashboard)
/sign-in, /sign-up             → Clerk catch-all pages
```

**Reglas de acceso (middleware):**
- `/dashboard/*` → requiere rol `logistics`, redirige a `/` si no
- `/admin/*` → requiere rol `super_admin`, redirige a `/` si no
- `/api/envios(.*)` → público (los route handlers hacen su propia validación)
- `/sso-callback` → ruta **reservada de Clerk** para OAuth, no usar nunca para páginas propias

## API endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/envios` | No | Crear envío (Seller App → Shipping App) |
| PATCH | `/api/envios/[envio_id]/estado` | Sí (logistics) | Cambiar estado — solo operador asignado |
| PATCH | `/api/envios/[envio_id]/asignar` | Sí (super_admin) | Asignar operador a un envío sin operador |
| GET | `/api/envios/orden/[orden_id]` | No | Consultar envío por orden (para Seller App) |
| PATCH | `/api/envios/orden/[orden_id]/liquidacion-logistico` | No | Registrar pago (Payments App → Shipping App) |
| POST | `/api/webhooks/clerk` | Svix | Crea UsuarioLogistico al registrarse un usuario |
| PATCH | `/api/mock/seller/...` | No | Mock respuesta de Seller App |
| POST | `/api/mock/payments/...` | No | Mock respuesta de Payments App |

**Eliminado:** `PATCH /api/envios/[envio_id]/reclamar` — ya no existe. Los operadores no pueden auto-asignarse envíos; el admin los asigna.

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

Cada cambio crea un `HistorialEntrega`. Al cambiar estado se notifica a Seller App y Payments App por HTTP. Las respuestas de esas notificaciones se retornan en el response del PATCH y se muestran como **toast notifications** en el dashboard.

## Diseño / paletas de colores

### Dashboard logístico — paleta verde
Definida en `dashboard.module.css`:
- `#8fa18d` — verde (nav, acentos)
- `#6b7f6a` — verde oscuro (hover)
- `#f6f1e7` — crema claro (fondo main)
- `#37413d` — texto oscuro

### Panel admin — paleta indigo/violeta
Definida en `admin.module.css` (variables `--admin-*`):
- `#1e1b4b` — indigo muy oscuro (nav)
- `#7c3aed` — violeta (accent)
- `#ede9fe` — violeta suave (accent-soft, fondos de badges)
- `#f5f3ff` — lavanda muy claro (fondo main)

**Regla**: landing page usa Tailwind inline. Dashboard y Admin usan CSS Modules. Los modales usan Tailwind con colores brand verde (`#8fa18d`).

## Convenciones importantes

- **Logo "lama"**: siempre letra por letra en `<span>` para la animación hover (ver `home.module.css .texto`, `dashboard.module.css .topBarLetter`, `admin.module.css .topBarLetter`).
- **SearchBar y Pagination**: estilos en `globals.css` (clases globales `.search-bar`, `.page-btn`, etc.) — disponibles en dashboard Y admin sin importar nada extra.
- **SearchBar**: debounce 400ms, soporta búsqueda por código seguimiento, dirección, envio_id y fecha `YYYY-MM-DD`.
- **Paginación**: 10 envíos por página, máximo 5 botones visibles.
- **Skeleton loading**: `<ShipmentsTable envios={[]} isLoading />` mientras carga la tabla.
- **Toast notifications** (`lib/toast.ts` + `Toaster`): se disparan desde `EstadoDropdown` cuando cambia un estado, mostrando la respuesta de Seller App y (si es `entregado`) Payments App.
- **Asignación de operadores**: el admin obtiene la lista de logísticos directamente de Clerk (`clerkClient().users.getUserList()`, filtrando por `publicMetadata.roles` = `logistics`). El `AsignarSelect` envía `clerk_user_id` al endpoint `/asignar`, que busca el `logistico_id` en DB.
- `lib/prisma.ts` exporta el singleton de PrismaClient.
- `lib/calcularFechaEntrega.ts` calcula entrega: 24h hábiles para Bahía Blanca, 72h para el resto.

## Variables de entorno clave

```
DATABASE_URL                              # PostgreSQL con pgbouncer
DATABASE_URL_UNPOOLED                     # Sin pgbouncer (migraciones)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
WEBHOOK_SECRET                            # Para validar webhooks de Clerk via Svix
SELLER_APP_URL                            # Para notificar cambios de estado
PAYMENTS_APP_URL                          # Para liberar pagos
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/auth-redirect
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/auth-redirect
```

**Importante Clerk**: las vars `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` y `AFTER_SIGN_UP_URL` están **deprecadas** en Clerk v5+. Usar las `FORCE_REDIRECT_URL`.

## CORS

Configurado en `next.config.ts` para los endpoints que consumen otras apps (`/api/envios`, `/api/envios/[id]/estado`, `/api/envios/orden/[id]`, `/api/envios/orden/[id]/liquidacion-logistico`). Permite `Access-Control-Allow-Origin: *`. Útil para cuando otras apps llamen desde el browser; para llamadas server-to-server no es necesario.

## Comandos

```bash
pnpm dev          # Desarrollo
pnpm build        # Build de producción
pnpm prisma studio # Explorar DB
pnpm prisma migrate dev --name <nombre>  # Nueva migración
```
