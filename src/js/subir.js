window.addEventListener("load", async function () {
  window.conexionWeb3();
  const ac = await getCuenta();
  if (ac != undefined)
    document.getElementById("cuenta").innerHTML = "Cuenta: " + ac;
});
