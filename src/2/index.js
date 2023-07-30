// ----------------------------------------------------------------
// Este script hace que apareza la opción de reiniciar el experimento
// cuando no se ve ningun bloque en pantalla
// El botón reiniciar hace que todos los bloques cuánticos reinicien
// con un estado aleatorio
// ----------------------------------------------------------------
import { sqrt } from "mathjs"
import '../scripts/definiciónDeBloques'
import { crearArBloques } from '../scripts/definiciónDeBloques';

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
    const opcionElegida =
      parseInt(document.getElementById("estadoElegido").value) / 100;
    const estadoEnBaseB = [
      sqrt(opcionElegida),
      sqrt(1 - opcionElegida),
    ];

    const arBloque = arBloques.filter((arBloque) => arBloque.enEscena)[0];

    const bloqueCuantico = arBloque.bloqueCuantico;
    const observable = arBloque.observable;

    bloqueCuantico.establecerEstado(
      observable.cambioCoordenadasBE(estadoEnBaseB)
    );

    arBloque.a_text.setAttribute(
      "value",
      "Estado preparado\nRetirar y volver\npara medir."
    );
    arBloque.a_figure.setAttribute("color", "grey");

    uiParaReiniciar.classList.add("noVisible");
  }
  window.prepararEstado = prepararEstado
})

