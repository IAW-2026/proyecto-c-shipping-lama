"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import styles from "@/app/ui/home.module.css";

export default function Page() {
  const { isSignedIn, sessionClaims } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const roles = ((sessionClaims as { roles?: string[] } | null)?.roles) ?? [];
  const panelHref = roles.includes("super_admin") ? "/admin" : "/dashboard";

  return (
    <div className="bg-[#f6f1e7] text-[#37413d] overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#1a2420]/75 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3" aria-label="LAMA Logistics — inicio">
            <div className="flex items-baseline gap-px text-white">
              <span className={styles.texto} >L</span>
              <span className={styles.texto} >A</span>
              <span className={styles.texto} >M</span>
              <span className={styles.texto} >A</span>
            </div>
            <span className="text-[9px] uppercase tracking-[2.5px] text-white/35 border border-white/15 px-2 py-0.5 rounded-full font-light">
              Logistics
            </span>
          </Link>

         

          <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href={panelHref}
                  className="text-sm px-4 py-2 bg-[#8fa18d] text-white rounded-full hover:bg-[#6f7f6d] transition-all duration-200 font-medium"
                >
                  Ir al panel
                </Link>
                <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="text-sm px-5 py-2 bg-[#8fa18d] text-white rounded-full hover:bg-[#6f7f6d] transition-all duration-200 font-medium"
              >
                Ingresar como operador
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white/60 hover:text-white p-1.5 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#1a2420]/98 border-t border-white/8 px-6 py-5 flex flex-col gap-4">
            <a href="#como-funciona" className="text-sm text-white/60 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
              Cómo funciona
            </a>
            <a href="#funcionalidades" className="text-sm text-white/60 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
              Funcionalidades
            </a>
            <div className="pt-2 border-t border-white/10">
              {isSignedIn ? (
                <Link
                  href={panelHref}
                  className="block text-sm px-4 py-3 bg-[#8fa18d] text-white rounded-xl text-center font-medium hover:bg-[#6f7f6d] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Ir al panel
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="block text-sm px-4 py-3 bg-[#8fa18d] text-white rounded-xl text-center font-medium hover:bg-[#6f7f6d] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Ingresar como operador
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/shipping.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1614]/90 via-[#0d1614]/70 to-[#0d1614]/92" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/12 bg-white/5 backdrop-blur-sm text-[10px] uppercase tracking-[3px] text-white/45 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8fa18d] animate-pulse" aria-hidden="true" />
            Plataforma logística · LAMA Marketplace
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.0] tracking-tight mb-6">
            Cada envío
            <br />
            <span className="text-[#8fa18d]">cuenta una historia</span>
          </h1>

          <p className="text-base md:text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
            La plataforma logística de LAMA. Gestioná envíos, actualizá estados y
            hacé el seguimiento de cada entrega en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link
              href={isSignedIn ? panelHref : "/sign-in"}
              className="px-7 py-3.5 bg-[#8fa18d] text-white rounded-full font-semibold text-sm hover:bg-[#6f7f6d] transition-all duration-200 hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              Ingresar como operador
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="#como-funciona"
              className="px-7 py-3.5 border border-white/18 text-white/65 rounded-full font-medium text-sm hover:bg-white/8 hover:text-white transition-all duration-200 inline-flex items-center justify-center"
            >
              Ver cómo funciona
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {[
              { value: "+10k", label: "Envíos gestionados" },
              { value: "+500", label: "Operadores activos" },
              { value: "24/7", label: "Tiempo real" },
            ].map((s) => (
              <div
                key={s.label}
                className="py-4 px-3 rounded-2xl bg-white/6 border border-white/8 backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-[10px] text-white/35 mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25" aria-hidden="true">
          <span className="text-[9px] uppercase tracking-[3px]">Scroll</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ── */}
      <section id="como-funciona" className="py-28 px-6 bg-[#f6f1e7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[3px] text-[#8fa18d] font-medium">
              Funcionalidades
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#37413d] mt-3 leading-tight">
              Todo lo que necesitás<br className="hidden md:block" />
              para gestionar envíos
            </h2>
            <p className="text-[#37413d]/50 mt-4 text-sm max-w-lg mx-auto leading-relaxed">
              Herramientas diseñadas para que los operadores logísticos trabajen con precisión y velocidad.
            </p>
          </div>

          <div id="funcionalidades" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                    <path d="M16.5 9.4 7.55 4.24" />
                    <polyline points="3.29 7 12 12 20.71 7" />
                    <line x1="12" x2="12" y1="22" y2="12" />
                    <circle cx="18.5" cy="15.5" r="2.5" />
                    <path d="M20.27 17.27 22 19" />
                  </svg>
                ),
                title: "Registro de envíos",
                desc: "Recibí nuevos envíos automáticamente cuando la Seller App despacha un pedido del marketplace.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                ),
                title: "Estados en tiempo real",
                desc: "Avanzá el estado: en preparación → en camino → entregado. Cada cambio notifica automáticamente a todas las partes.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="14" x="2" y="7" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                ),
                title: "Código de seguimiento",
                desc: "Cada envío tiene un código único de rastreo. Trazabilidad completa desde el despacho hasta la entrega.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                    <line x1="10" x2="8" y1="9" y2="9" />
                  </svg>
                ),
                title: "Historial completo",
                desc: "Cada evento queda registrado: quién lo movió, cuándo y en qué estado. Auditoría total de cada envío.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl bg-[#ede6d8] border border-[#8fa18d]/10 hover:border-[#8fa18d]/35 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="w-11 h-11 rounded-xl bg-[#8fa18d]/12 flex items-center justify-center text-[#6f7f6d] mb-4 group-hover:bg-[#8fa18d] group-hover:text-white transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-[#37413d] mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-[#37413d]/55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="py-28 px-6 bg-[#1a2420]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[3px] text-[#8fa18d] font-medium">
              Panel logístico
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 leading-tight">
              Tu panel, en tiempo real
            </h2>
            <p className="text-white/35 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              Una interfaz clara y veloz para gestionar todos tus envíos asignados desde un solo lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-[#212e2a] rounded-2xl p-5 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-medium text-white/45 uppercase tracking-widest">
                  Envíos activos
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#8fa18d]/15 text-[#8fa18d]">
                  4 asignados
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { id: "ENV-8A2F", dir: "Av. Alem 1234, Bahía Blanca", estado: "En camino", dot: "bg-blue-400", badge: "bg-blue-400/15 text-blue-300" },
                  { id: "ENV-3K9L", dir: "San Martín 450, CABA", estado: "En preparación", dot: "bg-yellow-400", badge: "bg-yellow-400/15 text-yellow-300" },
                  { id: "ENV-7X1Q", dir: "Belgrano 789, Córdoba", estado: "Entregado", dot: "bg-[#8fa18d]", badge: "bg-[#8fa18d]/15 text-[#8fa18d]" },
                  { id: "ENV-2M5R", dir: "Rivadavia 100, Rosario", estado: "En camino", dot: "bg-blue-400", badge: "bg-blue-400/15 text-blue-300" },
                ].map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:bg-white/4 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#8fa18d]/10 flex items-center justify-center flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8fa18d" strokeWidth="2" aria-hidden="true">
                          <rect width="20" height="14" x="2" y="7" rx="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-mono text-white/70">#{e.id}</div>
                        <div className="text-[10px] text-white/30 truncate">{e.dir}</div>
                      </div>
                    </div>
                    <div className={`text-[10px] px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1.5 ${e.badge}`}>
                      <span className={`w-1 h-1 rounded-full ${e.dot}`} aria-hidden="true" />
                      {e.estado}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[#212e2a] rounded-2xl p-5 border border-white/5 flex-1">
                <span className="text-[11px] font-medium text-white/45 uppercase tracking-widest block mb-1">
                  Actualizar estado
                </span>
                <div className="text-[10px] text-white/25 font-mono mb-4">#ENV-8A2F</div>
                <div className="space-y-2">
                  {[
                    { label: "En preparación", done: true },
                    { label: "En camino", active: true },
                    { label: "Entregado", done: false },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-colors ${
                        s.active
                          ? "bg-[#8fa18d]/12 border border-[#8fa18d]/25"
                          : "border border-white/5"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          s.active ? "bg-[#8fa18d]" : s.done ? "bg-white/25" : "bg-white/10"
                        }`}
                        aria-hidden="true"
                      />
                      <span className={`text-xs ${s.active ? "text-[#8fa18d] font-medium" : "text-white/30"}`}>
                        {s.label}
                      </span>
                      {s.active && (
                        <span className="ml-auto text-[9px] text-[#8fa18d]/50 uppercase tracking-wider">
                          Actual
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#212e2a] rounded-2xl p-5 border border-white/5">
                <span className="text-[11px] font-medium text-white/45 uppercase tracking-widest block mb-3">
                  Código de seguimiento
                </span>
                <div className="bg-[#0d1614] rounded-lg px-3 py-2.5 font-mono text-xs text-[#8fa18d] tracking-widest border border-[#8fa18d]/12">
                  LAMA-2026-A7X9K
                </div>
                <p className="text-[10px] text-white/20 mt-2 leading-relaxed">
                  Código único de rastreo asignado al envío
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href={isSignedIn ? panelHref : "/sign-in"}
              className="inline-flex items-center gap-2 text-sm text-[#8fa18d] hover:text-white transition-colors duration-200 font-medium"
            >
              Acceder al panel completo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0d1614] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-lg font-bold text-white/75 tracking-tight">LAMA</span>
                <span className="text-[9px] uppercase tracking-[2px] text-white/25 border border-white/12 px-1.5 py-0.5 rounded-full">
                  Logistics
                </span>
              </div>
              <p className="text-xs text-white/28 leading-relaxed max-w-[190px]">
                Plataforma logística del marketplace LAMA. Moda usada, entregada con precisión.
              </p>
            </div>

            <div>
              <h3 className="text-[10px] uppercase tracking-[2.5px] text-white/35 mb-4 font-medium">
                Plataforma
              </h3>
              <ul className="space-y-3">
                {[
                  { label: "Inicio", href: "/" },
                  { label: "Cómo funciona", href: "#como-funciona" },
                  { label: "Funcionalidades", href: "#funcionalidades" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-xs text-white/35 hover:text-white/75 transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] uppercase tracking-[2.5px] text-white/35 mb-4 font-medium">
                Acceso
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/sign-in" className="text-xs text-white/35 hover:text-white/75 transition-colors">
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-xs text-white/35 hover:text-white/75 transition-colors">
                    Panel operador
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] uppercase tracking-[2.5px] text-white/35 mb-4 font-medium">
                Legal
              </h3>
              <ul className="space-y-3">
                {["Términos y condiciones", "Privacidad", "Soporte"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-xs text-white/35 hover:text-white/75 transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
            <span className="text-[11px] text-white/22">
              © {new Date().getFullYear()} LAMA Marketplace. Todos los derechos reservados.
            </span>
            <span className="text-[11px] text-white/18">
              Shipping App · Etapa 2 · IAW 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
