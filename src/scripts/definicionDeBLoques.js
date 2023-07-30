import { sqrt } from "mathjs";
import Observable from "./observadores";
import BloqueCuantico from "./bloqueCuantico";
import ARBloqueCuantico from "./arBLoqueCuantico";
//----------------------------------------------------------------
// Bloques cuánticos
//----------------------------------------------------------------

const cara = new Observable(
  [1, -1],
  [
    [1, 0],
    [0, 1],
  ]
);

const aa = sqrt(2) / 2;
const contraCara = new Observable(
  [1, -1],
  [
    [aa, aa],
    [-aa, aa],
  ]
);

//----------------------------------------------------------------
// Creación de estado inicial, en la base canónica pero aleatoreamente!
//----------------------------------------------------------------
export const bloquesCuanticos = [
  new BloqueCuantico(0),
  new BloqueCuantico(1),
  new BloqueCuantico(2),
];

export function crearArBloques() {
  // los bloques se deben crear después de cargado el dom.
  const arBloques = [
    new ARBloqueCuantico(0, bloquesCuanticos[0], cara),
    new ARBloqueCuantico(1, bloquesCuanticos[1], cara),
    new ARBloqueCuantico(2, bloquesCuanticos[2], cara),
    new ARBloqueCuantico(3, bloquesCuanticos[0], contraCara),
    new ARBloqueCuantico(4, bloquesCuanticos[1], contraCara),
    new ARBloqueCuantico(5, bloquesCuanticos[2], contraCara),
  ];
  // window.arBloques = arBloques; //para que la variable sea accesible globalmente
  //----------------------------------------------------------------
  // Detección de target en camara
  //----------------------------------------------------------------
  const a_escena = document.getElementById("escena");
  a_escena.addEventListener("targetFound", (event) => {
    // identificación del target en pantalla
    const idTarget =
      event.target.components["mindar-image-target"].data.targetIndex;
    // Indica que se detecto el bloque
    arBloques[idTarget].enEscena = true;

    // medición y colapso del estado cuántico
    arBloques[idTarget].detectado();
  });

  a_escena.addEventListener("targetLost", (event) => {
    // identificación del target en pantalla
    const idTarget =
      event.target.components["mindar-image-target"].data.targetIndex;
    arBloques[idTarget].enEscena = false;
    console.log("Se perdió el target ", idTarget);
  });

  return arBloques;
}
