function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);

    return { r, g, b }
}
const canvasDom = document.getElementById("canvasPrincipal");
canvasDom.width = lienzoPrincipal.confCapas.anchoCanvas
canvasDom.height = lienzoPrincipal.confCapas.altoCanvas
const canvas = new lienzoHtml(canvasDom.width, canvasDom.height, canvasDom)




const canvasInfo = canvasDom.getBoundingClientRect();


configuracion.configuracionesBase(canvasDom);

function revertirTrazo() {
    if (lienzoPrincipal.capaActiva.historial.historialTrazos.length > 0) {
        canvas.limpiar()
        lienzoPrincipal.capaActiva.historial.revertirTrazo()
        lienzoPrincipal.capas.renderizar(canvas)
    }
}

function recuperarTrazo() {
    if (lienzoPrincipal.capaActiva.historial.trazosRevertidos.length > 0) {
        canvas.limpiar()
        lienzoPrincipal.capaActiva.historial.recuperarTrazo()
        lienzoPrincipal.capas.renderizar(canvas)
    }
}

let capaActual = lienzoPrincipal.capas
const listaCapas = document.getElementById('listaCapas');

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
        capaActual = lienzoPrincipal.capas.buscarGrupoCapas(idGrupoActivo);
    } else {
        capaActual = lienzoPrincipal.capas.buscarCapa(idCapaActiva);
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
        capaActual = lienzoPrincipal.capas.buscarCapa(id);
        lienzoPrincipal.capaActiva = capaActual;

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
        capaActual = lienzoPrincipal.capas.buscarGrupoCapas(id);
        lienzoPrincipal.grupoCapasActiva = capaActual;
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
        lienzoPrincipal.agregarGrupoCapas(idGrupoActivo);
        const capa = lienzoPrincipal.grupoCapasActiva
        idGrupoActivo = capa.id

        agregarCapaGrupo(ubic, capa);
        seleccionarCapa(idGrupoActivo, 'grupo')

    } else if (tipo === 'individual') {

        lienzoPrincipal.agregarCapa(idGrupoActivo);
        const capa = lienzoPrincipal.capaActiva
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
                            <canvas id="canvasgrupocapa${capa.id}" height="${Number(capa.lienzo.alto)}" width="${Number(capa.lienzo.largo)}" "></canvas>
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
                            <canvas id="canvasindividualcapa${capa.id}" height="${Number(capa.lienzo.alto)}" width="${Number(capa.lienzo.largo)}" ></canvas>
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
            lienzoPrincipal.eliminarGrupoCapas(capaActual.id);
            document.getElementById('representacionGrupo' + capaActual.id).remove()
        } else {
            lienzoPrincipal.eliminarCapa(capaActual.id);
            document.getElementById('representacionCapa' + capaActual.id).remove()
        }
        capaActual = lienzoPrincipal.capas
        seleccionarCapa(capaActual.id, capaActual.tipoCapa)
        canvas.limpiar()
        lienzoPrincipal.capas.renderizar(canvas);
        sincronizarCapaCanvasReal(capaActual);
    }

}

function sincronizarCapaCanvasReal(capa) {
    /*
    const ctxActual = document.getElementById('canvas' + capa.tipoCapa + 'capa' + capa.id).getContext('2d');
    ctxActual.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    capa.renderizar(ctxActual)
    if (capa.capaPadre !== undefined) {
        sincronizarCapaCanvasReal(capa.capaPadre)
    }
        */
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
        lienzoPrincipal.clonarCapa(capaActual.capaPadre, capaActual)
    }
    agregarContenidoGrupo(lienzoPrincipal.capas)
    seleccionarCapa(capaActual.id, capaActual.tipoCapa)
}

function actualizarSelectorCapaPadre() {
    const select = document.getElementById('selectorCapaPadre')
    for (const borrar of select.querySelectorAll('option')) {
        borrar.remove();
    }

    for (const capa of lienzoPrincipal.capasGrupoVivas) {
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

    const capaDios = absoluteArt.lienzoPrincipal.capas;
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
    const nuevaCapaPadre = lienzoPrincipal.capas.buscarGrupoCapas(Number(document.getElementById('selectorCapaPadre').value));
    lienzoPrincipal.capas.moverCapaDeGrupo(capaActual, nuevaCapaPadre)
    agregarContenidoGrupo(lienzoPrincipal.capas)
    seleccionarCapa(capaActual.id, capaActual.tipoCapa)
}

function listarHerramientas() {
    for (const herramienta of pintor.listaHerramientas) {
        document.getElementById("herramientas").insertAdjacentHTML('beforeend', `<option value="${herramienta.nombre}" >${herramienta.nombre}</option>`);
    }
}
listarHerramientas();

let colorPrincipal = { r: 0, g: 0, b: 0, }
let colorSecundario = { r: 0, g: 0, b: 0, }
let opacidadPrincipal = 1;
let opacidadSecundaria = 1;
let grosor = 10;
let nombreHerramienta = 'lineaSimple';

function obtenerColores() {
    const rgba = [{
        r: hexToRgb(document.getElementById('colorPrincipal').value).r,
        g: hexToRgb(document.getElementById('colorPrincipal').value).g,
        b: hexToRgb(document.getElementById('colorPrincipal').value).b,
        a: document.getElementById('opacidadPrincipal').value
    }, {
        r: hexToRgb(document.getElementById('colorSecundario').value).r,
        g: hexToRgb(document.getElementById('colorSecundario').value).g,
        b: hexToRgb(document.getElementById('colorSecundario').value).b,
        a: document.getElementById('opacidadSecundaria').value
    }];
    return rgba;
}

function obtenerTrazoActual(cordInicial) {
    const trazoGuardar = new trazo({
        trayectos: [],
        puntoInicial: cordInicial,
        rgba: obtenerColores(),
        grosor: grosor,
        herramienta: nombreHerramienta,
        relacionAnchoAlto: undefined
    })
    return trazoGuardar;
}

let clickeando = false;
canvasDom.addEventListener('mousedown', (e) => {
    clickeando = true;

    const cordenadaActual = utiles.adaptarCordCanvas(e.clientX, e.clientY, canvasDom)
    lienzoPrincipal.inicioClick({ cordenada: cordenadaActual, lienzoReal: canvas, parametrosTrazo: obtenerTrazoActual(cordenadaActual) })
});

canvasDom.addEventListener('mousemove', (e) => {
    if (!clickeando) return

    const cordenadaActual = utiles.adaptarCordCanvas(e.clientX, e.clientY, canvasDom)
    lienzoPrincipal.arrastreClick({ cordenada: cordenadaActual, lienzoReal: canvas })
});

canvasDom.addEventListener('mouseup', (e) => {
    clickeando = false;
    const cordenadaActual = utiles.adaptarCordCanvas(e.clientX, e.clientY, canvasDom)

    lienzoPrincipal.finClick({ cordenada: cordenadaActual, lienzoReal: canvas })
    sincronizarCapaCanvasReal(capaActual);
});
