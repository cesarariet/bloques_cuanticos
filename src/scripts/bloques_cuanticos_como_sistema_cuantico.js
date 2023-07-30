//----------------------------------------------------------------
// Logica de los observables cuánticos.
// Observables, se definen en la base canónica E
//----------------------------------------------------------------

import { sqrt, identity } from "mathjs";
import Observable from "./observadores";
import BloqueCuantico from "./bloqueCuantico";
import ARBloqueCuantico from "./arBLoqueCuantico";

//----------------------------------------------------------------
// Observable del sistema cuántico
//----------------------------------------------------------------
// Para tres partículas
// Base   autovalores para cada bloque (1,2,3)
// 000     1  1  1
// 001     1  1 -1
// 010     1 -1  1
// 011     1 -1 -1
// 100    -1  1  1
// 101    -1  1 -1
// 110    -1 -1  1
// 111    -1 -1 -1

const baseE = identity(8)._data;

const caraParaBloque1 = new Observable([1, 1, 1, 1, -1, -1, -1, -1], baseE);

const caraParaBloque2 = new Observable(
  [1, 1, 1, 1, -1, -1, -1, -1],
  [
    [1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1],
  ]
);

const caraParaBloque3 = new Observable(
  [1, 1, 1, 1, -1, -1, -1, -1],
  [
    [1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1],
  ]
);

const a = sqrt(8) / 8;

const contraCaraParaBloque1 = new Observable(
  [1, 1, 1, 1, -1, -1, -1, -1],
  [
    [a, a, a, a, a, a, a, a],
    [-a, a, -a, a, -a, a, -a, a],
    [-a, -a, a, a, -a, -a, a, a],
    [a, -a, -a, a, a, -a, a, -a],
    [-a, -a, -a, -a, a, a, a, a],
    [a, -a, a, -a, -a, a, -a, a],
    [a, a, -a, -a, -a, -a, a, a],
    [-a, a, a, -a, a, -a, -a, a],
  ]
);

const contraCaraParaBloque2 = new Observable(
  [1, 1, 1, 1, -1, -1, -1, -1],
  [
    [a, a, a, a, a, a, a, a],
    [-a, a, -a, a, -a, a, -a, a],
    [-a, -a, -a, -a, a, a, a, a],
    [a, -a, a, -a, -a, a, -a, a],
    [-a, -a, a, a, -a, -a, a, a],
    [a, -a, -a, a, a, -a, a, -a],
    [a, a, -a, -a, -a, -a, a, a],
    [-a, a, a, -a, a, -a, -a, a],
  ]
);

const contraCaraParaBloque3 = new Observable(
  [1, 1, 1, 1, -1, -1, -1, -1],
  [
    [a, a, a, a, a, a, a, a],
    [-a, -a, a, a, -a, -a, a, a],
    [-a, -a, -a, -a, a, a, a, a],
    [a, a, -a, -a, -a, -a, a, a],
    [-a, a, -a, a, -a, a, -a, a],
    [a, -a, -a, a, a, -a, a, -a],
    [a, -a, a, -a, -a, a, -a, a],
    [-a, a, a, -a, a, -a, -a, a],
  ]
);

//----------------------------------------------------------------
// Creación de estado inicial, en la base canónica pero aleatoreamente!
//----------------------------------------------------------------
export const bloquesCuanticos = new BloqueCuantico(0);

export function crearArBloques() {
  // esto es para poder crear los bloques luego de que se halla renderizado la página... sino hay algunos métodos que no puede operar sobre la misma
  const arBloques = [
    new ARBloqueCuantico(0, bloquesCuanticos, caraParaBloque1),
    new ARBloqueCuantico(1, bloquesCuanticos, caraParaBloque2),
    new ARBloqueCuantico(2, bloquesCuanticos, caraParaBloque3),
    new ARBloqueCuantico(3, bloquesCuanticos, contraCaraParaBloque1),
    new ARBloqueCuantico(4, bloquesCuanticos, contraCaraParaBloque2),
    new ARBloqueCuantico(5, bloquesCuanticos, contraCaraParaBloque3),
  ];

  //----------------------------------------------------------------
  // Detección de target en camara
  //----------------------------------------------------------------

  const a_escena = document.getElementById("escena");

  a_escena.addEventListener("targetFound", (event) => {
    // identificación del target en pantalla
    const idTarget =
      event.target.components["mindar-image-target"].attrValue.targetIndex
    // Indica que se detecto el bloque
    arBloques[idTarget].enEscena = true;

    // medición y colapso del estado cuántico
    arBloques[idTarget].detectado();

  });

  a_escena.addEventListener("targetLost", (event) => {
    // identificación del target en pantalla
    const idTarget =
      event.target.components["mindar-image-target"].attrValue.targetIndex
    arBloques[idTarget].enEscena = false;
    console.log("Se perdió el target ", idTarget);
  });

  return arBloques;
}


