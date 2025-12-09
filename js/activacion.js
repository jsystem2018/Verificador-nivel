
    let equiposGuardados = [];
document.addEventListener("DOMContentLoaded", () => {

    console.log("[Section5] JS cargado correctamente (Versión final)");    

    // -------------------------
    // ADP
    // -------------------------
    function getNombreADP() {
        const storedADP = localStorage.getItem('sessionADP');
        return storedADP || "USUARIO DESCONOCIDO";
    }

  
    const inputCodigo = document.getElementById("inputCodigo");
    const inputEmta = document.getElementById("inputEmta");
   

    const previoContainer = document.getElementById("previoContainer");
    const resultadoArea = document.getElementById("resultado");

    const btnLimpiarPrevio = document.getElementById("btnLimpiarPrevio");
    const btnCopiarPlantilla = document.getElementById("btnCopiarPlantilla");
    const btnGuardar = document.getElementById("btnGuardar");

    const blocNotas = document.getElementById("blocNotas");
    const btnLimpiarNotas = document.getElementById("btnLimpiarNotas");

    const sotContainer = document.getElementById("sotContainer");

    const buscarModelo = document.getElementById("buscarModelo");
    const selectModelo = document.getElementById("selectModelo");
    const modeloInfo = document.getElementById("modeloInfo");

    const modeloImagen = document.getElementById("modeloImagen");
    const modeloNombre = document.getElementById("modeloNombre");
    const modeloDescripcion = document.getElementById("modeloDescripcion");
    const modeloRepetidor = document.getElementById("modeloRepetidor");
    const modeloVersion = document.getElementById("modeloVersion");

    // -------------------------
    // Estado local
    // -------------------------

    let plantillaActual = "";
    let sotDatos = {}; 

    // -------------------------
    // LocalStorage
    // -------------------------
    function guardarDatos() {
        localStorage.setItem("sotHistorial", JSON.stringify(sotDatos));
        if (blocNotas) localStorage.setItem("blocNotasActivacion", blocNotas.value);
    }

    function cargarDatos() {
        const storedSOT = localStorage.getItem("sotHistorial");
        if (storedSOT) {
            try {
                sotDatos = JSON.parse(storedSOT);
            } catch(e) {
                sotDatos = {};
            }
        }

        const storedNotas = localStorage.getItem("blocNotasActivacion");
        if (blocNotas && storedNotas) {
            blocNotas.value = storedNotas;
        }

        actualizarHistorial();
    }

    // -------------------------
    // Formateo EMTA
    // -------------------------
    function formatearEMTA(valor) {
        valor = valor.toUpperCase().replace(/[^A-Z0-9]/g, "");
        return valor.match(/.{1,2}/g)?.join(":") || valor;
    }

    // -------------------------
    // Modelos ONT 
    // -------------------------
    const modelosData = {
        "DPC3926": { nombre:"CISCO DPC3926", img:"img/CISCO DPC3926.jpg", descripcion:"Soporta 30 Mbps / NO REPETIDOR", repetidor:"NO", velocidad:30 },
        "DPQ3925": { nombre:"CISCO DPQ3925", img:"img/CISCO DPQ3925.jpg", descripcion:"Soporta 30 Mbps / NO REPETIDOR", repetidor:"NO", velocidad:30 },
        "TG862": { nombre:"ARRIS TG862", img:"img/ARRIS TG862.jpg", descripcion:"Soporta 30 Mbps / NO REPETIDOR", repetidor:"NO", velocidad:30 },
        "FAST3686V22": { nombre:"SAGEMCOM FAST3686V2.2", img:"img/SAGEMCOM FAST3686V2_2.jpg", descripcion:"Soporta 300 Mbps / NO REPETIDOR", repetidor:"NO", velocidad:300 },
        "TG2482": { nombre:"ARRIS TG2482", img:"img/ARRIS TG2482.jpg", descripcion:"Soporta 300 Mbps / SI REPETIDOR", repetidor:"SI", velocidad:300 },
        "CGA2121": { nombre:"TECNICOLOR CGA2121", img:"img/TECNICOLOR CGA2121.jpg", descripcion:"Soporta 300 Mbps / NO REPETIDOR", repetidor:"NO", velocidad:300 },
        "F3890V3": { nombre:"SAGEMCOM F3890 V3", img:"img/SAGEMCOM F3890 V3.jpg", descripcion:"Soporta 301-1000 Mbps / NO REPETIDOR", repetidor:"NO", velocidad:1000 },
        "TG3442": { nombre:"ARRIS TG3442", img:"img/ARRIS TG3442.jpg", descripcion:"Soporta 301-1000 Mbps / SI REPETIDOR", repetidor:"SI", velocidad:1000 },
        "CGA4233": { nombre:"TECNICOLOR CGA4233 CLP2", img:"img/TECNICOLOR CGA4233 CLP2.jpg", descripcion:"Soporta 301-1000 Mbps / SI REPETIDOR", repetidor:"SI", velocidad:1000 },
        "HG8245Q2": { nombre:"HUAWEI HG8245Q2", img:"img/ONT_HUAWEI HG8245Q2.jpg", descripcion:"Soporta 1000 Mbps / NO REPETIDOR", repetidor:"NO", velocidad:1000 },
        "HG815V5": { nombre:"HUAWEI HG815V5", img:"img/ONT_HUAWEI HG815V5.jpg", descripcion:"Soporta 1000 Mbps / NO REPETIDOR", repetidor:"NO", velocidad:1000 },
        "ZXHNF680": { nombre:"ZTE ZXHNF680", img:"img/ONT_ZTE ZXHNF680.jpg", descripcion:"Soporta 1000 Mbps / NO REPETIDOR", repetidor:"NO", velocidad:1000 },
        "F6600P": { nombre:"ZTE F6600P v9.0.12", img:"img/ONT_ZTE_F6600P.jpg", descripcion:"Soporta 1000 Mbps / NO REPETIDOR", repetidor:"NO", velocidad:1000 },
        "FAST5670V2": { nombre:"SAGEMCOM FAST5670 v2", img:"img/ONT_SAGEMCOM FAST5670 v2.jpg", descripcion:"Soporta 1GB A+ Mbps / NO REPETIDOR", repetidor:"NO", velocidad:1000 }
    };

    // -------------------------
    // Agregar equipos
    // -------------------------
    function agregarEquipo(codigoInput, emtaInput) {
        let inputRaw = (codigoInput || "").trim() || (emtaInput || "").trim();
        if (!inputRaw) return;

        const isEmtaInput = (emtaInput || "").trim() !== '';
        const seriesRaw = inputRaw.split(/[\s\n]+/).filter(s => s.trim() !== '');

        seriesRaw.forEach(serieRaw => {
            if (!serieRaw) return;
            let finalEntry;
            if (isEmtaInput) {
                finalEntry = formatearEMTA(serieRaw);
            } else {
                finalEntry = serieRaw.toUpperCase().replace(/[^A-Z0-9]/g, "");
            }
            if (finalEntry.trim()) {
                equiposGuardados.push(finalEntry);
            }
        });

        inputCodigo.value = "";
        inputEmta.value = "";
        actualizarPrevio();
    }

    // -------------------------
    // Actualizar preview
    // -------------------------
    function actualizarPrevio() {
        if (!previoContainer) return;
        previoContainer.innerHTML = "";

        if (equiposGuardados.length === 0) {
            previoContainer.innerHTML = "<p style='color:#6b7280; font-size:14px;'>No hay equipos ingresados.</p>";
            return;
        }

        equiposGuardados.forEach(item => {
            const linea = document.createElement("div");
            linea.className = "linea-preview";
            linea.textContent = item;

            linea.addEventListener("click", () => {
                const textoACopiar = item;
                navigator.clipboard.writeText(textoACopiar).then(() => {
                    linea.textContent = item + "  (Copiado)";
                    linea.classList.add("linea-copiado");
                    setTimeout(() => {
                        linea.textContent = item;
                        linea.classList.remove("linea-copiado");
                    }, 1100);
                });
            });

            previoContainer.appendChild(linea);
        });
    }

    // -------------------------
    // Eventos 
    // -------------------------
    if (inputCodigo) {
        inputCodigo.addEventListener("keyup", (e) => {
            inputCodigo.value = inputCodigo.value.toUpperCase().replace(/[^A-Z0-9\s\n]/g, "");
            if (e.key === "Enter" && inputCodigo.value.trim() !== "") {
                agregarEquipo(inputCodigo.value, "");
            }
        });
    }
    if (inputEmta) {
        inputEmta.addEventListener("input", () => {
            inputEmta.value = formatearEMTA(inputEmta.value).slice(0, 30);
        });
        inputEmta.addEventListener("keyup", (e) => {
            if (e.key === "Enter" && inputEmta.value.trim() !== "") {
                agregarEquipo("", inputEmta.value);
            }
        });
    }

    // Limpiar preview
    if (btnLimpiarPrevio) {
        btnLimpiarPrevio.addEventListener("click", () => {
            equiposGuardados = [];
            plantillaActual = "";
            resultadoArea.value = "";
            actualizarPrevio();
        });
    }

    // Bloc de notas
    if (blocNotas) {
        blocNotas.addEventListener("input", guardarDatos);
    }
    if (btnLimpiarNotas) {
        btnLimpiarNotas.addEventListener("click", () => {
            if (!blocNotas) return;
            blocNotas.value = "";
            localStorage.removeItem("blocNotasActivacion");
        });
    }

    // Mensaje flotante
    function mostrarAvisoCopiado(texto) {
        const msg = document.createElement("div");
        msg.textContent = texto;
        msg.className = "msg-flotante";
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 1500);
    }

    
    // Modal universal 
   
    function abrirModal(titulo, descripcion, placeholder = "") {
        return new Promise((resolve) => {
            const modal = document.getElementById("modalGlobal");
            const tituloEl = document.getElementById("modalTitulo");
            const descEl = document.getElementById("modalDescripcion");
            const inputEl = document.getElementById("modalInput");
            const btnAceptar = document.getElementById("modalAceptar");
            const btnCancelar = document.getElementById("modalCancelar");

            if (!modal || !tituloEl || !descEl || !inputEl || !btnAceptar || !btnCancelar) {
                // Si modal no existe
                const val = prompt(descripcion);
                resolve(val ? val.trim() : null);
                return;
            }

            tituloEl.textContent = titulo;
            descEl.textContent = descripcion;
            inputEl.value = "";
            inputEl.placeholder = placeholder;
            modal.classList.remove("hidden");

            // movil
            setTimeout(() => inputEl.focus(), 70);

            // limpiar
            btnAceptar.onclick = null;
            btnCancelar.onclick = null;

            btnAceptar.onclick = () => {
                modal.classList.add("hidden");
                resolve(inputEl.value.trim());
            };

            btnCancelar.onclick = () => {
                modal.classList.add("hidden");
                resolve(null);
            };
        });
    }

    // -------------------------
    // Botones de plantillas columna 1
    // -------------------------
    document.querySelectorAll(".btn-accion").forEach(btn => {
        btn.addEventListener("click", () => {
            const nombreADP = getNombreADP();
            const tipo = btn.dataset.tipo;

            // Generamos la lista de equipos en el momento
            const listaEquiposTxt = equiposGuardados.map(eq => `- ${eq}`).join('\n');

            // Plantilla base
            const plantillaBase =
`EQUIPOS ACTIVADOS:
${listaEquiposTxt}
ESTADO: ATENDIDO
REALIZADO POR: ${nombreADP}`;

            // Tratamiento por tipo
            if (tipo === "equipo") {
                // modal
                abrirModal("Codigo de Autorización", "Ingrese el codigo autorizado:", "Ej: ABC123")
                .then(codAuth => {
                    if (!codAuth) return;
                    const listaAhora = equiposGuardados.map(eq => `- ${eq}`).join('\n');
                    plantillaActual =
`MESA MULTISKILL HITSS - CAMBIO DE EQUIPO
EQUIPOS ACTIVADOS:
${listaAhora}
CÓDIGO DE AUT.: ${codAuth.toUpperCase().trim()}
ESTADO: ATENDIDO
REALIZADO POR: ${nombreADP}`;
                    resultadoArea.value = plantillaActual;
                    navigator.clipboard.writeText(plantillaActual).then(() => {
                        mostrarAvisoCopiado("Plantilla copiada");
                    }).catch(()=>{ /* ignore */ });
                });
                return;
            }

            // Otros tipos 
            switch (tipo) {
                case "instalacion":
                    plantillaActual = `MESA MULTISKILL HITSS - ACTIVACIÓN NUEVA\n${plantillaBase}`;
                    break;
                case "plan":
                    plantillaActual = `MESA MULTISKILL HITSS - CAMBIO DE PLAN\n${plantillaBase}`;
                    break;
                case "mesh":
                    plantillaActual =
`MESA MULTISKILL HITSS - ACTIVACIÓN MESH
SERIE REPETIDOR:
${listaEquiposTxt}
ESTADO: ATENDIDO
REALIZADO POR: ${nombreADP}`;
                    break;
                case "reenvio":
                    plantillaActual =
`MESA MULTISKILL HITSS - REENVÍO DE SEÑAL
EQUIPOS CON REENVÍO DE SEÑAL:
${listaEquiposTxt}
CONFORMIDAD: ATENDIDO
REALIZADO POR: ${nombreADP}`;
                    break;
                case "traslado":
                    plantillaActual =
`MESA MULTISKILL HITSS - TRASLADO EXTERNO
EQUIPOS ACTIVADOS:
${listaEquiposTxt}
ESTADO: ATENDIDO
REALIZADO POR: ${nombreADP}`;
                    break;
                default:
                    plantillaActual = `MESA MULTISKILL HITSS\n${plantillaBase}`;
            }

            // Mostrar y copiar 
            if (tipo !== "equipo") {
                resultadoArea.value = plantillaActual;
                navigator.clipboard.writeText(plantillaActual).then(() => {
                    mostrarAvisoCopiado("Plantilla copiada");
                }).catch(()=>{ /* ignore */ });
            }
        });
    });

    // -------------------------
    // Copiar plantilla generada columna 2
    // -------------------------
    if (btnCopiarPlantilla) {
        btnCopiarPlantilla.addEventListener("click", () => {
            plantillaActual = resultadoArea.value;
            if (!plantillaActual || !plantillaActual.trim()) return;
            navigator.clipboard.writeText(plantillaActual).then(() => {
                btnCopiarPlantilla.classList.add("btn-copiado");
                btnCopiarPlantilla.textContent = "COPIADO";
                setTimeout(() => {
                    btnCopiarPlantilla.classList.remove("btn-copiado");
                    btnCopiarPlantilla.textContent = "COPIAR";
                }, 1200);
            }).catch(()=>{ /* ignore */ });
        });
    }

    // -------------------------
    // Guardar SOT
    // -------------------------
    if (btnGuardar) {
        btnGuardar.addEventListener("click", () => {
            plantillaActual = resultadoArea.value;
            if (!plantillaActual || !plantillaActual.trim()) {
                alert("⚠️ No hay plantilla para guardar.");
                return;
            }

            abrirModal("Guardar SOT", "Ingrese el número de la SOT:", "Ej: 123456789")
            .then(sot => {
                if (!sot) return;
                const sotKey = sot.toUpperCase().trim();
                const adp = getNombreADP();

                sotDatos[sotKey] = {
                    plantilla: plantillaActual,
                    fecha: new Date().toISOString(),
                    adp: adp,
                    regularizada: false
                };

                guardarDatos();
                mostrarAvisoCopiado(`SOT ${sotKey} guardada.`);
                actualizarHistorial();
            });
        });
    }

    // -------------------------
    // Modelos
    // -------------------------
    for (const key in modelosData) {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = modelosData[key].nombre;
        if (selectModelo) selectModelo.appendChild(opt);
    }

    function mostrarModelo(modelKey) {
        const data = modelosData[modelKey];
        if (!data) {
            if (modeloInfo) modeloInfo.classList.add("hidden");
            return;
        }
        if (modeloImagen) modeloImagen.src = data.img;
        if (modeloNombre) modeloNombre.textContent = data.nombre;
        if (modeloDescripcion) modeloDescripcion.textContent = data.descripcion;
        if (modeloRepetidor) modeloRepetidor.textContent = `Repetidor: ${data.repetidor}`;
        if (data.velocidad <= 30) {
            modeloVersion.textContent = "Versión 3.0";
            modeloVersion.className = "modelo-version v3";
        } else {
            modeloVersion.textContent = "Versión 3.1";
            modeloVersion.className = "modelo-version v31";
        }
        modeloInfo.classList.remove("hidden");
    }

    if (buscarModelo) {
        buscarModelo.addEventListener("input", () => {
            const busqueda = buscarModelo.value.toUpperCase().replace(/\s/g, "");
            for (const key in modelosData) {
                if (key.includes(busqueda)) {
                    mostrarModelo(key);
                    return;
                }
            }
            modeloInfo.classList.add("hidden");
        });
    }

    if (selectModelo) {
        selectModelo.addEventListener("change", () => {
            if (selectModelo.value.trim() !== "") {
                mostrarModelo(selectModelo.value);
            } else {
                modeloInfo.classList.add("hidden");
            }
        });
    }

    // -------------------------
    // Historial
    // -------------------------
    function actualizarHistorial() {
        if (!sotContainer) return;
        sotContainer.innerHTML = "";

        const sotsOrdenadas = Object.keys(sotDatos).sort((a, b) => {
            const itemA = sotDatos[a];
            const itemB = sotDatos[b];

            if (itemA.regularizada === itemB.regularizada) {
                return new Date(itemB.fecha) - new Date(itemA.fecha);
            }
            return itemA.regularizada ? 1 : -1;
        });

        let num = 1;
        sotsOrdenadas.forEach(sot => {
            const item = sotDatos[sot];
            const fechaGuardada = new Date(item.fecha);
            const horaFormateada = fechaGuardada.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const cont = document.createElement("div");
            cont.className = "sot-item";
            if (item.regularizada) cont.classList.add("sot-regularizado");

            cont.innerHTML = `
                <div class="sot-header">
                    <div class="sot-title-group">
                        <strong>${num}-->  ${sot}</strong>
                        <span class="sot-time">${horaFormateada} (${item.adp || 'ADP Desconocido'})</span>
                    </div>
                    
                    <div class="sot-actions">
                        <button class="sot-toggle-check" title="${item.regularizada ? 'Marcar Pendiente' : 'Marcar Regularizada'}">
                            ${item.regularizada ? '✔️' : '◻️'}
                        </button>
                       
                        <button class="sot-eliminar" title="Eliminar SOT">🗑️</button>
                    </div>
                </div>

                <div class="sot-body" style="display:none;">
                    <textarea class="sot-textarea">${item.plantilla}</textarea>
                    <div class="sot-btns">
                         <button class="sot-copiar">Copiar</button>
                        <button class="sot-modificar">Guardar cambios</button>
                        <span class="sot-ok" style="display:none;">Actualizado </span>
                    </div>
                </div>
            `;

            const body = cont.querySelector(".sot-body");
            const bodyTextarea = cont.querySelector(".sot-textarea");

            // titulo
            cont.querySelector(".sot-title-group").addEventListener("click", () => {
                body.style.display = body.style.display === "none" ? "block" : "none";
            });

          
            // boton copiar
cont.querySelector(".sot-copiar").addEventListener("click", () => {
    const texto = bodyTextarea.value.trim();
    if (!texto) return;
    navigator.clipboard.writeText(texto).then(() => {
        mostrarAvisoCopiado("Plantilla copiada");
    });
});

            // guardar cambios modificados
            cont.querySelector(".sot-modificar").addEventListener("click", () => {
                const nuevo = bodyTextarea.value.trim();
                if (!nuevo) return alert("No puede dejar el texto vacío.");
                sotDatos[sot].plantilla = nuevo;
                plantillaActual = nuevo;
                guardarDatos();
                const ok = cont.querySelector(".sot-ok");
                ok.style.display = "inline";
                setTimeout(() => ok.style.display = "none", 1500);
            });

            // regularizada
            cont.querySelector(".sot-toggle-check").addEventListener("click", () => {
                sotDatos[sot].regularizada = !sotDatos[sot].regularizada;
                guardarDatos();
                actualizarHistorial();
            });

            // eliminar
            cont.querySelector(".sot-eliminar").addEventListener("click", () => {
                if (confirm(`¿Seguro que desea eliminar el SOT ${sot}?`)) {
                    delete sotDatos[sot];
                    guardarDatos();
                    actualizarHistorial();
                }
            });

            sotContainer.appendChild(cont);
            num++;
        });
    }

   
    cargarDatos();
    actualizarPrevio();

}); 