-- CreateTable
CREATE TABLE "UsuarioLogistico" (
    "logistico_id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "empresa_logistica" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioLogistico_pkey" PRIMARY KEY ("logistico_id")
);

-- CreateTable
CREATE TABLE "Envio" (
    "envio_id" TEXT NOT NULL,
    "orden_id" TEXT NOT NULL,
    "estado_actual" TEXT NOT NULL DEFAULT 'en_preparacion',
    "direccion_destino" TEXT NOT NULL,
    "nombre_comprador" TEXT NOT NULL,
    "codigo_seguimiento" TEXT NOT NULL,
    "logistico_id" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_estimada_entrega" TIMESTAMP(3),

    CONSTRAINT "Envio_pkey" PRIMARY KEY ("envio_id")
);

-- CreateTable
CREATE TABLE "HistorialEntrega" (
    "evento_id" TEXT NOT NULL,
    "envio_id" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT,
    "logistico_id" TEXT,

    CONSTRAINT "HistorialEntrega_pkey" PRIMARY KEY ("evento_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioLogistico_clerk_user_id_key" ON "UsuarioLogistico"("clerk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Envio_codigo_seguimiento_key" ON "Envio"("codigo_seguimiento");

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_logistico_id_fkey" FOREIGN KEY ("logistico_id") REFERENCES "UsuarioLogistico"("logistico_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEntrega" ADD CONSTRAINT "HistorialEntrega_envio_id_fkey" FOREIGN KEY ("envio_id") REFERENCES "Envio"("envio_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEntrega" ADD CONSTRAINT "HistorialEntrega_logistico_id_fkey" FOREIGN KEY ("logistico_id") REFERENCES "UsuarioLogistico"("logistico_id") ON DELETE SET NULL ON UPDATE CASCADE;
