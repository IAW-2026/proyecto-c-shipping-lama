# 1.2 — Asignación de Responsabilidades

> **Tipo C — Marketplace**

## Distribución de webapps

| App          | Responsable      | Repositorio                    |
|--------------|------------------|--------------------------------|
| Buyer App    |Lourdes Santillan | `proyecto-c-buyer-[lama]`    |
| Seller App   | Alejo Berenguer  | `proyecto-c-seller-[lama]`   |
| Shipping App | Maximiliano Bloga| `proyecto-c-shipping-[lama]` |
| Payments App | Ana Paz Bauser   | `proyecto-c-payments-[lama]` |

---

## Datos propios de cada app

### Buyer App
- Usuario: almacena la información propia del comprador dentro de la aplicación, complementaria a la identidad gestionada por el sistema de autenticación. (compradorId, nombre, email, telefono, dirección, etc.)

- Preferencias: almacena las preferencias del comprador, como categorías de interés, talles favoritos, etc., para personalizar su experiencia de compra. (preferencia_id, comprador_id, categorias_preferidas, vendedores_preferidos, talles_preferidos) 

### Seller App
- Vendedor: almacena la información propia del vendedor dentro de la aplicación, complementaria a la identidad gestionada por el sistema de autenticación.
(vendedorId, nombre,DNI, email de contacto, teléfono, fecha de creación, etc.)

- Producto: representa cada prenda publicada por el vendedor, incluyendo su información principal, características y estado de publicación.
    (productoId, vendedorId,categoriaId, título, descripción, precio, estado de la prenda, talle, imagenes, marca, genero, estado de publicación, fecha de creación)

- Categoria producto: : representa la clasificación de los productos dentro del sistema, permitiendo organizar las prendas en distintos tipos (por ejemplo, camperas, pantalones, remeras, etc.). Facilita la búsqueda, filtrado y navegación de los productos.
  (id, nombre, descripción, fecha de creación)

- Orden de Venta: representa una venta realizada sobre un producto del vendedor, incluyendo la información básica de la operación.
(ordenId, productoId, compradorId, precio, fecha, estado general(pendiente de pago, pagada, finalizada), estado de envio(pendiente, despachado, en preparacion), estado de pago (pendiente,rechazado,aprobado))

- Orden item: representa cada producto incluido dentro de una orden de venta. Permite asociar uno o varios productos a una misma orden, almacenando la información específica de cada item comprado.
(ordenItemId, ordenId, productoId, cantidad, precioUnitario, fecha de creación)


### Shipping App
- Usuario operador logistico: Operará en su propia interfaz dentro de la aplicación web, se encargara de la gestion de envios, actualizar el estado en el que el envio se encuentra, de actualizar el historial de entregas, etc.(logisticoId, nombre, email, empresa logistica.)

- Envio: Cada uno de estos contara con la informacion necesaria para que el usuario comprador pueda hacer un seguimiento del producto que compro.(envioId, estado actual, dirección, código de seguimiento) 

- Historial de entregas: Posee informacion sobre cada uno de los envios hechos, por los estados que pasaron, fechas, etc. (eventId, shipmentId, fecha, estado)


### Payments App
- Pagos: Representa el pago completo de una compra dentro del sistema.

- Transacciones: Registra cada intento o movimiento relacionado con un pago (por ejemplo, cuando se intenta cobrar  o cuando falla).

- Métodos de pago: Define las formas de pago disponibles en la aplicación.

## Datos o acciones que requieren comunicación entre apps

| App origen   | Acción / dato necesario                                | App destino  | API involucrada     |
|--------------|--------------------------------------------------------|--------------|---------------------|
| Buyer App    | Crear y procesar un pago para una orden de compra      | Payments App | API de pagos        |
| Payments App | Crear orden de venta aprobada por Payments App (pago aprobado)| Seller App| API de vendedores  |
| Seller App   | Crear un envío para una orden                          | Shipping App | API de logística    |
| Buyer App    | Consultar estado de preparación de una orden           | Seller App   | API de vendedores    |
| Buyer App    | Consultar el envío asociado a una orden                | Shipping App | API de logistica    |
| Seller App   | Consultar estado de pago de una orden                  | Payments App | API de pagos        |
| Buyer App    | Obtener detalle de un producto publicado               | Seller App   | API de vendedores    |
| Payments App, Shipping App, Buyer App  | Actualizar estado de una orden de venta| Seller App   | API de vendedores |
| Buyer App    |Obtener los métodos de pago disponibles                 | Payments App | API de pagos |
| Shipping App | Notificar que una orden fue entregada para habilitar la liberación del pago al vendedor | Payments App | API de pagos |
| Shipping App | Actualizar estado de envío de una orden                 | Seller App  | API de vendedores     |

