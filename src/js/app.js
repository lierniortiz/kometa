//conexión a web3
async function conexionWeb3() {
  //PROTOCOLO: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
  if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
      // Solicitar acceso a la cuenta
      window.ethereum.request({ method: "eth_requestAccounts" });
      alert("Conectado a Web3");
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
      "0x0C7364CE8a3D6aA2c7401EC0E1b0B37a79928618"
    );
    return contractInstance;
}

window.init = init;

//Recoge datos del formulario de inscripcion de proyectos y los sube a la blockchain
async function recogerDatos() {
    conexionWeb3();
    const contractInstance = await init();
    console.log(contractInstance);

    const nombreProyecto = document.getElementById("nombre").value;
    const nombreOrganizacion = document.getElementById("organización").value;
    const contacto = document.getElementById("contacto").value;
    const donReq = document.getElementById("donReq").value;
    const descripcion = document.getElementById("descripcion").value;
    //const img = document.getElementById("imagen");

    //const hs = loadIPFS(img);
    const ac = await getCuenta();

    const donReqWei = web3.utils.toWei(donReq,"ether");

    await contractInstance.methods.subirProyecto("brv", nombreProyecto, nombreOrganizacion, descripcion, donReqWei).send({from: ac,});
    
    const evento = await contractInstance.events.proyectoSubido();

    //COMO GESTIONAR ESTOOO????
    console.log(evento);
      
}

/*
//Retorna el hash-256 de un mensaje que se le pasa como parametro
async function digestMessage(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return hash;
}
//const digestBuffer = await digestMessage(text);
//console.log(digestBuffer.byteLength);
*/


//Función que sube una imagen dada a ipfs y nos retorna el hash
async function loadIPFS(img) {
  const node = await IPFS.create();
  const result = node.add(img); 
  return result.cid.toString();
}

//Funcion que nos retorna lo guardado en IPFS dado un hash
async function downloadIPFS(hash) {
  const node = await IPFS.create();
  const stream = node.cat(hash);
  let data = "";
  for await (const chunk of stream) {
    data += chunk.toString();
  }
  return data;
}
