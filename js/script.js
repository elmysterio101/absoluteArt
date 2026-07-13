function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);

    return { r, g, b }
}

const canvas = document.getElementById("canvasPrincipal")

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
        absoluteArt.lienzo.capas.renderizar(ctx)
    }
}

function recuperarTrazo() {
    if (absoluteArt.lienzo.capaActiva.historial.trazosRevertidos.length > 0) {
        absoluteArt.herramientasCanvas.vaciar(ctx)
        absoluteArt.lienzo.capaActiva.historial.recuperarTrazo()
        absoluteArt.lienzo.capas.renderizar(ctx)
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
let categoriaHerramienta = 'pinceles';
let herramienta = 'clasico';
let colorPrincipal = { r: 0, g: 0, b: 0 };
let colorSecundario = { r: 0, g: 0, b: 0 };
let grosor = 100;
let opacidadPrincipal = 0.3;
let opacidadSecundaria = 1;
let recorrido = [];

const listaCapas = document.getElementById('listaCapas');

let capaActual = absoluteArt.lienzo.capas

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

function cambiarOpacidadCapa() {
    capaActual.opacidad = Number(document.getElementById('capaOpacidad').value)
    document.getElementById('letreroCapaOpacidad').innerHTML = 'opacidad : ' + capaActual.opacidad;
}

function cambiarVisibilidadCapa() {
    capaActual.visible = document.getElementById('capaVisibilidad').checked
    document.getElementById('LetreroCapaVisibilidad').innerHTML = 'visible : ' + capaActual.visible;
}

function cambiarEditabilidadCapa() {
    capaActual.editable = document.getElementById('capaEditabilidad').checked
    document.getElementById('letreroCapaEditabilidad').innerHTML = 'editable : ' + capaActual.editable;
}

const confCapa = document.getElementById('configuracionCapaActual');

function abrirConfiguracionCapa() {
    confCapa.style.display = "flex";
    let capa;
    if (tipoCapaActiva === 'grupo') {
        capaActual = absoluteArt.lienzo.capas.buscarGrupoCapas(idGrupoActivo);
    } else {
        capaActual = absoluteArt.lienzo.capas.buscarCapa(idCapaActiva);
    }

    actualizarSelectorCapaPadre();

    if (capaActual.tipoCapa === 'grupo') {
        document.getElementById('letreroCapaEditabilidad').parentElement.style.display = 'none'
        if (capaActual.id === 0) {
            document.getElementById('letreroCapaPadre').parentElement.style.display = 'none'
            document.getElementById('capaCordenadaX').parentElement.style.display = 'none'
            document.getElementById('capaCordenadaY').parentElement.style.display = 'none'
        } else {
            document.getElementById('letreroCapaPadre').parentElement.style.display = 'flex'
            document.getElementById('capaCordenadaX').parentElement.style.display = 'flex';
            document.getElementById('capaCordenadaY').parentElement.style.display = 'flex';
        }
    } else {
        document.getElementById('letreroCapaEditabilidad').parentElement.style.display = 'flex'
        document.getElementById('letreroCapaPadre').parentElement.style.display = 'flex'
        document.getElementById('capaCordenadaX').parentElement.style.display = 'flex'
        document.getElementById('capaCordenadaY').parentElement.style.display = 'flex';
    }


    document.getElementById('nombreCapaConfigurada').innerHTML = capaActual.nombre

    document.getElementById('letreroCapaOpacidad').innerHTML = 'opacidad : ' + capaActual.opacidad;
    document.getElementById('capaOpacidad').value = capaActual.opacidad;

    document.getElementById('LetreroCapaVisibilidad').innerHTML = 'visible : ' + capaActual.visible;
    document.getElementById('capaVisibilidad').checked = capaActual.visible;

    document.getElementById('letreroCapaEditabilidad').innerHTML = 'editable : ' + capaActual.editable;
    document.getElementById('capaEditabilidad').checked = capaActual.editable;

}

let idGrupoActivo = 0;
let idCapaActiva = 0;
let tipoCapaActiva = 'grupo';

function seleccionarCapa(id, tipo) {
    if (tipo === 'individual') {
        tipoCapaActiva = 'individual';
        capaActual = absoluteArt.lienzo.capas.buscarCapa(id);
        absoluteArt.lienzo.capaActiva = capaActual;

        idCapaActiva = id;
        const eliminar = document.querySelector('.activo')
        if (eliminar) {
            eliminar.classList.remove('activo')
        }
        document.getElementById('representacionCapa' + id).classList.add('activo')
        abrirConfiguracionCapa()
        abrirCapasPadre(capaActual)
    } else if (tipo === 'grupo') {

        tipoCapaActiva = 'grupo';
        capaActual = absoluteArt.lienzo.capas.buscarGrupoCapas(id);
        absoluteArt.lienzo.grupoCapasActiva = capaActual;
        idGrupoActivo = id;

        const eliminar = document.querySelector('.activo')
        if (eliminar) {
            eliminar.classList.remove('activo')
        }
        document.getElementById('representacionGrupo' + id).classList.add('activo')
        abrirConfiguracionCapa()
        if (capaActual.id !== 0) {
            abrirCapasPadre(capaActual)
        }
    } else {
        console.log("errorsito bro")
    }
}

function abrirCapasPadre(capa) {
    if (capa.capaPadre) {
        document.getElementById('desplegableCapa' + capa.capaPadre.id).checked = true;
        if (capa.capaPadre.capaPadre) {
            abrirCapasPadre(capa.capaPadre)
        }
    }
}

function agregarCapaDom(tipo) {
    const ubic = document.getElementById('contenido' + idGrupoActivo);

    if (tipo === 'grupo') {
        absoluteArt.lienzo.agregarGrupoCapas(idGrupoActivo);
        const capa = absoluteArt.lienzo.grupoCapasActiva
        idGrupoActivo = capa.id

        agregarCapaGrupo(ubic, capa);
        seleccionarCapa(idGrupoActivo, 'grupo')

    } else if (tipo === 'individual') {

        absoluteArt.lienzo.agregarCapa(idGrupoActivo);
        const capa = absoluteArt.lienzo.capaActiva
        capaActiva = capa.id

        agregarCapaIndividual(ubic, capa)

        seleccionarCapa(capa.id, 'individual')
    }
}

function agregarCapaGrupo(ubicacion, capa) {
    ubicacion.insertAdjacentHTML('afterbegin', `
        <div class="representacionCapa representacionCapaGrupo" id="representacionGrupo${capa.id}" ">
                    <input type="checkbox" name="" class="input" id="desplegableCapa${capa.id}">

                    <div class="portada">
                        <label for="desplegableCapa${capa.id}" class="plegado">
                            <p>></p>
                        </label>
                        <button type="button" class="infoPlegado" onclick="seleccionarCapa(${capa.id} , 'grupo')">
                            <p class="nombreCapa"> ${capa.nombre}</p>
                            <canvas id="canvasgrupocapa${capa.id}" height="${capa.canvas.height}" width="${capa.canvas.width}" "></canvas>
                        </button>
                    </div>
                    <div class="contenido" id="contenido${capa.id}">
                    </div>
                </div>

        `);

    sincronizarCapaCanvasReal(capa)
}

function agregarCapaIndividual(ubicacion, capa) {
    ubicacion.insertAdjacentHTML('afterbegin', `
        <div class="representacionCapa representacionCapaGrupo capaIndividual" id="representacionCapa${capa.id}">
                    <input type="checkbox" name="" class="input" id="visibilidadCapa${capa.id} onchange= "cambiarVisibilidadCapa('individual' , ${capa.id})"">

                    <div class="portada">
                        <label for="visibilidadCapa${capa.id}" class="plegado">
                            <p>0</p>
                        </label>
                        <button type="button" class="infoPlegado" onclick="seleccionarCapa(${capa.id} , 'individual')">
                            <p class="nombreCapa"> ${capa.nombre}</p>
                            <canvas id="canvasindividualcapa${capa.id}" height="${Number(capa.canvas.height)}" width="${Number(capa.canvas.width)}" ></canvas>
                        </button>
                    </div>
                </div>

        `);

    sincronizarCapaCanvasReal(capa)
}

function agregarContenidoGrupo(grupo) {
    const ubic = document.getElementById('contenido' + grupo.id)
    const borrar = ubic.querySelectorAll('.representacionCapa');
    for (const cap of borrar) {
        cap.remove()
    }

    for (const capa of grupo.contenido) {
        if (capa.tipoCapa === 'grupo') {
            agregarCapaGrupo(ubic, capa)
            if (capa.contenido !== 0) {
                agregarContenidoGrupo(capa)
            }
        } else {
            agregarCapaIndividual(ubic, capa)
        }
    }

}

function eliminarCapaActual() {
    let capaDios = false;
    if (capaActual.tipoCapa === 'grupo') {
        if (capaActual.id === 0) {
            capaDios = true
        }
    }
    if (!capaDios) {
        if (capaActual.tipoCapa === 'grupo') {
            absoluteArt.lienzo.eliminarGrupoCapas(capaActual.id);
            document.getElementById('representacionGrupo' + capaActual.id).remove()
        } else {
            absoluteArt.lienzo.eliminarCapa(capaActual.id);
            document.getElementById('representacionCapa' + capaActual.id).remove()
        }
        capaActual = absoluteArt.lienzo.capas
        seleccionarCapa(capaActual.id, capaActual.tipoCapa)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        absoluteArt.lienzo.capas.renderizar(ctx);
        sincronizarCapaCanvasReal(capaActual);
    }

}

function sincronizarCapaCanvasReal(capa) {
    const ctxActual = document.getElementById('canvas' + capa.tipoCapa + 'capa' + capa.id).getContext('2d');
    ctxActual.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    capa.renderizar(ctxActual)
    if (capa.capaPadre !== undefined) {
        sincronizarCapaCanvasReal(capa.capaPadre)
    }
}

function moverCapaLista(capa, movimiento) {
    const indiceCapa = capa.capaPadre.obtenerIndiceCapa(capa);
    if (indiceCapa + movimiento >= 0 && indiceCapa + movimiento < capa.capaPadre.contenido.length) {
        capa.capaPadre.moverCapaIndice(capa, indiceCapa + movimiento)
        let capaMover;
        if (capaActual.tipoCapa === 'grupo') {
            capaMover = document.getElementById('representacionGrupo' + capaActual.id)
        } else {
            capaMover = document.getElementById('representacionCapa' + capaActual.id)
        }
        agregarContenidoGrupo(capa.capaPadre)

    }
    seleccionarCapa(capa.id, capa.tipoCapa)
}

function duplicarCapa() {
    if (capaActual.capaPadre) {
        absoluteArt.lienzo.clonarCapa(capaActual.capaPadre, capaActual)
    }
    agregarContenidoGrupo(absoluteArt.lienzo.capas)
    seleccionarCapa(capaActual.id, capaActual.tipoCapa)
}

function actualizarSelectorCapaPadre() {
    const select = document.getElementById('selectorCapaPadre')
    for (const borrar of select.querySelectorAll('option')) {
        borrar.remove();
    }

    for (const capa of absoluteArt.lienzo.capasGrupoVivas) {
        if (capaActual !== capa) {
            let capaHijo = true;
            if (capaActual.tipoCapa === 'grupo') {
                if (capaActual.buscarGrupoCapas(capa.id) !== undefined) {
                    capaHijo = false;
                }
            }
            if (capaHijo) {
                if (capaActual.capaPadre === capa) {
                    select.insertAdjacentHTML('afterbegin', `
                    <option value="${capa.id} ">
                        ${capa.nombre}
                    </option>
                `);
                } else {
                    select.insertAdjacentHTML('afterbegin', `
                        <option value="${capa.id}"  ">
                            ${capa.nombre}
                        </option>
                    `);
                }
            }

        }
    }

    const capaDios = absoluteArt.lienzo.capas;
    if (capaActual !== capaDios) {
        if (capaActual.capaPadre === capaDios) {
            select.insertAdjacentHTML('afterbegin', `
                <option value="${capaDios.id} ">
                    ${capaDios.nombre}
                </option>
            `);
        } else {
            select.insertAdjacentHTML('afterbegin', `
                <option value="${capaDios.id}" ">
                    ${capaDios.nombre}
                </option>
                `);
        }


    }

}

function cambiarCapaGrupo() {
    const nuevaCapaPadre = absoluteArt.lienzo.capas.buscarGrupoCapas(Number(document.getElementById('selectorCapaPadre').value));
    absoluteArt.lienzo.capas.moverCapaDeGrupo(capaActual, nuevaCapaPadre)
    agregarContenidoGrupo(absoluteArt.lienzo.capas)
    seleccionarCapa(capaActual.id, capaActual.tipoCapa)
}
let parametros = obtenerParametros();
let clickeando = false;

canvas.addEventListener('mousedown', (e) => {

    clickeando = true;
    recorrido = []; // adaptarCordCanvas(cordX,cordY,canvas)
    recorrido.push(absoluteArt.utiles.adaptarCordCanvas(e.clientX, e.clientY, ctx))
    parametros = obtenerParametros();

    absoluteArt.utiles.pintarTrazo(parametros, ctx)


});

canvas.addEventListener('mousemove', (e) => {
    if (clickeando) {
        parametros = obtenerParametros();
        recorrido.push(absoluteArt.utiles.adaptarCordCanvas(e.clientX, e.clientY, ctx))

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        absoluteArt.lienzo.capas.renderizarHasta(ctx, absoluteArt.lienzo.capaActiva.id)

        absoluteArt.utiles.pintarTrazo(parametros, ctx)

        absoluteArt.lienzo.capas.renderizarDesde(ctx, absoluteArt.lienzo.capaActiva.id)
    }
});

canvas.addEventListener('mouseup', (e) => {
    clickeando = false;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    recorrido.push(absoluteArt.utiles.adaptarCordCanvas(e.clientX, e.clientY, ctx))
    parametros = obtenerParametros();

    absoluteArt.lienzo.capaActiva.guardarTrazo(parametros);
    absoluteArt.lienzo.capas.renderizar(ctx);

    sincronizarCapaCanvasReal(capaActual);
});


