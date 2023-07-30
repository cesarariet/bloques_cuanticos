
import { norm, multiply, divide, sqrt, } from "mathjs";

export function armarEstadoParaUnBloque(probabilidadEnPorcentaje, arBloque) {
  //Solo sirve para tres bloques cuánticos
  // estos simetrico y antisimetro para igual colapsar en los mismos estados en ambos bloques

  const a = sqrt(probabilidadEnPorcentaje / 100);
  const b = sqrt(1 - probabilidadEnPorcentaje / 100);

  const matrizDePreparacionEnBaseB = [
    [a, 0, 0, 0, a, 0, 0, 0],
    [0, a, 0, 0, 0, a, 0, 0],
    [0, 0, a, 0, 0, 0, a, 0],
    [0, 0, 0, a, 0, 0, 0, a],
    [b, 0, 0, 0, b, 0, 0, 0],
    [0, b, 0, 0, 0, b, 0, 0],
    [0, 0, b, 0, 0, 0, b, 0],
    [0, 0, 0, b, 0, 0, 0, b],
  ];

  function prepararEstadoDelBloque(arBloque, matrizDePreparacionEnBaseB) {
    const estadoEnBaseE = arBloque.bloqueCuantico.estado;
    const observable = arBloque.observable;
    var estadoPreparadoEnE = multiply(
      observable.matrizCambioDeBaseBE,
      matrizDePreparacionEnBaseB,
      observable.matrizCambioDeBaseEB,
      estadoEnBaseE
    );
    console.log("el estado salido del preparador es ", estadoPreparadoEnE);
    return estadoPreparadoEnE;
  }
  var estadoPreparadoEnE = prepararEstadoDelBloque(arBloque, matrizDePreparacionEnBaseB);

  //normalizar el estado
  estadoPreparadoEnE = divide(
    estadoPreparadoEnE,
    norm(estadoPreparadoEnE)
  );
  return estadoPreparadoEnE;
}
