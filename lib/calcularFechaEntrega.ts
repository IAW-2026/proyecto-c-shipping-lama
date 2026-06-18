
function esHoraHabil(date: Date): boolean {
  const dia = date.getDay() // 0=domingo, 6=sábado
  const hora = date.getHours()
  return dia >= 1 && dia <= 5 && hora >= 8 && hora < 18
}

function agregarHorasHabiles(desde: Date, horas: number): Date {
  const resultado = new Date(desde)
  let horasRestantes = horas

  while (horasRestantes > 0) {
    resultado.setHours(resultado.getHours() + 1)
    if (esHoraHabil(resultado)) {
      horasRestantes--
    }
  }

  return resultado
}

export function calcularFechaEstimada(direccion: string, fechaCreacion: Date): Date {
  const esBahiaBlanca = direccion.toLowerCase().includes('bahía blanca') ||
                        direccion.toLowerCase().includes('bahia blanca')

  const horasHabiles = esBahiaBlanca ? 24 : 72
  return agregarHorasHabiles(fechaCreacion, horasHabiles)
}