pragma solidity ^0.5.0;

contract Donacion{
	string public nombre = "Donacion";
	
	//GUARDAR PROYECTOS (IPFS)	
	uint public proyectoID = 0;
	mapping(uint => Proyecto) public proyectos; //public para poder llamarlo por fuera del SM

	
	
	struct Proyecto{
		uint id; //identificador de cada proyecto
		string hash; //(hash de IPSF)
		string nombre;
		string organizacion;
		string descripcion;
		address payable autor; //Para enviar donaciones al dueño del proyecto
		uint donacionRecibida; //Donacion que ha recibido
		uint donacionRequerida; //Donación que desearía recibir (recibida<requerida)
	}

	event proyectoSubido(
		uint id,
		string hash,
		string nombre,
		string organizacion,
		string descripcion,
		address payable autor,
		uint donacionRecibida,
		uint donacionRequerida
	);
	
	event proyectoDonado(
		uint id,
		string hash,
		string nombre,
		string organizacion,
		string descripcion,
		address payable autor,
		uint donacionRecibida,
		uint donacionRequerida
	);

	//SUBIR UN PROYECTO NUEVO
	/**modifier proyectoAceptado(uint _id) {
		if (proyectoId < 100){
			_;
		} else {
			//??aceptado = true; //como hacer que alguien acepte, y como sabemos que ese alguien ya ha subido si no
			//se puede iterar en el mapping? se puede pedir al que acepte que meta el id del proyecto que subió
		}
	}***/

	function subirProyecto (string memory _proyHash, string memory _nombre, string memory _organizacion, string memory _descripcion, uint _donacionRequerida) /**ProyectoAceptado()**/ public {
		//El modifier se asegura de que tenemos proyectos reales, que han sido aceptados por alguien que ha subido anteriormente
		
		//Asegurarse de que no son vacíos
		require(bytes(_proyHash).length == 256);
		require(bytes(_descripcion).length > 0);
		require(msg.sender != address(0x0));

		//Incrementar id de proyectos
		proyectoID ++;

		//Añadir proyectos al contrato
		proyectos[proyectoID] = Proyecto(proyectoID, _proyHash, _nombre, _organizacion, _descripcion, msg.sender, 0, _donacionRequerida);

		//Emitir evento al subirse un proyecto nuevo
		emit proyectoSubido(proyectoID, _proyHash, _nombre, _organizacion, _descripcion, msg.sender, 0, _donacionRequerida);

	}

	//Retorna el último proyecto que ha sido subido
	function getUltimoProyecto() public returns (uint, string memory hs, string memory nm, string memory org, string memory des, address, uint, uint){
		Proyecto memory _proyecto = proyectos[proyectoID];
			hs = _proyecto.hash;
			nm = _proyecto.nombre;
			org = _proyecto.organizacion;
			des = _proyecto.descripcion;
			return(_proyecto.id, hs ,nm, org, des,_proyecto.autor,_proyecto.donacionRecibida,_proyecto.donacionRequerida);
	}

	//Retorna el proyecto correspondiente a un id concreto que recibe como parametro
	function getProyecto(uint _id) public returns (uint, string memory hs, string memory nm, string memory org, string memory des, address, uint, uint){
		Proyecto memory _proyecto = proyectos[_id];
			hs = _proyecto.hash;
			nm = _proyecto.nombre;
			org = _proyecto.organizacion;
			des = _proyecto.descripcion;
			return(_proyecto.id, hs ,nm, org, des,_proyecto.autor,_proyecto.donacionRecibida,_proyecto.donacionRequerida);
	}

	//DONAR A UN PROYECTO
	function donar(uint _id) public payable{

		require(_id > 0 && _id <= proyectoID);

		//Identificar el proyecto al que donar
		Proyecto memory _proyecto = proyectos[_id];

		//Si la donación requerida ha sido cumplida no se podrá donar
		require(_proyecto.donacionRecibida < _proyecto.donacionRequerida);

		//Identificar el dueño del proyecto al que se quiere donar
		address payable _autor = _proyecto.autor;

		//Donar
		address(_autor).transfer(msg.value); //value nundik hartzen do??

		//Aumentar el valor de la donación que ha recibido ese proyecto
		_proyecto.donacionRecibida = _proyecto.donacionRecibida + msg.value;

		//Volver a poner el proyecto en el mapping
		proyectos[_id] = _proyecto;

		//Emitir evento cuando se dona
		emit proyectoDonado(_id, _proyecto.hash,_proyecto.nombre,_proyecto.organizacion, _proyecto.descripcion, _autor, _proyecto.donacionRecibida, _proyecto.donacionRequerida);
	}

}