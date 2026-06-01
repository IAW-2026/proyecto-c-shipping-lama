# 1.5 — Usuarios Compartidos

> **Tipo C — Marketplace**

El sistema utiliza **Clerk** como servicio centralizado de autenticación. Los usuarios se autentican a través de Clerk independientemente de qué app estén usando, y la identidad se propaga entre servicios mediante el token JWT emitido por Clerk.

---

## ¿Qué apps comparten usuarios?

| Usuario | Apps donde puede autenticarse |
|---------|------------------------------|
| Comprador | Buyer App, Payments App |
| Vendedor | Seller App, Payments App |
| Operador logistico | Shipping App |
| Super administrador | Buyer App, Seller App, Shipping App, Payments App |

### Aclaración sobre los roles

- El comprador se autentica en la Buyer App, desde donde puede comprar productos e iniciar pagos.
- El vendedor se autentica en la Seller App, desde donde puede publicar productos y consultar sus ventas.
- El operador logistico solo se autentica en la Shipping App, desde donde gestiona y actualiza los envíos.
- El administrador de pagos se autentica en la Payments App para consultar y controlar pagos y transacciones.
- Un mismo usuario puede ser comprador y vendedor al mismo tiempo, pero accedería a Buyer App y Seller App según el rol que esté utilizando.
- El vendedor y comprador ingresan a la Payments App para visualizar las transacciones que tuvieron de ventas o compras segun corresponda.
---

## Claims del JWT relevantes por app
- El JWT es un token que Clerk genera cuando el usuario está logueado.
- Claims: información del usuario

| App | Claims utilizados | Para qué |
|-----|------------------|----------|
| Buyer App | `sub` (user ID), `roles`, `email` | Identificar comprador o admin, verificar rol `buyer` o `super_admin` |
| Seller App | `sub` (user ID), `roles`, `email` | Identificar vendedor o admin, verificar rol `seller` o `super_admin` |
| Shipping App | `sub` (user ID), `roles`, `email` | Identificar operador o admin, verificar rol `logistics` o `super_admin` |
| Payments App | `sub` (user ID), `roles`, `email` | Asociar transacciones al usuario, verificar rol `buyer`, `seller` o `super_admin` |

<!-- Definir si los roles se gestionan como metadata en Clerk (publicMetadata) o de otra forma. -->
### Estrategia de roles

Los roles de los usuarios se gestionan mediante Clerk utilizando `publicMetadata` y se exponen como claims en el JWT.

Cada usuario puede tener uno o más roles asociados dependiendo de las funcionalidades a las que necesite acceder dentro del sistema.

#### Configuración de claims en Clerk

La plantilla de sesión de Clerk debe configurarse para incluir en el JWT los claims personalizados necesarios para las aplicaciones del sistema.

En particular, el token debe exponer:

- `roles`: como un array de roles asociados al usuario.
- `email`: correo electrónico del usuario autenticado.
- `sub`: identificador único del usuario autenticado.

Ejemplo de claims esperados en el JWT:

```json
{
  "sub": "user_123",
  "email": "usuario@email.com",
  "roles": ["buyer", "seller"]
}
```

#### Estructura de almacenamiento en Clerk

Los roles se almacenan en `publicMetadata` en el perfil del usuario:

```json
{
  "roles": ["buyer", "seller"]
}
```

#### Roles definidos en el sistema

- `buyer`: comprador que realiza compras
- `seller`: vendedor que publica productos
- `logistics`: operador logístico que gestiona envíos
- `super_admin`: administrador general con acceso a todas las aplicaciones

#### Identificación y validación

El claim `sub` permite identificar de forma única al usuario autenticado.

El claim `roles` permite controlar a qué aplicación puede acceder cada usuario y qué acciones puede realizar dentro del sistema.

Cada aplicación validará los roles necesarios en el JWT para permitir el acceso:

- **Buyer App** → requiere rol `buyer` o `super_admin`
- **Seller App** → requiere rol `seller` o `super_admin`
- **Shipping App** → requiere rol `logistics` o `super_admin`
- **Payments App** → requiere rol `buyer`, `seller` o `super_admin`

#### Restricciones de acceso

El rol `super_admin` funciona como acceso global de administración: permite entrar a todas las aplicaciones, pero no reemplaza los permisos funcionales específicos de cada una.

