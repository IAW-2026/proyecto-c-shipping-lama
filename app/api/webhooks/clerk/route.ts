// logica para recibir los webhooks de clerk y crear un usuario logístico en la base de datos
// clerk llama desde sus servidores a este endpoint cada vez que se crea un nuevo usuario, y con la info 
// del usuario crea un nuevo registro en la tabla de usuarioLogistico con el clerk_user_id, nombre y email del usuario

import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret no configurado", { status: 500 });
  }

  // Verificar que el request viene de Clerk
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Headers de svix faltantes", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Webhook inválido", { status: 400 });
  }

  // Manejar el evento
  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data;

    const email = email_addresses[0]?.email_address ?? "";
    const nombre = `${first_name ?? ""} ${last_name ?? ""}`.trim();

    await prisma.usuarioLogistico.create({
      data: {
        clerk_user_id: id,
        nombre,
        email,
        empresa_logistica: "lama",
      },
    });
  }

  return new Response("OK", { status: 200 });
}