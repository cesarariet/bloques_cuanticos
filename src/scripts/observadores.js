// Logica de los observables cuánticos.
// Observables, se definen en la base canónica E
import {
  transpose,
  inv,
  diag,
  multiply,
  divide,
  cumsum,
  map,
  norm,
  random,
  zeros
} from "mathjs";

export default function Observable(autovalores, autovectores) {
  // autovalores es un array con los autovalores ordenados según la base de autovectores
  // autovectores es un array de arrays donde cada array es uno de loa autovectores.
  // B = base de autovectores
  // E = base canónica

  this.autovalores = autovalores;
  this.autovectores = autovectores;
  this.dimension = autovalores.length;
  this.matrizCambioDeBaseBE = transpose(autovectores);
  this.matrizCambioDeBaseEB = inv(this.matrizCambioDeBaseBE);
  this.operadorEnBaseB = diag(autovalores);
  this.operadorEnBaseE = multiply(
    this.matrizCambioDeBaseBE,
    this.operadorEnBaseB,
    this.matrizCambioDeBaseEB
  );

  // Pasar el estado en Base E a base B
  this.cambioCoordenadasEB = (estadoEnBaseE) => {
    // estado debe ser un array con el estado en base canónica.
    const estadoEnBaseB = multiply(
      this.matrizCambioDeBaseEB,
      estadoEnBaseE
    );
    return estadoEnBaseB;
  };

  this.cambioCoordenadasBE = (estadoEnBaseB) => {
    // estado debe ser un array con el estado en base B.
    const estadoEnBaseE = multiply(
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
    const probabilidades = map(estadoEnBaseB, (item) => item * item);
    const acumulacionProbabilidades = cumsum(probabilidades);
    const indice = darIndiceAleatorioConPesos(acumulacionProbabilidades);
    const valorMedido = this.autovalores[indice];
    //Proyección del estado en el subespacio de la medida de colapso.
    // Solo sirve para dos estados y que la base este separada en sus dos autoespacios
    const ceros = zeros(this.dimension / 2)._data;
    if (indice < (this.dimension / 2)) {
      estadoEnBaseB.splice(this.dimension / 2, this.dimension, ...ceros);
    } else if (indice < this.dimension) {
      estadoEnBaseB.splice(0, this.dimension / 2, ...ceros);
    } else {
      console.error("La elección de indice de colapso esta fuera de las dimensiones permitidas")
    }
    // normalización después de la proyección
    const estadoEnBaseBNormalizado = divide(estadoEnBaseB, norm(estadoEnBaseB));

    console.log(
      "con un indice ",
      indice,
      " del estado a colapsar en base B es",
      estadoEnBaseBNormalizado
    )
    const estadoColapsadoEnBaseE = this.cambioCoordenadasBE(estadoEnBaseBNormalizado);

    return { valorMedido, estadoColapsado: estadoColapsadoEnBaseE };
  };
}


function darIndiceAleatorioConPesos(acumulacionProbabilidades) {
  const aleatorio = random();
  return acumulacionProbabilidades.reduce((indice, valor) => {
    if (valor > aleatorio) return indice;
    if (valor > 0.999) return indice; // para darle cierta tolerancia al cálculo numérico
    return indice + 1;
  }, 0);
}
