import Link from "next/link";
import styles from '@/app/ui/home.module.css';
import Image from "next/image";

//Header principal → #8fa18d
//Detalles → #6f7f6d
//Fondo crema → #f6f1e7
//Cards → #ede6d8
//Texto oscuro → #37413d

export default function Page() {
  return (
    <main className="min-h-screen bg-[#8FA18D] text-black flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-3 border-b-2 border-black/10 text-white bg-[#8FA08D]">
        
          <div className="flex -mb-2">
          <span className={styles.texto}>
            l
          </span>
          <span className={styles.texto}>
            a
          </span>
          <span className={styles.texto}>
            m
          </span>
          <span className={styles.texto}>
            a
          </span>
          </div>
        
        {/* className="px-5 py-2 border rounded-full border-white/40 text-2sm font-medium text-white/80 hover:bg-[#C3E8CD] hover:text-[#0C3B06] transition-all duration-200" */}
        <Link
          href="/sign-in"
          className = {styles.boton}
        >
          Iniciar sesión
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center text-center px-6 py-10 relative overflow-hidden bg-[#f6f1e7]">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[420px] rounded-full border-2 border-[#6f7f6d]/0" />
        </div>

        
        <Image
          src="/truck2.png"
          width={155}
          height={100}
          className="absolute top-[160px] left-[130px] hover:translate-x-20 transition-transform duration-400"
          alt=""
        />
       

        
        <Image
          src="/truck2.png"
          width={155}
          height={100}
          className="absolute top-[160px] right-[130px] hover:translate-x-20 transition-transform duration-400  "
          alt=""
        />
      

        {/* Tag */}
        <div className="mb-6 font-semibold inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border-5 border-[#ede6d8]/100 bg-[#ede6d8]/100 text-xs text-[#37413d]/100 uppercase tracking-[2.5px] font-light">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Interfaz de operadores logísticos
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-7xl text-[#37413d]/80 font-semibold tracking-tight leading-[1.05] mb-4 max-w-5xl">
          Gestor de envíos
        </h1>

        <p className="text-[#37413d]/50 text-lg md:text-xl max-w-lg mb-6 leading-tight">
          Actualiza estados, gestiona el historial de entregas y mantén
          informados a compradores y vendedores en tiempo real sobre la compra de su producto.
        </p>

        {/* CTA */}
        <Link
          href="/sign-in"
          className="group inline-flex items-center gap-1 px-8 py-4 bg-[#ede6d8] text-[#37413d] rounded-full font-medium text-base hover:bg-[#6f7f6d]/50 transition-all duration-200 hover:gap-2"
        >
          Ingresar al panel
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>

        <div className="flex gap-2">
          <div className="flex justify-center mt-3 -mb-8">
            <Image
              src="/box2.png"
              width={55}
              height={70}
              className="hidden md:block opacity-25"
              alt="Screenshots of the dashboard project showing desktop version"
            />
          </div> 
          <div className="flex justify-center mt-3 -mb-8">
            <Image
              src="/box2.png"
              width={55}
              height={70}
              className="hidden md:block opacity-50"
              alt="Screenshots of the dashboard project showing desktop version"
            />
          </div>
          <div className="flex justify-center mt-3 -mb-8">
            <Image
              src="/box2.png"
              width={55}
              height={70}
              className="hidden md:block opacity-75"
              alt="Screenshots of the dashboard project showing desktop version"
            />
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-t-2 border-black/10 px-8 py-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2 bg-[#6f7f6d]/60 p-3 rounded-xl">
            <div className="flex gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/60"
                >
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                  <path d="M16.5 9.4 7.55 4.24" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" x2="12" y1="22" y2="12" />
                  <circle cx="18.5" cy="15.5" r="2.5" />
                  <path d="M20.27 17.27 22 19" />
                </svg>
              </div>
                <h3 className="text-2sm font-medium text-[white]/80 py-1">
                Seguimiento en tiempo real
                </h3>
            </div>  
            <p className="text-xs text-white/40 leading-relaxed">
              Actualiza el estado de cada envío y el comprador lo ve al
              instante.
            </p>
          </div>

          <div className="flex flex-col gap-2 bg-[#6f7f6d]/60 p-3 rounded-xl">
            <div className="flex gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/60"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                  <line x1="10" x2="8" y1="9" y2="9" />
                </svg>
              </div>
                <h3 className="text-2sm font-medium text-[white]/80 py-1">
                Historial completo
                </h3>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              Cada evento del envío queda registrado con fecha, estado y
              operador asignado.
            </p>
          </div>

          <div className="flex flex-col gap-2 bg-[#6f7f6d]/60 p-3 rounded-xl">
            <div className="flex gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/60"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
                <h3 className="text-2sm font-medium text-[white]/80 py-1">
                Multi-operador
                </h3>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              Cada operador logístico accede a sus envíos asignados de forma
              independiente.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-2 flex items-center justify-between">
        <span className="text-xs text-white/30">
          lama © {new Date().getFullYear()}
        </span>
        <span className="text-xs text-white/30">Shipping App</span>
      </footer>
    </main>
  );
}