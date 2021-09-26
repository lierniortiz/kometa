window.addEventListener("load", async function () {
  window.conexionWeb3();
  const ac = await getCuenta();
  document.getElementById("cuenta").innerHTML = "Cuenta: " + ac;
});
