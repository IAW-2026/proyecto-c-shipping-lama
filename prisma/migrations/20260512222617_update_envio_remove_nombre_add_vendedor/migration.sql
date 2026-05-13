/*
  Warnings:

  - You are about to drop the column `nombre_comprador` on the `Envio` table. All the data in the column will be lost.
  - Added the required column `vendedor_id` to the `Envio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Envio" DROP COLUMN "nombre_comprador",
ADD COLUMN     "vendedor_id" TEXT NOT NULL;
