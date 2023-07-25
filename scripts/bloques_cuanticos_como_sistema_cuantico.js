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
    const indice = darIndiceAleatorioConPesos(acumulacionProbabilidades._data);
    const valorMedido = this.autovalores[indice];
    //Proyección del estado en el subespacio de la medida de colapso.
    // Solo sirve para dos estados y que la base este separada en sus dos autoespacios
    const ceros = math.zeros(this.dimension / 2)._data;
    if (this.dimension / 2 > indice) {
      estadoEnBaseB._data.splice(this.dimension / 2, this.dimension, ...ceros);
    } else {
      estadoEnBaseB._data.splice(0, this.dimension / 2, ...ceros);
    }

    estadoEnBaseB = math.multiply(estadoEnBaseB, 1 / math.norm(estadoEnBaseB));
    const estadoColapsadoEnBaseE =
      this.cambioCoordenadasBE(estadoEnBaseB)._data;

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

const aa = math.sqrt(2) / 2;

const contraCaraParaBloque1 = new Observable(
  [1, 1, 1, 1, -1, -1, -1, -1],
  [
    [aa, 0, 0, 0, aa, 0, 0, 0],
    [0, aa, 0, 0, 0, aa, 0, 0],
    [0, 0, aa, 0, 0, 0, aa, 0],
    [0, 0, 0, aa, 0, 0, 0, aa],
    [-aa, 0, 0, 0, aa, 0, 0, 0],
    [0, -aa, 0, 0, 0, aa, 0, 0],
    [0, 0, -aa, 0, 0, 0, aa, 0],
    [0, 0, 0, -aa, 0, 0, 0, aa],
  ]
);

const contraCaraParaBloque2 = new Observable(
  [1, 1, 1, 1, -1, -1, -1, -1],
  [
    [aa, 0, aa, 0, 0, 0, 0, 0],
    [0, aa, 0, aa, 0, 0, 0, 0],
    [0, 0, 0, 0, aa, 0, aa, 0],
    [0, 0, 0, 0, 0, aa, 0, aa],
    [-aa, 0, aa, 0, 0, 0, 0, 0],
    [0, -aa, 0, aa, 0, 0, 0, 0],
    [0, 0, 0, 0, -aa, 0, aa, 0],
    [0, 0, 0, 0, 0, -aa, 0, aa],
  ]
);

const contraCaraParaBloque3 = new Observable(
  [1, 1, 1, 1, -1, -1, -1, -1],
  [
    [aa, aa, 0, 0, 0, 0, 0, 0],
    [0, 0, aa, aa, 0, 0, 0, 0],
    [0, 0, 0, 0, aa, aa, 0, 0],
    [0, 0, 0, 0, 0, 0, aa, aa],
    [-aa, aa, 0, 0, 0, 0, 0, 0],
    [0, 0, -aa, aa, 0, 0, 0, 0],
    [0, 0, 0, 0, -aa, aa, 0, 0],
    [0, 0, 0, 0, 0, 0, -aa, aa],
  ]
);

//----------------------------------------------------------------
// Simetrizadores para producir estados de Bell
//----------------------------------------------------------------

function entrelazarEnEstadoDeBell(idCartaLibre, estadoAsimetrizar) {
  //Solo sirve para tres bloques cuánticos
  // estos simetrico y antisimetro para igual colapsar en los mismos estados en ambos bloques
  const simetrizardorParaBloque2Libre = [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
  ];

  const simetrizardorParaBloque1Libre = [
    [1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1],
  ];

  const simetrizardorParaBloque0Libre = [
    [1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1],
  ];

  function simetrizar(operadorSimetrizador, estadoAsimetrizar) {
    var estadoSimetrizado = math.multiply(
      operadorSimetrizador,
      estadoAsimetrizar
    );
    console.log("el estado salido del simetrizador es ", estadoSimetrizado);
    return estadoSimetrizado;
  }

  var estadoSimetrizado = bloquesCuanticos.estado;
  console.log("la carta libre es ", idCartaLibre);
  if (idCartaLibre === 0) {
    estadoSimetrizado = simetrizar(
      simetrizardorParaBloque0Libre,
      estadoAsimetrizar
    );
  } else if (idCartaLibre === 1) {
    estadoSimetrizado = simetrizar(
      simetrizardorParaBloque1Libre,
      estadoAsimetrizar
    );
  } else if (idCartaLibre === 2) {
    estadoSimetrizado = simetrizar(
      simetrizardorParaBloque2Libre,
      estadoAsimetrizar
    );
  }
  //normalizar el estado
  estadoSimetrizado = math.divide(
    estadoSimetrizado,
    math.norm(estadoSimetrizado)
  );
  console.log(estadoSimetrizado);
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
  this.idCarta = idCarta;
  this.bloqueCuantico = bloqueCuantico;
  this.observable = observable;
  this.ARbloque = target0.cloneNode(true);
  this.ARbloque.setAttribute("id", `target${id}`);
  this.ARbloque.setAttribute("mindar-image-target", `targetIndex: ${id}`);
  this.a_text = this.ARbloque.children[0];
  this.enEscena = false;

  id < 3
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

// const bloquesCuanticos = [
//   new BloqueCuantico(0),
//   new BloqueCuantico(1),
//   new BloqueCuantico(2),
// ];

const bloquesCuanticos = new BloqueCuantico(0);

const arBloques = [
  new ARBloqueCuantico(0, 0, bloquesCuanticos, caraParaBloque1),
  new ARBloqueCuantico(1, 1, bloquesCuanticos, caraParaBloque2),
  new ARBloqueCuantico(2, 2, bloquesCuanticos, caraParaBloque3),
  new ARBloqueCuantico(3, 0, bloquesCuanticos, contraCaraParaBloque1),
  new ARBloqueCuantico(4, 1, bloquesCuanticos, contraCaraParaBloque2),
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
});

a_escena.addEventListener("targetLost", (event) => {
  // identificación del target en pantalla
  idTarget =
    event.target.components["mindar-image-target"].attrValue.targetIndex;
  arBloques[idTarget].enEscena = false;
  console.log("Se perdió el target ", idTarget);
});
