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
    });
  } catch (error) {
    console.log("Error de conexion al canal " + canalNombre);
  }
}

// para mandar mensajes usar
// channel.publish("canalNombre", "mensaje al usuario!")
conectarYEscuchar("33")
  .then(() => channel.publish("33", "esto es un mensaje"))
  .catch("Error al enviar mensaje");
