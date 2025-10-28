let usuarioActualDisplay = ""; 
let usuarioActualRealizado = ""; 
const USUARIO_STORAGE_KEY = 'adpUsuarioActualDisplay'; 

// cargar sesion
function cargarSesion() {
    const usuarioGuardado = localStorage.getItem(USUARIO_STORAGE_KEY);
    
    if (usuarioGuardado) {
        usuarioActualDisplay = usuarioGuardado; 
        
        // realizado por
        const nombreADP = usuarioGuardado.split(' - ')[0]; 
        usuarioActualRealizado = `${nombreADP} - MESA MULTISKILL HITSSS`; 

        document.getElementById('usuarioActualTexto').innerText = usuarioActualDisplay;
        document.getElementById('login').style.display = "none";
        document.getElementById('app').style.display = "block";
        
        
        document.getElementById('realizado').innerText = usuarioActualRealizado; 
    } else {
        // visible login
        document.getElementById('login').style.display = "block";
        document.getElementById('app').style.display = "none";
    }
}

// login
function login() {
  const nombre = document.getElementById('nombreADP').value.trim();
  const usuarioE = document.getElementById('usuarioE').value.trim();

  if (!nombre || !usuarioE) {
    alert("Por favor ingresa tu nombre y usuario E.");
    return;
  }

  
  usuarioActualDisplay = `${nombre} - ${usuarioE}`; 
  
 
  usuarioActualRealizado = `${nombre} - MESA MULTISKILL HITSSS`; 
  
  //guardar LocalStorage
  localStorage.setItem(USUARIO_STORAGE_KEY, usuarioActualDisplay);

  document.getElementById('usuarioActualTexto').innerText = usuarioActualDisplay;
  document.getElementById('login').style.display = "none";
  document.getElementById('app').style.display = "block";
  
  //iniciar con nombre
  document.getElementById('realizado').innerText = usuarioActualRealizado; 
}

// cerrrar sesion
function cerrarSesion() {
    
    localStorage.removeItem(USUARIO_STORAGE_KEY);

    document.getElementById('login').style.display = "block";
    document.getElementById('app').style.display = "none";
    document.getElementById('nombreADP').value = "";
    document.getElementById('usuarioE').value = "";
    usuarioActualDisplay = "";
    usuarioActualRealizado = "";
    limpiarTexto();
    limpiarSNR();
    limpiarRX();
}

// procesar texto
function procesarTexto() {
  const btn = document.getElementById('procesarBtn');
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 600);

  const text = document.getElementById('texto').value;
  if (!text.trim()) {
    alert("Por favor pega el texto primero.");
    return;
  }

  function buscarCampo(etiqueta) {
    const regex = new RegExp(`${etiqueta}\\s*[:\\-]*\\s*(.+)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : "No detectado";
  }

  function sumarUnDiaSimple(fechaTexto) {
    const partes = fechaTexto.split("/");
    if (partes.length !== 3) return fechaTexto;
    let [dia, mes, anio] = partes.map(p => p.trim());
    
    // Convertir a objeto fecha 
    const fechaObj = new Date(anio, mes - 1, dia);
    if (isNaN(fechaObj.getTime())) return fechaTexto;
    
    fechaObj.setDate(fechaObj.getDate() + 1);

    let nuevoDia = String(fechaObj.getDate()).padStart(2, "0");
    let nuevoMes = String(fechaObj.getMonth() + 1).padStart(2, "0"); 
    let nuevoAnio = fechaObj.getFullYear();
    
    return `${nuevoDia}/${nuevoMes}/${nuevoAnio}`;
  }

  function buscarFranja() {
    const regex = /(\b[A-Z]{1,2}\d{1,2}\b)\s*(Intervalo\s*de\s*tiempo)?/i; 
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  }

  const sot = buscarCampo("SOT");
  const codigo = buscarCampo("C[óo]digo\\s+de\\s+Cliente");
  const cliente = buscarCampo("Nombre");
  const telefono = buscarCampo("Tel[eé]fono");
  const plano = buscarCampo("Plano");
  const direccion = buscarCampo("Direccion");
  const distrito = buscarCampo("Distrito");
  const servicio = buscarCampo("Tipo\\s+de\\s+Orden");
  const subtipo = buscarCampo("Sub\\s+Tipo\\s+de\\s+Orden");
  const fechaRaw = buscarCampo("Fecha\\s+de\\s+Programaci[óo]n");
  const franja = buscarFranja();

  let fechaFinal = "No detectado";
  if (fechaRaw !== "No detectado") {
    const fechaSumada = sumarUnDiaSimple(fechaRaw.trim());
    fechaFinal = franja ? `${fechaSumada} - ${franja}` : fechaSumada;
  }

  document.getElementById('sot').innerText = sot;
  document.getElementById('codigo').innerText = codigo;
  document.getElementById('cliente').innerText = cliente;
  document.getElementById('telefono').innerText = telefono;
  document.getElementById('plano').innerText = plano;
  document.getElementById('direccion').innerText = direccion;
  document.getElementById('distrito').innerText = distrito;
  document.getElementById('servicio').innerText = servicio;
  document.getElementById('subtipo').innerText = subtipo;
  document.getElementById('fecha').innerText = fechaFinal;
  
  
  document.getElementById('realizado').innerText = usuarioActualRealizado; 
}
//copiar plantilla
function copiarPlantilla() {
  const campos = [
    "*FUERA DE TOA*",
    "📥 SOT: " + document.getElementById("sot").innerText,
    "⚙️ SUB TIPO: " + document.getElementById("subtipo").innerText,
    "🏡 DIRECCIÓN: " + document.getElementById("direccion").innerText,
    "📍 DISTRITO: " + document.getElementById("distrito").innerText,
    "⚒️ SERVICIO: " + document.getElementById("servicio").innerText,
    "🪚 PLANO: " + document.getElementById("plano").innerText,
    "👨‍💻 CLIENTE: " + document.getElementById("cliente").innerText,
    "🔣 COD. CLIENTE: " + document.getElementById("codigo").innerText,
    "📱 CELULAR DEL CLIENTE: " + document.getElementById("telefono").innerText,
    "📅 FECHA Y FRANJA: " + document.getElementById("fecha").innerText,
    "✍️ REALIZADO POR: " + document.getElementById("realizado").innerText
  ];

  navigator.clipboard.writeText(campos.join("\n")).then(() => {
    alert("✅ Plantilla copiada al portapapeles");
  });
}

function limpiarTexto() {
  const btn = document.getElementById('limpiarBtn');
  btn.style.backgroundColor = "red";
  setTimeout(() => btn.style.backgroundColor = "black", 2500);
  document.getElementById('texto').value = "";
  document.querySelectorAll("#plantilla span").forEach(span => {
      if(span.id !== 'realizado') { 
          span.innerText = "No detectado"; 
      }
  });
  // Aseguro que el nombre de usuario este presente
  document.getElementById('realizado').innerText = usuarioActualRealizado; 
}


// evaluar valores
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

function limpiarSNR() {
    const btn = document.getElementById('limpiarSNRBtns');
    btn.style.backgroundColor = "red";
    setTimeout(() => btn.style.backgroundColor = "black", 2500);
    document.getElementById('valores').value = "";
    document.getElementById('resultadoSNR').textContent = "";
}

// verificar niveles
function verificarNivel() {
  const valor = parseFloat(document.getElementById('rxValue').value);
  const resultado = document.getElementById('resultadoRX');
  const barra = document.getElementById('barra');

  if (isNaN(valor)) {
    resultado.textContent = "Por favor ingrese un número válido.";
    barra.className = "bar";
    return;
  }
  
  // Resetear bar
  barra.className = "bar";

  if (valor > 3 || valor < -40) { 
    resultado.textContent = "Valor fuera de rango.";
  } else if (valor > -6) {
    resultado.textContent = "El nivel es NO ACEPTABLE ❌";
    barra.className = "bar noaceptable";
  } else if (valor >= -8.9) { 
    resultado.textContent = "El nivel es ACEPTABLE ⚠️";
    barra.className = "bar aceptable";
  } else if (valor >= -21.9) { 
    resultado.textContent = "El nivel es ÓPTIMO ✅";
    barra.className = "bar optimo";
  } else if (valor >= -24.9) { 
    resultado.textContent = "El nivel es ACEPTABLE ⚠️";
    barra.className = "bar aceptable";
  } else { // Covers -25 to -40
    resultado.textContent = "El nivel es NO ACEPTABLE ❌";
    barra.className = "bar noaceptable";
  }
}

function limpiarRX() {
    const btn = document.getElementById('limpiarRXBtn');
    btn.style.backgroundColor = "red";
    setTimeout(() => btn.style.backgroundColor = "black", 2500);
    document.getElementById('rxValue').value = "";
    document.getElementById('resultadoRX').textContent = "";
    document.getElementById('barra').className = "bar";
}


// escuchar
document.addEventListener("DOMContentLoaded", () => {
    
    cargarSesion();
    
    // extraer eventos
    document.getElementById("procesarBtn").addEventListener("click", procesarTexto);
    document.getElementById("copiarBtn").addEventListener("click", copiarPlantilla);
    document.getElementById("limpiarBtn").addEventListener("click", limpiarTexto);
    
    // dar enter o espacio
    document.getElementById("texto").addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.code === "Space") {
            e.preventDefault();
            procesarTexto();
        }
    });

    // snr eventos
    document.getElementById("evaluarBtn").addEventListener("click", evaluarEstabilidad);
    document.getElementById("limpiarSNRBtns").addEventListener("click", limpiarSNR);

    // rx eventos
    document.getElementById("verificarBtn").addEventListener("click", verificarNivel);
    document.getElementById("limpiarRXBtn").addEventListener("click", limpiarRX);

  
    document.getElementById("rxValue").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        verificarNivel();
      }
    });
});