const absoluteArt = {} // heramientas

class historial {
    constructor(frecuenciaCapturas, trayectoMuyLargo, limiteCapturasHistorial, ctx) {
        this.frecuenciaTrazos = frecuenciaCapturas;// de base son 10
        this.trayectoMuyLargo = trayectoMuyLargo; // de base son 1k
        this.limiteCapturasHistorial = limiteCapturasHistorial; // de base son 10
        this.ctx = ctx;
    }
    trazosRevertidos = [];
    historialTrazos = [];
    historialCapturas = []; // {captura:, indice:}

    revertirTrazo() {
        if (this.historialTrazos.length > 0) {
            absoluteArt.herramientasCanvas.vaciar(this.ctx);
            this.trazosRevertidos.push(this.historialTrazos[this.historialTrazos.length - 1])
            if (this.historialCapturas.length > 0) {
                if (this.historialCapturas[this.historialCapturas.length - 1].indice === this.historialTrazos.length - 1) {
                    this.historialCapturas.pop();
                }
            }
            this.historialTrazos.pop()
            this.pintarHistorial();
        }
    }
    recuperarTrazo() {
        if (this.trazosRevertidos.length > 0) {
            this.historialTrazos.push(this.trazosRevertidos[this.trazosRevertidos.length - 1])
            this.trazosRevertidos.pop();
            const ultTrazo = this.historialTrazos[this.historialTrazos.length - 1];
            absoluteArt[ultTrazo.contexto.tipoHerramienta]?.[ultTrazo.contexto.categoriaHerramienta]?.[ultTrazo.contexto.herramienta](ultTrazo, this.ctx)
                ?? absoluteArt[ultTrazo.contexto.tipoHerramienta]?.[ultTrazo.contexto.herramienta]?.(ultTrazo, this.ctx);
        }
    }
    guardarHistorial(conf) {
        this.guardarTrazo(conf);
        if (this.debeGuardarCaptura(conf)) {
            absoluteArt[conf.contexto.tipoHerramienta]?.[conf.contexto.categoriaHerramienta]?.[conf.contexto.herramienta](conf, this.ctx)
                ?? absoluteArt[conf.contexto.tipoHerramienta]?.[conf.contexto.herramienta]?.(conf, this.ctx);
            this.guardarCaptura(conf);
        } else {
            absoluteArt[conf.contexto.tipoHerramienta]?.[conf.contexto.categoriaHerramienta]?.[conf.contexto.herramienta](conf, this.ctx)
                ?? absoluteArt[conf.contexto.tipoHerramienta]?.[conf.contexto.herramienta]?.(conf, this.ctx);
        }
    }
    guardarTrazo(trazo) {
        this.trazosRevertidos = [];
        if (trazo.contexto.categoriaHerramienta === "pinceles") {
            this.historialTrazos.push(absoluteArt.utiles.eliminarTrayectoInutil(trazo))
        } else {
            this.historialTrazos.push(absoluteArt.utiles.borrarRecorridoIntermedio(trazo))
        }
    }
    trazosDesdeUltimaCaptura() { //
        let cantidadTrazos = this.historialTrazos.length;
        if (this.historialCapturas.length > 0) {
            cantidadTrazos = ((this.historialTrazos.length - 1) - (this.historialCapturas[this.historialCapturas.length - 1].indice) + 1);
        }
        return cantidadTrazos;
    }
    guardarCaptura(conf) {
        if (this.historialCapturas.length - 1 >= this.limiteCapturasHistorial) {
            this.historialCapturas.splice(0, 1)
        }
        const canvasTrucho = document.createElement("canvas")
        canvasTrucho.width = this.ctx.canvas.width
        canvasTrucho.height = this.ctx.canvas.height
        const ctxTrucho = canvasTrucho.getContext('2d')
        ctxTrucho.drawImage(canvas, 0, 0)
        this.historialCapturas.push({ captura: canvasTrucho, indice: this.historialTrazos.length - 1 })
    }
    debeGuardarCaptura(conf) {
        let guardarEstado = false;
        if (this.trazosDesdeUltimaCaptura() >= this.frecuenciaTrazos ||
            conf.contexto.recorrido.length >= this.trayectoMuyLargo && conf.contexto.categoriaHerramienta === "pinceles" ||
            this.historialCapturas.length == 0 && this.historialTrazos.length >= this.frecuenciaTrazos) {
            guardarEstado = true;
        }
        return guardarEstado;
    }
    pintarHistorial() {
        if (this.historialTrazos.length > 0) {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
            this.cargarUltimaCaptura();


            const cantTrazos = this.trazosDesdeUltimaCaptura();
            const trazos = this.historialCapturas;
            for (let i = 0; i < cantTrazos; i++) {
                const indiceTrazo = trazos.length - cantTrazos + i;
                const trazoActual = trazos[indiceTrazo];
                absoluteArt[trazoActual.contexto.tipoHerramienta]?.[trazoActual.contexto.categoriaHerramienta]?.[trazoActual.contexto.herramienta](trazoActual, this.ctx)
                    ?? absoluteArt[trazoActual.contexto.tipoHerramienta]?.[trazoActual.contexto.herramienta]?.(trazoActual, this.ctx);
            }
            //absoluteArt.herramientasCanvas.pintarTrazos(this.trazosDesdeUltimaCaptura(), this.historialTrazos, this.ctx)
        }
    }
    cargarUltimaCaptura() { // sin razon de cambio
        if (this.historialCapturas.length > 0) {
            const captura = this.historialCapturas[this.historialCapturas.length - 1].captura;
            this.ctx.drawImage(captura, 0, 0)
        }
    }
}
class capaBase {
    constructor(capaPadre, idCapa, anchoCanvas, altoCanvas) {
        this.canvas = document.createElement('canvas')
        this.canvas.height = altoCanvas;
        this.canvas.width = anchoCanvas;
        this.ctx = this.canvas.getContext('2d');
        this.id = idCapa
        this.capaPadre = capaPadre;
    }
    x = 0;
    y = 0;
    visible = true;
    editable = true;
    opacidad = 1;

    renderizar() {

    }
}
class grupoCapas extends capaBase {
    constructor(capaPadre, idCapa, anchoCanvas, altoCanvas) {
        super(capaPadre, idCapa, anchoCanvas, altoCanvas)
        this.nombre = 'grupo ' + idCapa
    }
    tipoCapa = 'grupo';

    contenido = [];

    renderizar(ctx) {
        for (const capa of this.contenido) {
            capa.renderizar(ctx);
        }
    }

    renderizarHasta(ctx, idCapaLimite) {
        for (const capa of this.contenido) {
            capa.renderizar(ctx);
            if (capa.id === idCapaLimite) {
                return;
            }
        }
    }

    renderizarDesde(ctx, idCapaLimite) {
        let capaEncontrada = false;
        for (const capa of this.contenido) {
            if (capaEncontrada) {
                capa.renderizar(ctx);

            }
            if (capa.id === idCapaLimite) {
                capaEncontrada = true;
            }
        }
    }

    buscarCapa(id) {
        if (this.contenido.length > 0) {
            for (const lugar of this.contenido) {
                if (lugar.tipoCapa === 'individual' && lugar.id === id) {
                    return lugar;
                }
                if (lugar.contenido) {
                    const encontrado = lugar.buscarCapa(id);
                    if (encontrado !== undefined) return encontrado;
                }
            }
        }
    }

    buscarGrupoCapas(id) {
        if (id === 0) {
            return absoluteArt.lienzo.capas; // capa " dios " digamos
        }
        if (this.contenido.length > 0) {
            for (const lugar of this.contenido) {
                if (lugar.tipoCapa === 'grupo' && lugar.id === id) {
                    return lugar;
                }
                if (lugar.contenido) {
                    const encontrado = lugar.buscarGrupoCapas(id, lugar);
                    if (encontrado) return encontrado;
                }
            }
        }
    }

    agregarCapa(confCapas) {
        const nuevaCapa = new capa(
            confCapas.capaPadre,
            confCapas.idCapa,
            confCapas.anchoCanvas,
            confCapas.altoCanvas,
            confCapas.frecuenciaCapturas,
            confCapas.trayectoMuyLargo,
            confCapas.limiteCapturasHistorial);
        this.contenido.push(nuevaCapa);
        return nuevaCapa;
    }

    agregarGrupoCapas(confCapas) {
        const nueveGrupo = new grupoCapas(
            confCapas.capaPadre,
            confCapas.idCarpeta,
            confCapas.anchoCanvas,
            confCapas.altoCanvas);

        this.contenido.push(nueveGrupo);

        return nueveGrupo;
    }

    eliminarCapa(id) {
        let cont = 0;
        while (cont < this.contenido.length) {
            if (this.contenido[cont].id === id && this.contenido[cont].tipoCapa === "individual") {
                this.contenido.splice(cont, 1)
                return true;
            }
            cont++;
        }
        return false;
    }

    eliminarGrupoCapas(id) {
        let cont = 0;
        while (cont < this.contenido.length) {
            if (this.contenido[cont].id === id && this.contenido[cont].tipoCapa === "grupo") {
                this.contenido.splice(cont, 1)
                return true;
            }
            cont++;
        }
        return false;
    }
}
class capa extends capaBase {
    constructor(capaPadre, idCapa, anchoCanvas, altoCanvas, frecuenciaCapturas, trayectoMuyLargo, limiteCapturasHistorial) {
        super(capaPadre, idCapa, anchoCanvas, altoCanvas)
        this.historial = new historial(
            frecuenciaCapturas,
            trayectoMuyLargo,
            limiteCapturasHistorial,
            this.ctx);
        this.nombre = 'capa ' + idCapa
    }
    tipoCapa = 'individual';

    renderizar(ctx) {
        ctx.drawImage(this.canvas, 0, 0)
    }
}

absoluteArt.lienzo = {
    confCapas: {
        frecuenciaCapturas: 10,
        trayectoMuyLargo: 1000,
        limiteCapturasHistorial: 10,
        altoCanvas: 720,
        anchoCanvas: 1280
    }, //no de capa
    conteoCapas: 0, // control de Id de capas
    conteoGrupoCapas: 0, // control de Id de capas
    capas: [],
    capasIndividualesVivas: [],
    capasGrupoVivas: [],
    capaActiva: undefined,
    grupoCapasActiva: undefined,

    agregarCapa(idCarpeta) {
        const capaPadre = this.capas.buscarGrupoCapas(idCarpeta);
        if (capaPadre) {
            this.conteoCapas++;

            const confCapa = this.confCapas;
            confCapa.capaPadre = capaPadre;
            confCapa.idCapa = this.conteoCapas;

            this.capaActiva = capaPadre.agregarCapa(confCapa);
            this.capasIndividualesVivas.push(this.capaActiva);
        }
    },

    agregarGrupoCapas(idCarpeta) {
        const capaPadre = this.capas.buscarGrupoCapas(idCarpeta);
        if (capaPadre) {
            this.conteoGrupoCapas++;

            const confCapa = this.confCapas;
            confCapa.capaPadre = capaPadre;
            confCapa.idCarpeta = this.conteoGrupoCapas;

            this.grupoCapasActiva = capaPadre.agregarGrupoCapas(confCapa);
            this.capasGrupoVivas.push(this.grupoCapasActiva);
        }
    },

    eliminarCapa(id) { // eliminarCapa(id) 
        const capaPadre = this.capas.buscarCapa(id)?.capaPadre;
        if (this.capasIndividualesVivas.length > 1 && capaPadre !== undefined) {
            if (capaPadre.eliminarCapa(id)) {

                let i = 0;
                let capaVivaEliminada = false;
                while (i < this.capasIndividualesVivas.length && !capaVivaEliminada) {
                    if (this.capasIndividualesVivas[i].id === id) {
                        this.capasIndividualesVivas.splice(i, 1);
                        capaVivaEliminada = true;
                    }
                    i++;
                }
                this.capaActiva = this.capasIndividualesVivas[0]
            }
        }
    },

    eliminarGrupoCapas(id) {
        const capaPadre = this.capas.buscarGrupoCapas(id)?.capaPadre;
        if (this.capasGrupoVivas.length > 0 && capaPadre !== undefined && id !== 0) {
            if (capaPadre.eliminarGrupoCapas(id)) {

                let i = 0;
                let capaVivaEliminada = false;
                while (i < this.capasGrupoVivas.length && !capaVivaEliminada) {
                    if (this.capasGrupoVivas[i].id === id) {
                        this.capasGrupoVivas.splice(i, 1);
                        capaVivaEliminada = true;
                    }
                    i++;
                }
                this.grupoCapasActiva = this.capasGrupoVivas[0]
            }
        }
    },
}
absoluteArt.herramientasCanvas = {
    vaciar(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }

}
absoluteArt.utiles = {
    datosCuadrilatero(trayecto) {
        let x = 0;
        let y = 0;
        let esquina = [{ x, y }, { x, y }, { x, y }, { x, y }]
        const priCord = trayecto[0];
        const ultCord = trayecto[trayecto.length - 1];
        if (priCord.x >= ultCord.x) {
            esquina[0].x = priCord.x
            esquina[1].x = ultCord.x
            esquina[2].x = ultCord.x
            esquina[3].x = priCord.x
        } else {
            esquina[0].x = ultCord.x
            esquina[1].x = priCord.x
            esquina[2].x = priCord.x
            esquina[3].x = ultCord.x
        }
        if (priCord.y >= ultCord.y) {
            esquina[0].y = ultCord.y
            esquina[1].y = ultCord.y
            esquina[2].y = priCord.y
            esquina[3].y = priCord.y
        } else {
            esquina[0].y = priCord.y
            esquina[1].y = priCord.y
            esquina[2].y = ultCord.y
            esquina[3].y = ultCord.y
        }
        return esquina;
    },
    borrarRecorridoIntermedio(conf) { // elimina todo el trayecto basura para cuando se usa un elemento que no requiere mas que los puntos inicial y final
        let modificado = conf;
        modificado.contexto.recorrido = [conf.contexto.recorrido[0], conf.contexto.recorrido[conf.contexto.recorrido.length - 1]]
        return modificado;
    },
    eliminarTrayectoInutil(trazo) { // para cuando se usan pinceles y se general lineas de recorrido , para acortar el recorrido[] , agregar trazos diagonales
        // no funca no usar AUN
        let trayectoOptimizado = trazo;
        let trayecto = trazo.contexto.recorrido;
        // limpieza de puntos repetidos primero
        for (let i = trayecto.length - 1; i > 0; i--) {
            if (trayecto[i].x === trayecto[i - 1].x &&
                trayecto[i].y === trayecto[i - 1].y) {
                trayecto.splice(i, 1)
            }
        }

        trayectoOptimizado.contexto.recorrido = recorrido;
        return trayectoOptimizado;
    },
    medidaPixelesCanvas(canvas) {// dice cuantos pixeles reales mide uno de canvas  // recibe el canvas ya en  contexto osea el ctx como dice gemini
        const canvasInfo = canvas.canvas.getBoundingClientRect();
        const medidasCanvas = { real: { w: canvas.canvas.width, h: canvas.canvas.height }, css: { w: canvasInfo.width, h: canvasInfo.height } }


        return { ancho: (canvasInfo.width / canvas.canvas.width), alto: (canvasInfo.height / canvas.canvas.height) };
    },
    adaptarCordCanvas(cordX, cordY, canvas) {//usar para convertir la cordenada obtenida para que sea la cordenada real tocada del canvas
        const tamanio = this.medidaPixelesCanvas(canvas);
        const ubicacionClick = this.obtUbicClickElem(cordX, cordY, canvas.canvas);
        return { x: ((ubicacionClick.x / tamanio.ancho) | 0) + 0.5, y: ((ubicacionClick.y / tamanio.alto) | 0) + 0.5 };
    },
    obtUbicClickElem(cordX, cordY, elemento) {
        const infoObjeto = { x: elemento.getBoundingClientRect().x, y: elemento.getBoundingClientRect().y };
        return { x: cordX - infoObjeto.x, y: cordY - infoObjeto.y };
    },
}
absoluteArt.dibujo = { // seccion de figuras pinceles y cualquier cosa que sea dibujo direto del canvas
    figuras: {
        lineaRedondeada(conf, ctx) { // acomodar posicion de los circulos , recortar medio grosor la linea en cada lado y evitar solapamiento de alpha
            if (conf.contexto.recorrido[0].x !== conf.contexto.recorrido[conf.contexto.recorrido.length - 1].x ||
                conf.contexto.recorrido[0].y !== conf.contexto.recorrido[conf.contexto.recorrido.length - 1].y) {

                const cordInicial = conf.contexto.recorrido[0];
                const cordFinal = conf.contexto.recorrido[conf.contexto.recorrido.length - 1];
                const colPrin = conf.colorPrincipal

                ctx.beginPath();

                ctx.lineWidth = conf.grosorLinea;
                ctx.strokeStyle = 'rgba(' + colPrin.r + ',' + colPrin.g + ',' + colPrin.b + ',' + conf.opacidadPrincipal + ')';
                ctx.fillStyle = 'rgba(' + colPrin.r + ',' + colPrin.g + ',' + colPrin.b + ',' + conf.opacidadPrincipal + ')';

                ctx.arc(cordInicial.x, cordInicial.y, conf.grosorLinea / 2, 0, Math.PI * 2);
                ctx.moveTo(cordInicial.x, cordInicial.y);
                ctx.lineTo(cordInicial.x, cordInicial.y);
                ctx.lineTo(cordFinal.x, cordFinal.y);
                ctx.moveTo(cordFinal.x, cordFinal.y);
                ctx.arc(cordFinal.x, cordFinal.y, conf.grosorLinea / 2, 0, Math.PI * 2);

                ctx.fill()
            }
        },

        lineaBrusca(conf, ctx) {
            if (conf.contexto.recorrido[0].x !== conf.contexto.recorrido[conf.contexto.recorrido.length - 1].x ||
                conf.contexto.recorrido[0].y !== conf.contexto.recorrido[conf.contexto.recorrido.length - 1].y
            ) {
                const cordInicial = conf.contexto.recorrido[0];
                const cordFinal = conf.contexto.recorrido[conf.contexto.recorrido.length - 1];
                const colPrin = conf.colorPrincipal

                ctx.beginPath();

                ctx.lineWidth = conf.grosorLinea;
                ctx.strokeStyle = 'rgba(' + colPrin.r + ',' + colPrin.g + ',' + colPrin.b + ',' + conf.opacidadPrincipal + ')';

                ctx.moveTo(cordInicial.x, cordInicial.y)
                ctx.lineTo(cordFinal.x, cordFinal.y)

                ctx.stroke();

            }
        },

        rectangulo(conf, ctx) {
            if (conf.contexto.recorrido[0].x !== conf.contexto.recorrido[conf.contexto.recorrido.length - 1].x &&
                conf.contexto.recorrido[0].y !== conf.contexto.recorrido[conf.contexto.recorrido.length - 1].y) {
                const cordInicial = conf.contexto.recorrido[0];
                const cordFinal = conf.contexto.recorrido[conf.contexto.recorrido.length - 1];
                const colPrin = conf.colorPrincipal;
                const colSec = conf.colorSecundario;
                const grosor = Number(conf.grosorLinea);
                const esquinas = absoluteArt.utiles.datosCuadrilatero(conf.contexto.recorrido);

                let desviacionX = grosor / 2;
                let desviacionY = desviacionX;
                let signoX = 1;
                let signoY = 1;

                if (cordInicial.x <= cordFinal.x) { signoX = -1; }

                if (cordInicial.y <= cordFinal.y) { signoY = -1; }
                desviacionX = desviacionX * signoX;
                desviacionY = desviacionY * signoY;

                ctx.lineWidth = conf.grosorLinea;
                ctx.strokeStyle = 'rgba(' + colPrin.r + ',' + colPrin.g + ',' + colPrin.b + ',' + conf.opacidadPrincipal + ')';
                ctx.fillStyle = 'rgba(' + colSec.r + ',' + colSec.g + ',' + colSec.b + ',' + conf.opacidadSecundaria + ')';


                ctx.beginPath();
                if (esquinas[0].x - esquinas[2].x > grosor * 2 && esquinas[2].y - esquinas[0].y > grosor * 2) {

                    ctx.moveTo(cordInicial.x, cordInicial.y - desviacionY)
                    ctx.lineTo(cordFinal.x + desviacionX, cordInicial.y - desviacionY)
                    ctx.lineTo(cordFinal.x + desviacionX, cordFinal.y + desviacionY)
                    ctx.lineTo(cordInicial.x - desviacionX, cordFinal.y + desviacionY)
                    ctx.lineTo(cordInicial.x - desviacionX, cordInicial.y)
                } else {
                    ctx.fillStyle = ctx.strokeStyle;
                    ctx.fillRect(esquinas[0].x | 0,
                        esquinas[0].y | 0,
                        (esquinas[2].x - esquinas[0].x) | 0,
                        (esquinas[2].y - esquinas[0].y) | 0);
                }

                ctx.stroke() // Desde aca es linea rectangular pa haya es el relleno


                /*
                ctx.strokeRect(esquinas[0].x - desviacionX,
                               esquinas[0].y - desviacionY,
                               esquinas[2].x  - esquinas[0].x,
                               esquinas[2].y - esquinas[0].y)
                */

                if (esquinas[0].x - esquinas[2].x > grosor * 2 &&
                    esquinas[2].y - esquinas[0].y > grosor * 2) {

                    ctx.fillRect((esquinas[0].x - grosor),
                        (esquinas[0].y + grosor),
                        ((esquinas[1].x - esquinas[0].x) + grosor * 2) | 0,
                        ((esquinas[2].y - esquinas[1].y) - grosor * 2) | 0)
                }

            }
        }
    },
    pinceles: {
        // agregar array de pinceles optimizables
        clasico(conf, ctx) {
            ctx.fillStyle = `rgba(${conf.colorPrincipal.r}, ${conf.colorPrincipal.g}, ${conf.colorPrincipal.b}, ${conf.opacidadPrincipal})`;
            ctx.beginPath();
            for (const cord of conf.contexto.recorrido) {
                ctx.moveTo(cord.x + conf.grosorLinea / 2, cord.y);
                ctx.arc(cord.x, cord.y, conf.grosorLinea / 2, 0, Math.PI * 2);
            }
            ctx.fill();
        },

        continuo(conf, ctx) {
            console.log(" programa el pincel continuo gil")
        }
    },

    herramientas: {
        borrador(conf, ctx) {
        }
    }
}
absoluteArt.configuracion = {
    configurarEsteticaCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // 2. ¡MUY IMPORTANTE! Para navegadores viejos o Firefox/Safari, 
        // a veces hay que usar los prefijos viejos para asegurarse de que se apague:
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        canvas.style.imageRendering = 'pixelated';
        canvas.style.imageRendering = 'crisp-edges'; // me lo tiro gemini , para el navegador de mierda pq lo difumina
    },
    agregarCapaBase() {
        absoluteArt.lienzo.capas = new grupoCapas(undefined, absoluteArt.lienzo.conteoGrupoCapas, absoluteArt.lienzo.confCapas.anchoCanvas, absoluteArt.lienzo.confCapas.altoCanvas);
        absoluteArt.lienzo.grupoCapasActiva = absoluteArt.lienzo.capas;
        absoluteArt.lienzo.capaActiva = new capa(absoluteArt.lienzo.capas,
            absoluteArt.lienzo.conteoCapas,
            absoluteArt.lienzo.confCapas.anchoCanvas,
            absoluteArt.lienzo.confCapas.altoCanvas,
            absoluteArt.lienzo.confCapas.frecuenciaCapturas,
            absoluteArt.lienzo.confCapas.trayectoMuyLargo,
            absoluteArt.lienzo.confCapas.limiteCapturasHistorial,)
        absoluteArt.lienzo.capas.contenido.push(absoluteArt.lienzo.capaActiva)
        absoluteArt.lienzo.capasIndividualesVivas.push(absoluteArt.lienzo.capaActiva)
    }
}