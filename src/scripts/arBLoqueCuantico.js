//----------------------------------------------------------------
// Visualización de los bloques cuánticos
//----------------------------------------------------------------
function ARElemento(id) {
  // crea los elementos asociados a los target (cartas) y los elementos que se imprimen cuando se detectan
  this.a_entity = document.createElement("a-entity");
  this.a_entity.setAttribute("id", "target" + id);
  this.a_entity.setAttribute("mindar-image-target", "targetIndex: " + id);
  // agregar el texto
  this.a_text = document.createElement("a-text");
  this.a_entity.appendChild(this.a_text);
  // Agregar circulo o cuadrado
  if (id < 3) {
    this.a_figure = document.createElement("a-circle");
    this.a_figure.setAttribute("color", "blue");
    this.a_figure.setAttribute("position", "0 0 0");
    this.a_figure.setAttribute("radius", "0.25");
    this.a_entity.appendChild(this.a_figure);
  } else {
    this.a_figure = document.createElement("a-plane");
    this.a_figure.setAttribute("color", "red");
    this.a_figure.setAttribute("position", "0 0 0");
    this.a_figure.setAttribute("height", ".5");
    this.a_figure.setAttribute("width", ".5");
    this.a_entity.appendChild(this.a_figure);
  }
  return this.a_entity;
}

export default function ARBloqueCuantico(id, bloqueCuantico, observable) {
  // toda la lógica de visualización de cada cara de las cartas cuando se dectectan y cuando se pierden de la camara
  const a_escena = document.getElementById("escena");
  this.id = id;
  this.bloqueCuantico = bloqueCuantico;
  this.observable = observable;
  const arElemento = new ARElemento(id);
  this.arBloque = arElemento;
  this.a_text = arElemento.children[0];
  this.a_figure = arElemento.children[1];
  this.enEscena = false;
  this.fueMedido = false;

  a_escena.appendChild(this.arBloque);

  this.detectado = () => {

    const valorMedido = this.bloqueCuantico.medirYColapsar(this);

    switch (valorMedido) {
      case 1:
        this.a_figure.setAttribute("color", "red");
        break;
      case -1:
        this.a_figure.setAttribute("color", "blue");
        break;
    }
  };
}
