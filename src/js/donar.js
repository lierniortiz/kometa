window.addEventListener("load", function () {
	window.conexionWeb3();
	escribirDatos();
});

async function escribirDatos(){
	let proyectos = [];
	let cantidadProyectos = web3.methods.proyectoID;



	for (i =1; i <= cantidadProyectos; i++){
		proyectos.push(web3.methods.getProyecto(i))
	}

	datosProyectos = "";

	
	`

	`

}

async function donar(_id) {
  //Hay que identificar cada boton con un id??
}
