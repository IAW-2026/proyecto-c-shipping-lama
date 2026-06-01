[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mVV06Hfm)
# shipping

Aplicación **Shipping** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión `<!-- completar -->`.

Esta app corresponde al módulo de envíos y logística en el proyecto de tipo **C (Marketplace)**.

---

Enunciado completo: <https://iaw-2026.github.io/proyecto/>

---
## Descripción de la app

Shipping app creada con las siguientes tecnologías: 
- Next.js
- PostgreSQL
- Clerk
- Tailwind CSS
- Prisma
- Vercel + Neon


La app cuenta con dos tipos de usuarios que pueden operar: Usuario logistico (rol: logistics) y usuario administrador (rol: super_admin)

Ahora mismo cuenta con varios usuarios logisticos los cuales visualizarán un dashboard que tiene solo los pedidos que les fueron asignados. Van a poder ir actualizando los estados de cada uno de estos según el flujo de entrega.

Cuenta con un único usuario administrador. Este verá un dashboard especial, completo con todos los envios del sistema y sus correspondientes logisticos asignados. El administrador podra desde este panel asignar envios a los distintos usuarios logisticos.

Ambos dashboards cuentan con la opcion de clickear los id de los envios, esto permitirá ver el historial de estados de cada envío.

Credenciales inicio de sesión de usuario administrador:
- mail: maxibloga7@gmail.com
- contraseña: m3LeKSbC27JP9Jb

Credenciales inicio de sesión de un usuario logistico:
- mail: maxibdn6@gmail.com
- contraseña: qspjFrBKACYEy45


---



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
