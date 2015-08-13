// Vardas (libreria) 
// Version: 0.1 30-07-15 
// David Alejandro Soto Cabrera
// d.sotoc@outlook.com

/*
compatibilidad con:
	Internet explorer 9+
	Google Chrome 
	Mozilla Firefox 
	Opera.
*/

var vardas = function() {
	this.Resultado;				// resultado devuelto de la peticion ajax
	this.ErrorAjax; 			// guarda el contenido del error en peticiones
	this.estadoDoc = false;		// true y false, si el document esta listo
	this.tiempoContadores = 800;// tiempo para los contadores que verifican estados
	return this;
}
// verifica si la pagina esta lista
vardas.prototype.docListo=function(){
	this.verificaDocListo();
	return this;
}
vardas.prototype.verificaDocListo=function(){
	var verificaciones = setInterval(verificaResultado.bind(this), this.tiempoContadores);
	window.onload = function(){
		return true;
	}
	function verificaResultado () {
		if (document.readyState == "complete" || window.onload) {
			this.estadoDoc = true;
		 	clearInterval(verificaciones);
		} else {
			this.estadoDoc = false;	
		}
	}
}
// set y get
vardas.prototype.setResultado=function(VALOR){
	this.Resultado = VALOR;
}
vardas.prototype.getResultado=function(){
	return this.Resultado;
}
vardas.prototype.setErrorAjax=function(VALOR){
	this.ErrorAjax = VALOR;
}
vardas.prototype.getErrorAjax=function(){
	if (typeof this.ErrorAjax == 'undefined') {
		return 'no se han definido errores';
	} else if (this.ErrorAjax == 0) {
		return 'solicitud externa rechazada';
	} else {
		return this.ErrorAjax;
	}
}
// genera un string para parametros POST ajax
vardas.prototype.generaStrPost = function(obj) {
// genera parametros
}
// funcion crea Ajax,  la misma recibira parametros para adaptarse a todos los casos
vardas.prototype.creaAjax = function(URL,METODO,PARAMETROS) {
	if (METODO == 'POST') {
		//console.log('metodo POST');
	} else {
		//console.log('metodo GET');
		if(window.XMLHttpRequest) {
			peticion_http = new XMLHttpRequest();
			peticion_http.onreadystatechange = (function() {
				if(peticion_http.readyState == 4) {
					if(peticion_http.status == 200) {
						var respuestaAjax = peticion_http.responseText;
						this.setResultado(respuestaAjax);
					} else {
						this.setResultado('error');
						this.setErrorAjax(peticion_http.status);
					}
					} else {
						this.setResultado('cargando');
				}
			}).bind(this);
			peticion_http.open('GET', URL +'#'+ Math.random(), true);
			peticion_http.send(null);
		} else {
			this.setResultado('error');
			this.setErrorAjax('XMLHttpRequest no existe');
		}
	}
}
// funcion ajax, entrada para la configuracion de peticiones ajax.
vardas.prototype.Ajax = function(ObJSON = '',Parametros = '') {
	var verificacionesAjax,retrasoAjax;// setInterval
	// verifica estado de documento.
	if (this.estadoDoc == false) {
		this.ErrorAjax = 'aun no esta listo el document DOM';
		retrasoAjax = setInterval(iniciaPeticionAjax.bind(this), this.tiempoContadores);
	} else {
		inicia.bind(this);
	}
	// funcion controladora de estado de documento
	function iniciaPeticionAjax() {
		if (this.estadoDoc == true && typeof ObJSON == 'object' && ObJSON.url) {
			clearInterval(retrasoAjax);
			// llama al metodo creaajax y le pasa los parametros.
			this.creaAjax(ObJSON.url,ObJSON.metodo,Parametros);
			verificacionesAjax = setInterval(verificaResultado.bind(this), this.tiempoContadores);	
		}
	}
	// verifica si la llamada AJAX termino, ya sea en error o exitosa
	function verificaResultado () {
		if (this.Resultado == 'cargando' || this.Resultado == 'error' || this.Resultado === undefined) {
			if (this.Resultado == 'cargando') {
				if (ObJSON.cargando) {eval( ObJSON.cargando + '()' );}
			}
			if (this.Resultado == 'error') {
				clearInterval(verificacionesAjax);
				if (ObJSON.fallo) {eval( ObJSON.fallo + '("'+ this.getErrorAjax() +'")' );}
				
			}
			if (this.Resultado === undefined) {
				clearInterval(verificacionesAjax);
				if (ObJSON.fallo) {eval( ObJSON.fallo + '("'+ this.getErrorAjax() +'")' );}
			}
		} else {
			// salida exitosa
			clearInterval(verificacionesAjax);
			if (ObJSON.exito) {eval( ObJSON.exito + '()' );}
			if (ObJSON.fin) {eval( ObJSON.fin + '()' );}
		}
	}
}

/*
metodos publicos listos
	Ajax(); parametros json


*/