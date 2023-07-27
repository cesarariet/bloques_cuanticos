//----------------------------------------------------------------
// Logica de los observables cuánticos.
// Observables, se definen en la base canónica E
//----------------------------------------------------------------
function Observable(autovalores, autovectores) {
  // autovalores es un array con los autovalores ordenados según la base de autovectores
  // autovectores es un array de arrays donde cada array es uno de loa autovectores.
  // B = base de autovectores
  // E = base canónica

  this.autovalores = autovalores;
  this.autovectores = autovectores;
  this.dimension = autovalores.length;
  this.matrizCambioDeBaseBE = math.transpose(autovectores);
  this.matrizCambioDeBaseEB = math.inv(this.matrizCambioDeBaseBE);
  this.operadorEnBaseB = math.diag(autovalores);
  this.operadorEnBaseE = math.multiply(
    this.matrizCambioDeBaseBE,
    this.operadorEnBaseB,
    this.matrizCambioDeBaseEB
  );

  // Pasar el estado en Base E a base B
  this.cambioCoordenadasEB = (estadoEnBaseE) => {
    // estado debe ser un array con el estado en base canónica.
    const estadoEnBaseB = math.multiply(
      this.matrizCambioDeBaseEB,
      estadoEnBaseE
    );
    return estadoEnBaseB;
  };

  this.cambioCoordenadasBE = (estadoEnBaseB) => {
    // estado debe ser un array con el estado en base canónica.
    const estadoEnBaseE = math.multiply(
      this.matrizCambioDeBaseBE,
      estadoEnBaseB
    );
    return estadoEnBaseE;
  };

  // metodo para producir el colapso del estado cuantico frente a una observación
  this.medirYColapsar = (estadoEnBaseE) => {
    // estado debe ser un array con el estado en base canónica.
    var estadoEnBaseB = this.cambioCoordenadasEB(estadoEnBaseE);
    // calculo de probabilidades de que el sistema colapse en los autoestados del observable
    const probabilidades = math.map(estadoEnBaseB, (item) => item * item);
    const acumulacionProbabilidades = math.cumsum(probabilidades);
    const indice = darIndiceAleatorioConPesos(acumulacionProbabilidades);
    const valorMedido = this.autovalores[indice];
    //Proyección del estado en el subespacio de la medida de colapso.
    // Solo sirve para dos estados y que la base este separada en sus dos autoespacios
    console.log(
      "con un indice ",
      indice,
      " del estado a colapsar en",
      estadoEnBaseB
    );
    const ceros = math.zeros(this.dimension / 2)._data;
    if (this.dimension / 2 > indice) {
      estadoEnBaseB.splice(this.dimension / 2, this.dimension, ...ceros);
    } else {
      estadoEnBaseB.splice(0, this.dimension / 2, ...ceros);
    }

    estadoEnBaseB = math.divide(estadoEnBaseB, math.norm(estadoEnBaseB));
    const estadoColapsadoEnBaseE = this.cambioCoordenadasBE(estadoEnBaseB);

    return { valorMedido, estadoColapsado: estadoColapsadoEnBaseE };
  };
}

function darIndiceAleatorioConPesos(acumulacionProbabilidades) {
  const aleatorio = math.random();
  return acumulacionProbabilidades.reduce((indice, valor) => {
    if (valor > aleatorio) return indice;
    return indice + 1;
  }, 0);
}

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

const baseE = math.identity(8)._data;

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

const a = math.sqrt(8) / 8;

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
// Simetrizadores para producir estados de Bell
//----------------------------------------------------------------

function entrelazarEnEstadoDeBell(arBloque) {
  //Solo sirve para tres bloques cuánticos
  // estos simetrico y antisimetro para igual colapsar en los mismos estados en ambos bloques

  const simetrizardorEnBaseB = [
    [1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1],
  ];

  function simetrizar(arBloque, simetrizardorEnBaseB) {
    const estadoEnBaseE = arBloque.bloqueCuantico.estado;
    const observable = arBloque.observable;
    var estadoSimetrizado = math.multiply(
      observable.matrizCambioDeBaseBE,
      simetrizardorEnBaseB,
      observable.matrizCambioDeBaseEB,
      estadoEnBaseE
    );
    console.log("el estado salido del simetrizador es ", estadoSimetrizado);
    return estadoSimetrizado;
  }
  var estadoSimetrizado = simetrizar(arBloque, simetrizardorEnBaseB);

  //normalizar el estado
  estadoSimetrizado = math.divide(
    estadoSimetrizado,
    math.norm(estadoSimetrizado)
  );
  return estadoSimetrizado;
}

//----------------------------------------------------------------
// Logíca de los bloques cuánticos
//----------------------------------------------------------------

function BloqueCuantico(id, estadoInidical) {
  this.id = id;
  this.establecerEstado = (estado) => {
    this.estado = estado || baseE[math.randomInt(8)];
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

function ARBloqueCuantico(id, idCarta, bloqueCuantico, observable) {
  const a_escena = document.getElementById("escena");
  const target0 = document.getElementById("targetModelo");
  this.id = id;
  this.idCarta = idCarta;
  this.bloqueCuantico = bloqueCuantico;
  this.observable = observable;
  this.ARbloque = target0.cloneNode(true);
  this.ARbloque.setAttribute("id", `target${id}`);
  this.ARbloque.setAttribute("mindar-image-target", `targetIndex: ${id}`);
  this.enEscena = false;

  id % 2
    ? this.ARbloque.children[0].remove()
    : this.ARbloque.children[1].remove();
  this.a_figura = this.ARbloque.children[0];

  a_escena.appendChild(this.ARbloque);

  this.detectado = () => {
    valorMedido = bloqueCuantico.medirYColapsar(observable);

    switch (valorMedido) {
      case 1:
        this.a_figura.setAttribute("color", "red");
        break;
      case -1:
        this.a_figura.setAttribute("color", "blue");
        break;
    }
  };
}
//----------------------------------------------------------------
// Creación de estado inicial, en la base canónica pero aleatoreamente!
//----------------------------------------------------------------
const bloquesCuanticos = new BloqueCuantico(0);

const arBloques = [
  new ARBloqueCuantico(0, 0, bloquesCuanticos, caraParaBloque1),
  new ARBloqueCuantico(1, 0, bloquesCuanticos, contraCaraParaBloque1),
  new ARBloqueCuantico(2, 1, bloquesCuanticos, caraParaBloque2),
  new ARBloqueCuantico(3, 1, bloquesCuanticos, contraCaraParaBloque2),
  new ARBloqueCuantico(4, 2, bloquesCuanticos, caraParaBloque3),
  new ARBloqueCuantico(5, 2, bloquesCuanticos, contraCaraParaBloque3),
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

  console.log(
    "estado en base ",
    idTarget,
    " es: ",
    arBloques[idTarget].observable.cambioCoordenadasEB(bloquesCuanticos.estado)
  );
});

a_escena.addEventListener("targetLost", (event) => {
  // identificación del target en pantalla
  idTarget =
    event.target.components["mindar-image-target"].attrValue.targetIndex;
  arBloques[idTarget].enEscena = false;
  console.log("Se perdió el target ", idTarget);
});
