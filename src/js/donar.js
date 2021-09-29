window.addEventListener("load", function () {
  window.conexionWeb3();
  escribirDatos();
});

async function escribirDatos() {
  const ac = await getCuenta();
  if (ac != undefined)
    document.getElementById("cuenta").innerHTML = "Cuenta: " + ac;

  const contractInstance = await init();
  let proyectos = [];
  let cantidadProyectos = await contractInstance.methods.proyectoID().call();

  for (i = 1; i <= cantidadProyectos; i++) {
    proyectos.push(await contractInstance.methods.getProyecto(i).call());
  }

  let datosProyectos = "";
  for (proyecto of proyectos) {
    if (proyecto.donReq - proyecto.donRec > 0) {
      id = "donacion" + proyecto.id;
      datos = `
        <div id="donar" class="donar">
          <div class="titulo" id="nombreProyecto">${proyecto.nm}</div>
          <div class="row display_boxflex">
           <div class="org">
            <div class="box-text">Organización: ${proyecto.org}</div>
            </div>
            <div class="orgR">
              <div class="box-text">Contacto: ${proyecto.cont}</div>
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
                 ${((proyecto.donRec * 100) / proyecto.donReq).toFixed(2)} % de la donación completada.
                </p>
                <p>
                  Faltan ${(proyecto.donReq - proyecto.donRec) / 10 ** 18} ETH para completar el proyecto.
                </p>
                  <form class="donar_py" type="POST">
                  <div class="row">
                   <div class="col-md-12">
                   <div class="col-md-12">
                       <input
                       class="contactus"
                       placeholder="Cantidad a donar (ETH)"
                       type="number"
                       id=${id}
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
              
              <figure><img src="https://gateway.pinata.cloud/ipfs/${proyecto.hs}" alt="#" /></figure>
            </div>
          </div>
        </div>
          <div class="container">
         <div class="gitHub"></div>
        </div>
        </div>
         `;

      datosProyectos = datos + datosProyectos;
    }
  }

  let container = document.querySelector("#proyectos_container");
  container.innerHTML = datosProyectos;
}

//Función que permite donar
async function donar(_id) {
  const contractInstance = await init();
  let donante = await getCuenta();
  let proyecto = await contractInstance.methods.getProyecto(_id).call();
  let idHtml = "donacion" + proyecto.id;
  let cantidad = document.getElementById(idHtml).value;
  await contractInstance.methods
    .donar(_id)
    .send({ from: donante, value: web3.utils.toWei(cantidad, "ether") });
  
  const eventos = await contractInstance.getPastEvents("proyectoDonado",{});
  const tx = eventos[0].transactionHash;
  alert("Hash de tu transacción: " + tx);


}
