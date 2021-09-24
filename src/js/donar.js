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
	for (proyecto in proyectos){
		datos = 
	`
<div id="donar" class="donar">
      <div class="titulo" id="nombreProyecto">${proyecto.nm}</div>
      <div class="row display_boxflex">
        <div class="org">
          <div class="box-text">${proyecto.org}</div>
        </div>
        <div class="orgR">
          <div class="box-text">Contacto</div>
        </div>
      </div>
      <div class="row display_boxflex">
        <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12">
          <div class="box_text">
            <p>
              ${proyecto.des}
            </p>
            <br>

            <p>
            ${proyecto.donRec *100 / proyecto.donReq} % de la donación completada.
            </p>
            <form class="donar_py" type="POST">
              <div class="row">
                <div class="col-md-12">
                  <div class="col-md-12">
                    <input
                      class="contactus"
                      placeholder="Cantidad a donar (ETH)"
                      type="text"
                      id="donacion"
                      required
                    />
                  </div>
                  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <button
                      id="btnDonar"
                      class="btnDonar"
                      type="button"
                      onclick="donar(${proyecto.id})"
                    >
                      Donar
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="col-xl-7 col-lg-7 col-md-7 col-sm-12 border_right">
          <div class="upcoming">
            <figure><img src="images/up.jpg" alt="#" /></figure>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="gitHub"></div>
      </div>
    </div>
	`;
	datosProyectos = datosProyectos + datos;
	}

	let container = document.querySelector("#proyectos_container");
	container.innerHTML = datosProyectos;

}

//Función que permite donar
async function donar(_id) {
	let cantidad = document.getElementById("donacion");
	web3.methods.donar(_id,cantidad);
}
