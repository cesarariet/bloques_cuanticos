// ----------------------------------------------------------------
// Este script hace que apareza la opción de reiniciar el experimento
// cuando no se ve ningun bloque en pantalla
// El botón reiniciar hace que todos los bloques cuánticos reinicien
// con un estado aleatorio

import "../scripts/definicionDeBLoques.js";
import { bloquesCuanticos } from "../scripts/definicionDeBLoques.js";
import { crearArBloques } from "../scripts/definicionDeBLoques.js";

document.addEventListener("DOMContentLoaded", () => {
  const escena = document.getElementById("escena");
  crearArBloques();

  const uiParaReiniciar = document.getElementById("uiParaReiniciar");

  escena.addEventListener("targetFound", () => {
    uiParaReiniciar.classList.add("noVisible");
  });

  escena.addEventListener("targetLost", () => {
    uiParaReiniciar.classList.remove("noVisible");
  });
});

function reiniciarEstados() {
  bloquesCuanticos.forEach((bloque) => bloque.establecerEstado());
  uiParaReiniciar.classList.add("noVisible");
}
window.reiniciarEstados = reiniciarEstados;
