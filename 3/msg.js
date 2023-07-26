// ----------------------------------------------------------------
// Conexión en a ABLY
//----------------------------------------------------------------
const ably = new Ably.Realtime.Promise(
  "z9GTlA.jgLRzw:Pbg7WSJTTZXPRqHHJrRLeYqiH72rZp5QBYC2jnIJYx0"
);
const channel = ably.channels.get("entrelazados");

// Función para entrar en un canal especifico.
// El usuario puede selecciona el canal desde la página.
async function conectarYEscuchar(canalNombre) {
  try {
    await ably.connection.once("connected");
    await channel.subscribe(canalNombre, (message) => {
      console.log("Mensaje del canal " + canalNombre + ": " + message.data);
      bloquesCuanticos.estado = JSON.parse(message.data);
    });
  } catch (error) {
    console.log("Error de conexion al canal " + canalNombre);
  }
}

function EnviarMensajeA(numeroExperimento) {
  return async function enviarMensaje(mensaje) {
    try {
      await channel.publish(numeroExperimento, mensaje);
    } catch (e) {
      console.error(e);
    }
  };
}

//----------------------------------------------------------------
// Elegir numero de experimento
//----------------------------------------------------------------

const inputElegirExperimento = document.getElementById("elegirExperimento");
inputElegirExperimento.value = math.randomInt(1000, 9999);

function msgCambiarExperimento() {
  const numeroExperimento = inputElegirExperimento.value;
  const enviarMensaje = EnviarMensajeA(numeroExperimento.toString());
  console.log("conectando");
  conectarYEscuchar(numeroExperimento.toString()).then(() =>
    enviarMensaje(JSON.stringify(bloquesCuanticos.estado))
  );
}
