var Donacion = artifacts.require("Donacion");
module.exports = function (deployer) {
	deployer.deploy(Donacion);
};
