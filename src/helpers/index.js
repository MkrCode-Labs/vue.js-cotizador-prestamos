

const calcularTotalPagar = (cantidad, plazo) => {
    let totalPagar = 0

    //mientras mayor es la cantidad, menor es el interes a pagar
    if (cantidad < 5000) totalPagar = cantidad * 1.5
    if (cantidad >= 5000 && cantidad < 10000) totalPagar = cantidad * 1.4
    if (cantidad >= 10000 && cantidad < 15000) totalPagar = cantidad * 1.3
    if (cantidad >= 15000 && cantidad <= 20000) totalPagar = cantidad * 1.2

    // plazo - mas plazo, mas interes
    if (plazo === 6) totalPagar *= 1.1
    if (plazo === 12) totalPagar *= 1.2
    if (plazo === 24) totalPagar *= 1.3

    return totalPagar

}



export {
    calcularTotalPagar
}