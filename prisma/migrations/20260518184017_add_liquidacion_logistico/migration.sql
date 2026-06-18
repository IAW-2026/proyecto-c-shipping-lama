-- AlterTable
ALTER TABLE "Envio" ADD COLUMN     "estado_liquidacion_logistico" TEXT DEFAULT 'pendiente',
ADD COLUMN     "fecha_actualizacion" TIMESTAMP(3),
ADD COLUMN     "fecha_liquidacion_logistico" TIMESTAMP(3);
