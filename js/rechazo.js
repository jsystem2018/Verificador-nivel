console.log("[rechazo.js] cargado");

/* ===== BUSCAR CAMPOS ===== */
function buscarDato(texto, clave) {
    const regex = new RegExp(clave + "[:\\s]*([^\\n]+)", "i");
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
    const plano = buscarDato(text, "PLANO");
    const coordCliente = buscarDato(text, "Coordenadas");
    const coordTecnico = buscarDato(text, "COORD TEC");
    const login = "(COLOCAR EL LOGIN)";
    const tecnico = "- DNI/";

    let plantilla = "";

    /* ==========================================
       ========== PLANTILLA RED SATURADA ==========
       ========================================== */
    if (motivo === "RED SATURADA") {

        plantilla =
`MESA MULTISKILL HITSS
RECHAZO EN CAMPO
Técnico: ${tecnico}
Asesor: ${login}
Tipo de caso: Rechazo
Tipo de actividad: Instalación
Estado de Solicitud: Atendido
Sub-estado de Solicitud: Se Rechaza SOT
Motivo rechazo: RED SATURADA
Sub-motivo rechazo: TAP Saturado
PLANO: ${plano}
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
Técnico: ${tecnico}
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
TÉCNICO: ${tecnico}
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
        navigator.clipboard.writeText(area.value).then(() => {
            alert("✔ Plantilla copiada");
        });
    };

    cont.appendChild(btn);
}
