//Cuando se carga la página
window.addEventListener("load", function () {});

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

//Cargar el contrato
/*function cargarContrato() {
  var DonacionJSON = $.getJSON(
    "../../build/constracts/Donacion.json",
    function (data) {
      console.log(data);
      return data;
    }
  );

  return new web3.eth.Contract(DonacionJSON);
}*/

//Devuelve la cuenta con la que está operando metamask
function getCuenta() {
  window.ethereum.enable();
  let acc = web3.eth.getAccounts().then(function (acc) {
    accounts = acc[0];
    return accounts;
  });
  return acc;
}

//Cargar el archivo json del contrato
function loadJSON(callback) {
  const file = "Donacion.json";
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", file, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

//Retorna el hash-256 de un mensaje que se le pasa como parametro
async function digestMessage(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return hash;
}
//const digestBuffer = await digestMessage(text);
//console.log(digestBuffer.byteLength);

//Recoge datos del formulario de inscripcion de proyectos y los sube a la blockchain
async function recogerDatos() {
  conexionWeb3();
  //--------------------init()------------------------------//
  loadJSON(function (data) {
    var contract = JSON.parse(data);
    //console.log(contract);
    let contractAbi = contract.abi;
    let contractInstance = new web3.eth.Contract(
      contractAbi,
      "0x9Ad10d8aDa15A6651d05D86a87C34BeB9ad6B740"
    );
    //--------------------------------------------------------//

    console.log(contractInstance);

    const nombreProyecto = document.getElementById("nombre").value;
    const nombreOrganizacion = document.getElementById("organización").value;
    const contacto = document.getElementById("contacto").value;
    const donReq = document.getElementById("donReq").value;
    const descripcion = document.getElementById("descripcion").value;
    //const img = document.getElementById("imagen").value;
    const info = [
      nombreProyecto,
      nombreOrganizacion,
      contacto,
      donReq,
      descripcion,
    ];

    const ac = getCuenta();
    const cuenta = () => {
      ac.then((a) => {
        return a;
      });
    };
    document.getElementById("cuenta").innerHTML = "Cuenta: " + cuenta();

    //HAY QUE ARREGLAR LA ASINCRONÍA DE ESTO PARA METERLO EN EL SEND(from: ... ), y para que aparezca bien la cuenta

    contractInstance.methods.subirProyecto("5875aa6d0a4dbfca428c0c848e0a7c4584b67dd24554cd604f64e4275b77c2f0", nombreProyecto, nombreOrganizacion, descripcion, donReq).send({
        from: /*cuenta()*/ "0x56b32c3557eFB8A836Aeeac0d6F4f778B111c48B",
      });
    //altera el estado del contrato, si no alterara .call()

    //escribirDatos(contractInstance);
  });
}

//Escribe en la sección de proyectos el último proyecto que se ha sido subido a la blockchain.
/*function escribirDatos(contrato) {
  proyecto = contrato.methods.getUltimoProyecto();
  //COMO ESCRIBO LA TUPLA EN DONAR.HTML???
  id = proyecto[0];
  hs = proyecto[1];
  nm = proyecto[2];
  org = proyecto[3];
  des = proyecto[4];
  au = proyecto[5];
  dRec = proyecto[6];
  dReq = proyecto[7];

  var newDivNombre = document.createElement("div");

  newDivNombre.appendChild(document.createTextNode(nm));
  console.log(newDivNombre);

  document.getElementById("donar").appendChild(nm);
}*/

//Funcion que permite donar
function donar(_id) {
  //Hay que identificar cada boton con un id??
}

//Función que sube una imagen dada a ipfs y nos retorna el hash
/*async function loadIPFS(img) {
  const node = await IPFS.create();
  const results = node.addAll([img,nm,...]); //podemos subir más que solo la imagen, podemos subir todo y hacer un hash(subir hash a la bch)
  for await (const { cid } of results) {
    return cid.toString();
  }
}

//Funcion que nos retorna lo guardado en IPFS dado un hash
async function downloadIPFS(hash) {
  const node = await IPFS.create();
  const stream = node.cat(hash);
  let data = "";
  for await (const chunk of stream) {
    data += chunk.toString();
  }
  console.log(data);
}*/
