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
      "0x9E83Ff60cdCdCCA0Efe06388D21a610A641d653b"
    );
    return contractInstance;
}

window.init = init;

//Recoge datos del formulario de inscripcion de proyectos y los sube a la blockchain
async function recogerDatos() {
    conexionWeb3();
    const contractInstance = await init();

    const nombreProyecto = document.getElementById("nombre").value;
    const nombreOrganizacion = document.getElementById("organización").value;
    const contacto = document.getElementById("contacto").value;
    const donReq = document.getElementById("donReq").value;
    const descripcion = document.getElementById("descripcion").value;
    const img = document.getElementById("imagen").files[0];
    
    const ac = await getCuenta();

    const base64 = await toBase64(img);
    const imgResponse = await uploadImage(base64);
    const hs = imgResponse.cid;
    console.log(hs);

    const donReqWei = web3.utils.toWei(donReq,"ether");

    await contractInstance.methods.subirProyecto(hs, nombreProyecto, nombreOrganizacion, contacto, descripcion, donReqWei).send({from: ac,});

    const eventos = await contractInstance.getPastEvents("proyectoSubido",{});
    const numeroBloque = eventos[0].blockNumber;
    alert("Tu proyecto ha sido subido al bloque número " + numeroBloque);
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.replace('data:', '').replace(/^.+,/, ''));
    reader.onerror = error => reject(error);
});

async function uploadImage(base64){
    const config = {method:"POST", body: JSON.stringify({base64: base64}), headers: {"Content-Type":"application/json"}};
    const url = "http://localhost:8000/upload";
    const response = await fetch(url, config);
    return response.json();
}

//https://www.npmjs.com/package/ipfs-http-client

//Función que sube una imagen dada a ipfs y nos retorna el hash
async function loadIPFS(img) {
  const ipfsClient = window.IpfsHttpClient;
  console.log(ipfsClient);
  const ipfs = ipfsClient.create();
  console.log(ipfs);
  const result = await ipfs.add(img); //path of the file to be added
  return result.cid.toString();
}

//Funcion que nos retorna lo guardado en IPFS dado un hash
async function downloadIPFS(hash) {
  const ipfs = await IPFS.create();
  const stream = ipsf.cat(hash);
  let data = "";
  for await (const chunk of stream) {
    data += chunk.toString();
  }
  return data;
}
