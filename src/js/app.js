//conexión a web3
async function conexionWeb3() {
  //PROTOCOLO: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
  if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
      // Solicitar acceso a la cuenta
      window.ethereum.request({ method: "eth_requestAccounts" });
      //alert("Conectado a Web3");
    } catch (error) {
      // Acceso denegado...
      alert("Necesitas un proveedor de web3");
    }
  }
  // Otros dapp browsers
  else if (window.web3) {
    web3Provider = window.web3.currentProvider;
  }
  // Si no se detecta ningún proveedor de web3, conectar de nuevo con Ganache
  else {
    web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
  }

  web3 = new Web3(window.ethereum);
}

window.conexionWeb3 = conexionWeb3;



//Devuelve la cuenta con la que está operando metamask
async function getCuenta() {
  window.ethereum.enable();
  let acc = await web3.eth.getAccounts();
  return acc[0];
}

window.getCuenta = getCuenta;

//Cargar el Json
async function loadJSON() {
  const file = "http://localhost:3000/Donacion.json";
  const promise = await fetch(file);
  return promise.json();
}

window.loadJSON = loadJSON;

//Instanciar el smart contract
async function init(){
    const contract = await loadJSON();
    let contractAbi = contract.abi;
    let contractInstance = new web3.eth.Contract(
      contractAbi,
      "0xb132e9a86a95293b1ea483096677e70c2991cf99"
      //ropsten: 0xb132e9a86a95293b1ea483096677e70c2991cf99
    );
    return contractInstance;
}

window.init = init;



//Recoge datos del formulario de inscripcion de proyectos y los sube a la blockchain
async function recogerDatos() {
  let containerLoader = document.querySelector("#botonSubir");
  console.log(containerLoader);
  containerLoader.innerHTML = `<div class="loader"><figure><img src="images/loading.gif" alt="#" /></figure></div>`
    conexionWeb3();
    const contractInstance = await init();

    //Recoger datos del formulario
    const nombreProyecto = document.getElementById("nombre").value;
    const nombreOrganizacion = document.getElementById("organización").value;
    const contacto = document.getElementById("contacto").value;
    const donReq = document.getElementById("donReq").value;
    const descripcion = document.getElementById("descripcion").value;
    const img = document.getElementById("imagen").files[0];
    
    const ac = await getCuenta();

    //Imagen a IPFS vía Pinata
    const base64 = await toBase64(img);
    const imgResponse = await uploadImage(base64);
    const hs = imgResponse.cid;

    //Subir proyecto al mapping del contrato
    const donReqWei = web3.utils.toWei(donReq,"ether");
    let tx = await contractInstance.methods.subirProyecto(hs, nombreProyecto, nombreOrganizacion,
     contacto, descripcion, donReqWei).send({from: ac,});
    let txHash = tx.transactionHash;

    //Dar a conocer al usuario su transacción
    let container = document.querySelector("#datos");
    container.innerHTML = `<div class="titlepage">
                            <h1>¡PROYECTO SUBIDO!</h1>
                          </div>
                          <div class="titlepageS">
                            <h2><i>${nombreProyecto}</i>.</h2><br>
                            <h3>Hash de tu transacción: </h3>
                            <div class="hs"><p> ${txHash} </p></div><br><br><br><br>
                            <p><a href="https://ropsten.etherscan.io/tx/${txHash}"  target="_blank">
                            Accede al explorador de tu transacción aquí</a></p>
                          </div>`;

    //Recoger evento emitido por el contrato
    const eventos = await contractInstance.getPastEvents("proyectoSubido",{});
    const ultimoEvento = eventos[0];
}

//Convierte una imagen a base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.replace('data:', '').replace(/^.+,/, ''));
    reader.onerror = error => reject(error);
});

//Sube una imagen a un servidor público el cual redirecciona la imagen a Pinata y a IPFS
async function uploadImage(base64){
    const config = {method:"POST", body: JSON.stringify({base64: base64}), 
    headers: {"Content-Type":"application/json"}};
    const url = "http://app-a3ce6b6a-db3a-4579-9eb8-af58ba78ea82.cleverapps.io/upload";
    const response = await fetch(url, config);
    return response.json();
}

