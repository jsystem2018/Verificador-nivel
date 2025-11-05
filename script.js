let usuarioActualDisplay = ""; 
let usuarioActualRealizado = ""; 
const USUARIO_STORAGE_KEY = 'adpUsuarioActualDisplay'; 
let motivoReprogramacion = null; 

// Plantilla de Atencion Fuera de TOA
const PLANTILLA_ATENCION_FUERA_TOA = `
---------------------
Proceder con atencion fuera de TOA 
Motivo: SOT sin flujo TOA 
Autorizado por: (Mesa de programaciones HITSS)
`.trim();


// --- LOGIN ---

function cargarSesion() {
    const usuarioGuardado = localStorage.getItem(USUARIO_STORAGE_KEY);
    
    if (usuarioGuardado) {
        usuarioActualDisplay = usuarioGuardado; 
        
        const nombreADP = usuarioGuardado.split(' - ')[0]; 
        usuarioActualRealizado = `${nombreADP} - MESA MULTISKILL HITSSS`; 

        document.getElementById('usuarioActualTexto').innerText = usuarioActualDisplay;
        document.getElementById('login').style.display = "none";
        document.getElementById('app').style.display = "block";
        
        if (document.getElementById('realizado')) {
             document.getElementById('realizado').innerText = usuarioActualRealizado; 
        }
    } else {
        document.getElementById('login').style.display = "block";
        document.getElementById('app').style.display = "none";
    }
}

function login() {
  const nombre = document.getElementById('nombreADP').value.trim();
  const usuarioE = document.getElementById('usuarioE').value.trim();

  if (!nombre || !usuarioE) {
    alert("Por favor ingresa tu nombre y usuario E.");
    return;
  }

  usuarioActualDisplay = `${nombre} - ${usuarioE}`; 
  usuarioActualRealizado = `${nombre} - MESA MULTISKILL HITSSS`; 
  
  localStorage.setItem(USUARIO_STORAGE_KEY, usuarioActualDisplay);

  document.getElementById('usuarioActualTexto').innerText = usuarioActualDisplay;
  document.getElementById('login').style.display = "none";
  document.getElementById('app').style.display = "block";
  
  if (document.getElementById('realizado')) {
      document.getElementById('realizado').innerText = usuarioActualRealizado; 
  }
}

function cerrarSesion() {
    localStorage.removeItem(USUARIO_STORAGE_KEY);

    document.getElementById('login').style.display = "block";
    document.getElementById('app').style.display = "none";
    document.getElementById('nombreADP').value = "";
    document.getElementById('usuarioE').value = "";
    usuarioActualDisplay = "";
    usuarioActualRealizado = "";
    limpiarTexto();
    if(typeof limpiarSNR === 'function') limpiarSNR();
    if(typeof limpiarRX === 'function') limpiarRX();
    if(typeof limpiarRechazo === 'function') limpiarRechazo();
    if(typeof limpiarLlamadas === 'function') limpiarLlamadas();
}

// --- FUNCIONES AUXILIARES DE BUSQUEDA Y FECHA ---

function sumarUnDiaSimple(fechaTexto) {
    const partes = fechaTexto.split("/");
    if (partes.length !== 3) return fechaTexto;
    
    let dia = Number(partes[0].trim());
    let mes = Number(partes[1].trim()); 
    let anio = Number(partes[2].trim());

    if (anio < 100 && anio >= 0) {
        anio += 2000;
    }

    const fechaObj = new Date(anio, mes - 1, dia); 
    
    if (isNaN(fechaObj.getTime())) return fechaTexto;
    
    fechaObj.setDate(fechaObj.getDate() + 1);

    let nuevoDia = String(fechaObj.getDate()).padStart(2, "0");
    let nuevoMes = String(fechaObj.getMonth() + 1).padStart(2, "0"); 
    
    return `${nuevoDia}/${nuevoMes}`; 
}

function buscarCampo(text, etiqueta) {
    const regex = new RegExp(`${etiqueta}\\s*[:\\-]*\\s*([^\\n\\r]+)`, "is"); 
    const match = text.match(regex);
    
    return match ? match[1].trim() : "No detectado";
}

function buscarDato(text, etiqueta) {
    const regex = new RegExp(`${etiqueta}\\s*[:\\-]*\\s*([^\\n\\r]+)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : "NO ENCONTRADO";
}

function buscarContrata(text) {
    const contrataRegex = /(MANT|INST)\s*([A-Z]+)/;
    const contrataMatch = text.match(contrataRegex);

    if (contrataMatch && contrataMatch[2]) {
        return contrataMatch[2].trim().toUpperCase();
    }
    
    return "NULL";
}

// --- SINCRONIZAR DE DATOS REPROGRAMACION---


function propagarCambiosAReprogramacion() {
    // 1 Obtener el valor actualizado del campo editable (Telefono)
    const cliente = document.getElementById('cliente').innerText;
    const telefonoRepro = document.getElementById('inputTelefono') ? document.getElementById('inputTelefono').value : '---';
    
    //  OBTENER VALOR ACTUALIZADO DEL CAMPO DE FECHA Y FRANJA
    const fechaFinal = document.getElementById('inputFecha') ? document.getElementById('inputFecha').value : document.getElementById('fecha').innerText;

    // 2 Otros campos se mantienen
    const contrata = document.getElementById('reproContrata').innerText; 
    const realizado = document.getElementById('reproRealizado').innerText;
    const motivo = document.getElementById('reproMotivo').innerText;

    // 3 Actualizar la seccion de reprogramacion
    document.getElementById('reproCliente').innerText = cliente === 'No detectado' ? '---' : cliente;
    document.getElementById('reproTelefono').innerText = telefonoRepro; 
    document.getElementById('reproFecha').innerText = fechaFinal === 'No detectado' ? '---' : fechaFinal; // <-- VALOR ACTUALIZADO DE FECHA
    document.getElementById('reproContrata').innerText = contrata;
    document.getElementById('reproRealizado').innerText = realizado;
    document.getElementById('reproMotivo').innerText = motivo;
}


/**
 * Funcion que inserta un input editable para el numero de telefono
 
 */
function actualizarCampoTelefono(telefono) {
    const contenedor = document.getElementById('telefono');
    let valorFinal = telefono;

    if (valorFinal === "No detectado") {
        valorFinal = "NULL";
    }

    // Inyecta el campo input
    contenedor.innerHTML = `<input type="text" id="inputTelefono" value="${valorFinal}" class="editable-input-adp">`;

    // Estilo basico
    const input = document.getElementById('inputTelefono');
    if (input) {
        input.style.border = '1px solid gray';
        input.style.padding = '2px';
        /*input.style.width = '100%'; */

         /*border: 1px solid gray;*/
  /*input.style.padding= '2px;'*/
  input.style.width= '50%';          /*  ancho mas pequeno */
  input.style.display ='inline-block'; /* se mantiene en la misma linea que el texto */
  
        
        // ANADIR EVENT LISTENER
        input.addEventListener('input', propagarCambiosAReprogramacion);
    }
}

/**
 *   Inserta un input editable para la Fecha y Franja
 */
function actualizarCampoFecha(fecha) {
    const contenedor = document.getElementById('fecha');
    let valorFinal = fecha;

    if (valorFinal === "No detectado") {
        valorFinal = "DD/MM - FR1"; // Valor por defecto util
    }

    // Inyecta el campo input
    contenedor.innerHTML = `<input type="text" id="inputFecha" value="${valorFinal}" class="editable-input-adp">`;

    // Estilo basico
    const input = document.getElementById('inputFecha');
    if (input) {
        input.style.border = '1px solid gray';
        input.style.padding = '2px';
       /* input.style.width = '100%';*/ 

  input.style.width= '50%';          /* ancho mas pequeño */
  input.style.display ='inline-block'; /*  se mantiene en la misma línea que el texto */
        
        // ANADIR EVENT LISTENER
        input.addEventListener('input', propagarCambiosAReprogramacion);
    }
}


// ---  EXTRAER (ADP) ---

function procesarTexto() {
  const btn = document.getElementById('procesarBtn');
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 600);

  const text = document.getElementById('texto').value;
  if (!text.trim()) {
    alert("Por favor pega el texto primero.");
    return;
  }

  function buscarFranja() {
    const regex = /(\b[A-Z]{1,2}\d{1,2}\b)\s*(Intervalo\s*de\s*tiempo)?/i; 
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  }

  const sot = buscarCampo(text, "SOT");
  const codigo = buscarCampo(text, "C[óo]digo\\s+de\\s+Cliente");
  const cliente = buscarCampo(text, "Nombre");
  
  // BUSCAR TELEFONO
  let telefono = buscarCampo(text, "Telefono"); 
  if (telefono === "No detectado") {
      const telefonoSecundario = buscarCampo(text, "NUMERO:");
      if (telefonoSecundario !== "No detectado") {
          telefono = telefonoSecundario;
      }
  }
 
  const plano = buscarCampo(text, "Plano");
  const direccion = buscarCampo(text, "Direccion"); 
  const distrito = buscarCampo(text, "Distrito");
  const servicio = buscarCampo(text, "Tipo\\s+de\\s+Orden");
  const subtipo = buscarCampo(text, "Sub\\s+Tipo\\s+de\\s+Orden");
  const fechaRaw = buscarCampo(text, "Fecha\\s+de\\s+Programaci[óo]n");
  const franja = buscarFranja();
  const contrata = buscarContrata(text); 

  let fechaFinal = "No detectado";
  if (fechaRaw !== "No detectado") {
    const fechaSumadaDDMM = sumarUnDiaSimple(fechaRaw.trim()); 
    fechaFinal = franja ? `${fechaSumadaDDMM} - ${franja}` : fechaSumadaDDMM; 
  }

  document.getElementById('sot').innerText = sot;
  document.getElementById('codigo').innerText = codigo;
  document.getElementById('cliente').innerText = cliente;
  
  // Inyecta el input editable del telEfono con listener
  actualizarCampoTelefono(telefono); 

  document.getElementById('plano').innerText = plano;
  document.getElementById('direccion').innerText = direccion;
  document.getElementById('distrito').innerText = distrito;
  document.getElementById('servicio').innerText = servicio;
  document.getElementById('subtipo').innerText = subtipo;
  
  // Inyecta el input editable de fecha con listener
  actualizarCampoFecha(fechaFinal);
  
  document.getElementById('realizado').innerText = usuarioActualRealizado; 

  // Inicializa la secciOn de reprogramaciOn
  procesarReprogramacion(cliente, telefono, fechaFinal, contrata);
}


// --- REPRO Y COPIAR PLANTILLA ---

function procesarReprogramacion(cliente, telefonoInicial, fechaFinal, contrata) {
    const checkCliente = document.getElementById('reprogramarCliente');
    const checkNoResponde = document.getElementById('reprogramarNoResponde');
    
    checkCliente.checked = false;
    checkNoResponde.checked = false;
    motivoReprogramacion = null;

    document.getElementById('reproCliente').innerText = cliente === 'No detectado' ? '---' : cliente;
    
    // Al inicio, toma el valor del input recien creado o del valor extraido
    const telefonoRepro = document.getElementById('inputTelefono') ? document.getElementById('inputTelefono').value : (telefonoInicial === 'No detectado' ? '---' : telefonoInicial);

    document.getElementById('reproTelefono').innerText = telefonoRepro;
    document.getElementById('reproFecha').innerText = fechaFinal === 'No detectado' ? '---' : fechaFinal;
    document.getElementById('reproContrata').innerText = contrata;
    document.getElementById('reproRealizado').innerText = usuarioActualRealizado;
    
    document.getElementById('reproObservacion').innerText = ''; 
    document.getElementById('reproCodLlamada').innerText = ''; 
    document.getElementById('reproMotivo').innerText = '';

    checkCliente.onchange = () => {
        if (checkCliente.checked) {
            checkNoResponde.checked = false; 
            motivoReprogramacion = checkCliente.value;
        } else {
            motivoReprogramacion = null;
        }
        document.getElementById('reproMotivo').innerText = motivoReprogramacion || '';
        propagarCambiosAReprogramacion(); 
    };

    checkNoResponde.onchange = () => {
        if (checkNoResponde.checked) {
            checkCliente.checked = false; 
            motivoReprogramacion = checkNoResponde.value;
        } else {
            motivoReprogramacion = null;
        }
        document.getElementById('reproMotivo').innerText = motivoReprogramacion || '';
        propagarCambiosAReprogramacion(); 
    };
}

function copiarPlantilla() {
  // Obtener el valor de los campos editables
  const celularCliente = document.getElementById('inputTelefono') ? document.getElementById('inputTelefono').value : 'NULL';
  const fechaYFranja = document.getElementById('inputFecha') ? document.getElementById('inputFecha').value : document.getElementById('fecha').innerText;

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
    "📱 CELULAR DEL CLIENTE: " + celularCliente, 
    "📅 FECHA Y FRANJA: " + fechaYFranja,
    "✍️ REALIZADO POR: " + document.getElementById("realizado").innerText
  ];

  let plantillaCompleta = campos.join("\n");

  // 1 REPROGRAMACION
  if (motivoReprogramacion) {
        const reproMotivo = document.getElementById('reproMotivo').innerText;
        const reproCliente = document.getElementById('reproCliente').innerText;
        const reproTelefono = document.getElementById('reproTelefono').innerText; 
        const reproFecha = document.getElementById('reproFecha').innerText;
        const reproObservacion = document.getElementById('reproObservacion').innerText;
        const reproContrata = document.getElementById('reproContrata').innerText;
        const reproRealizado = document.getElementById('reproRealizado').innerText;
        const reproCodLlamada = document.getElementById('reproCodLlamada').innerText;

        const plantillaRepro = [
            "\n\n--------------------\n\n",
            "MESA MULTISKILL HITSS",
            "REPROGRAMADO EN MESA / REAGENDADO POR CLIENTE",
            `MOTIVO DE REPROGRAMACIÓN: ${reproMotivo}`,
            `CLIENTE: ${reproCliente}`,
            `TELÉFONO: ${reproTelefono}`,
            `NUEVA FECHA Y FRANJA DE VISITA: ${reproFecha}`,
            `OBSERVACIÓN: ${reproObservacion}`,
            `CONTRATA: ${reproContrata}`,
            `REALIZADO POR: ${reproRealizado}`,
            `CÓD LLAMADA: ${reproCodLlamada}`
        ];

        plantillaCompleta += plantillaRepro.join("\n");
  }

  // 2 NUEVA PLANTILLA DE ATENCION FUERA DE TOA
  plantillaCompleta += `\n\n${PLANTILLA_ATENCION_FUERA_TOA}`;


  navigator.clipboard.writeText(plantillaCompleta).then(() => {
    alert("✅ Plantilla(s) copiada(s) al portapapeles");
  });
}

function limpiarTexto() {
  const btn = document.getElementById('limpiarBtn');
  btn.style.backgroundColor = "red";
  setTimeout(() => btn.style.backgroundColor = "black", 2500);
  document.getElementById('texto').value = "";
  
  document.querySelectorAll("#plantilla span").forEach(span => {
      if(span.id === 'telefono' || span.id === 'fecha') {
          // Limpia los inputs del telefono y fecha
          span.innerHTML = '<span>No detectado</span>'; 
      } else if(span.id !== 'realizado') { 
          span.innerText = "No detectado"; 
      }
  });

  // Vuelve a inyectar los inputs con listeners
  actualizarCampoTelefono("No detectado"); 
  actualizarCampoFecha("No detectado");
  
  document.getElementById('realizado').innerText = usuarioActualRealizado; 
  
  document.getElementById('reprogramarCliente').checked = false;
  document.getElementById('reprogramarNoResponde').checked = false;
  motivoReprogramacion = null;
  document.getElementById('reproMotivo').innerText = ''; 
  
  // Limpia los campos de reprogramacion
  propagarCambiosAReprogramacion(); 
}


// ---  (SNR, RX, RECHAZO, LLAMADAS) --- 

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

function verificarNivel() {
  const valor = parseFloat(document.getElementById('rxValue').value);
  const resultado = document.getElementById('resultadoRX');
  const barra = document.getElementById('barra');

  if (isNaN(valor)) {
    resultado.textContent = "Por favor ingrese un número válido.";
    barra.className = "bar";
    return;
  }
  
  barra.className = "bar";
  
  if (valor > -6) {
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
  } else if (valor >= -40) { 
    resultado.textContent = "El nivel es NO ACEPTABLE ❌";
    barra.className = "bar noaceptable";
  } else {
    resultado.textContent = "Valor fuera de rango.";
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


function generarPlantilla(motivo) {
    const text = document.getElementById('textoRechazo').value;
    const asesor = usuarioActualRealizado.split(' - ')[0].trim(); 

    if (!text.trim()) {
        alert("⚠️ Por favor, pega el texto en el campo de rechazo primero");
        return;
    }

    const sot = buscarDato(text, "SOT");
    const nombreTecnico = buscarDato(text, "Nombre de T[ée]cnico"); 
    const numeroTecnico = buscarDato(text, "N[uú]mero de T[ée]nico"); 
    const coordCliente = buscarDato(text, "Coord\\. de Cliente");
    const coordTecnico = buscarDato(text, "Coord\\. de Tecnico");

    let tipoActividad = "Instalación";
    if (motivo === 'FALTA DE INFRAESTRUCTURA DE RED') {
        tipoActividad = "Instalación - PostVenta";
    }

    let plantillaContent = `MESA MULTISKILL HITSS
RECHAZO EN CAMPO
TÉCNICO: ${nombreTecnico} - DNI/${numeroTecnico}
ASESOR: ${asesor}
TIPO DE CASO: Rechazo
TIPO DE ACTIVIDAD: ${tipoActividad}
ESTADO DE SOLICITUD: Atendido
SUB-ESTADO DE SOLICITUD: Se Rechaza SOT
MOTIVO RECHAZO: ${motivo}
COORDENADA CLIENTE: ${coordCliente}
COORDENADA DEL TÉCNICO: ${coordTecnico}`;

    switch (motivo) {
        case 'RED SATURADA':
            const plano = buscarDato(text, "PLANO");
            plantillaContent = plantillaContent.replace(`MOTIVO RECHAZO: ${motivo}`, `MOTIVO RECHAZO: ${motivo}
SUB-MOTIVO RECHAZO: TAP Saturado
PLANO: ${plano}`);

            plantillaContent += `
Observaciones: PROCEDE RECHAZO se verifica con plantilla TAP SATURADO`;
            break;

        case 'FACTIBILIDAD TECNICA':
            plantillaContent = plantillaContent.replace(`MOTIVO RECHAZO: ${motivo}`, `MOTIVO RECHAZO: ${motivo}
SUB-MOTIVO RECHAZO: Acometida excede los 85 metros (HFC)`);

            plantillaContent += `
Observaciones: PROCEDE RECHAZO, realizar quiebre en TOA. Se valida en street view domicilio de 6 pisos, cliente CN en piso 3 parte del fondo, por lo cual excede acometida HFC, entrará a un proceso de revisión por un supervisor de campo`;
            break;

        case 'FALTA DE INFRAESTRUCTURA DE RED':
            plantillaContent = plantillaContent.replace(`MOTIVO RECHAZO: ${motivo}`, `MOTIVO RECHAZO: ${motivo}
SUB-MOTIVO RECHAZO: No hay red HFC/FTTH en la zona/avenida`);

            plantillaContent += `
Observaciones: PROCEDE RECHAZO, según coordenadas enviadas, se valida domicilio del cliente fuera de cobertura.`;
            break;
    }

    plantillaContent = plantillaContent.trim();
    
    const contenedor = document.getElementById('contenedorPlantillaRechazo');
    contenedor.innerHTML = ''; 

    const btnCopiar = document.createElement('button');
    btnCopiar.className = 'btn-plantilla-rechazo';
    
    btnCopiar.innerHTML = `
        ${sot} 
        <small style="display: block; font-weight: normal;">(${motivo})</small>
    `;
    
    btnCopiar.onclick = () => {
        navigator.clipboard.writeText(plantillaContent).then(() => {
            alert(`✅ Plantilla de ${motivo} para SOT ${sot} copiada al portapapeles.`);
        });
    };
    
    contenedor.appendChild(btnCopiar);
}

function limpiarRechazo() {
    const btn = document.querySelector('.botones-util button[onclick="limpiarRechazo()"]');
    if (btn) {
        btn.style.backgroundColor = "red";
        setTimeout(() => btn.style.backgroundColor = "black", 2500); 
    }
    document.getElementById('textoRechazo').value = "";
    document.getElementById('contenedorPlantillaRechazo').innerHTML = "";
}


function generarPlantillaLlamada(tipo) {
    const text = document.getElementById('textoLlamadas').value;
    const contenedor = document.getElementById('contenedorPlantillaLlamadas');
    contenedor.innerHTML = '';
    
    const asesor = usuarioActualRealizado.split(' - ')[0].trim(); 

    if (!text.trim()) {
        alert("⚠️ Por favor, pega el texto en el campo de llamadas primero.");
        return;
    }

    const sot = buscarDato(text, "SOT");
    const cliente = buscarDato(text, "Nombre"); 
    const telefono = buscarDato(text, "Telefono");
    const fechaRaw = buscarDato(text, "Fecha\\s+de\\s+Programaci[óo]n");
    let contrataDefault = buscarContrata(text);
    
    let dia = "DD/MM";
    if (fechaRaw !== "NO ENCONTRADO") {
        const partes = fechaRaw.split("/");
        if (partes.length >= 2) {
            dia = `${partes[0].trim().padStart(2, "0")}/${partes[1].trim().padStart(2, "0")}`;
        }
    }
    const franjaDefault = "AM2";

    let titulo = "";
    let colorBtn = "";
    let realizadoPorLine = "";
    let encabezadoTexto = "";

    const inputDiaFranja = `<input type="text" id="inputDiaFranja" value="${dia} ${franjaDefault}" data-default-franja=" ${franjaDefault}">`;
    const inputNumero = `<input type="text" id="inputNumero" value="${telefono !== 'NO ENCONTRADO' ? telefono : ''}">`; 
    const inputContrata = `<input type="text" id="inputContrata" value="${contrataDefault}">`;
    const inputIdLlamada = `<input type="text" id="inputIdLlamada" value="">`;
    
    let plantillaFormulario = ""; 

    if (tipo === 'CICLO_LLAMADAS') {
        titulo = "CICLO DE LLAMADAS";
        colorBtn = "#e91e63";
        realizadoPorLine = `${asesor} - ADP MULTISKILL HITSS`;
        encabezadoTexto = `MESA MULTISKILL HITSS - CICLO DE LLAMADAS`;
        
        plantillaFormulario = `
            <div class="campo-linea"><label id="label-sot">SOT:</label><span id="span-sot">${sot}</span></div>
            <div class="campo-linea"><label class="resaltado-ciclo">CICLO DE LLAMADA NRO:</label><input type="text" id="inputCicloNro" value="1"></div>
            <div class="campo-linea"><label class="resaltado-ciclo">CANTIDAD DE LLAMADAS:</label><input type="text" id="inputCantLlamadas" value="4"></div>
            <div class="campo-linea"><label>NUMERO:</label>${inputNumero}</div>
            <div class="campo-linea"><label>MOTIVO:</label><span id="span-motivo">FALTA DE CONTACTO</span></div>
            <div class="campo-linea"><label class="resaltado-ciclo">SUB-MOTIVO:</label><input type="text" id="inputSubMotivo" value="Buzón de voz / No contesta / Apagado (Elegir uno)"></div>
            <div class="campo-linea"><label class="resaltado-id">ID DE LLAMADA:</label>${inputIdLlamada}</div>
            <div class="campo-linea"><label id="label-realizado">REALIZADO POR:</label><span id="span-realizado">${realizadoPorLine}</span></div>
        `;
        
    } else { 
        
        const realizadoPorFullFormat = `${asesor} - ADP MULTISKILL HITSS`;

        switch (tipo) {
            case 'CONFIRMA_VISITA':
                titulo = "CONFIRMA VISITA";
                colorBtn = "#00bcd4";
                realizadoPorLine = realizadoPorFullFormat; 
                encabezadoTexto = `MESA MULTISKILL HITSS - CONFIRMA VISITA`; 
                break;
            case 'ADELANTO_VISITA':
                titulo = "ADELANTA VISITA";
                colorBtn = "#ff9800";
                realizadoPorLine = realizadoPorFullFormat; 
                encabezadoTexto = `MESA MULTISKILL HITSS - ADELANTA VISITA`;
                break;
            case 'MANTIENE_FECHA':
                titulo = "MANTIENE FECHA";
                colorBtn = "#4caf50";
                realizadoPorLine = realizadoPorFullFormat; 
                encabezadoTexto = `MESA MULTISKILL HITSS - MANTIENE FECHA DE VISITA`; 
                break;
        }

        plantillaFormulario = `
            <div class="campo-linea"><label id="label-sot">SOT:</label><span id="span-sot">${sot}</span></div>
            <div class="campo-linea"><label class="resaltado-franja">DÍA Y FRANJA:</label>${inputDiaFranja}</div>
            <div class="campo-linea"><label id="label-cliente">CLIENTE:</label><span id="span-cliente">${cliente}</span></div>
            <div class="campo-linea"><label>NUMERO:</label>${inputNumero}</div>
            <div class="campo-linea"><label>CONTRATA:</label>${inputContrata}</div>
            <div class="campo-linea"><label class="resaltado-id">ID DE LLAMADA:</label>${inputIdLlamada}</div>
            <div class="campo-linea"><label id="label-realizado">REALIZADO POR:</label><span id="span-realizado">${realizadoPorLine}</span></div>
        `;
    }

    const form = document.createElement('form');
    form.id = 'formPlantillaLlamadas';
    form.onsubmit = (e) => e.preventDefault();
    form.innerHTML = plantillaFormulario;
    contenedor.appendChild(form);

    const btnCopiar = document.createElement('button');
    btnCopiar.className = 'btn-plantilla-llamadas';
    btnCopiar.style.backgroundColor = colorBtn;
    
    btnCopiar.innerHTML = `
        COPIAR
        <small>${sot}</small>
    `;
    
    btnCopiar.onclick = () => {
        let textoFinal = `${encabezadoTexto}\n`;

        const diaFranjaValue = document.getElementById('inputDiaFranja')?.value.trim() || '';
        const numeroValue = document.getElementById('inputNumero')?.value.trim() || '';
        const contrataValue = document.getElementById('inputContrata')?.value.trim() || '';
        const idLlamadaValue = document.getElementById('inputIdLlamada')?.value.trim() || '';

        const sotValue = document.getElementById('span-sot')?.textContent.trim() || '';
        const clienteValue = document.getElementById('span-cliente')?.textContent.trim() || '';
        const realizadoPorValue = document.getElementById('span-realizado')?.textContent.trim() || ''; 

        
        if (tipo === 'CICLO_LLAMADAS') {
            const cicloNroValue = document.getElementById('inputCicloNro')?.value.trim() || '';
            const cantLlamadasValue = document.getElementById('inputCantLlamadas')?.value.trim() || '';
            const motivoValue = document.getElementById('span-motivo')?.textContent.trim() || '';
            const subMotivoValue = document.getElementById('inputSubMotivo')?.value.trim() || '';

            textoFinal += `SOT: ${sotValue}\n`;
            textoFinal += `CICLO DE LLAMADA NRO: ${cicloNroValue}\n`;
            textoFinal += `CANTIDAD DE LLAMADAS: ${cantLlamadasValue}\n`;
            textoFinal += `NUMERO: ${numeroValue}\n`;
            textoFinal += `MOTIVO: ${motivoValue}\n`;
            textoFinal += `SUB-MOTIVO: ${subMotivoValue}\n`;
            textoFinal += `ID DE LLAMADA: ${idLlamadaValue}\n`;
            textoFinal += `REALIZADO POR: ${realizadoPorValue}\n`;

        } else {
            textoFinal += `SOT: ${sotValue}\n`;
            textoFinal += `DÍA Y FRANJA: ${diaFranjaValue}\n`;
            textoFinal += `CLIENTE: ${clienteValue}\n`;
            textoFinal += `NUMERO: ${numeroValue}\n`;
            textoFinal += `CONTRATA: ${contrataValue}\n`;
            textoFinal += `ID DE LLAMADA: ${idLlamadaValue}\n`;
            textoFinal += `REALIZADO POR: ${realizadoPorValue}\n`; 
        }

        const textoLimpio = textoFinal.trim();

        navigator.clipboard.writeText(textoLimpio).then(() => {
            alert(`✅ Plantilla de "${titulo}" para SOT ${sot} copiada al portapapeles.`);
        });
    };
    
    contenedor.appendChild(btnCopiar);
}

function limpiarLlamadas() {
    const btn = document.querySelector('.botones-llamadas-fila .limpiar-texto-util');
    if (btn) {
        btn.style.backgroundColor = "red";
        setTimeout(() => btn.style.backgroundColor = "black", 2500); 
    }
    document.getElementById('textoLlamadas').value = "";
    document.getElementById('contenedorPlantillaLlamadas').innerHTML = "";
}


// --- EVENTO LISTENERS E INICIO ---
document.addEventListener("DOMContentLoaded", () => {
    cargarSesion();
    
    const procesarBtn = document.getElementById("procesarBtn");
    if (procesarBtn) procesarBtn.addEventListener("click", procesarTexto);
    
    const copiarBtn = document.getElementById("copiarBtn");
    if (copiarBtn) copiarBtn.addEventListener("click", copiarPlantilla);
    
    const limpiarBtn = document.getElementById("limpiarBtn");
    if (limpiarBtn) limpiarBtn.addEventListener("click", limpiarTexto);
    
    const textoInput = document.getElementById("texto");
    if (textoInput) textoInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.code === "Space") {
            e.preventDefault();
            procesarTexto();
        }
    });

    const evaluarBtn = document.getElementById("evaluarBtn");
    if (evaluarBtn) evaluarBtn.addEventListener("click", evaluarEstabilidad);
    
    const limpiarSNRBtns = document.getElementById("limpiarSNRBtns");
    if (limpiarSNRBtns) limpiarSNRBtns.addEventListener("click", limpiarSNR);

    const verificarBtn = document.getElementById("verificarBtn");
    if (verificarBtn) verificarBtn.addEventListener("click", verificarNivel);
    
    const limpiarRXBtn = document.getElementById("limpiarRXBtn");
    if (limpiarRXBtn) limpiarRXBtn.addEventListener("click", limpiarRX);
    
    const rxValueInput = document.getElementById("rxValue");
    if (rxValueInput) rxValueInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        verificarNivel();
      }
    });

    const limpiarRechazoBtn = document.querySelector('.botones-util button[onclick="limpiarRechazo()"]');
    if (limpiarRechazoBtn) {
        limpiarRechazoBtn.addEventListener("click", limpiarRechazo);
    }
});