

//  Busca un campo 
function buscarCampoEstricto(texto, etiqueta) {
    const regex = new RegExp(`${etiqueta}\\s*\\n\\s*(.+)`, "i");
    const match = texto.match(regex);
    return match ? match[1].trim() : "No detectado";
}

// Busca datos tipo 
function buscarDato(texto, etiqueta) {
    const regex = new RegExp(`${etiqueta}\\s*[:\\-]?\\s*(.+)`, "i");
    const match = texto.match(regex);
    return match ? match[1].trim() : "NO ENCONTRADO";
}

//Buscar la contrata 
function buscarContrata(texto) {
    const regex = /(INST|MANT)\s+([A-ZÑ0-9 ]+)/i;
    const match = texto.match(regex);
    if (!match) return "NULL";
    return match[2].trim();
}



/* ============================================================
   PLANTILLAAS
   ============================================================ */

function mostrarColumna2() {
    document.getElementById("contenedorPlantillaLlamadasWrapper")
            .classList.remove("oculto");
}

/* ========== GENERAR PLANTILLA ========== */
function generarPlantillaLlamada(tipo) {
    mostrarColumna2();

    const text = document.getElementById('textoLlamadas').value;
    const contenedor = document.getElementById('contenedorPlantillaLlamadas');
    contenedor.innerHTML = '';

    if (!text.trim()) {
        alert("⚠️ Pega el texto primero.");
        return;
    }

    /* -----------------------
       EXTRAER DATOS
       ----------------------- */

    const cliente = buscarCampoEstricto(text, "Nombre") || "NULL";
    const sot = buscarDato(text, "SOT") || "NO ENCONTRADO";
    let telefono = buscarCampoEstricto(text, "Telefono") || "";
    let contrata = buscarContrata(text);
    const asesor = currentUsername || "ADP";

    if (telefono.replace(/\D/g, "").length < 6) telefono = "NULL";

    const fechaRaw = buscarDato(text, "Fecha\\s+de\\s+Programaci") || "";
    let dia = "DD/MM";
    if (fechaRaw.includes("/")) {
        const p = fechaRaw.split("/");
        dia = `${p[0]}/${p[1]}`;
    }

    /* -----------------------
       FORMULARIO DE COLUMNA 2
       ----------------------- */

    let plantillaHTML = "";

    if (tipo === "CICLO_LLAMADAS") {
        plantillaHTML = `
        <form id="formPlantillaLlamadas">
            <label>SOT:</label><span>${sot}</span>
            <label>CICLO DE LLAMADA N°:</label><input id="inputCicloNro" value="1">
            <label>CANTIDAD DE LLAMADAS:</label><input id="inputCantLlamadas" value="4">
            <label>NUMERO:</label><input id="inputNumero" value="${telefono}">
            <label>MOTIVO:</label><span>FALTA DE CONTACTO</span>
            <label>SUB-MOTIVO:</label><input id="inputSubMotivo" value="Buzón de voz">
            <label>ID DE LLAMADA:</label><input id="inputIdLlamada">
            <label>REALIZADO POR:</label><span>${asesor} - ADP MULTISKILL HITSS</span>
        </form>`;
    } else {
        plantillaHTML = `
        <form id="formPlantillaLlamadas">
            <label>SOT:</label><span>${sot}</span>
            <label>DÍA Y FRANJA:</label><input id="inputDiaFranja" value="${dia} AM2">
            <label>CLIENTE:</label><span>${cliente}</span>
            <label>NUMERO:</label><input id="inputNumero" value="${telefono}">
            <label>CONTRATA:</label><input id="inputContrata" value="${contrata}">
            <label>ID DE LLAMADA:</label><input id="inputIdLlamada">
            <label>REALIZADO POR:</label><span>${asesor} - ADP MULTISKILL HITSS</span>
        </form>`;
    }

    contenedor.innerHTML = plantillaHTML;

    /* BOTON COPIAR */
    const btn = document.createElement("button");
    btn.className = "btn-plantilla-llamadas";
    btn.style.background = tipo === "CICLO_LLAMADAS" ? "#e91e63" :
                           tipo === "CONFIRMA_VISITA" ? "#00bcd4" :
                           tipo === "ADELANTO_VISITA" ? "#ff9800" :
                           "#4caf50";

    btn.innerHTML = `COPIAR<small>${sot}</small>`;

    btn.onclick = () => copiarPlantilla(tipo, sot);

    contenedor.appendChild(btn);
}

/* ========== COPIAR TEXTO ========== */
function copiarPlantilla(tipo, sot) {
    const form = document.getElementById("formPlantillaLlamadas");
    const labels = form.querySelectorAll("label");
    const elements = form.querySelectorAll("input, span");

    let texto = "";

    for (let i = 0; i < labels.length; i++) {
        const label = labels[i].textContent.trim();
        const value = elements[i].value || elements[i].textContent.trim();
        texto += `${label} ${value}\n`;
    }

    navigator.clipboard.writeText(texto.trim());
    alert(`📋 Copiado plantilla ${tipo} para SOT ${sot}`);
}

/* ========== LIMPIAR ========== */
function limpiarLlamadas() {
    document.getElementById("textoLlamadas").value = "";
    document.getElementById("contenedorPlantillaLlamadas").innerHTML = "";
    document.getElementById("contenedorPlantillaLlamadasWrapper").classList.add("oculto");
}
