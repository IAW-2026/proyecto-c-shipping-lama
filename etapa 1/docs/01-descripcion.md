# 1.1 — Descripción del Sistema

> **Tipo C — Marketplace**

## ¿Qué problema resuelve?
lama busca resolver la falta de una plataforma confiable, simple y especializada para la compra y venta de ropa usada o vintage.

Actualmente, muchas personas tienen ropa en buen estado que ya no utilizan, mientras que otros usuarios buscan prendas únicas, vintage o a menor precio. Sin embargo, las plataformas generalistas no están especialmente orientadas a este nicho, lo que genera una experiencia de compra y venta poco optimizada.

Entonces, lama permite:
- Darle una segunda vida a la ropa.
- Facilitar la compra segura entre usuarios.
- Promover el consumo sostenible y la moda circular.
- Centralizar publicaciones, pagos y envíos en un mismo sistema.


## Actores del sistema
| Actor         | Descripción                                                                                        | Apps donde interactúa                  |
| ------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Comprador     | Usuario que busca productos, realiza compras y consulta el estado de sus envíos                    | Buyer App, Payments App, Shipping App  |
| Vendedor      | Usuario que publica productos, gestiona ventas y despacha pedidos cargando la información de envío | Seller App, Payments App, Shipping App |
| Administrador | Usuario interno que supervisa el sistema, modera contenido y gestiona incidencias                  | Control Plane                          |
| Operador logistico | Usuario que se encargara de la gestion de envios, actualizar estados, historial de entregas   | Shipping App                           |          

## Flujo principal de uso

1. El vendedor publica su ropa a través de la Seller App.
2. El comprador navega por la Buyer App, busca prendas de su interés, selecciona uno o varios productos y los agrega al carrito.
3. El comprador realiza la compra.
4. La Payments App procesa y registra el pago correspondiente.
5. Una vez acreditado el pago, el vendedor recibe la orden en la Seller App y prepara el despacho del pedido.
6. El vendedor entrega el paquete al operador logístico externo encargado del envío.
7. El operador logístico registra y actualiza el estado del envío en la Shipping App, incluyendo información como código de seguimiento y estado del pedido.
8. La Shipping App almacena la información del envío 
9. El comprador consulta el estado del envío desde la plataforma.
10. Finalmente, el o los productos son entregados al comprador.

### Modelo Logístico

La plataforma trabaja con operadores logísticos que se encargaran de la gestion de los envios (la plataforma es su misma empresa logistica encargada de los envios). Estos operadores son responsables del traslado del pedido y de actualizar el estado del envío en la Shipping App mediante integraciones o registros asociados al seguimiento del paquete.