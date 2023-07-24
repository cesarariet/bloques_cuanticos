// ----------------------------------------------------------------
// Este script hace que apareza la opción de reiniciar el experimento
// cuando no se ve ningun bloque en pantalla
// El botón reiniciar hace que todos los bloques cuánticos reinicien
// con un estado aleatorio
// ----------------------------------------------------------------

function EstadoGeneral(arBloques) {
  this.cartaVisible = [false, false, false];
  this.cantidadCartasVisibles = 0;
  this.cartaDetectada = (idCarta) => {
    this.cartaVisible[idCarta] = true;
    this.cantidadCartasVisibles++;
    return this.cartaVisible;
  };

  this.cartaPerdida = (idCarta) => {
    this.cartaVisible[idCarta] = false;
    this.cantidadCartasVisibles--;
    return this.cartaVisible;
  };
}

const estadoGeneral = new EstadoGeneral(arBloques);

const escena = document.getElementById("escena");

const uiParaEntrelazarBloques = document.getElementById(
  "uiParaEntrelazarBloques"
);

//----------------------------------------------------------------
// Cuando se detectan los bloques
//----------------------------------------------------------------

escena.addEventListener("targetFound", (event) => {
  idTarget =
    event.target.components["mindar-image-target"].attrValue.targetIndex;

  estadoGeneral.cartaDetectada(arBloques[idTarget].idCarta);

  if (estadoGeneral.cantidadCartasVisibles === 2)
    uiParaEntrelazarBloques.classList.remove("noVisible");
});

//----------------------------------------------------------------
// Cuando se pierde algun bloque
//----------------------------------------------------------------
escena.addEventListener("targetLost", (event) => {
  uiParaEntrelazarBloques.classList.add("noVisible");

  idTarget =
    event.target.components["mindar-image-target"].attrValue.targetIndex;

  estadoGeneral.cartaPerdida(arBloques[idTarget].idCarta);
});

//----------------------------------------------------------------
// Cuando se presiona el boton entrelazarBloquesDetectados
//----------------------------------------------------------------
function entrelazarBloquesDetectados() {
  //entrelazar estados
  const idCartaLibre = estadoGeneral.cartaVisible.indexOf(false);
  bloquesCuanticos.establecerEstado(
    entrelazarEnEstadoDeBell(idCartaLibre, bloquesCuanticos.estado)
  );

  // cambiar interfaz de usuario despues del producir el entrelazamiento
  uiParaEntrelazarBloques.classList.add("noVisible");
  arBloques.forEach((arBloque) => {
    arBloque.a_figura.setAttribute("color", "grey");
    arBloque.a_text.setAttribute(
      "value",
      "bloques entrelazados\nRetirar y volver\npara medir."
    );
  });
}
