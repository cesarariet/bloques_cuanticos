// ----------------------------------------------------------------
// Este script hace que apareza la opción de reiniciar el experimento
// cuando no se ve ningun bloque en pantalla
// El botón reiniciar hace que todos los bloques cuánticos reinicien
// con un estado aleatorio
// ----------------------------------------------------------------

import '../scripts/bloques_cuanticos_como_sistema_cuantico'
import { crearArBloques, bloquesCuanticos } from '../scripts/bloques_cuanticos_como_sistema_cuantico';
import { entrelazarEnEstadoDeBell } from '../scripts/armarEstadoDeBell';
import { comenzarMensajeria } from '../scripts/mesajeria';

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

// Crear los bloques de realidad aumentada despues de rederizada la página.

document.addEventListener("DOMContentLoaded", () => {
  const arBloques = crearArBloques();
  const escena = document.getElementById("escena")
  const uiParaEntrelazarBloques = document.getElementById("uiParaEntrelazarBloques")

  const mensajeria = comenzarMensajeria(escena, bloquesCuanticos, arBloques)

  //----------------------------------------------------------------
  // Cuando se detectan los bloques
  //----------------------------------------------------------------

  escena.addEventListener("targetFound", () => {
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
  escena.addEventListener("targetLost", () => {
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
      arBloque.a_figure.setAttribute("color", "grey")
    );
    mensajeria.enviarEstado({
      estado: bloquesCuanticos.estado,
      colores: arBloques.map((arBloque) =>
        arBloque.a_figure.getAttribute("color")
      ),
    });
  }
  window.entrelazarBloquesDetectados = entrelazarBloquesDetectados

})
