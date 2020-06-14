class Place {
  nome_fantasia;
  telefone;
  municipio;
  sempre_aberto;
  horario_abertura;
  horario_fechamento;
  location;

  constructor(latitude, longitude, nome_fantasia) {
    this.nome_fantasia = nome_fantasia;
    this.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
  }

  get id() {
    const [longitude, latitude] = this.location.coordinates;

    return {
      latitude,
      longitude,
    };
  }
}

module.exports = Place;
