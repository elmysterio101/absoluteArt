function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);

    return { r, g, b }
}

const canvas = document.querySelector("canvas")

canvas.width = absoluteArt.lienzo.confCapas.anchoCanvas
canvas.height = absoluteArt.lienzo.confCapas.altoCanvas

const ctx = canvas.getContext('2d')
const canvasInfo = canvas.getBoundingClientRect();

absoluteArt.configuracion.configurarEsteticaCanvas(canvas)
absoluteArt.configuracion.agregarCapaBase()

function revertirTrazo() {
    if (absoluteArt.lienzo.capaActiva.historial.historialTrazos.length > 0) {
        absoluteArt.herramientasCanvas.vaciar(ctx)
        absoluteArt.lienzo.capaActiva.historial.revertirTrazo()
        absoluteArt.lienzo.renderizarCapas(ctx)
        actualizarCanvasEnPantalla(absoluteArt.lienzo.capaActiva);
    }
}

function recuperarTrazo() {
    if (absoluteArt.lienzo.capas[absoluteArt.lienzo.capaActiva].historial.trazosRevertidos.length > 0) {
        absoluteArt.herramientasCanvas.vaciar(ctx)
        absoluteArt.lienzo.capas[absoluteArt.lienzo.capaActiva].historial.recuperarTrazo()
        absoluteArt.lienzo.renderizarCapas(ctx)
        actualizarCanvasEnPantalla(absoluteArt.lienzo.capaActiva);
    }
}

function listarHerramientas() {
    const pinceles = Object.keys(absoluteArt.dibujo.pinceles)
    for (const pincel of pinceles) {
        document.getElementById("pinceles").insertAdjacentHTML('beforeend', `<option value="${pincel}" class="pincel">${pincel}</option>`);
    }

    const figuras = Object.keys(absoluteArt.dibujo.figuras)
    for (const figura of figuras) {
        document.getElementById("figuras").insertAdjacentHTML('beforeend', `<option value="${figura}" class="figura">${figura}</option>`);
    }

    const herramientas = Object.keys(absoluteArt.dibujo.herramientas)
    for (const herramienta of herramientas) {
        document.getElementById("herramientas").insertAdjacentHTML('beforeend', `<option value="${herramienta}" class="herramienta">${herramienta}</option>`);
    }

}

listarHerramientas();
let tipoHerramienta = 'dibujo';
let categoriaHerramienta = 'figuras';
let herramienta = 'lineaBrusca';
let colorPrincipal = { r: 0, g: 0, b: 0 };
let colorSecundario = { r: 0, g: 0, b: 0 };
let grosor = 1;
let opacidadPrincipal = 1;
let opacidadSecundaria = 1;
let recorrido = [];

const listaCapas = document.getElementById('listaCapas');


function obtenerParametros() {
    return {
        colorPrincipal: colorPrincipal,
        opacidadPrincipal: opacidadPrincipal,
        grosorLinea: grosor,

        colorSecundario: colorSecundario,
        opacidadSecundaria: opacidadSecundaria,
        contexto: {
            tipoHerramienta: tipoHerramienta,
            categoriaHerramienta: categoriaHerramienta,
            herramienta: herramienta,
            recorrido,
        }
    }
}

let idGrupoActivo = 0;
let idCapaActiva = 0;

function seleccionarCapa(id, tipo) {
    if (tipo === 'individual') {
        const capa = absoluteArt.lienzo.buscarCapa(id, absoluteArt.lienzo.capas);
        absoluteArt.lienzo.capaActiva = capa;
        idCapaActiva = capa.id
        console.log(capa)
        document.querySelector('.activo').classList.remove('activo')
        document.getElementById('representacionCapa' + id).classList.add('activo')
    } else if (tipo === 'grupo') {
        absoluteArt.lienzo.grupoCapasActiva = absoluteArt.lienzo.buscarGrupoCapas(id, absoluteArt.lienzo.capas);
        idGrupoActivo = id;

        console.log(document.querySelector('.activo').classList)
        document.querySelector('.activo').classList.remove('activo')
        document.getElementById('representacionGrupo' + id).classList.add('activo')
    } else {
        console.log("errorsito bro")
    }

}

function agregarCapaDom(tipo) {
    const ubic = document.getElementById('contenido' + idGrupoActivo);

    if (tipo === 'grupo') {
        absoluteArt.lienzo.agregarGrupoCapas(idGrupoActivo);
        const capa = absoluteArt.lienzo.grupoCapasActiva
        idGrupoActivo = capa.id

        ubic.insertAdjacentHTML('afterbegin', `
        <div class="representacionCapa representacionCapaGrupo" id="representacionGrupo${capa.id}" ">
                    <input type="checkbox" name="" class="input" id="desplegableCapa${capa.id}">

                    <div class="portada">
                        <label for="desplegableCapa${capa.id}" class="plegado">
                            <p>></p>
                        </label>
                        <button type="button" class="infoPlegado" onclick="seleccionarCapa(${capa.id} , 'grupo')">
                            <p class="nombreCapa"> ${capa.nombre}</p>
                            <canvas id="canvasGrupoCapas${capa.id}"></canvas>
                        </button>
                    </div>
                    <div class="contenido" id="contenido${capa.id}">
                    </div>
                </div>

        `);
        seleccionarCapa(capa.id, 'grupo')

    } else if (tipo === 'individual') {
        absoluteArt.lienzo.agregarCapa(idGrupoActivo);
        const capa = absoluteArt.lienzo.capaActiva

        ubic.insertAdjacentHTML('afterbegin', `
        <div class="representacionCapa representacionCapaGrupo capaIndividual" id="representacionCapa${capa.id}">
                    <input type="checkbox" name="" class="input" id="visibilidadCapa${capa.id} onchange= "cambiarVisibilidadCapa('individual' , ${capa.id})"">

                    <div class="portada">
                        <label for="visibilidadCapa${capa.id}" class="plegado">
                            <p>0</p>
                        </label>
                        <button type="button" class="infoPlegado" onclick="seleccionarCapa(${capa.id} , 'individual')">
                            <p class="nombreCapa"> ${capa.nombre}</p>
                            <canvas id="canvasGrupoCapas${capa.id}"></canvas>
                        </button>
                    </div>
                </div>

        `);
        seleccionarCapa(capa.id, 'individual')

    }

}



function actualizarCanvasEnPantalla(capa, ctx) {
    capa.renderizar(ctx)
}

let parametros = obtenerParametros();
let clickeando = false;

canvas.addEventListener('mousedown', (e) => {

    

    clickeando = true;
    recorrido = []; // adaptarCordCanvas(cordX,cordY,canvas)
    recorrido.push(absoluteArt.utiles.adaptarCordCanvas(e.clientX, e.clientY, ctx))
    parametros = obtenerParametros();

    absoluteArt[parametros.contexto.tipoHerramienta]?.[parametros.contexto.categoriaHerramienta]?.[parametros.contexto.herramienta](parametros, ctx)
        ?? absoluteArt[parametros.contexto.tipoHerramienta]?.[parametros.contexto.herramienta]?.(parametros, ctx);

});

canvas.addEventListener('mousemove', (e) => {
    if (clickeando) {
        parametros = obtenerParametros();
        recorrido.push(absoluteArt.utiles.adaptarCordCanvas(e.clientX, e.clientY, ctx))

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.drawImage(absoluteArt.lienzo.capaActiva.historial.ctx.canvas , 0 ,0);

        absoluteArt[parametros.contexto.tipoHerramienta]?.[parametros.contexto.categoriaHerramienta]?.[parametros.contexto.herramienta](parametros, ctx)
            ?? absoluteArt[parametros.contexto.tipoHerramienta]?.[parametros.contexto.herramienta]?.(parametros, ctx);
    }
});

canvas.addEventListener('mouseup', (e) => {
    clickeando = false;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    recorrido.push(absoluteArt.utiles.adaptarCordCanvas(e.clientX, e.clientY, ctx))
    parametros = obtenerParametros();
    absoluteArt.lienzo.capaActiva.historial.guardarHistorial(parametros);
    actualizarCanvasEnPantalla(absoluteArt.lienzo.capaActiva, ctx);
});

