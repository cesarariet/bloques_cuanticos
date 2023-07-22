// Logica de los observables cuánticos.
// Observables, se definen en la base canónica E
function Observable(autovalores, autovectores) {
  // autovalores es un array con los autovalores ordenados según la base de autovectores
  // autovectores es un array de arrays donde cada array es uno de loa autovectores.
  // B = base de autovectores
  // E = base canónica

  this.autovalores = autovalores;
  this.autovectores = autovectores;
  this.dimension = autovalores.length;
  this.matrizCambioDeBaseBE = math.transpose(math.matrix(autovectores));
  this.matrizCambioDeBaseEB = math.inv(this.matrizCambioDeBaseBE);
  this.operadorEnBaseB = math.diag(autovalores);
  this.operadorEnBaseE = math.multiply(
    this.matrizCambioDeBaseEB,
    this.operadorEnBaseB,
    this.matrizCambioDeBaseBE
  );

  // Pasar el estado en Base E a base B
  this.cambioCoordenadasEB = (estadoEnBaseE) => {
    // estado debe ser un array con el estado en base canónica.
    const estadoEnBaseB = math.multiply(
      this.matrizCambioDeBaseEB,
      math.matrix(estadoEnBaseE)
    );
    return estadoEnBaseB;
  };

  this.cambioCoordenadasBE = (estadoEnBaseB) => {
    // estado debe ser un array con el estado en base canónica.
    const estadoEnBaseE = math.multiply(
      this.matrizCambioDeBaseBE,
      math.matrix(estadoEnBaseB)
    );
    return estadoEnBaseE;
  };

  // metodo para producir el colapso del estado cuantico frente a una observación
  this.medirYColapsar = (estadoEnBaseE) => {
    // estado debe ser un array con el estado en base canónica.
    const estadoEnBaseB = this.cambioCoordenadasEB(estadoEnBaseE);
    // calculo de probabilidades de que el sistema colapse en los autoestados del observable
    const probabilidades = math.map(estadoEnBaseB, (item) => item * item);
    const acumulacionProbabilidades = math.cumsum(probabilidades);
    const indice = darIndiceAleatorioConPesos(acumulacionProbabilidades._data);
    console.log("el indice es ", indice);
    const valorMedido = this.autovalores[indice];
    const estadoColapsado = this.autovectores[indice];
    // // Valor medido al colapsar el estado
    // const valorMedido = math.pickRandom(this.autovalores, probabilidades);
    // const estadoColapsado =
    //   this.autovectores[this.autovalores.indexOf(valorMedido)];

    return { valorMedido, estadoColapsado };
  };
}

function darIndiceAleatorioConPesos(acumulacionProbabilidades) {
  console.log("Acumulación de proba ", acumulacionProbabilidades);
  const aleatorio = math.random();
  return acumulacionProbabilidades.reduce((indice, valor) => {
    console.log(
      "valor: ",
      valor,
      "para comparar con el aleatorior: ",
      aleatorio
    );
    if (valor > aleatorio) return indice;
    return indice + 1;
  }, 0);
}

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

const aa = math.sqrt(2) / 2;
const contraCara = new Observable(
  [1, -1],
  [
    [aa, aa],
    [-aa, aa],
  ]
);

// Logíca de los bloques cuánticos

function BloqueCuantico(id, estadoInidical) {
  this.id = id;
  this.establecerEstado = (estado) => {
    this.estado =
      estado ||
      [
        [1, 0],
        [0, 1],
      ][math.pickRandom([0, 1])];
    this.fueMedido = false;
    this.informacion = `Bloque ${id} creado en estado [${this.estado}]`;
    console.log(this.informacion);
  };
  this.establecerEstado(estadoInidical);

  this.medirYColapsar = (observable) => {
    // Este método produce el colapso del estado cuántico en algún autoestado del observable, cambia el estado del bloque y devuelve un objeto con la información de la medición
    const medirYColapsar = observable.medirYColapsar(this.estado);
    this.estado = medirYColapsar.estadoColapsado;
    this.fueMedido = true;
    this.informacion = `Estado colapsado en [${this.estado}]`;
    console.log(this.informacion);
    return medirYColapsar.valorMedido;
  };
}
//----------------------------------------------------------------
// Visualización de los bloques cuánticos
//----------------------------------------------------------------

function ARBloqueCuantico(id, bloqueCuantico, observable) {
  const a_escena = document.getElementById("escena");
  const target0 = document.getElementById("targetModelo");
  this.bloqueCuantico = bloqueCuantico;
  this.observable = observable;
  this.ARbloque = target0.cloneNode(true);
  this.ARbloque.setAttribute("id", `target${id}`);
  this.ARbloque.setAttribute("mindar-image-target", `targetIndex: ${id}`);
  this.a_text = this.ARbloque.children[0];
  this.enEscena = false;

  id % 2
    ? this.ARbloque.children[1].remove()
    : this.ARbloque.children[2].remove();
  this.a_figura = this.ARbloque.children[1];

  a_escena.appendChild(this.ARbloque);

  this.detectado = () => {
    bloqueCuantico.fueMedido
      ? this.a_text.setAttribute("value", " ")
      : this.a_text.setAttribute("value", "Medido por \nprimera vez.");

    valorMedido = bloqueCuantico.medirYColapsar(observable);

    switch (valorMedido) {
      case 1:
        this.a_figura.setAttribute("color", "red");
        console.log(
          "AR: color red por medición ",
          valorMedido,
          " para el bloque cuántico ",
          bloqueCuantico.id
        );
        break;
      case -1:
        this.a_figura.setAttribute("color", "blue");
        console.log(
          "AR: color blue por medición ",
          valorMedido,
          " para el bloque cuántico ",
          bloqueCuantico.id
        );
        break;
    }
  };
}
//----------------------------------------------------------------
// Creación de estado inicial, en la base canónica pero aleatoreamente!
//----------------------------------------------------------------

const bloquesCuanticos = [
  new BloqueCuantico(0),
  new BloqueCuantico(1),
  new BloqueCuantico(2),
];

const arBloques = [
  new ARBloqueCuantico(0, bloquesCuanticos[0], cara),
  new ARBloqueCuantico(1, bloquesCuanticos[1], cara),
  new ARBloqueCuantico(2, bloquesCuanticos[2], cara),
  new ARBloqueCuantico(3, bloquesCuanticos[0], contraCara),
  new ARBloqueCuantico(4, bloquesCuanticos[1], contraCara),
  new ARBloqueCuantico(5, bloquesCuanticos[2], contraCara),
];

//----------------------------------------------------------------
// Detección de target en camara
//----------------------------------------------------------------

const a_escena = document.getElementById("escena");

a_escena.addEventListener("targetFound", (event) => {
  // identificación del target en pantalla
  idTarget =
    event.target.components["mindar-image-target"].attrValue.targetIndex;

  // Indica que se detecto el bloque
  arBloques[idTarget].enEscena = true;

  // medición y colapso del estado cuántico
  arBloques[idTarget].detectado();
});

a_escena.addEventListener("targetLost", (event) => {
  // identificación del target en pantalla
  idTarget =
    event.target.components["mindar-image-target"].attrValue.targetIndex;
  arBloques[idTarget].enEscena = false;
  console.log("Se perdió el target ", idTarget);
});
