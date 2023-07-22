// probabilidad por defecto, que viene del hash de dirección url
var probabilidad_roja = parseInt(window.location.hash.slice(1) || "50") / 100;
console.log(
  "El estado del sistema contiene una probabilidad de salir rojo en la primera medición de ",
  probabilidad_roja
);
var a_escena = document.getElementById("escena");
var estado = [false, false, false, false, false, false]; //estado inicial, ninguna cara medida.
var cara_presente = null;
var cara_opuesta_presente = null;
var elemento = null;
var texto_elemento = null;

function prepararEstado() {
  // solo funciona si hay un target en pantalla!
  if (cara_presente === null)
    return console.log("no se encontró ningún target");
  // obteniendo la elección de experimento
  let estado_elegido =
    parseInt(document.getElementById("experimento").value) / 100;
  probabilidad_roja = estado_elegido;
  estado[cara_presente] = false;
  estado[cara_opuesta_presente] = false;
  elemento.setAttribute("color", "gray");
  texto_elemento.setAttribute(
    "value",
    "Estado preparado, \n retirar el bloque y \n volver para medir."
  );
}
// Revisión de medición y cambio de estado.
a_escena.addEventListener("targetFound", (event) => {
  // mostrar el divParaPrepararEstado
  document.getElementById("divParaPrepararEstado").style.display = "block";
  cara_presente =
    event.target.components["mindar-image-target"].attrValue.targetIndex;
  cara_opuesta_presente = (parseInt(cara_presente) + 3) % 6;
  elemento = document.getElementById(`e${cara_presente}`);
  texto_elemento = document.getElementById(`et${cara_presente}`);
  console.log(
    "Se muestra la imagen ",
    cara_presente,
    " y la cara opesta es ",
    cara_opuesta_presente
  );
  if (
    estado[cara_presente] === false &&
    estado[cara_opuesta_presente] === true
  ) {
    let color_elegido = Math.random() <= 0.5 ? "red" : "blue";
    console.log("cambio de color por ", color_elegido, ". mediciones ", estado);
    elemento.setAttribute("color", color_elegido);
    texto_elemento.setAttribute("value", " ");
    estado[cara_presente] = true;
    estado[cara_opuesta_presente] = false;
    console.log("cambio de color, mediciones ", estado);
  } else if (
    estado[cara_presente] === false &&
    estado[cara_opuesta_presente] === false
  ) {
    // esta caso corresponde con la primera medición y se prepara el estado para eso.
    console.log("primera medición de la cara", cara_presente);
    color_elegido = Math.random() <= probabilidad_roja ? "red" : "blue";
    elemento.setAttribute("color", color_elegido);
    texto_elemento.setAttribute("value", "Primera medida \nde este bloque");
    estado[cara_presente] = true;
    estado[cara_opuesta_presente] = false;
    console.log("cambio de color, mediciones ", estado);
  } else if (
    estado[cara_presente] === true &&
    estado[cara_opuesta_presente] == false
  ) {
    texto_elemento.setAttribute("value", " ");
  }
});
a_escena.addEventListener("targetLost", (event) => {
  document.getElementById("divParaPrepararEstado").style.display = "none";
  cara_presente = null;
  cara_opuesta_presente = null;
  elemento = null;
  texto_elemento = null;
});
