

/* ========== SNR SENAL ========== */
function evaluarEstabilidad() {
    const texto = document.getElementById('valores').value;
    const valores = texto.split(',')
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

    const resultado = document.getElementById('resultadoSNR');

    if (valores.length === 0) {
        resultado.textContent = "Ingresar valores validos";
        return;
    }

    const max = Math.max(...valores);
    const min = Math.min(...valores);
    const diferencia = max - min;

    const estable = diferencia < 4;
    resultado.textContent =
        `Diferencia: ${diferencia.toFixed(2)} dB → Señal ${estable ? 'ESTABLE ✅' : 'INESTABLE ❌'}`;
}

/* Limpia SNR */
function limpiarSNR() {
    const btn = document.getElementById('limpiarSNRBtns');
    btn.style.backgroundColor = "red";
    setTimeout(() => btn.style.backgroundColor = "black", 800);

    document.getElementById('valores').value = "";
    document.getElementById('resultadoSNR').textContent = "";
}

/* ========== RX Verificacion de Nivel FTTH ========== */
function verificarNivel() {
    const valor = parseFloat(document.getElementById('rxValue').value);
    const resultado = document.getElementById('resultadoRX');
    const barra = document.getElementById('barra');

    if (isNaN(valor)) {
        resultado.textContent = "Ingresar un numero valido";
        barra.className = "bar";
        return;
    }

    barra.className = "bar";

    if (valor > -6) {
        resultado.textContent = "El nivel es NO ACEPTABLE ❌";
        barra.classList.add("noaceptable");
    } else if (valor >= -8.9) {
        resultado.textContent = "El nivel es ACEPTABLE ⚠️";
        barra.classList.add("aceptable");
    } else if (valor >= -21.9) {
        resultado.textContent = "El nivel es OPTIMO ✅";
        barra.classList.add("optimo");
    } else if (valor >= -24.9) {
        resultado.textContent = "El nivel es ACEPTABLE ⚠️";
        barra.classList.add("aceptable");
    } else if (valor >= -40) {
        resultado.textContent = "El nivel es NO ACEPTABLE ❌";
        barra.classList.add("noaceptable");
    } else {
        resultado.textContent = "Valor fuera de rango.";
    }
}

/* Limpia RX */
function limpiarRX() {
    const btn = document.getElementById('limpiarRXBtn');
    btn.style.backgroundColor = "red";
    setTimeout(() => btn.style.backgroundColor = "black", 800);

    document.getElementById('rxValue').value = "";
    document.getElementById('resultadoRX').textContent = "";
    document.getElementById('barra').className = "bar";
}
