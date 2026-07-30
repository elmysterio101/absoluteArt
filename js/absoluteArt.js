class lienzoBase {
    constructor(largo, alto) {
        this.largo = largo;
        this.alto = alto;
        this.canvas = undefined
    }

    pegarLienzo(lienzo, x, y) { // pegar en ESTE lienzo
        console.log("funcion pegarLienzo no hecha")
    }

    redimenzionar(u, r, d, l) { // como en el cubo rubik 3x3 ,Up Right Down Left, en sentido horario, es aumento o decenso para que no crezca o se achique siempre perdiendo contenido del mismo lado
        console.log("funcion redimenzionar no hecha")
    }

    pintarPixel(x, y, rgba) {
        console.log("funcion pintarPixel no hecha")
    }

    limpiarPixel(x, y) {
        console.log("funcion limpiarPixel no hecha")
    }

    pintarLinea(x1, y1, x2, y2, grosor, rgba) {
        console.log("funcion pintarLinea no hecha")
    }

    limpiarRectangulo(x, y, largo, ancho, rgba) {
        console.log("funcion limpiarRectangulo no hecha")
    }

    pintarRectangulo(x, y, largo, ancho, rgba) {
        console.log("funcion pintarRectangulo no hecha")
    }

}
class lienzoHtml extends lienzoBase {
    constructor(largo, alto, canvas) {
        super(largo, alto)
        if (canvas) {
            this.canvas = canvas;
        } else {
            this.canvas = document.createElement('canvas')
        }
        this.ctx = this.canvas.getContext('2d')
        this.canvas.width = this.largo
        this.canvas.height = this.alto
    }

    pegarLienzo({ lienzo, x, y }) { // pegar en ESTE lienzo
        this.ctx.drawImage(lienzo.canvas, x, y)
    }
    redimenzionar({ u, r, d, l }) {
        const canvasProvisional = document.createElement('canvas')
        canvasProvisional.width = this.largo;
        canvasProvisional.height = this.alto;
        canvasProvisional.getContext('2d').drawImage(this.canvas, 0, 0);
        this.canvas.width = this.largo + r + l
        this.canvas.height = this.alto + u + d
        this.ctx.drawImage(canvasProvisional, l, u)
    }
    pintarPixel({ x, y, r, g, b, a }) {
        console.log({ x, y, r, g, b, a })
        this.ctx.fillStyle = 'rgba(' + r + ' , ' + g + ' , ' + b + ' , ' + a + ')';
        this.ctx.fillRect(x, y, 1, 1)
    }
    limpiarPixel({ x, y }) {
        this.ctx.clearRect(x, y, 1, 1)
    }
    pintarLinea({ x1, y1, x2, y2, grosor, r, g, b, a }) {
        this.ctx.lineWidth = grosor;
        this.ctx.strokeStyle = 'rgba(' + r + ' , ' + g + ' , ' + b + ' , ' + a + ')';
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke();
    }
    pintarTrayectoLineas({ trayecto, grosor, r, g, b, a }) {
        if (trayecto.length > 1) {
            this.ctx.lineWidth = grosor;
            this.ctx.strokeStyle = 'rgba(' + r + ' , ' + g + ' , ' + b + ' , ' + a + ')';
            this.ctx.beginPath();
            for (let i = 0; i < trayecto.length - 1; i++) {
                this.ctx.moveTo(trayecto[i].x, trayecto[i].y)
                this.ctx.lineTo(trayecto[i + 1].x, trayecto[i + 1].y)
            }
            this.ctx.stroke();
        }
    }
    limpiarRectangulo({ x, y, largo, alto }) {
        console.log("pq no se borrooooooo")
        this.ctx.clearRect(x, y, largo, alto);
    }
    pintarRectangulo({ x, y, largo, alto, r, g, b, a }) {
        this.ctx.fillStyle = 'rgba(' + r + ' , ' + g + ' , ' + b + ' , ' + a + ')';
        this.ctx.fillRect(x, y, largo, alto)
    }
    pintarContornoElipse({ x1, y1, x2, y2, grosor, r, g, b, a, rotacion, inicio, fin }) {
        this.ctx.lineWidth = grosor;
        this.ctx.strokeStyle = 'rgba(' + r + ' , ' + g + ' , ' + b + ' , ' + a + ')';
        let radioX = (x1 - x2) / 2
        let radioY = (y1 - y2) / 2
        let centroX = x1 + radioX;
        let centroY = y1 + radioY;
        if (x1 < x2) {
            radioX = radioX * -1
            centroX = x2 + radioX;
        }
        if (y1 < y2) {
            radioY = radioY * -1
            centroY = y2 + radioY;

        }
        this.ctx.beginPath();
        this.ctx.ellipse(
            centroX,
            centroY,
            radioX,
            radioY,
            rotacion,
            inicio,
            fin
        );
        this.ctx.stroke();
    }
    limpiar() {
        this.ctx.clearRect(0, 0, this.largo, this.alto)
    }
    redimenzionar(largo, alto) {
        this.canvas.width = largo;
        this.canvas.height = alto;
    }
    obtenerPixel({ x, y }) {
        const pixel = this.ctx.getImageData(x, y, 1, 1).data;

        return {
            r: pixel[0],
            g: pixel[1],
            b: pixel[2],
            a: pixel[3]
        };
    }
}
class capaBase {
    constructor(capaPadre, idCapa, anchoCanvas, altoCanvas) {
        this.lienzo = lienzo.obtener(anchoCanvas, altoCanvas)
        this.id = idCapa
        this.capaPadre = capaPadre;
    }
    x = 0;
    y = 0;
    visible = true;
    opacidad = 1;
    renderizar() {
    }
}
class grupoCapas extends capaBase { // ctx cambiado
    constructor(capaPadre, idCapa, anchoCanvas, altoCanvas) {
        super(capaPadre, idCapa, anchoCanvas, altoCanvas)
        this.nombre = 'grupo ' + idCapa
    }
    tipoCapa = 'grupo';
    contenido = [];
    renderizar(lienzo) {
        if (this.visible) {
            if (this.contenido.length > 0) {
                for (const capa of this.contenido) {
                    capa.renderizar(lienzo);
                }
            }
        }
    }
    renderizarHasta(lienzo, idCapaLimite) {
        for (const capa of this.contenido) {
            capa.renderizar(lienzo);
            if (capa.id === idCapaLimite) {
                return;
            }
        }
    }
    renderizarDesde(lienzo, idCapaLimite) {
        let capaEncontrada = false;
        for (const capa of this.contenido) {
            if (capaEncontrada) {
                capa.renderizar(lienzo);

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
    buscarGrupoCapas(id) { // arreglar lo de la ubicacion absolute de lienzoPrincipal , no deberian manejar absolutez en ningun contexto sin importar que 
        if (id === 0) {
            return absoluteArt.lienzoPrincipal.capas; // capa " dios " digamos
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
    moverCapaIndice(capa, nuevoIndice) {
        let i = 0;
        let movida = false;
        while (i < this.contenido.length && !movida) {
            if (this.contenido[i] === capa) {
                this.contenido.splice(i, 1)
                this.contenido.splice(nuevoIndice, 0, capa)
                movida = true;
            }
            i++;
        }
    }
    moverCapaDeGrupo(capa, nuevoGrupo) {
        if (capa?.capaPadre !== nuevoGrupo && capa !== undefined && nuevoGrupo !== undefined) {
            if (capa.tipoCapa == 'grupo') {
                capa.capaPadre.eliminarGrupoCapas(capa.id)
            } else {
                capa.capaPadre.eliminarCapa(capa.id)
            }
            capa.capaPadre = nuevoGrupo;
            nuevoGrupo.contenido.push(capa)
        }
    }
    obtenerIndiceCapa(capa) {
        if (capa) {
            for (let i = 0; i < this.contenido.length; i++) {
                if (this.contenido[i] === capa) {
                    return i;
                }
            }
        }
    }
    clonar(capaPadre, idCopia) {
        const clonCapa = new grupoCapas(
            capaPadre,
            idCopia,
            this.lienzo.largo,
            this.lienzo.alto,
        )

        clonCapa.lienzo.pegarLienzo({ lienzo: this.lienzo, y: 0, x: 0 })
        clonCapa.x = this.x
        clonCapa.y = this.y
        clonCapa.opacidad = this.opacidad
        clonCapa.visible = this.visible


        clonCapa.nombre = this.nombre + ' (copia)'
        return clonCapa;
    }
    clonarCapa(id, capa) {
        const clon = capa.clonar(this, id)
        this.contenido.push(clon)
        return clon
    }

}
class capa extends capaBase {
    constructor(capaPadre, idCapa, anchoCanvas, altoCanvas, frecuenciaCapturas, trayectoMuyLargo, limiteCapturasHistorial) {
        super(capaPadre, idCapa, anchoCanvas, altoCanvas)
        this.historial = new historial(
            frecuenciaCapturas,
            trayectoMuyLargo,
            limiteCapturasHistorial,
            this.lienzo
        );
        this.nombre = 'capa ' + idCapa
    }
    tipoCapa = 'individual';
    editable = true;
    guardarTrazo(trazo) {
        this.historial.guardarHistorial(trazo);
    }
    revertirTrazo() {
        this.historial.revertirTrazo();
    }
    recuperarTrazo() {
        this.historial.recuperarTrazo();
    }
    renderizar(lienzo) {
        if (this.visible) {
            lienzo.pegarLienzo({ lienzo: this.lienzo, x: this.x, y: this.y })
        }
    }
    clonar(capaPadre, idCopia) {
        const clonCapa = new capa(
            capaPadre,
            idCopia,
            this.lienzo.largo,
            this.lienzo.alto,
            this.historial.frecuenciaTrazos,
            this.historial.trayectoMuyLargo,
            this.historial.limiteCapturasHistorial
        )

        const copiaArrays = this.historial.clonarArrays();

        clonCapa.historial.trazosRevertidos = copiaArrays.trazosRevertidos
        clonCapa.historial.historialTrazos = copiaArrays.historialTrazos
        clonCapa.historial.historialCapturas = copiaArrays.historialCapturas
        clonCapa.historial.lienzo = clonCapa.lienzo

        clonCapa.lienzo.pegarLienzo({ lienzo: this.lienzo, x: 0, y: 0 })
        clonCapa.x = this.x
        clonCapa.y = this.y
        clonCapa.opacidad = this.opacidad
        clonCapa.visible = this.visible
        clonCapa.editable = this.editable

        clonCapa.nombre = this.nombre + ' (copia)'
        return clonCapa;
    }
}
class historial {
    constructor(frecuenciaCapturas, trayectoMuyLargo, limiteCapturasHistorial, lienzo) {
        this.frecuenciaTrazos = frecuenciaCapturas;// de base son 10
        this.trayectoMuyLargo = trayectoMuyLargo; // de base son 1k
        this.limiteCapturasHistorial = limiteCapturasHistorial; // de base son 10
        this.lienzo = lienzo;
    }
    trazosRevertidos = [];
    historialTrazos = [];
    historialCapturas = []; // {captura:, indice:}

    revertirTrazo() { // NO VEO RAZON PARA QUE NO FUNCIONE
        if (this.historialTrazos.length > 0) {
            this.lienzo.limpiar()
            this.trazosRevertidos.push(this.historialTrazos[this.historialTrazos.length - 1])
            if (this.historialCapturas.length > 0) {
                if (this.historialCapturas[this.historialCapturas.length - 1].indice > this.historialTrazos.length - 1) {
                    this.historialCapturas.pop();
                }
            }
            this.historialTrazos.pop()
            this.pintarHistorial(this.lienzo);
        }
    }
    recuperarTrazo() {
        if (this.trazosRevertidos.length > 0) {
            this.historialTrazos.push(this.trazosRevertidos[this.trazosRevertidos.length - 1])
            this.trazosRevertidos.pop();
            const ultTrazo = this.historialTrazos[this.historialTrazos.length - 1];
            pintor.dibujar(this.lienzo, ultTrazo)
        }
    }
    guardarHistorial(trazo) {
        this.guardarTrazo(trazo);
        pintor.dibujar(this.lienzo, trazo)
        if (this.debeGuardarCaptura(trazo)) {
            this.guardarCaptura(trazo);
        }
    }
    guardarTrazo(trazo) {
        this.trazosRevertidos = [];
        this.historialTrazos.push(trazo)
    }
    pintarHistorial() {
        if (this.historialTrazos.length > 0) {
            this.lienzo.limpiar()
            this.cargarUltimaCaptura();

            const cantTrazos = this.trazosDesdeUltimaCaptura();
            const trazos = this.historialTrazos;
            for (let i = 0; i < cantTrazos; i++) {
                const indiceTrazo = trazos.length - cantTrazos + i;
                const trazoActual = trazos[indiceTrazo];
                pintor.dibujar(this.lienzo, trazoActual)
            }
        }
    }
    guardarCaptura() {
        const canvasTrucho = lienzo.obtener(this.lienzo.largo, this.lienzo.alto)
        canvasTrucho.pegarLienzo({ lienzo: this.lienzo, x: 0, y: 0 })
        this.historialCapturas.push({ captura: canvasTrucho, indice: this.historialTrazos.length })

        if (this.historialCapturas.length > this.limiteCapturasHistorial) {
            this.historialCapturas.splice(0, 1)
        }
    }
    debeGuardarCaptura(trazo) {
        let guardarEstado = false;
        if (this.trazosDesdeUltimaCaptura() >= this.frecuenciaTrazos ||
            pintor.trazoComplejo(trazo) ||
            this.historialCapturas.length == 0 && this.historialTrazos.length >= this.frecuenciaTrazos) {
            guardarEstado = true;
        }
        return guardarEstado;
    }
    renderizarUltimaCaptura(lienzo) {
        if (this.historialCapturas.length > 0) {
            lienzo.pegarLienzo({ lienzo: this.historialCapturas[this.historialCapturas.length - 1].captura, x: 0, y: 0 })
        }
    }
    trazosDesdeUltimaCaptura() {
        let cantidadTrazos = this.historialTrazos.length;
        if (this.historialCapturas.length > 0) {
            cantidadTrazos = ((this.historialTrazos.length - 1) - (this.historialCapturas[this.historialCapturas.length - 1].indice) + 1);
        }
        return cantidadTrazos;
    }
    cargarTodosLosTrazos(lienzo) {
        if (this.historialTrazos.length > 0) {
            for (const trazo of this.historialTrazos) {
                absoluteArt.utiles.pintarTrazo(trazo, lienzo)
            }
        }
    }
    cargarUltimaCaptura() {
        if (this.historialCapturas.length > 0) {
            const captura = this.historialCapturas[this.historialCapturas.length - 1].captura;
            this.lienzo.pegarLienzo({ lienzo: captura, x: 0, y: 0 })
        }
    }
    clonarArrayTrazos(historial) { // REVISADO
        const clonHistorial = []
        for (let i = 0; i < historial.length; i++) {
            const trazoCopiado = historial[i].clonar()
            clonHistorial.push(trazoCopiado)
        }
        return clonHistorial;
    }
    clonarCapturas() {
        const clonHistorial = []
        for (let i = 0; i < this.historialCapturas.length; i++) {
            const capt = this.historialCapturas[i]
            const canvasClon = lienzo.obtener(capt.captura.largo, capt.captura.alto);
            canvasClon.pegarLienzo({ lienzo: capt.captura, y: 0, x: 0 })

            clonHistorial.push({ indice: capt.indice, captura: canvasClon })
        }

        return clonHistorial
    }
    clonarArrays() {
        return {
            trazosRevertidos: this.clonarArrayTrazos(this.trazosRevertidos),
            historialTrazos: this.clonarArrayTrazos(this.historialTrazos),
            historialCapturas: this.clonarCapturas()
        }
    }
}
class categoria {
    constructor(nombre, categoria) {
        this.nombre = nombre;
        this.categoria = categoria; // igual a carpeta padre
    }
    herramientas = [];
    subCategorias = [];
}
class herramienta {
    constructor(nombre, categoria) {
        this.nombre = nombre;
        this.categoria = categoria; // igual a carpeta padre
    }
    usar(lienzo, trazo) {
    }

    perteneceCategoria(categoria) {
        let categoriaActual = this.categoria;

        while (categoriaActual) {
            if (categoriaActual === categoria) {
                return true;
            }

            categoriaActual = categoriaActual.categoria;
        }

        return false;
    }

}
class trazo {
    constructor({ trayectos, puntoInicial, rgba, grosor, herramienta, relacionAnchoAlto }) { // le puedo agregar cosas pero por ahora va este 
        this.trayectos = trayectos;
        this.puntoInicial = puntoInicial;
        this.rgba = rgba;
        this.grosor = grosor;
        this.relacionAnchoAlto = relacionAnchoAlto;
        this.herramienta = herramienta; // es un string, simplemente el nombre de la herramienta
    }
    cajaDelimitadora() { // se toma asi pq es cordenada relativa a punto inicial, la cord 0 siempre es 0 0 
        let x1 = 0;
        let y1 = 0;
        let x2 = 0;
        let y2 = 0;
        for (const cord of this.trayectos[0]) {
            if (x1 > cord.x) x1 = cord.x
            if (x2 < cord.x) x2 = cord.x
            if (y1 > cord.y) y1 = cord.y
            if (y2 < cord.y) y2 = cord.y
        }

        return {
            x: x1,
            y: y1,
            largo: x2 - x1,
            alto: y2 - y1
        }
    }
    invertirRGB(indice) {
        const color = this.rgba[indice]
        if (color) {
            color.r = 255 - color.r;
            color.g = 255 - color.g;
            color.b = 255 - color.b;
        }
    }
    invertirAlpha(indice) {
        const color = this.rgba[indice]
        if (color) {
            color.a = 1 - color.a;
        }
    }
    invertirCanalesRGBA(indice) {
        this.invertirAlpha(indice)
        this.invertirRGB(indice)
    }
    clonarRGBA() {
        const clonRGBA = [];
        for (const act of this.rgba) {
            clonRGBA.push({
                r: act.r,
                g: act.g,
                b: act.b,
                a: act.a
            })
        }
        return clonRGBA
    }
    clonarTrayectos() {
        const clonTrayectos = [];
        for (const trayecto of this.trayectos) {
            const clonTrayecto = [];
            if (trayecto[0]) {
                for (const cords of trayecto) {
                    clonTrayecto.push({
                        x: cords.x,
                        y: cords.y,
                    })
                }
            }
            clonTrayectos.push(clonTrayecto)
        }
        return clonTrayectos
    }
    clonar() {
        return new trazo({
            puntoInicial: { x: this.puntoInicial.x, y: this.puntoInicial.y },
            //relacionAnchoAlto: { alto: this.relacionAnchoAlto.alto, ancho: this.relacionAnchoAlto.ancho },
            grosor: this.grosor,
            rgba: this.clonarRGBA(),
            trayectos: this.clonarTrayectos(),
            herramienta: this.herramienta,
        })
    }
    agregarTrazo(cordenada) {
        this.trayectos.push([this.obtenerCordenadaRelativa(cordenada)])
    }
    agregarCordenada(cordenada) {
        this.trayectos[this.trayectos.length - 1].push(this.obtenerCordenadaRelativa(cordenada))
    }
    remplazarUltimaCordenada(cordenada) {
        if (this.trayectos[this.trayectos.length - 1].length > 0) {
            this.trayectos[this.trayectos.length - 1][this.trayectos[this.trayectos.length - 1].length - 1] = this.obtenerCordenadaRelativa(cordenada)
        } else {
            this.agregarCordenada(cordenada)
        }
    }
    obtenerCordenadaRelativa(cordenada) {
        return { x: cordenada.x - this.puntoInicial.x, y: cordenada.y - this.puntoInicial.y }
    }
}
class herramientaDibujo extends herramienta {
    constructor(nombre, categoria) {
        super(nombre, categoria)
    }
    usar({ lienzo, lienzoIntermediario, trazo }) {
    }
    trazoComplejo() {
        return false
    }
}
class figura extends herramientaDibujo {
    constructor(nombre, categoria) {
        super(nombre, categoria)
    }
    cordenadasRepetibles = false;
    trayectosNecesarios = 1;
    cordenadasNecesarios = [2]; // esto del trazo 0 ,  en caso de figuras porlomenos, en caso de una herramienta selectora libre seria del trazo 2
    trazoTerminado(trazo) {
        return trazo.trayectos.length >= this.trayectosNecesarios
    }
    trazoValido(trazo) {
        if (trazo.trayectos.length !== this.trayectosNecesarios) return false
        for (let i = 0; i < trazo.trayectos.length; i++) {
            if (trazo.trayectos[i].length !== this.cordenadasNecesarios[i]) return false
        }
        if (!this.condicionesEspeciales(trazo)) return false
        return true
    }

    condicionesEspeciales(trazo) {
        const tam = trazo.cajaDelimitadora();
        if (tam.alto * tam.largo <= 0) return false

        return true
    }

    trazoEnProceso(trazo) {
        if (trazo.trayectos.length < this.trayectosNecesarios) {
            for (let i = 0; i < trazo.trayectos.length; i++) {
                if (trazo.trayectos[i].length !== this.cordenadasNecesarios[i]) {
                    return false
                }
            }
            return true;
        }

        return false;
    }
}
class lineaSimple extends figura {
    constructor(nombre, categoria) {
        super(nombre, categoria)
    }
    usar({ lienzo, trazo }) { // ({ x1, y1, x2, y2, grosor, r, g, b, a })
        if (!this.trazoValido(trazo)) return
        lienzo.pintarLinea({
            x1: trazo.trayectos[0][0].x + trazo.puntoInicial.x,
            y1: trazo.trayectos[0][0].y + trazo.puntoInicial.y,
            x2: trazo.trayectos[0][1].x + trazo.puntoInicial.x,
            y2: trazo.trayectos[0][1].y + trazo.puntoInicial.y,
            grosor: trazo.grosor,
            r: trazo.rgba[0].r,
            g: trazo.rgba[0].g,
            b: trazo.rgba[0].b,
            a: trazo.rgba[0].a
        })
    }
    condicionesEspeciales(trazo) {
        const tam = trazo.cajaDelimitadora();
        if (tam.alto + tam.largo <= 0) return false

        return true
    }
}

class rectanguloSimple extends figura {
    constructor(nombre, categoria) {
        super(nombre, categoria)
    }
    usar({ lienzo, trazo }) { // ({ x1, y1, x2, y2, grosor, r, g, b, a })
        if (!this.trazoValido(trazo)) return
        const borde = trazo.cajaDelimitadora()
        borde.x += trazo.puntoInicial.x;
        borde.y += trazo.puntoInicial.y;
        Object.assign(borde, trazo.rgba[0]);
        const centro = trazo.cajaDelimitadora()
        centro.x += trazo.grosor + trazo.puntoInicial.x;
        centro.y += trazo.grosor + trazo.puntoInicial.y;
        centro.largo -= trazo.grosor * 2;
        centro.alto -= trazo.grosor * 2;
        Object.assign(centro, trazo.rgba[1]);

        lienzo.pintarRectangulo(borde)
        if (centro.largo > 0 && centro.alto  > 0) {
            lienzo.limpiarRectangulo(centro)
            lienzo.pintarRectangulo(centro)
        }
    }
}

const pintor = {
    lienzoIntermediario: undefined,
    categorias: new categoria('herramientas'),
    listaHerramientas: [],
    listaCategorias: [],

    dibujar(lienzoDibujar, trazo) {
        /*
        if (!this.lienzoIntermediario) {
            this.lienzoIntermediario = lienzo.obtener(lienzoDibujar.largo, lienzoDibujar.alto)
        } else if (this.lienzoIntermediario.largo !== lienzoDibujar.largo || this.lienzoIntermediario.alto !== lienzoDibujar.alto) {
            this.lienzoIntermediario.redimenzionar(lienzoDibujar.largo, lienzoDibujar.alto)
        }
            */
        this.obtenerHerramienta(trazo.herramienta).usar({ lienzo: lienzoDibujar, trazo: trazo, lienzoIntermediario: this.lienzoIntermediario })
        //this.lienzoIntermediario.redimenzionar(1, 1)
    },
    trazoComplejo(trazo) {
        return this.obtenerHerramienta(trazo.herramienta).trazoComplejo();
    },
    cargarCategorias() { // orden ordenado por dios
        const listaCategorias = [
            { nombreCategoria: 'dibujo' },
            { nombreCategoria: 'figuras', categoriaPadre: 'dibujo' },
            { nombreCategoria: 'pinceles', categoriaPadre: 'dibujo' },
            { nombreCategoria: 'continuos', categoriaPadre: 'pinceles' },
            { nombreCategoria: 'sello', categoriaPadre: 'pinceles' },
        ]
        const agregarHerramienta = ({ nombreCategoria, categoriaPadre }) => {
            this.listaCategorias.push(this.agregarCategoria(new categoria(nombreCategoria, this.obtenerCategoria(categoriaPadre))))
        };
        for (const herramienta of listaCategorias) {
            agregarHerramienta(herramienta);
        }
    },
    cargarHerramientas() { // orden irrelevante
        this.cargarCategorias();
        this.listaHerramientas.push(
            this.agregarHerramienta((new lineaSimple('lineaSimple', this.obtenerCategoria('figuras')))),
            this.agregarHerramienta((new rectanguloSimple('rectanguloSimple', this.obtenerCategoria('figuras')))),
        )
    },
    agregarHerramienta(herramienta) {
        herramienta.categoria.herramientas.push(herramienta);
        return herramienta
    },
    agregarCategoria(categoria) {
        categoria.categoria.subCategorias.push(categoria);
        return categoria
    },
    obtenerHerramienta(nombre) {
        for (const herramienta of this.listaHerramientas) {
            if (herramienta.nombre === nombre) {
                return herramienta
            }
        }
    },
    obtenerCategoria(nombre) {
        for (const categoria of this.listaCategorias) {
            if (categoria.nombre === nombre) {
                return categoria
            }
        }
        return this.categorias;
    },
}

const lienzoPrincipal = {
    confCapas: {
        frecuenciaCapturas: 10,
        trayectoMuyLargo: 1000,
        limiteCapturasHistorial: 5,
        altoCanvas: 720,
        anchoCanvas: 1280
    }, //no de capa
    conteoCapas: 0, // control de Id de capas
    conteoGrupoCapas: 0, // control de Id de capas
    capas: {},
    capasIndividualesVivas: [],
    capasGrupoVivas: [],
    capaActiva: undefined,
    grupoCapasActiva: undefined,

    trazoTemporal: undefined,
    trazoGuardar: undefined,

    inicioClick({ cordenada, lienzoReal, parametrosTrazo }) {

        if (this.trazoGuardar) {
            if (!pintor.obtenerHerramienta(this.trazoGuardar.herramienta).trazoEnProceso(this.trazoGuardar)) {
                if (pintor.obtenerHerramienta(this.trazoGuardar.herramienta).trazoValido(this.trazoGuardar)) {
                    this.trazoGuardar = undefined;
                }
            }
        }
        if (!this.trazoGuardar) {
            this.trazoGuardar = new trazo(parametrosTrazo)
        }
        this.trazoGuardar.agregarTrazo(cordenada)
        this.trazoTemporal = this.trazoGuardar.clonar()
    },

    arrastreClick({ cordenada, lienzoReal }) {

        lienzoReal.limpiar()
        if (pintor.obtenerHerramienta(this.trazoGuardar.herramienta).perteneceCategoria(pintor.obtenerCategoria('pinceles'))) {
            this.trazoGuardar.agregarCordenada(cordenada)
            this.renderizarTrazo({ lienzoReal: lienzoReal, trazo: this.trazoGuardar })
        } else {
            if (this.trazoTemporal.trayectos[this.trazoTemporal.trayectos.length - 1].length > 1) {
                this.trazoTemporal.remplazarUltimaCordenada(cordenada)
            } else {
                this.trazoTemporal.agregarCordenada(cordenada)
            }
            this.renderizarTrazo({ lienzoReal: lienzoReal, trazo: this.trazoTemporal })
        }
    },

    finClick({ cordenada, lienzoReal }) {
        lienzoReal.limpiar()
        this.trazoGuardar.agregarCordenada(cordenada)
        this.renderizarTrazo({ lienzoReal: lienzoReal, trazo: this.trazoGuardar })

        if (!pintor.obtenerHerramienta(this.trazoGuardar.herramienta).trazoEnProceso(this.trazoGuardar)) {
            if (pintor.obtenerHerramienta(this.trazoGuardar.herramienta).trazoValido(this.trazoGuardar)) {
                this.capaActiva.guardarTrazo(this.trazoGuardar)
            }
            this.trazoGuardar = undefined;
        }
    },

    renderizarTrazo({ lienzoReal, trazo }) {
        this.capas.renderizarHasta(lienzoReal, this.capaActiva.id)
        pintor.dibujar(lienzoReal, trazo)
        this.capas.renderizarDesde(lienzoReal, this.capaActiva.id)
    },
    clonarCapa(carpeta, capa) { //id carpeta es el padre, capa es la carpeta a clonar
        if (carpeta.tipoCapa === 'grupo') {
            if (capa.tipoCapa === 'individual') {
                this.conteoCapas++

                this.capaActiva = carpeta.clonarCapa(this.conteoCapas, capa);
                this.capasIndividualesVivas.push(this.capaActiva);
            } else {
                if (capa.id !== 0) {
                    this.conteoGrupoCapas++
                    this.grupoCapasActiva = carpeta.clonarCapa(this.conteoGrupoCapas, capa);
                    this.capasGrupoVivas.push(this.grupoCapasActiva);
                    this.clonarContenido(capa, this.grupoCapasActiva)
                }
            }
        }
    },
    clonarContenido(grupo, clon) {
        for (const capa of grupo.contenido) {
            this.clonarCapa(clon, capa)
            if (capa.tipoCapa === 'grupo') {
                if (capa.contenido.length > 0) {
                    const padre = clon.contenido[clon.contenido.length - 1]
                    this.clonarContenido(capa, padre)
                }
            }
        }
    },
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
        if (capaPadre !== undefined) {
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
    eliminarCapasHijo(capa) {
        if (capa.contenido.length > 0) {
            for (let i = capa.contenido.length - 1; i > - 1; i--) {
                if (capa.contenido[i].tipoCapa === 'grupo') {
                    this.eliminarGrupoCapas(capa.contenido[i].id)
                } else {
                    this.eliminarCapa(capa.contenido[i].id)
                }
            }
        }
    },
    eliminarGrupoCapas(id) {
        const capaEliminar = this.capas.buscarGrupoCapas(id)
        const capaPadre = capaEliminar?.capaPadre;
        if (this.capasGrupoVivas.length > 0 && capaPadre !== undefined && id !== 0) {
            this.eliminarCapasHijo(capaEliminar);
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

const utiles = {
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
        const canvasInfo = canvas.getBoundingClientRect();
        const medidasCanvas = { real: { w: canvas.width, h: canvas.height }, css: { w: canvasInfo.width, h: canvasInfo.height } }


        return { ancho: (canvasInfo.width / canvas.width), alto: (canvasInfo.height / canvas.height) };
    },
    adaptarCordCanvas(cordX, cordY, canvas) {//usar para convertir la cordenada obtenida para que sea la cordenada real tocada del canvas
        const tamanio = this.medidaPixelesCanvas(canvas);
        const ubicacionClick = this.obtUbicClickElem(cordX, cordY, canvas);
        return { x: ((ubicacionClick.x / tamanio.ancho) | 0) + 0.5, y: ((ubicacionClick.y / tamanio.alto) | 0) + 0.5 };
        //return { x: ((ubicacionClick.x / tamanio.ancho) ) , y: ((ubicacionClick.y / tamanio.alto))  };
    },
    obtUbicClickElem(cordX, cordY, elemento) {
        const infoObjeto = { x: elemento.getBoundingClientRect().x, y: elemento.getBoundingClientRect().y };
        return { x: cordX - infoObjeto.x, y: cordY - infoObjeto.y };
    },
}
const lienzo = {
    contadorLienzos : 0,
    obtener(largo, alto) { // faltan lienzos, por ahora solo el lienzoPlano pero si agregase react native faltaria ese tambien , todos deben tener las mismas funciones , porlomenos las qu ese usen al dibujar
        this.contadorLienzos++;
        console.log(this.contadorLienzos)
        return new lienzoHtml(largo, alto)
    },
}
const configuracion = {
    configurarEsteticaCanvas(canvas) { // se lo pedi a gemini
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
        const lienzo = lienzoPrincipal;
        lienzo.capas = new grupoCapas(undefined, lienzo.conteoGrupoCapas, lienzo.confCapas.anchoCanvas, lienzo.confCapas.altoCanvas);
        lienzo.grupoCapasActiva = lienzo.capas;
        lienzo.capaActiva = new capa(lienzo.capas,
            lienzo.conteoCapas,
            lienzo.confCapas.anchoCanvas,
            lienzo.confCapas.altoCanvas,
            lienzo.confCapas.frecuenciaCapturas,
            lienzo.confCapas.trayectoMuyLargo,
            lienzo.confCapas.limiteCapturasHistorial,
        )
        lienzo.capas.contenido.push(lienzo.capaActiva)
        lienzo.capasIndividualesVivas.push(lienzo.capaActiva)
    },

    configuracionesBase(canvas) {
        this.agregarCapaBase()
        this.configurarEsteticaCanvas(canvas)
        pintor.cargarHerramientas()

    }
}

const absoluteArt = {
    lienzoPrincipal,
    lienzo,
    utiles,
    pintor,
    configuracion
}