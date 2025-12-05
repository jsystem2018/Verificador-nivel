// --- VARIABLES ---
let currentUsername = '';
let currentUsuarioE = '';

const loginCard = document.getElementById('login-card');
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.getElementById('progress-bar');
const mainContent = document.getElementById('main-content');
const mainFooter = document.getElementById('main-footer'); // Elemento para el footer

/* === AUDIOS === */
function playBeep(freq, dur) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

        osc.start();
        osc.stop(ctx.currentTime + dur);
    } catch {}
}

function playPopSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch {}
}

/* === LOGIN === */
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const usuarioE = document.getElementById('usuario-e').value.trim();

    if (!username || !usuarioE) {
        showMessage("Ingrese Nombre del ADP y Usuario E.", '#ef4444');
        return;
    }

    currentUsername = username;
    currentUsuarioE = usuarioE;

    // Guardar sesion
    localStorage.setItem('sessionADP', username);
    localStorage.setItem('sessionE', usuarioE);
    localStorage.setItem('sessionActive', 'true');

    loginCard.classList.add('hidden');
    
    // ALINEAR CONTENIDO PRINCIPAL
    document.body.style.flexDirection = 'column'; 
    document.body.style.alignItems = 'center'; // Centrar el contenido horizontalmente
    document.body.style.justifyContent = 'flex-start'; // Alinear el contenido al inicio 

    loadingScreen.classList.remove('hidden');
    progressBar.style.width = '0%';

    document.querySelectorAll('.connection-post')
        .forEach(p => p.classList.remove('completed'));

    const intervals = [
        { t: 500, w: '40%', beep: 440, post: 'post-1' },
        { t: 1500,w: '80%', beep: 550, post: 'post-2' },
        { t: 2500,w: '100%',beep: 660, post: 'post-3' }
    ];

    intervals.forEach(s => {
        setTimeout(() => {
            progressBar.style.width = s.w;
            playBeep(s.beep, 0.1);
            document.getElementById(s.post).classList.add('completed');
        }, s.t);
    });

    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        mainFooter && mainFooter.classList.remove('hidden'); // Mostrar Footer
        updateHeaderUserInfo(username, usuarioE);
        setActive(document.getElementById('link-fuera-toa'));
        hideMessage();
    }, 3000);
}

function updateHeaderUserInfo(a, b) {
    document.getElementById('adp-name').textContent = a;
    document.getElementById('user-e-id').textContent = b;
}

/* === MENU === */
function setActive(el) {
    document.querySelectorAll('.menu-nav-item')
        .forEach(i => i.classList.remove('active-link'));

    el.classList.add('active-link');
}

/* === GENERAR PLANTILLA === */
function generateTemplate() {
    const motivoSelect = document.getElementById('motivo');
    const comentariosTextarea = document.getElementById('comentarios');
    const templateTextarea = document.getElementById('generated-template');

    const motivo = motivoSelect.options[motivoSelect.selectedIndex].text;
    const comentarios = comentariosTextarea.value.trim();

    if (motivo === 'Seleccione un motivo') {
        showMessage("Debe seleccionar un motivo para generar la plantilla.", '#f59e0b');
        return;
    }

    templateTextarea.value =
        `[FUERA TOA SOLICITUD]\n\nMotivo: ${motivo}\nDetalles Adicionales: ${comentarios || 'N/A'}\n\nPor favor, procesar a la brevedad.`;

    showMessage("Plantilla generada con exito", 'var(--secondary-green)');
}

/* === COPIAR === */
function copyToClipboard() {
    const textarea = document.getElementById('generated-template');

    if (!textarea.value) {
        showMessage("Primero debe generar una plantilla.", '#f59e0b');
        return;
    }

    textarea.select();
    textarea.setSelectionRange(0, 99999);

    try {
        document.execCommand('copy');
        showMessage("Plantilla copiada", 'var(--secondary-green)');
    } catch {
        showMessage("Error al copiar, hagalo manualmente.", '#ef4444');
    }
}

/* === LOGOUT === */
function logout() {
    // Eliminar datos del localStorage
    localStorage.removeItem('sessionADP');
    localStorage.removeItem('sessionE');
    localStorage.removeItem('sessionActive');
    
    // Eliminar el historial de SOT al cerrar sesion.
    localStorage.removeItem('sotHistorial'); 
    localStorage.removeItem('toaHistory'); // Eliminar historial TOA

    mainContent.classList.add('hidden');
    mainFooter && mainFooter.classList.add('hidden'); // Ocultar Footer

    document.getElementById('adp-name').textContent = '';
    document.getElementById('user-e-id').textContent = '';

    currentUsername = '';
    currentUsuarioE = '';

    //ALINEAR LOGIN 
    document.body.style.flexDirection = 'row'; 
    document.body.style.alignItems = 'center';
    document.body.style.justifyContent = 'center';

    document.getElementById('username').value = '';
    document.getElementById('usuario-e').value = '';

    loginCard.classList.remove('hidden');
    showMessage("Ha salido de la sesion con exito.", 'var(--secondary-green)');
}

/* === MENSAJES === */
let messageTimeout;

function showMessage(text, bg) {
    hideMessage();
    let box = document.getElementById('message-box');

    if (!box) {
        box = document.createElement('div');
        box.id = 'message-box';
        box.style.cssText =
            'position: fixed; top: 1rem; left: 50%; transform: translateX(-50%); ' +
            'padding: 1rem; color: white; border-radius: 0.5rem; ' +
            'box-shadow:0 4px 6px rgba(0,0,0,0.1); font-size: 0.875rem;' +
            'z-index:9999; transition:0.3s;';
        document.body.appendChild(box);
    }

    box.textContent = text;
    box.style.background = bg;
    box.style.opacity = '1';

    messageTimeout = setTimeout(hideMessage, 4000);
}

function hideMessage() {
    clearTimeout(messageTimeout);
    const box = document.getElementById('message-box');
    if (box) box.style.opacity = '0';
}

/* === INIT === */
window.onload = function () {

    const savedSession = localStorage.getItem('sessionActive');
    const savedADP = localStorage.getItem('sessionADP');
    const savedE = localStorage.getItem('sessionE');

    if (savedSession === 'true' && savedADP && savedE) {

        // Restaurar en variables internas
        currentUsername = savedADP;
        currentUsuarioE = savedE;

        // Ocultar login, mostrar contenido
        loginCard.classList.add('hidden');
        loadingScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        mainFooter && mainFooter.classList.remove('hidden'); // Mostrar Footer

        // Mostrar usuario en el header
        updateHeaderUserInfo(savedADP, savedE);

        //Alinear AL INICIAR
        document.body.style.flexDirection = 'column';
        document.body.style.alignItems = 'center';
        document.body.style.justifyContent = 'flex-start';

        // Activar el primer enlace
        setActive(document.getElementById('link-fuera-toa'));

    } else {
        // Si no hay sesion, aseguramos el centrado para el login
        document.body.style.alignItems = 'center';
        document.body.style.justifyContent = 'center';
        document.body.style.flexDirection = 'row'; 
        mainFooter && mainFooter.classList.add('hidden'); // Ocultar Footer
    }

    // Activar sonido al cambiar menu
    document.querySelectorAll('.menu-nav-item').forEach(link => {
        link.addEventListener('click', function () {
            setActive(this);
            playPopSound();
        });
    });

    // Al cargar, si existen elementos de la seccion FUERA TOA, inicializamos algunos estilos
    try {
        const copyGeneratedBtn = document.getElementById('copy-generated');
        const saveHistoryBtn = document.getElementById('save-history');
        const buttonRow = document.getElementById('button-row');

        if (copyGeneratedBtn && saveHistoryBtn && buttonRow) {
            // Estilo grande para botones
            copyGeneratedBtn.style.padding = "12px 24px";
            copyGeneratedBtn.style.fontSize = "16px";
            copyGeneratedBtn.style.fontWeight = "700";
            copyGeneratedBtn.style.borderRadius = "6px";

            saveHistoryBtn.style.padding = "12px 24px";
            saveHistoryBtn.style.fontSize = "16px";
            saveHistoryBtn.style.fontWeight = "700";
            saveHistoryBtn.style.borderRadius = "6px";

            // Alinear botones en fila
            buttonRow.style.display = "flex";
            buttonRow.style.gap = "12px";
            buttonRow.style.marginBottom = "10px";
        }
    } catch (e) {
        // ignorar
    }
};

/* =====================================================================================
   SECCIoN 1 FUERA DE TOA 
   ===================================================================================== */

(function () {

    const $ = id => document.getElementById(id);

    // Elementos de la interfaz
    const toaInput = $('toa-input');
    const procesarBtn = $('procesar-toa');
    const limpiarBtn = $('limpiar-toa');

    const generated = $('toa-generated');
    const copyGeneratedBtn = $('copy-generated');
    const saveHistoryBtn = $('save-history');

    const abTextarea = $('toa-ab');
    const finalTextarea = $('toa-final');

    const copyAbBtn = $('copy-ab');
    const copyFinalBtn = $('copy-final');

    const radioA = document.querySelector('input[name="opcionReprogramacion"][value="A"]');
    const radioB = document.querySelector('input[name="opcionReprogramacion"][value="B"]');

    let historyContainer; // contenedor dinamico de historial

    /* =============================== EXTRACTORES =============================== */

    // EXTRAER etiqueta
    function extractNextLine(label, raw) {
        const lines = raw.split(/\r?\n/);
        label = label.trim().toLowerCase();

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().toLowerCase() === label) {
                // buscar siguiente linea con contenido
                for (let j = i + 1; j < lines.length; j++) {
                    if (lines[j].trim() !== "") {
                        return lines[j].trim();
                    }
                }
            }
        }
        return "";
    }

    // backup extractor (regex-based) 
    function extract(regex, text) {
        const m = text.match(regex);
        return m ? m[1].trim() : "";
    }

    /* =========================== DETECCIoN DE CONTRATA =========================== */
    function detectContrata(text) {
    
        const inst = text.match(/\bINST\s+([A-Za-z0-9\s]+)/i);
        if (inst) return inst[1].trim();

        const mant = text.match(/\bMANT\s+([A-Za-z0-9\s\-_]+)/i);
        if (mant) return mant[1].trim();

        // "CONTRATA XYZ"
        const c = text.match(/CONTRATA[:\s]*([A-Za-z0-9\s\-_]+)/i);
        if (c) return c[1].trim();

        return "NULL";
    }

    /* =========================== PROCESAR TEXTO =========================== */

    function procesarTexto() {
        const raw = (toaInput && toaInput.value ? toaInput.value : "").replace(/\r/g, "\n");
        if (!raw.trim()) {
            showMessage("Pegue el texto primero.", "#f59e0b");
            return;
        }

        /* ==========  EXTRACTORES BASADOS EN LINEA SIGUIENTE ========== */

        const SOT =
            extractNextLine("SOT", raw) ||
            extract(/SOT[:\s]*([A-Za-z0-9\-]+)/i, raw) ||
            extract(/^([A-Za-z0-9\-]{4,})/i, raw) || "";

        const subTipo =
            extractNextLine("Sub Tipo de Orden", raw) ||
            extractNextLine("Sub Tipo", raw) || "";

        const direccion =
            extractNextLine("Direccion", raw) ||
            extractNextLine("Dirección", raw) || "";

        const distrito =
            extractNextLine("Distrito", raw) || "";

        const servicio =
            extractNextLine("Acciones Orden", raw) || "";

        const plano =
            extractNextLine("Plano", raw) || "";

        const cliente =
            extractNextLine("CLIENTE", raw) ||
            extractNextLine("Nombre", raw) ||
            extractNextLine("Nombre del Cliente", raw) ||
            extract(/CLIENTE[:\s]*([^\n]+)/i, raw) ||
            "";

        const codCliente =
            extractNextLine("Código de Cliente", raw) ||
            extractNextLine("Codigo de Cliente", raw) ||
            extractNextLine("COD CLIENTE", raw) ||
            extract(/C[oó]digo(?:\s*de\s*Cliente)?[:\s]*([^\n]+)/i, raw) ||
            "";

        const telefono =
            extractNextLine("Telefono", raw) ||
            extractNextLine("TELÉFONO", raw) ||
            extractNextLine("CELULAR", raw) ||
            extract(/Tel[eé]?fono[:\s]*([0-9+\-\s()]+)/i, raw) ||
            extract(/CELULAR[:\s]*([0-9+\-\s()]+)/i, raw) ||
            "";

        let fechaBruta =
            extractNextLine("Fecha de Programacion", raw) ||
            extractNextLine("Fecha de Programación", raw) ||
            extractNextLine("FECHA", raw) ||
            "";

        let fecha = "";
        if (fechaBruta) {
            const soloDiaMes = fechaBruta.match(/(\d{1,2}\/\d{1,2})/);
            if (soloDiaMes) fecha = soloDiaMes[1] + " - AM2";
        }

        const contrata = detectContrata(raw) || "NULL";
        const realizadoPor = currentUsername || "";

        /* ========== PLANTILLA GENERADA -COLUMNA 2========== */

        if (generated) {
            generated.value =
`*FUERA DE TOA*
📥 SOT: ${SOT}
⚙️ SUB TIPO: ${subTipo}
🏡 DIRECCIÓN: ${direccion}
📍 DISTRITO: ${distrito}
⚒️ SERVICIO: ${servicio}
🪚 PLANO: ${plano}
👨‍💻 CLIENTE: ${cliente}
🔣 COD CLIENTE: ${codCliente}
📱 CELULAR DEL CLIENTE: ${telefono}
📅 FECHA Y FRANJA: ${fecha}
✍️ REALIZADO POR: ${realizadoPor} - ADP MULTISKILL HITSS`;
        }

        buildABandFinal();
        showMessage("Plantilla generada.", "var(--secondary-green)");
    }

    /* ==================== REPARSEAR DESDE PLANTILLA GENERADA ==================== */
    function reparseGenerated() {

        const txt = generated ? generated.value : "";

        const extracted = {
            SOT: extract(/SOT[:\s]*([^\n]+)/i, txt),
            cliente: extract(/CLIENTE[:\s]*([^\n]+)/i, txt) || extract(/👨‍💻 CLIENTE[:\s]*([^\n]+)/i, txt),
            telefono: extract(/CELULAR DEL CLIENTE[:\s]*([^\n]+)/i, txt) || extract(/📱 CELULAR DEL CLIENTE[:\s]*([^\n]+)/i, txt),
            fecha: extract(/FECHA Y FRANJA[:\s]*([^\n]+)/i, txt) || extract(/📅 FECHA Y FRANJA[:\s]*([^\n]+)/i, txt),
            contrata: detectContrata(txt),
            realizadoPor: extract(/REALIZADO POR[:\s]*([^\n]+)/i, txt) || currentUsername || ""
        };

        return extracted;
    }

    /* ======================= PLANTILLA A/B ======================= */

    function buildABandFinal() {

        const data = reparseGenerated();

        const opcion =
            document.querySelector('input[name="opcionReprogramacion"]:checked')?.value || "B";

        let plantillaAB = "";

        if (opcion === "A") {
            // Opcion A corregida para usar los datos del cliente
            plantillaAB =
`MESA MULTISKILL HITSS
REPROGRAMADO EN CAMPO / REAGENDADO POR CLIENTE
MOTIVO DE REPROGRAMACIÓN: CLIENTE # Cambios en las fechas y franjas solicitadas
CLIENTE: ${data.cliente || ""}
TELÉFONO: ${data.telefono || ""}
NUEVA FECHA Y FRANJA DE VISITA: ${data.fecha ? data.fecha.replace(/\s*-\s*AM2$/,'') : ""} - AM0
OBSERVACIÓN:
CONTRATA: ${data.contrata || detectContrata(generated ? generated.value : "")}
REALIZADO POR: ${currentUsername}
CÓD LLAMADA:`;
        } else {
            plantillaAB =
`MESA MULTISKILL HITSS
REPROGRAMADO EN CAMPO / REAGENDADO POR CLIENTE
MOTIVO DE REPROGRAMACIÓN: CLIENTE # Cliente no responde los 4 intentos de llamada
CLIENTE: ${data.cliente || ""}
TELÉFONO: ${data.telefono || ""}
NUEVA FECHA Y FRANJA DE VISITA: ${data.fecha ? data.fecha.replace(/\s*-\s*AM2$/,'') : ""} - AM0
OBSERVACIÓN:
CONTRATA: ${data.contrata || detectContrata(generated ? generated.value : "")}
REALIZADO POR: ${currentUsername}
CÓD LLAMADA:`;
        }

        if (abTextarea) abTextarea.value = plantillaAB;

        const plantillaFinal =
`Proceder con atención fuera de TOA
Motivo: SOT sin flujo TOA
Autorizado por: ${currentUsername || ""}`;

        if (finalTextarea) finalTextarea.value = plantillaFinal;
    }

    /* ======================= COPIAR ======================= */
    function copy(ta, msg) {
        try {
            ta.select();
            ta.setSelectionRange(0, 99999);
            document.execCommand("copy");
            showMessage(msg || "Copiado", "var(--secondary-green)");
        } catch (e) {
            showMessage("Error al copiar", "#ef4444");
        }
    }

    /* ======================= HISTORIAL ======================= */
    function saveHistory() {

        const full = generated ? generated.value : "";
        const SOT = extract(/SOT[:\s]*([A-Za-z0-9\-]+)/i, full) || `SOT_${Date.now()}`;

        const entry = {
            principal: generated ? generated.value : "",
            ab: abTextarea ? abTextarea.value : "",
            final: finalTextarea ? finalTextarea.value : "",
            date: new Date().toISOString(),
            status: "pendiente" // estado inicial A - pendiente
        };

        let history = {};
        try {
            history = JSON.parse(localStorage.getItem("toaHistory") || "{}");
        } catch (e) {
            history = {};
        }
        history[SOT] = entry;

        localStorage.setItem("toaHistory", JSON.stringify(history));

        showMessage("Guardado en historial", "var(--secondary-green)");

        renderHistoryList();
    }

    /* ======================= MOSTRAR HISTORIAL ======================= */
    function renderHistoryList() {

        // crear container si no existe
        if (!historyContainer) {
            historyContainer = document.createElement("div");
            historyContainer.style.marginTop = "1rem";
            historyContainer.style.background = "#f3f4f6"; 
            historyContainer.style.padding = "12px";
            historyContainer.style.borderRadius = "8px";
            historyContainer.style.maxHeight = "420px";
            historyContainer.style.overflowY = "auto";

            // inserta despues de button-row si existe, si no al final de la columna 2
            const btnRow = document.getElementById("button-row");
            if (btnRow && btnRow.parentNode) {
                btnRow.parentNode.insertBefore(historyContainer, btnRow.nextSibling);
            } else {
                // fallback insertar en el DOM principal
                document.querySelector('.grid-3-col-toa')?.appendChild(historyContainer);
            }
        }

        let history = {};
        try {
            history = JSON.parse(localStorage.getItem("toaHistory") || "{}");
        } catch (e) {
            history = {};
        }

        // Ordenar por fecha 
        const entries = Object.entries(history).sort((a, b) => {
            const da = new Date(a[1].date).getTime();
            const db = new Date(b[1].date).getTime();
            return db - da;
        });

        historyContainer.innerHTML = `<h4 style="margin-bottom:0.5rem; font-size:16px; font-weight:700;">Historial</h4>`;

        entries.forEach(([sot, item]) => {
            const box = document.createElement("div");
            box.style.marginBottom = "10px";
            box.style.padding = "8px";
            box.style.background = "#ffffff";
            box.style.borderRadius = "6px";
            box.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";

            // HEADER SOT + ICONoS
            const header = document.createElement("div");
            header.style.display = "flex";
            header.style.justifyContent = "space-between";
            header.style.alignItems = "center";

            const left = document.createElement("div");
            left.style.display = "flex";
            left.style.flexDirection = "column";

            const title = document.createElement("span");
            title.textContent = `SOT ${sot}`;
            title.style.fontWeight = "700";
            title.style.cursor = "pointer";

            const dateSmall = document.createElement("small");
            dateSmall.textContent = new Date(item.date).toLocaleString();
            dateSmall.style.color = "#6b7280";
            dateSmall.style.marginTop = "4px";

            left.appendChild(title);
            left.appendChild(dateSmall);

            const icons = document.createElement("div");
            icons.style.display = "flex";
            icons.style.gap = "10px";
            icons.style.alignItems = "center";

            // Estado icon 
            const statusBtn = document.createElement("button");
            statusBtn.style.background = "transparent";
            statusBtn.style.border = "none";
            statusBtn.style.cursor = "pointer";
            statusBtn.style.fontSize = "18px";
            statusBtn.title = "Cambiar estado";

            function drawStatusIcon() {
                statusBtn.textContent = item.status === "regularizada" ? "✅" : "🔄";
            }
            drawStatusIcon();

            statusBtn.addEventListener("click", (ev) => {
                ev.stopPropagation();
                // toggle status
                item.status = item.status === "regularizada" ? "pendiente" : "regularizada";
                // persistir
                const hist = JSON.parse(localStorage.getItem("toaHistory") || "{}");
                hist[sot] = item;
                localStorage.setItem("toaHistory", JSON.stringify(hist));
                drawStatusIcon();
            });

            // regularizar quick button 
            const regularBtn = document.createElement("button");
            regularBtn.style.background = "transparent";
            regularBtn.style.border = "none";
            regularBtn.style.cursor = "pointer";
            regularBtn.style.fontSize = "18px";
            regularBtn.title = "Marcar regularizada";
            regularBtn.textContent = "✅";
            regularBtn.addEventListener("click", (ev) => {
                ev.stopPropagation();
                item.status = "regularizada";
                const hist = JSON.parse(localStorage.getItem("toaHistory") || "{}");
                hist[sot] = item;
                localStorage.setItem("toaHistory", JSON.stringify(hist));
                drawStatusIcon();
            });

            // eliminar
            const deleteBtn = document.createElement("button");
            deleteBtn.style.background = "transparent";
            deleteBtn.style.border = "none";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.style.fontSize = "18px";
            deleteBtn.title = "Eliminar";
            deleteBtn.textContent = "🗑️";

            deleteBtn.addEventListener("click", (ev) => {
                ev.stopPropagation();
                const hist = JSON.parse(localStorage.getItem("toaHistory") || "{}");
                delete hist[sot];
                localStorage.setItem("toaHistory", JSON.stringify(hist));
                renderHistoryList();
            });

            icons.appendChild(statusBtn);
            icons.appendChild(deleteBtn);

            header.appendChild(left);
            header.appendChild(icons);
            box.appendChild(header);

            // contenido expandible
            const content = document.createElement("textarea");
            content.style.display = "none";
            content.style.width = "100%";
            content.style.height = "200px";
            content.style.marginTop = "8px";
            content.style.fontSize = "13px";
            content.readOnly = true;
            content.value =
`${item.principal}
====================
${item.ab}
====================
${item.final}`;

            // toggle expandir y colapsar cuando se de clic
            title.addEventListener("click", () => {
                content.style.display = content.style.display === "none" ? "block" : "none";
            });

            box.appendChild(content);
            historyContainer.appendChild(box);
        });
    }

    /* ======================= EVENTOS ======================= */

    // Enlazar botones comprobar
    if (procesarBtn) procesarBtn.addEventListener("click", procesarTexto);

    if (generated) {
        // textarea es editable
        generated.removeAttribute && generated.removeAttribute("readonly");
        generated.addEventListener("input", () => {
            // reconstruir AB y Final en vivo
            buildABandFinal();
        });
    }

    // actualizar plantilla AB cuando cambian
    document.querySelectorAll('input[name="opcionReprogramacion"]').forEach(r => {
        r.addEventListener('change', () => {
            buildABandFinal();
            showMessage("Opción A/B actualizada", "var(--primary-blue)");
        });
    });

    if (copyGeneratedBtn) copyGeneratedBtn.addEventListener("click", () => copy(generated, "Plantilla copiada"));
    if (copyAbBtn) copyAbBtn.addEventListener("click", () => copy(abTextarea, "Plantilla copiada"));
    if (copyFinalBtn) copyFinalBtn.addEventListener("click", () => copy(finalTextarea, "Plantilla copiada"));
    if (saveHistoryBtn) saveHistoryBtn.addEventListener("click", saveHistory);

    if (limpiarBtn) limpiarBtn.addEventListener("click", () => {
        if (toaInput) toaInput.value = "";
        if (generated) generated.value = "";
        if (abTextarea) abTextarea.value = "";
        if (finalTextarea) finalTextarea.value = "";
        showMessage("Limpio", "#ef4444");
    });

    // inicializar historial si existe
    renderHistoryList();

})();