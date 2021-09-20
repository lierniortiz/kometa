function recogerDatos() {
  //Elementos
  const nombreProyecto = document.getElementById("nombre").value;
  const nombreOrganizacion = document.getElementById("organización").value;
  const contacto = document.getElementById("contacto").value;
  const resumen = document.getElementById("resumen").value;
  const descripcion = document.getElementById("descripción").value;
  const mensajeFinal =
    nombreProyecto + nombreOrganizacion + contacto + resumen + descripcion;

  console.log(mensajeFinal);
}

function escribirDatos() {
  var newDivNombre = document.createElement("div");

  newDivNombre.appendChild(document.createTextNode(nombreProyecto));
  console.log(newDivNombre);

  document.getElementById("proyectos").appendChild(nombreProyecto);
}

//Listeners
//btnSubir.onclick = conectar;

/**<div id="proyectos" class="proyectos">
      <div class="container-fluid padding_left3">
        <div class="row display_boxflex">
          <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12">
            <div class="box_text">
              <div class="titlepage_pr">
                <h2>Casa en nosedonde</h2>
              </div>
              <p>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters, as opposed to using 'Content
                here, content here', making it lookIt is a long established fact
                that a reader will be distracted by the readable content of a
                page when looking at its layout. The point of using Lorem Ipsum
                is that it has a more-or-less normal distribution of letters, as
                opposed to using 'Content here, content here', making it look
              </p>
            </div>
          </div>

          <div class="col-xl-7 col-lg-7 col-md-7 col-sm-12 border_right">
            <div class="proyectos">
              <figure><img src="images/up.jpg" alt="#" /></figure>
            </div>
          </div>
        </div>
      </div>
    </div>**/
