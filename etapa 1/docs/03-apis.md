# 1.3 — Diseño de APIs Inter-Servicios

> **Tipo C — Marketplace**

Documentar cada endpoint que una app expone para ser consumido por otra app del sistema. Este contrato debe estar acordado por todos los integrantes antes de comenzar la Etapa 2.

## Seller App — Endpoints expuestos

### Obtener detalle de un producto publicado
- **Endpoint**: `GET /api/productos/{producto_id}`
- **Request**:
  - `producto_id` (path): ID del producto
- **Response**:
  - `producto_id`
  - `vendedor_id`
  - `categoria_id`
  - `imagenes`: lista de imágenes del producto
  - `titulo`
  - `descripcion`
  - `precio`
  - `estado_prenda`: nuevo | usado | vintage
  - `talle`
  - `marca`
  - `genero`
  - `estado_publicacion`: activa | inactiva | 
  - `fecha_creacion`: fecha de publicación
- **Quién llama a quién**: Buyer App llama a Seller App


### Listar productos publicados
- **Endpoint**: `GET /api/productos`

- **Query params opcionales**:
  - `search`: texto de búsqueda por título, descripción o marca
  - `categoria_id`: ID de categoría
  - `talle`: talle
  - `genero`: hombre | mujer | niños
  - `sort`: recent | price_asc | price_desc
  - `page`: número de página
  - `pageSize`: cantidad de productos por página

- **Response**:
  - `items`: lista de productos
    - `producto_id`
    - `vendedor_id`
    - `categoria_id`
    - `imagenes`
    - `titulo`
    - `descripcion`
    - `precio`
    - `estado_prenda`: nuevo | usado | vintage
    - `talle`
    - `marca`
    - `genero`
    - `estado_publicacion`: activa
    - `fecha_creacion`
  - `total`
  - `page`
  - `pageSize`
  - `categorias`: categorias disponibles para filtros
  - `vendedores`: vendedores asociados a los productos listados

- **Reglas**:
  - Solo devuelve productos con `estado_publicacion = activa`.
  - No devuelve productos vendidos ni inactivos.
  - Si no se envian filtros, devuelve los productos activos mas recientes.

- **Quien llama a quien**: Buyer App API llama a Seller App.


### Obtener productos por IDs
- **Endpoint**: `GET /api/productos/bulk`

- **Query params**:
  - `ids`: lista de IDs de productos separados por coma.
    - Ejemplo: `prod_1,prod_2`

- **Ejemplo**:
  - `GET /api/productos/bulk?ids=prod_1,prod_2`

- **Response**:
  - `items`: lista de productos
    - `producto_id`
    - `vendedor_id`
    - `categoria_id`
    - `imagenes`
    - `titulo`
    - `descripcion`
    - `precio`
    - `estado_prenda`
    - `talle`
    - `marca`
    - `genero`
    - `estado_publicacion`
    - `fecha_creacion`

- **Reglas**:
  - Solo devuelve productos existentes.
  - Solo devuelve productos con `estado_publicacion = activa`.
  - Los IDs inexistentes o productos no activos son ignorados.
  - Si ninguno de los IDs existe, devuelve una lista vacía.

- **Quién llama a quién**: Buyer App API llama a Seller App.


### Listar categorías de productos
- **Endpoint**: `GET /api/categorias-productos`

- **Response**:
  - `items`
    - `categoria_producto_id`
    - `nombre`
    - `descripcion`
    - `fecha_creacion`

- **Quién llama a quién**: Buyer App API llama a Seller App.


### Listar vendedores
- **Endpoint**: `GET /api/vendedores`

- **Query params opcionales**:
  - `search`: búsqueda por nombre de vendedor
  - `page`: número de página
  - `pageSize`: cantidad de resultados por página

- **Response**:
  - `items`
    - `vendedor_id`
    - `nombre_vendedor`
  - `total`
  - `page`
  - `pageSize`

- **Reglas**:
  - Solo devuelve vendedores activos.
  - La búsqueda es parcial e insensible a mayúsculas/minúsculas.

- **Quién llama a quién**: Buyer App API llama a Seller App.


### Listar órdenes de venta de un comprador
- **Endpoint**: `GET /api/ordenes-ventas`

- **Query params**:
  - `comprador_id`: ID del comprador

- **Response**:
  - `items`
    - `orden_id` (ID externo / nro_orden)
    - `comprador_id`
    - `items`
      - `producto_id`
      - `precio_unitario`
    - `producto_ids`
    - `total`
    - `direccion_envio`
    - `estado_general`
    - `estado_pago`
    - `estado_envio`
    - `fecha_creacion`
    - `fecha_actualizacion`
  - `total`
  - `page`
  - `pageSize`

- **Quién llama a quién**: Buyer App API llama a Seller App.


### Obtener detalle de una orden
- **Endpoint**: `GET /api/ordenes-ventas/{orden_id}`

- **Request**:
  - `orden_id` path param: ID externo de la orden (`nro_orden` en Seller App)

- **Response**:
  - `orden_id`
  - `comprador_id`
  - `vendedor_id`
  - `items`
    - `producto_id`
    - `precio_unitario`
  - `producto_ids`
  - `total`
  - `direccion_envio`
  - `estado_general`
  - `estado_pago`
  - `estado_envio`
  - `fecha_creacion`
  - `fecha_actualizacion`

- **Reglas**:
  - El `orden_id` recibido por path corresponde al identificador externo de la orden.
  - Seller App lo busca internamente en la columna `nro_orden`.
  - Si la orden no existe, devuelve `404`.

- **Quién llama a quién**:
  - Buyer App API llama a Seller App.


### Crear orden de venta
- **Endpoint**: `POST /api/ordenes-ventas`
- **Request**:
  - `orden_id`: ID externo de la orden
  - `comprador_id`: ID del comprador
  - `items`: productos de la compra
    - `producto_id`
    - `precio_unitario`
  - `precio_total`: monto total de la compra
  - `direccion_envio`: dirección de entrega
- **Response**:
  - `orden_id`
  - `estado_general`: pendiente_pago
  - `estado_pago`: pendiente
  - `estado_envio`: pendiente
  - `fecha_creacion`
- **Quién llama a quién**: Buyer App llama a Seller App


### Consultar estado de una orden
- **Endpoint**: `GET /api/ordenes-ventas/{orden_id}/estado`
- **Request**:
  - `orden_id` (path): ID externo de la orden
- **Response**:
  - `orden_id`
  - `estado_general`: pendiente_pago | pagada | en_preparacion | despachada | finalizada | cancelada
  - `estado_pago`: pendiente | aprobado | rechazado
  - `estado_envio`: pendiente | en_preparacion | despachado | entregado | cancelado
  - `fecha_actualizacion`
- **Quién llama a quién**: Buyer App llama a Seller App


### Actualizar estado de envío de una orden
- **Endpoint**: `PATCH /api/ordenes-ventas/{orden_id}/estado-envio`
- **Request**:
  - `orden_id` (path): ID externo de la orden
  - `estado_envio`: pendiente | en_preparacion | despachado | entregado | cancelado
  - `motivo`: motivo del cambio de estado, si corresponde
  - `envio_id`: ID del envío asociado, si corresponde
  - `codigo_seguimiento`: código de seguimiento, si corresponde
- **Response**:
  - `orden_id`
  - `estado_general`
  - `estado_envio`
  - `fecha_actualizacion`
- **Quién llama a quién**: Shipping App llama a Seller App


### Actualizar estado de pago de una orden
- **Endpoint**: `PATCH /api/ordenes-ventas/{orden_id}/estado-pago`
- **Request**:
  - `orden_id` (path): ID externo de la orden
  - `estado_pago`: pendiente | aprobado | rechazado
  - `pago_id`: ID del pago
  - `motivo`: motivo del cambio, si corresponde
- **Response**:
  - `orden_id`
  - `estado_pago`
  - `estado_general`
  - `fecha_actualizacion`
- **Quién llama a quién**: Payments App llama a Seller App


### Actualizar estado de liquidación al vendedor
- **Endpoint**: PATCH /api/ordenes/{orden_id}/liquidacion-vendedor
- **Request**:
  - `orden_id` (path): ID de la orden
  - `fecha_actualizacion` : fecha en la que Payments App liquido el pago.
- **Response**:
  - `mensaje`: "Liquidacion registrada correctamente"
- **Quién llama a quién**: Payments App llama a Seller App.
  
---

## Shipping App — Endpoints expuestos

### Crear un envío para una orden
- **Endpoint**: `POST /api/envios`
- **Request**:
  - `orden_id`: ID de la orden
  - `direccion_destino`: dirección de entrega
  - `vendedor_id`: ID del vendedor
- **Response**:
  - `envio_id`: ID del envío
  - `empresa_logistica`: empresa logística
  - `codigo_seguimiento`
  - `estado`: `pending`
- **Quién llama a quién**: Seller App llama a Shipping App

### Consultar el envío asociado a una orden
- **Endpoint**: `GET /api/envios/orden/{orden_id}`
- **Request**:
  - `orden_id` (path): ID de la orden
- **Response**:
  - `envio_id`
  - `orden_id`
  - `codigo_seguimiento`
  - `empresa_logistica`
  - `estado` (pending, in_transit, delivered, returned)
  - `historial_estados`
- **Quién llama a quién**: Buyer App llama a Shipping App

### Actualizar estado de liquidación al logistico
- **Endpoint**: PATCH /api/envios/orden/{orden_id}/liquidacion-logistico
- **Request**:
  - `orden_id` (path): ID de la orden
  - `fecha_actualización`: fecha en la que Payments App liquidó el pago al logistico
- **Response**:
  - `mensaje`: "Liquidación registrada correctamente" (200 ok)
- **Quién llama a quién**: Payments App llama a Shipping App.

---

## Payments App — Endpoints expuestos

### Crear un pago pendiente para una orden de compra
- **Endpoint**: `POST /api/pagos`
- **Request**:
  - `orden_id`: ID de la orden
  - `comprador`:
    - `comprador_id`: ID del comprador
    - `nombre`: nombre del comprador
    - `email`: correo electrónico del comprador
  - `vendedor_id`: ID del vendedor
  - `monto_producto`: monto correspondiente al producto
  - `monto_envio`: monto correspondiente al envío
  - `monto_total`: monto total pagado por el comprador
- **Response**: `201 Created` sin contenido
- **Quién llama a quién**: Buyer App llama a Payments App

### Notificar que una orden fue entregada para habilitar la liberación del pago al vendedor
- **Endpoint**: `POST /api/pagos/orden/liberar`
- **Request**:
  - `orden_id`
  - `envio_id`
- **Response**:
  - `orden_id`
- - **Quién llama a quién**: Shipping App llama a Payments App


