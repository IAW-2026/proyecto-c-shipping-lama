# 1.4 — Modelo de Datos por Aplicación

> **Tipo C — Marketplace**

Para cada webapp, describir las entidades principales de su base de datos: tablas, campos relevantes y relaciones. No es necesario un DER formal, pero sí que quede claro qué persiste cada app.

También identificar posibles duplicados entre apps (ej: usuarios) y definir cómo se resuelven las inconsistencias.

---

## BUYER APP

### Entidades principales

#### 1. comprador
**Campos principales:**
- `clerk_user_id_comprador`: identificador del usuario autenticado en Clerk. PK
- `email`: correo electrónico principal.
- `nombre_comprador`: nombre y apellido.
- `DNI`: número de documento
- `telefono`: teléfono de contacto, si existe.
- `direccion_envio`: dirección de envío principal.
- `fecha_creacion`: fecha de creación del perfil.
- `fecha_actualizacion`: fecha de última modificación.

#### 2. preferencias_comprador
**Campos principales:**
- `preferencia_id`: identificador de la preferencia.
- `clerk_user_id_comprador`
- `talles_preferidos`
- `categorias_preferidas`
- `vendedores_preferidos`

#### 3. favorito_producto
**Campos principales:**
- `favorito_id`: identificador del favorito.
- `clerk_user_id_comprador`: referencia al comprador.
- `producto_id`: referencia al producto favorito.
- `fecha_agregado`: fecha de creación del favorito.

---

## SELLER APP

### Entidades principales

#### 1. vendedor
**Campos principales:**
- `clerk_user_id`: identificador del usuario autenticado en Clerk.
- `nombre_vendedor`
- `DNI`: número de documento
- `email`
- `telefono`
- `activo`: boolean para controlar vendedores
- `fecha_creacion`: fecha de creación del usuario

#### 2. categoría_producto
**Campos principales:**
- `categoria_producto_id`
- `nombre`
- `descripcion`
- `fecha_creacion`: fecha de creación de la categoria

#### 3. producto
**Campos principales:**
- `producto_id`
- `clerk_user_id`: referencia al vendedor propietario
- `categoria_id`: referencia a la categoría del producto
- `titulo`
- `descripcion`
- `precio` 
- `imagenes `
- `estado_prenda`: (nuevo, usado, vintage, etc.)
- `talle`
- `marca`
- `genero` (hombre, mujer, niños)
- `estado_publicacion`: (activa, inactiva, vendida)
- `fecha_creacion`: fecha de publicación

#### 4. orden
**Campos principales:**
- `orden_id`: identificador de la orden.
- `clerk_user_id`: referencia externa a Buyer App
- `nro_orden`: número visible para el usuario.
- `total`: total de la compra.
- `estado_general`: estado general de la orden (pendiente de pago, pagada, en preparación, enviada , completada o cancelada), es derivado y persistido; se actualiza automáticamente ante cambios en estado_pago o estado_envio. No se modifica manualmente.
- `estado_pago`: pendiente | aprobado | rechazado
- `estado_envio`: pendiente | en_preparacion | despachado | entregado | cancelado 
- `estado_liquidacion_vendedor` : pagada | pendiente
- `direccion_envio`: dirección usada al momento de confirmar la compra.
- `fecha_creacion` 
- `fecha_actualizacion`
- `fecha_liquidacion_vendedor`: fecha en que Payments App registró la liquidación al vendedor.
- `motivo`: motivo asociado a cambios de estado, por ejemplo rechazo de pago o cancelación de envío.
- `codigo_seguimiento`: código de seguimiento informado por Shipping App.
- `fecha_rechazo_pago`: fecha en que se registró el rechazo del pago, si corresponde.

#### 5. orden_item
**Campos principales:**
- `orden_item_id`
- `orden_id`: referencia a la orden de venta a la que pertenece el item
- `producto_id`: referencia al producto vendido
- `precio_unitario`: precio del producto al momento de generarse la orden
- `fecha_creacion`: fecha de creación del item de la orden

---

## SHIPPING APP

### Entidades principales

#### 1. usuario_logistico
**Campos principales:**
- `logistico_id`: PK
- `clerk_user_id`: identificador del usuario autenticado en Clerk.
- `nombre`
- `email`
- `empresa_logistica`
- `fecha_creacion`: Fecha de creacion del usuario

#### 2. envio
**Campos principales:**
- `envio_id`: PK
- `estado_actual`: (en_preparacion | en_camino | entregado | cancelado)
- `dirección_destino`
- `vendedor_id`
- `codigo_seguimiento`
- `logistico_id`: FK --> usuario_logistico
- `orden_id`: referencia a la orden en Buyer/Seller App (dato externo, sin FK real)
- `fecha_creacion`
- `fecha_estimada_entrega`
- `estado_liquidación_logistico`
- `fecha_liquidación_logistico`
- `fecha_actualización`

#### 3. historial_entregas
**Campos principales:**
- `evento_id`: PK
- `envio_id`: FK --> envio
- `estado`: el estado que tenía el envío en ese momento
- `fecha`
- `descripcion`: texto libre, ej: "Paquete recibido en depósito central"
- `logistico_id`: FK --> usuario_logistico (quién registró el evento)


---


## PAYMENTS APP

### Entidades principales

#### 1. metodo_de_pago
**Campos principales:**
- `metodo_pago_id`
- `metodo_pago`: nombre del medio de pago (por ejemplo: billetera virtual, tarjeta de débito, tarjeta de crédito)
- `descripcion`
- `esta_activo`: indica si el método de pago está habilitado para usarse o no

#### 2. pago
**Campos principales:**
- `pago_id`
- `orden_id`: referencia a la orden de compra generada en otra app
- `comprador_id`: identificador del comprador
- `vendedor_id`: identificador del vendedor
- `monto_producto`: monto correspondiente al producto
- `monto_envio`: monto correspondiente al envío
- `comision`: comisión que retiene la plataforma
- `monto_neto`: monto final que recibe el vendedor luego de comisiones
- `monto_total`: monto total pagado por el comprador (producto + envío)
- `moneda`: moneda en la que se realiza el pago
- `estado`: estado del pago (pendiente, aprobado, rechazado, cancelado)
- `metodo_pago_id`: referencia al método de pago utilizado
- `proveedor`: proveedor externo que procesa el pago
- `pago_proveedor_id`: identificador del pago en el proveedor
- `fecha_creacion`
- `fecha_actualizacion`
- `fecha_aprobado`
- `fecha_rechazo`
- `fecha_cancelado`

#### 3. transaccion_de_pago
**Campos principales:**
- `transaccion_id`
- `pago_id` // porque si hay muchas transacciones para un mismo pago aca tienen el mismo num 
- `tipo_transaccion`: tipo de transacción (autorización, captura, rechazo, reintento)
- `monto`: monto de la transacción
- `estado`: estado de la transacción
- `transaccion_proveedor_id`: identificador de la transacción en el proveedor
- `codigo_proveedor`: código de respuesta del proveedor
- `mensaje_proveedor`: mensaje o detalle devuelto por el proveedor
- `fecha_creacion`
---


## Datos duplicados y estrategia de consistencia

| Dato duplicado | Apps que lo tienen | Fuente de verdad | Estrategia |
|----------------|--------------------|-----------------|------------|
| Identidad del usuario (`clerk_user_id`) | Todas | Clerk | Cada app sincroniza datos mínimos del usuario al primer login mediante webhook o lazy load |
| Perfil del comprador (`nombre_comprador`, `email`,`DNI`, `teléfono`, `dirección_envio`) | Buyer App / Clerk | Buyer App + Clerk | Clerk administra identidad/autenticación. Buyer App persiste los datos operativos del comprador. |
| Perfil del vendedor (`nombre_vendedor`, `email`, `teléfono`, `DNI`) | Seller App / Clerk | Seller App + Clerk | Clerk administra identidad/autenticación. Seller App persiste los datos operativos del vendedor. |
| Perfil del operador logístico (`nombre`, `email`) | Shipping App / Clerk | Shipping App + Clerk | Clerk administra identidad/autenticación. Shipping App persiste los datos operativos del operador logístico. |
| Orden (`orden_id`) | Seller App / Shipping App / Payments App | Seller App | Seller App genera la orden y expone el `orden_id`; el resto de apps lo usan como referencia externa e inmutable | 
| Estado de orden | Seller App / Shipping App / Payments App / Buyer App | Seller App | Seller App consolida el estado general de la orden a partir de eventos recibidos desde Payments App y Shipping App (`estado_pago`, `estado_envio`). Buyer App solo consulta el estado para mostrarlo al comprador. |
| Productos (título, precio, talle, vendedor) | Seller App | Seller App | Buyer App consulta productos por API de productos y guarda un snapshot (`titulo`, `precio`, `talle`, `vendedor_id`,etc) |
| Datos del envío (`comprador_id`, `nombre_comprador`, `direccion_envio`) | Buyer App / Shipping App | Buyer App | Shipping App almacena un snapshot inmutable de los datos necesarios para el envío al crear `envio`. Si después el comprador cambia su perfil en Buyer App, ese cambio no modifica envíos ya creados en Shipping App. |
| Montos del pago (`monto_total`, `monto_producto`, `monto_envio`, `comisión`, `monto_neto`) | Buyer App / Payments App | Payments App | Payments App calcula y persiste los importes finales: el comprador paga `monto_total = monto_producto + monto_envio`; luego se descuenta la `comisión` sobre el producto y se calcula `monto_neto`. El `monto_envio` corresponde al servicio de envío y no forma parte del neto del vendedor. Buyer App solo consulta estos datos para mostrarlos al usuario. | 
| Datos de participantes del pago (`comprador_id`, `vendedor_id`, `nombre_comprador`, `nombre_vendedor`) | Buyer App / Seller App / Payments App / Clerk | Buyer App + Seller App + Clerk | Payments App recibe al crear el pago los identificadores externos del comprador y vendedor (`comprador_id`, `vendedor_id`) y puede guardar un snapshot mínimo de nombres para comprobantes e historial. Clerk mantiene la identidad/autenticación, mientras Buyer App y Seller App conservan los datos operativos completos. |   
