console.log("[rechazo.js] cargado");

/* ===== BUSCAR CAMPOS ===== */
function buscarDato(texto, clave) {
    const regex = new RegExp(clave + "\\s*[:\\-]*\\s*([^\\n]+)", "i");
    const match = texto.match(regex);
    return match ? match[1].trim() : "";
}


/* ===== LIMPIAR ===== */
function limpiarRechazo() {
    document.getElementById("textoRechazo").value = "";
    document.getElementById("contenedorPlantillaRechazo").innerHTML = "";
}

/* ===== GENERAR PLANTILLA ===== */
function generarPlantillaRechazo(motivo) {

    const text = document.getElementById("textoRechazo").value;
    const cont = document.getElementById("contenedorPlantillaRechazo");

    cont.innerHTML = "";

    if (!text.trim()) {
        alert("⚠️ Pega el texto del 360 primero.");
        return;
    }

    // Datos extraidos del 360
   const nombreTecnico = buscarDato(text, "Nombre de Técnico");
const numeroTecnico = buscarDato(text, "Número de Técnico");
const coordCliente = buscarDato(text, "Coord. de Cliente");
const coordTecnico = buscarDato(text, "Coord. de Técnico");

// Login del usuario
const login = localStorage.getItem("sessionADP") || "(NO REGISTRADO)";


    let plantilla = "";

    /* ==========================================
       ========== PLANTILLA RED SATURADA ==========
       ========================================== */
    if (motivo === "RED SATURADA") {

        plantilla =
`MESA MULTISKILL HITSS
RECHAZO EN CAMPO
Técnico: ${nombreTecnico} - DNI/ ${numeroTecnico}
Asesor: ${login}
Tipo de caso: Rechazo
Tipo de actividad: Instalación
Estado de Solicitud: Atendido
Sub-estado de Solicitud: Se Rechaza SOT
Motivo rechazo: RED SATURADA
Sub-motivo rechazo: TAP Saturado
PLANO: NULL
Coordenada cliente: ${coordCliente}
Coordenada del técnico: ${coordTecnico}
Observaciones: PROCEDE RECHAZO se verifica con plantilla TAP SATURADO`;
    }

    /* ===============================================
       ========== PLANTILLA FACTIBILIDAD TECNICA ==========
       =============================================== */
    if (motivo === "FACTIBILIDAD TECNICA") {

        plantilla =
`MESA MULTISKILL HITSS
RECHAZO EN CAMPO
Técnico: ${nombreTecnico} - DNI/ ${numeroTecnico}
Asesor: ${login}
Tipo de caso: Rechazo
Tipo de actividad: Instalación
Estado de Solicitud: Atendido
Sub-estado de Solicitud: Se Rechaza SOT
Motivo rechazo: FACTIBILIDAD TECNICA
Sub-motivo rechazo: Acometida excede los 85 metros (HFC)
Coordenada cliente: ${coordCliente}
Coordenada del técnico: ${coordTecnico}
Observaciones: PROCEDE RECHAZO, realizar quiebre en TOA. Se valida en street view domicilio de 6 pisos, cliente CN en piso 3 parte del fondo, por lo cual excede acometida HFC, entrará a un proceso de revisión por un supervisor de campo`;
    }

    /* =====================================================
       ========== PLANTILLA FALTA DE INFRAESTRUCTURA ==========
       ===================================================== */
    if (motivo === "FALTA DE INFRAESTRUCTURA DE RED") {

        plantilla =
`MESA MULTISKILL HITSS
RECHAZO EN CAMPO
TÉCNICO: ${nombreTecnico} - DNI/ ${numeroTecnico}
ASESOR: ${login}
TIPO DE CASO: Rechazo
TIPO DE ACTIVIDAD: Instalación - PostVenta
ESTADO DE SOLICITUD: Atendido
SUB-ESTADO DE SOLICITUD: Se Rechaza SOT
MOTIVO RECHAZO: FALTA DE INFRAESTRUCTURA DE RED
SUB-MOTIVO RECHAZO: No hay red HFC/FTTH en la zona/avenida
COORDENADA CLIENTE: ${coordCliente}
COORDENADA DEL TÉCNICO: ${coordTecnico}
OBSERVACIONES: PROCEDE RECHAZO, según coordenadas enviadas, se valida domicilio del cliente fuera de cobertura.`;
    }

    /* ======== AREA EDITABLE ======== */
    const area = document.createElement("textarea");
    area.className = "rechazo-plantilla-editable";
    area.value = plantilla;
    cont.appendChild(area);

    /* ======== BOTON COPIAR ======== */
    const btn = document.createElement("button");
    btn.className = "btn-copiar-rechazo";
    btn.textContent = "COPIAR";

    btn.onclick = () => {
    const texto = area.value.trim();
    if (!texto) return;

    navigator.clipboard.writeText(texto).then(() => {

        // Guardamos el texto
        const original = btn.textContent;

        // copiado
        btn.textContent = "COPIADO ✔";
        btn.style.background = "#16a34a";  
        btn.style.transform = "scale(1.07)";

        // Regresar al estado despues de 1.2 segundos
        setTimeout(() => {
            btn.textContent = original;
            btn.style.background = "#005eff";   
            btn.style.transform = "scale(1)";
        }, 1200);

    });
};

    cont.appendChild(btn);
}
