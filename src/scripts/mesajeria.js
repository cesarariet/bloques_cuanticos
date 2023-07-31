// ----------------------------------------------------------------
// Conexión en a ABLY
//----------------------------------------------------------------
import { randomInt } from "mathjs";
import Ably from "ably";


const ably = new Ably.Realtime.Promise(
  "z9GTlA.jgLRzw:Pbg7WSJTTZXPRqHHJrRLeYqiH72rZp5QBYC2jnIJYx0"
);
ably.connection.once("conected");
const channel = ably.channels.get("entrelazados");

function Mensajeria(bloquesCuanticos, arBloques) {
  this.canalNombre = null;
  this.conectarYEscuchar = async function(canalNombre) {
    try {
      channel.unsubscribe(this.canalNombre);
      this.canalNombre = canalNombre.toString();
      await channel.subscribe(canalNombre, (message) => {
        const data = JSON.parse(message.data);
        console.log(
          "Del Canal ",
          canalNombre,
          "\nViene el estado: ",
          data.estado,
          "\nY la configuración de colores: ",
          data.colores
        );
        if (data.estado.length === 8) bloquesCuanticos.estado = data.estado;
        if (data.colores.length === 6)
          arBloques.forEach((arBloque, i) =>
            arBloque.a_figure.setAttribute("color", data.colores[i])
          );
      });
    } catch (error) {
      console.log("Error de conexion al canal " + canalNombre);
    }
  };
  this.enviarEstado = async function(estado) {
    try {
      if (this.canalNombre === null) throw new Error("No hay canal asignado");
      await channel.publish(this.canalNombre, JSON.stringify(estado));
    } catch (error) {
      console.error(error);
    }
  };
}


export function comenzarMensajeria(escena, bloquesCuanticos, arBloques) {

  //----------------------------------------------------------------
  // Elegir numero de experimento
  //----------------------------------------------------------------

  const inputElegirExperimento = document.getElementById("elegirExperimento");
  inputElegirExperimento.value = randomInt(1000, 9999);
  const mensajeria = new Mensajeria(bloquesCuanticos, arBloques);

  async function msgCambiarExperimento() {
    try {
      const numeroExperimento = inputElegirExperimento.value;
      await mensajeria.conectarYEscuchar(numeroExperimento);
      await mensajeria.enviarEstado({
        estado: bloquesCuanticos.estado,
        colores: arBloques.map((arBloque) =>
          arBloque.a_figure.getAttribute("color")
        ),
      });
    } catch (error) {
      console.error(error);
    }
  }
  window.msgCambiarExperimento = msgCambiarExperimento

  escena.addEventListener("targetFound", () => {
    if (mensajeria.canalNombre !== null)
      // el setTime out es para darle tiempo a arBloque.medirYcopalsar para enviar luego de tener el estado medido enviar la información
      setTimeout(() => {
        console.log("enviando estado!");
        mensajeria.enviarEstado({
          estado: bloquesCuanticos.estado,
          colores: arBloques.map((arBloque) =>
            arBloque.a_figure.getAttribute("color")
          ),
        });
      }, 20);
  });

  return mensajeria
}
