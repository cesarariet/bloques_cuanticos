// ----------------------------------------------------------------
// Este script hace que apareza la opción de reiniciar el experimento
// cuando no se ve ningun bloque en pantalla
// El botón reiniciar hace que todos los bloques cuánticos reinicien
// con un estado aleatorio
// ----------------------------------------------------------------

function contarBloquesVisibles(arBloques) {
  return arBloques.reduce((cantidad, arBloque) => {
    return arBloque.enEscena ? cantidad + 1 : cantidad;
  }, 0);
}

function decidirSiAmbasCartasEstanDandoLaCara(arBloques) {
  return arBloques
    .filter((arBloque) => arBloque.enEscena === true)
    .every((arBloque) => arBloque.id < 3);
}

function decidirSiAmbasCartasEstanDandoLaContraCara(arBloques) {
  return arBloques
    .filter((arBloque) => arBloque.enEscena === true)
    .every((arBloque) => arBloque.id >= 3);
}
//----------------------------------------------------------------
// Cuando se detectan los bloques
//----------------------------------------------------------------

escena.addEventListener("targetFound", (event) => {
  if (contarBloquesVisibles(arBloques) === 2) {
    if (
      decidirSiAmbasCartasEstanDandoLaCara(arBloques) ||
      decidirSiAmbasCartasEstanDandoLaContraCara(arBloques)
    )
      uiParaEntrelazarBloques.classList.remove("noVisible");
  }
});

//----------------------------------------------------------------
// Cuando se pierde algun bloque
//----------------------------------------------------------------
escena.addEventListener("targetLost", (event) => {
  uiParaEntrelazarBloques.classList.add("noVisible");
});

//----------------------------------------------------------------
// Cuando se presiona el boton entrelazarBloquesDetectados
//----------------------------------------------------------------
function entrelazarBloquesDetectados() {
  const idArBloquesParaCaraNoVisibles = arBloques
    .filter((arBloques) => !arBloques.enEscena && arBloques.id < 3)
    .map((arBloques) => arBloques.id);
  const idArBloquesParaContraCaraNoVisibles = arBloques
    .filter((arBloques) => !arBloques.enEscena && arBloques.id >= 3)
    .map((arBloques) => arBloques.id);

  // aquel array que tenga solo un elemento corresponde con el observable de los bloques visibles
  if (idArBloquesParaCaraNoVisibles.length === 1)
    bloquesCuanticos.establecerEstado(
      entrelazarEnEstadoDeBell(arBloques[idArBloquesParaCaraNoVisibles[0]])
    );
  if (idArBloquesParaContraCaraNoVisibles.length === 1) {
    bloquesCuanticos.establecerEstado(
      entrelazarEnEstadoDeBell(
        arBloques[idArBloquesParaContraCaraNoVisibles[0]]
      )
    );
  }
  arBloques.forEach((arBloque) =>
    arBloque.a_figura.setAttribute("color", "grey")
  );
}
