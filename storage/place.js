class Place {
  nomeFantasia;
  telefone;
  uf;
  municipio;
  horarioAbertura;
  horarioFechamento;
  tags;
  score = 0;
  partner = false;

  latitude;
  longitude;

  location;

  constructor(latitude, longitude, nomeFantasia) {
    this.nomeFantasia = nomeFantasia;
    this.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
  }

  get id() {
    return {
      longitude: this.longitude,
      latitude: this.latitude,
    };
  }
}

module.exports = Place;
