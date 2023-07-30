//----------------------------------------------------------------
// Logíca de los bloques cuánticos
//----------------------------------------------------------------
import { identity, randomInt } from "mathjs";
export default function BloqueCuantico(id, estadoInidical) {
  this.id = id;
  this.establecerEstado = (estado) => {
    const baseE = identity(8)._data
    this.estado = estado || baseE[randomInt(8)];
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
