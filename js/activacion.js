// ===============================================================
// SECTION 5 ACTIVACION
// ===============================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("[Section5] JS cargado correctamente");

    // Obtener NombreAdp
    function getNombreADP() {
        const storedADP = localStorage.getItem('sessionADP');
        return storedADP || "USUARIO DESCONOCIDO";
    }

    // ===============================
    // ELEMENTOS DEL DOM
    // ===============================
    const inputCodigo = document.getElementById("inputCodigo");
    const inputEmta = document.getElementById("inputEmta");
    const inputSOT = document.getElementById("inputSOT");

    const previoContainer = document.getElementById("previoContainer");
    const resultadoArea = document.getElementById("resultado"); 

    const btnLimpiarPrevio = document.getElementById("btnLimpiarPrevio");
    const btnCopiarPlantilla = document.getElementById("btnCopiarPlantilla");
    const btnGuardar = document.getElementById("btnGuardar");

    const sotContainer = document.getElementById("sotContainer");

    const buscarModelo = document.getElementById("buscarModelo");
    const selectModelo = document.getElementById("selectModelo");
    const modeloInfo = document.getElementById("modeloInfo");
    
    // Elementos de informacion del modelo
    const modeloImagen = document.getElementById("modeloImagen");
    const modeloNombre = document.getElementById("modeloNombre");
    const modeloDescripcion = document.getElementById("modeloDescripcion");
    const modeloRepetidor = document.getElementById("modeloRepetidor");
    const modeloVersion = document.getElementById("modeloVersion");
    
    // ===============================
    // VARIABLES Y PERSISTENCIA DE DATOS
    // =================================
    let equiposGuardados = [];
    let plantillaActual = "";
    // sotDatos ahora guarda un objeto
    let sotDatos = {}; 

    // ------------------------------------
    // Funciones de LocalStorage
    // ------------------------------------
    function guardarDatos() {
        localStorage.setItem("sotHistorial", JSON.stringify(sotDatos));
    }

    function cargarDatos() {
        const storedSOT = localStorage.getItem("sotHistorial");
        if (storedSOT) {
            sotDatos = JSON.parse(storedSOT);
        }
        actualizarHistorial(); 
    }
   

    // ===============================
    // MAPEO de DATOS
    // ===============================
    function formatearEMTA(valor) {
        valor = valor.toUpperCase().replace(/[^A-Z0-9]/g, "");
        return valor.match(/.{1,2}/g)?.join(":") || valor;
    }

    const modelosPorCodigo = {
        "48575443": ["HUAWEI_HG8145V5", "HUAWEI_HG8145X6-10", "HUAWEI_HG8245W5-6T", "HUAWEI_HG8245Q2", "HUAWEI_HG8247U"],
        "5A544547D": ["ZTE_F6600PV9.0.12", "ZTE_F680V6.0.08", "ZTE_F680V6.0.024"],
        "53": ["SAGECOM FAST5670V2"],
        "ZTEATV412": ["ZTE B866V2"],
        "ZTEATV455": ["ZTE B866V2-H"],
        "SGC": ["VSB3918"]
    };

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
    
    function agregarEquipo(codigoInput, emtaInput) {
        let codigo = codigoInput.trim().toUpperCase();
        let emta = formatearEMTA(emtaInput.trim());
        let modelos = [];
        let modeloSeleccionado = "";
        for (const prefijo in modelosPorCodigo) {
            if (codigo.startsWith(prefijo)) {
                modelos = modelosPorCodigo[prefijo];
                break;
            }
        }
        if (modelos.length > 1) {
            let opciones = modelos.map((m, i)=>`${i+1}. ${m}`).join("\n");
            let seleccion = prompt(`Seleccione el modelo:\n${opciones}`);
            let idx = parseInt(seleccion) - 1;
            if (!isNaN(idx) && modelos[idx]) {
                modeloSeleccionado = modelos[idx];
            }
        } else if (modelos.length === 1) {
            modeloSeleccionado = modelos[0];
        }
        if (codigo || modeloSeleccionado || emta) {
            equiposGuardados.push([codigo, modeloSeleccionado, emta].filter(Boolean).join(" "));
        }
        inputCodigo.value = "";
        inputEmta.value = "";
        actualizarPrevio();
    }

    function actualizarPrevio() {
        previoContainer.innerHTML = "";
        equiposGuardados.forEach(item => {
            const linea = document.createElement("div");
            linea.className = "linea-preview";
            linea.textContent = item;
            linea.addEventListener("click", () => {
                const partes = item.split(" ");
                let emta = partes.find(p => p.includes(":"));
                let codigo = partes[0];
                let texto = emta || codigo;
                texto = texto.replace(/[^A-Z0-9]/g, "").toUpperCase();
                navigator.clipboard.writeText(texto).then(() => {
                    linea.textContent = item + "  (Copiado)";
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

    // ===============================
    // EVENTOS INPUT
    // ===============================
    inputCodigo.addEventListener("keyup", (e)=>{
        inputCodigo.value = inputCodigo.value.toUpperCase().slice(0, 30);
        if (e.key === "Enter" && inputCodigo.value.trim() !== "") {
            agregarEquipo(inputCodigo.value, "");
        }
    });

    inputEmta.addEventListener("input", ()=>{
        inputEmta.value = formatearEMTA(inputEmta.value).slice(0,30);
    });

    inputEmta.addEventListener("keyup", (e)=>{
        if (e.key === "Enter" && inputEmta.value.trim() !== "") {
            agregarEquipo("", inputEmta.value);
        }
    });

    // Anadido readonly para proteger el campo de plantilla al limpiar
    btnLimpiarPrevio.addEventListener("click", () => {
        equiposGuardados = [];
        plantillaActual = "";
        resultadoArea.value = "";
        resultadoArea.setAttribute('readonly', 'readonly'); 
        actualizarPrevio();
    });
    
    // ===============================================================
    // BOTONES DE PLANTILLAS
    // ===============================================================
    document.querySelectorAll(".btn-accion").forEach(btn => {
        btn.addEventListener("click", () => {

            const nombreADP = getNombreADP(); 

            if (equiposGuardados.length === 0) {
                return alert("⚠️ Debe agregar al menos un equipo.");
            }

            let listaEquiposTxt = equiposGuardados.join("\n");
            let tipo = btn.dataset.tipo; 

            switch (tipo) {
                case "instalacion":
                    plantillaActual =
`MESA MULTISKILL HITSS - ACTIVACIÓN
EQUIPOS ACTIVADOS:
${listaEquiposTxt}
ESTADO: ATENDIDO
REALIZADO POR: ${nombreADP}`; 
                    break;

                case "plan":
                    plantillaActual =
`MESA MULTISKILL HITSS - CAMBIO DE PLAN
EQUIPOS ACTIVADOS:
${listaEquiposTxt}
ESTADO: ATENDIDO
REALIZADO POR: ${nombreADP}`; 
                    break;

                case "equipo":
                    let codAuth = prompt("Ingrese codigo de autorizacion:");
                    if (!codAuth) return;

                    plantillaActual =
`MESA MULTISKILL HITSS - CAMBIO DE EQUIPO
EQUIPOS ACTIVADOS:
${listaEquiposTxt}
CODIGO DE AUT.: ${codAuth}
ESTADO: ATENDIDO
REALIZADO POR: ${nombreADP}`; 
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
`MESA MULTISKILL HITSS - REENVÍO
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
            }

            // Mostrar en textarea
            resultadoArea.value = plantillaActual;
            resultadoArea.removeAttribute('readonly'); // HABILITA LA EDICIÓN MANUAL
        });
    });

    // ===============================================================
    // BOToN COPIAR
    // ===============================================================
    btnCopiarPlantilla.addEventListener("click", () => {
        plantillaActual = resultadoArea.value;
        if (!plantillaActual.trim()) return;

        navigator.clipboard.writeText(plantillaActual).then(() => {
            btnCopiarPlantilla.classList.add("btn-copiado");
            btnCopiarPlantilla.textContent = "COPIADO ✔";

            setTimeout(() => {
                btnCopiarPlantilla.classList.remove("btn-copiado");
                btnCopiarPlantilla.textContent = "COPIAR";
            }, 1200);
        });
    });

    // ===============================================================
    // GUARDAR SOT EN HISTORIAL + COPIA
    // ===============================================================
    btnGuardar.addEventListener("click", () => {
        plantillaActual = resultadoArea.value;
        if (!plantillaActual.trim()) return alert("⚠️ No hay plantilla para guardar.");

        let sot = inputSOT.value.trim();
        if (!sot) {
            sot = prompt("Ingrese SOT:");
            if (!sot) return;
        }

        //guardado con fecha y estado
        sotDatos[sot] = {
            plantilla: plantillaActual,
            fecha: new Date().toISOString(), 
            regularizado: false 
        };
        
        guardarDatos(); 

        navigator.clipboard.writeText(plantillaActual);

        const msg = document.createElement("div");
        msg.textContent = "Plantilla guardada y copiada";
        msg.className = "msg-flotante";
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 1500);

        inputSOT.value = "";

        actualizarHistorial();
    });

    // ===============================================================
    // HISTORIAL 
    // ===============================================================
    function actualizarHistorial() {
        sotContainer.innerHTML = "";
        let num = 1;

        for (const sot in sotDatos) {
            const item = sotDatos[sot]; // Obtenemos el objeto completo

            // Formatear la hora
            const fechaGuardada = new Date(item.fecha);
            const horaFormateada = fechaGuardada.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            const cont = document.createElement("div");
            cont.className = "sot-item";
            if (item.regularizado) {
                cont.classList.add("sot-regularizado"); // Clase CSS para el estilo
            }

            cont.innerHTML = `
                <div class="sot-header">
                    <div class="sot-title-group">
                        <strong>${num}. SOT: ${sot}</strong>
                        <span class="sot-time">${horaFormateada}</span>
                    </div>
                    
                    <div class="sot-actions">
                        <button class="sot-toggle-check" title="Regularizar/Pendiente">
                            ${item.regularizado ? '✔️' : '◻️'}
                        </button>
                        <button class="sot-editar" title="Editar plantilla">📝</button>
                        <button class="sot-eliminar" title="Eliminar SOT">🗑️</button>
                    </div>
                </div>

                <div class="sot-body" style="display:none;">
                    <textarea class="sot-textarea">${item.plantilla}</textarea>
                    <div class="sot-btns">
                        <button class="sot-modificar">Guardar cambios</button>
                        <span class="sot-ok" style="display:none;">Actualizado ✔</span>
                    </div>
                </div>
            `;

            const body = cont.querySelector(".sot-body");
            const bodyTextarea = cont.querySelector(".sot-textarea");

            // ---------------------------------------------
            // Mostrar/Ocultar y Modificar
            // ---------------------------------------------
            
            cont.querySelector(".sot-title-group").addEventListener("click", () => {
                 body.style.display = body.style.display === "none" ? "block" : "none";
            });
            //  edicion para expandir
            cont.querySelector(".sot-editar").addEventListener("click", () => {
                body.style.display = "block";
            });

            // Guardar Cambios en el textarea
            cont.querySelector(".sot-modificar").addEventListener("click", () => {
                const nuevo = bodyTextarea.value.trim();
                if (!nuevo) return alert("No puede dejar el texto vacío.");

                sotDatos[sot].plantilla = nuevo; // Actualizar solo la plantilla
                plantillaActual = nuevo;
                guardarDatos(); 

                navigator.clipboard.writeText(nuevo);

                const ok = cont.querySelector(".sot-ok");
                ok.style.display = "inline";
                setTimeout(() => ok.style.display = "none", 1500);
            });

            // ---------------------------------------------
            // Check de regularizacion
            // ---------------------------------------------
            cont.querySelector(".sot-toggle-check").addEventListener("click", () => {
                sotDatos[sot].regularizado = !sotDatos[sot].regularizado;
                guardarDatos();
                actualizarHistorial(); // Refrescar la lista para actualizar el icono y el estilo
            });

            // ---------------------------------------------
            // eliminar
            // ---------------------------------------------
            cont.querySelector(".sot-eliminar").addEventListener("click", () => {
                if(confirm(`¿Seguro que desea eliminar el SOT ${sot}?`)){
                    delete sotDatos[sot];
                    guardarDatos(); 
                    actualizarHistorial();
                }
            });

            sotContainer.appendChild(cont);
            num++;
        }
    }


    // ===============================================================
    // MODELOS ONT / EMTA
    // ===============================================================
    
    // Agregar modelos al select
    for (const key in modelosData) {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = modelosData[key].nombre;
        selectModelo.appendChild(opt);
    }

    // Mostrar modelo en pantalla
    function mostrarModelo(modelKey) {
        const data = modelosData[modelKey];
        if (!data) {
            modeloInfo.classList.add("hidden");
            return;
        }

        modeloImagen.src = data.img; 
        modeloNombre.textContent = data.nombre;
        modeloDescripcion.textContent = data.descripcion;
        modeloRepetidor.textContent = `Repetidor: ${data.repetidor}`;

        if (data.velocidad <= 30) {
            modeloVersion.textContent = "Versión 3.0";
            modeloVersion.className = "modelo-version v3";
        } else {
            modeloVersion.textContent = "Versión 3.1";
            modeloVersion.className = "modelo-version v31";
        }

        modeloInfo.classList.remove("hidden");
    }

    // Buscar modelo escribiendo
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

    // Buscar modelo por seleccion
    selectModelo.addEventListener("change", () => {
        if (selectModelo.value.trim() !== "") {
            mostrarModelo(selectModelo.value);
        } else {
            modeloInfo.classList.add("hidden");
        }
    });

    // ------------------------------------
    // INICIAR LA APLICACION Cargar datos
    // ------------------------------------
    cargarDatos(); 

}); // FIN 