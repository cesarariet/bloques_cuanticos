// ----------------------------------------------------------------
// Este script hace que apareza la opción de reiniciar el experimento
// cuando no se ve ningun bloque en pantalla
// El botón reiniciar hace que todos los bloques cuánticos reinicien
// con un estado aleatorio

import "../scripts/bloques_cuanticos_como_sistema_cuantico.js";
import { crearArBloques } from "../scripts/bloques_cuanticos_como_sistema_cuantico.js";

document.addEventListener("DOMContentLoaded", () => {
  const escena = document.getElementById("escena");
  const arBloques = crearArBloques();

  const uiParaReiniciar = document.getElementById("uiParaReiniciar");

  escena.addEventListener("targetFound", () => {
    uiParaReiniciar.classList.add("noVisible");
  });

  escena.addEventListener("targetLost", () => {
    uiParaReiniciar.classList.remove("noVisible");
  });
  function reiniciarEstados() {
    arBloques[0].bloqueCuantico.establecerEstado()
    uiParaReiniciar.classList.add("noVisible");
  }
  window.reiniciarEstados = reiniciarEstados;
});

