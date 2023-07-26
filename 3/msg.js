// ----------------------------------------------------------------
// Conexión en a ABLY
//----------------------------------------------------------------
const ably = new Ably.Realtime.Promise(
  "z9GTlA.jgLRzw:Pbg7WSJTTZXPRqHHJrRLeYqiH72rZp5QBYC2jnIJYx0"
);
ably.connection.once("conected");
const channel = ably.channels.get("entrelazados");

function Mensajeria() {
  this.canalNombre = null;
  this.conectarYEscuchar = async function (canalNombre) {
    this.canalNombre = canalNombre.toString();
    try {
      await channel.subscribe(canalNombre, (message) => {
        data = JSON.parse(message.data);
        console.log(data);
        bloquesCuanticos.estado = data.estado;
        arBloques.forEach((arBloque, i) =>
          arBloque.a_figura.setAttribute("color", data.colores[i])
        );
      });
    } catch (error) {
      console.log("Error de conexion al canal " + canalNombre);
    }
  };
  this.enviarEstado = async function (estado) {
    try {
      if (this.canalNombre === null) throw new Error("No hay canal asignado");
      await channel.publish(this.canalNombre, JSON.stringify(estado));
    } catch (error) {
      console.error(error);
    }
  };
}

//----------------------------------------------------------------
// Elegir numero de experimento
//----------------------------------------------------------------

const inputElegirExperimento = document.getElementById("elegirExperimento");
inputElegirExperimento.value = math.randomInt(1000, 9999);
const mensajeria = new Mensajeria();

function msgCambiarExperimento() {
  const numeroExperimento = inputElegirExperimento.value;
  mensajeria.conectarYEscuchar(numeroExperimento);
  mensajeria.enviarEstado({
    estado: bloquesCuanticos.estado,
    colores: arBloques.map((arBloque) =>
      arBloque.a_figura.getAttribute("color")
    ),
  });
}

a_escena.addEventListener("targetFound", () => {
  if (mensajeria.canalNombre !== null)
    mensajeria.enviarEstado({
      estado: bloquesCuanticos.estado,
      colores: arBloques.map((arBloque) =>
        arBloque.a_figura.getAttribute("color")
      ),
    });
});
