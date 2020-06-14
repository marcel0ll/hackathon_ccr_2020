class Place {
  nome_fantasia;
  telefone;
  municipio;
  sempre_aberto;
  horario_abertura;
  horario_fechamento;
  location;
  score = 0;

  partner = false;

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

  get latitude() {
    return this.location.coordinates[1];
  }

  get longitude() {
    return this.location.coordinates[0];
  }
}

module.exports = Place;
