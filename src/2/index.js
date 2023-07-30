// ----------------------------------------------------------------
// Este script hace que apareza la opción de reiniciar el experimento
// cuando no se ve ningun bloque en pantalla
// El botón reiniciar hace que todos los bloques cuánticos reinicien
// con un estado aleatorio
// ----------------------------------------------------------------
//import '../scripts/definiciónDeBloques'
//import { crearArBloques } from '../scripts/definiciónDeBloques';
import '../scripts/bloques_cuanticos_como_sistema_cuantico'
import { bloquesCuanticos, crearArBloques } from "../scripts/bloques_cuanticos_como_sistema_cuantico";
import { armarEstadoParaUnBloque } from "../scripts/armarEstadoParaUnBloque";

const escena = document.getElementById("escena");

const uiParaReiniciar = document.getElementById("uiParaReiniciar");

document.addEventListener('DOMContentLoaded', () => {
  const arBloques = crearArBloques();
  escena.addEventListener("targetFound", () => {
    uiParaReiniciar.classList.remove("noVisible");
  });

  escena.addEventListener("targetLost", () => {
    uiParaReiniciar.classList.add("noVisible");
  });

  function prepararEstado() {
    const opcionElegidaEnPorcentaje =
      parseInt(document.getElementById("estadoElegido").value);

    const arBloque = arBloques.filter((arBloque) => arBloque.enEscena)[0];

    bloquesCuanticos.establecerEstado(armarEstadoParaUnBloque(opcionElegidaEnPorcentaje, arBloque))

    arBloque.a_text.setAttribute(
      "value",
      "Estado preparado\nRetirar y volver\npara medir."
    );
    arBloque.a_figure.setAttribute("color", "grey");

    uiParaReiniciar.classList.add("noVisible");
  }
  window.prepararEstado = prepararEstado
})

