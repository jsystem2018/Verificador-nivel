// --- Evaluador de Estabilidad SNR ---
function evaluarEstabilidad() {
  const texto = document.getElementById('valores').value;
  const valores = texto.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
  const resultado = document.getElementById('resultadoSNR');

  if (valores.length === 0) {
    resultado.textContent = 'Por favor ingresa valores válidos.';
    return;
  }

  const max = Math.max(...valores);
  const min = Math.min(...valores);
  const diferencia = max - min;
  const estable = diferencia < 4;
  const mensaje = `Diferencia: ${diferencia.toFixed(2)} dB → Señal ${estable ? 'ESTABLE ✅' : 'INESTABLE ❌'}`;
  resultado.textContent = mensaje;
}

// --- Verificador de Nivel RX ---
function verificarNivel() {
  const valor = parseFloat(document.getElementById('rxValue').value);
  const resultado = document.getElementById('resultadoRX');
  const barra = document.getElementById('barra');

  if (isNaN(valor)) {
    resultado.textContent = "Por favor ingrese un número válido.";
    barra.className = "bar";
    return;
  }

  if (valor <= 3 && valor >= -6) {
    resultado.textContent = "El nivel es NO ACEPTABLE ❌";
    barra.className = "bar noaceptable";
  } else if (valor <= -6.1 && valor >= -8.9) {
    resultado.textContent = "El nivel es ACEPTABLE ⚠️";
    barra.className = "bar aceptable";
  } else if (valor <= -9 && valor >= -21.9) {
    resultado.textContent = "El nivel es ÓPTIMO ✅";
    barra.className = "bar optimo";
  } else if (valor <= -22 && valor >= -24.9) {
    resultado.textContent = "El nivel es ACEPTABLE ⚠️";
    barra.className = "bar aceptable";
  } else if (valor <= -25 || valor < -40) {
    resultado.textContent = "El nivel es NO ACEPTABLE ❌";
    barra.className = "bar noaceptable";
  } else {
    resultado.textContent = "Valor fuera de rango.";
    barra.className = "bar";
  }
}

// Eventos
document.getElementById("evaluarBtn").addEventListener("click", evaluarEstabilidad);
document.getElementById("verificarBtn").addEventListener("click", verificarNivel);

// Enter para RX
document.getElementById("rxValue").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    verificarNivel();
  }
});
