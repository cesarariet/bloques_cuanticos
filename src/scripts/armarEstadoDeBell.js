
import { norm, multiply, divide, } from "mathjs";

export function entrelazarEnEstadoDeBell(arBloque) {
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
    var estadoSimetrizado = multiply(
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
  estadoSimetrizado = divide(
    estadoSimetrizado,
    norm(estadoSimetrizado)
  );
  return estadoSimetrizado;
}
