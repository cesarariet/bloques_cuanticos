import { bloquesCuanticos } from "./bloques_cuanticos_como_sistema_cuantico"

async function test(bloque1) {

  const contarSi = (valorDiferenciador) => {
    var n = 0
    return function(valorAcontar) {
      if (valorAcontar == valorDiferenciador) n++
      return n
    }
  }
  const contarRojo = contarSi(1);
  const contarAzul = contarSi(-1);

  for (let i = 0; i < 1000.; i++) {
    //  bloquesCuanticos.medirYColapsar(bloque1)
    const medida = bloquesCuanticos.medirYColapsar(bloque1);
    contarRojo(medida)
    contarAzul(medida)
    bloquesCuanticos.establecerEstado(armarEstadoParaUnBloque(77, bloque1))
  }
  console.log("Rojo: ", contarRojo())

  console.log("Azul: ", contarAzul())
  return true
}
