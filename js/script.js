function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);

    return { r, g, b }
}


absoluteArt.lienzo.agregarCapa();
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const canvasInfo = canvas.getBoundingClientRect();

absoluteArt.utiles.configurarEsteticaCanvas(canvas)

function revertirTrazo() {
    if (absoluteArt.lienzo.capas[absoluteArt.lienzo.capaActiva].historial.historialTrazos.length > 0) {
        absoluteArt.herramientasCanvas.vaciar(ctx)
        absoluteArt.lienzo.capas[absoluteArt.lienzo.capaActiva].historial.revertirTrazo()
        absoluteArt.lienzo.renderizarCapas(ctx)
    }
}
function recuperarTrazo() {
    if (absoluteArt.lienzo.capas[absoluteArt.lienzo.capaActiva].historial.trazosRevertidos.length > 0) {
        absoluteArt.herramientasCanvas.vaciar(ctx)
        absoluteArt.lienzo.capas[absoluteArt.lienzo.capaActiva].historial.recuperarTrazo()
        absoluteArt.lienzo.renderizarCapas(ctx)
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

function listarCapas(idLista) {
    const lista = document.getElementById(idLista);
    const capas = absoluteArt.lienzo.capas
    console.log(capas, lista)
}

function agregarCapa() {

}

// comentario para ver si cambia en git y github

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


        absoluteArt.herramientasCanvas.vaciar(ctx)
        absoluteArt.lienzo.capas[absoluteArt.lienzo.capaActiva].historial.pintarHistorial();
        absoluteArt.lienzo.renderizarCapas(ctx)

        absoluteArt[parametros.contexto.tipoHerramienta]?.[parametros.contexto.categoriaHerramienta]?.[parametros.contexto.herramienta](parametros, ctx)
            ?? absoluteArt[parametros.contexto.tipoHerramienta]?.[parametros.contexto.herramienta]?.(parametros, ctx);
    }
});

canvas.addEventListener('mouseup', (e) => {
    clickeando = false;

    recorrido.push(absoluteArt.utiles.adaptarCordCanvas(e.clientX, e.clientY, ctx))
    parametros = obtenerParametros();
    absoluteArt.lienzo.capas[absoluteArt.lienzo.capaActiva].historial.guardarHistorial(parametros);
});

