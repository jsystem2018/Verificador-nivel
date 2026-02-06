/* ======= inicio-ticket ======= */
window.addEventListener("DOMContentLoaded", () => {
  const sel=document.querySelector("select");
  if(location.pathname.includes("validaciones")){
    sel.value="validaciones";
  }else{
    sel.value="activaciones";
  }
});

/* ================= constantes ================= */
const CONFIG={
  A:3,
  R:5,
  M:5,
  P:10,
  RE:10
};

let asesores=JSON.parse(localStorage.getItem("activaciones"))||[];


function guardar(){
  localStorage.setItem("activaciones",JSON.stringify(asesores))
}

function cambiarVista(v){
  if(v==="validaciones"){
    window.location.href="validaciones.html";
  }
}

/* ================= CARGAr ================= */
function cargarAsesores(){
  const txt=document.getElementById("cargaMasiva").value.trim();
  if(!txt)return;
  txt.split(",").forEach(n=>{
    const nombre=n.trim();
    if(!nombre)return;
    if(asesores.some(a=>a.nombre.toLowerCase()===nombre.toLowerCase())){
      alert(`"${nombre}" ya existe`);
      return;
    }
    asesores.push({
      nombre,
      bloques:{},
      activo:{},
      inicioGeneral:null,
      llegada100:null,
      refrigerio:false
    });
  });
  document.getElementById("cargaMasiva").value="";
  guardar();render();
}

/* ================= DELEGAR ================= */
function delegar(i,tipo,cant){
  const a=asesores[i];
  if(a.refrigerio)return;

  if(!a.bloques[tipo])
    a.bloques[tipo]={tickets:0,inicio:null};

  a.bloques[tipo].tickets+=cant;
  a.bloques[tipo].inicio=Date.now();
  a.activo[tipo]=cant;

  if(!a.inicioGeneral)a.inicioGeneral=Date.now();
  guardar();render();
}

/* ================= RESETEAR ================= */
function resetAsesor(i){
  const a=asesores[i];
  a.activo={};
  a.inicioGeneral=null;
  a.llegada100=null;
  Object.values(a.bloques).forEach(b=>b.inicio=null);
  guardar();render();
}

function toggleRefrigerio(i){
  asesores[i].refrigerio=!asesores[i].refrigerio;
  guardar();render();
}

function reiniciarTodo(){
  if(!confirm("Se borrara todo"))return;
  asesores=[];
  localStorage.removeItem("activaciones");
  render();
}

/* ================= RENDER ================= */
function render(){
  const cont=document.getElementById("lista");
  cont.innerHTML="";
  const ahora=Date.now();

  asesores.forEach(a=>{
    let fin=0;
    Object.entries(a.bloques).forEach(([t,b])=>{
      if(!b.inicio)return;
      fin=Math.max(
        fin,
        b.inicio+(b.tickets*CONFIG[t]*60000)
      );
    });
    if(fin&&ahora>=fin&&!a.llegada100)
      a.llegada100=ahora;
  });

  asesores.sort((a,b)=>{
    if(a.llegada100&&b.llegada100)
      return a.llegada100-b.llegada100;
    if(a.llegada100)return -1;
    if(b.llegada100)return 1;
    return 0;
  });

  asesores.forEach((a,i)=>{
    let fin=0;
    Object.entries(a.bloques).forEach(([t,b])=>{
      if(b.inicio)
        fin=Math.max(
          fin,
          b.inicio+(b.tickets*CONFIG[t]*60000)
        );
    });

    let pct=a.inicioGeneral&&fin>a.inicioGeneral
      ?Math.min(((ahora-a.inicioGeneral)/(fin-a.inicioGeneral))*100,100)
      :0;

    const tot={
      A:a.bloques.A?.tickets||0,
      R:a.bloques.R?.tickets||0,
      M:a.bloques.M?.tickets||0,
      P:a.bloques.P?.tickets||0,
      RE:a.bloques.RE?.tickets||0
    };
    const total=Object.values(tot).reduce((x,y)=>x+y,0);

    cont.innerHTML+=`
    <div class="asesor ${pct>=100?'prioridad':''}"
      style="opacity:${a.refrigerio?0.5:1}">
      <strong>${a.nombre}</strong>
      <span class="tickets">
        (A=${tot.A}) (R=${tot.R}) (M=${tot.M})
        (P=${tot.P}) (RE=${tot.RE}) → Total ${total}
      </span>

      <div class="bloque">
        <span>A:</span>
        ${[1,2,3,4,5].map(n=>
          `<button class="${a.activo.A===n?'activo A':''}"
          onclick="delegar(${i},'A',${n})">A${n}</button>`
        ).join("")}
        || <span>R:</span>
        ${[1,2,3,4].map(n=>
          `<button class="${a.activo.R===n?'activo R':''}"
          onclick="delegar(${i},'R',${n})">R${n}</button>`
        ).join("")}
        || <span>M:</span>
        ${[1,2,3,4].map(n=>
          `<button class="${a.activo.M===n?'activo M':''}"
          onclick="delegar(${i},'M',${n})">M${n}</button>`
        ).join("")}
        || <span>P:</span>
        ${[1,2,3,4].map(n=>
          `<button class="${a.activo.P===n?'activo P':''}"
          onclick="delegar(${i},'P',${n})">P${n}</button>`
        ).join("")}
        || <span>RE:</span>
        ${[1,2,3,4].map(n=>
          `<button class="${a.activo.RE===n?'activo RE':''}"
          onclick="delegar(${i},'RE',${n})">RE${n}</button>`
        ).join("")}
        || <button class="refrigerio"
          onclick="toggleRefrigerio(${i})">Refrigerio</button>
        <button class="resetA"
          onclick="resetAsesor(${i})">Reset</button>
      </div>

      <div class="progress">
        <div class="progress-bar"
          style="width:${pct}%;
          background:${pct>=100?'red':'#555'}">
          ${Math.floor(pct)}%
        </div>
      </div>

      ${Object.entries(a.bloques).map(([t,b])=>{
        if(!b.inicio)return "";
        const dur=b.tickets*CONFIG[t]*60000;
        const pctB=Math.min(((ahora-b.inicio)/dur)*100,100);
        return `<div class="sub ${t}sub" style="width:${pctB}%"></div>`;
      }).join("")}
    </div>`;
  });
}

setInterval(render,1000);
render();