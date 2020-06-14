require("dotenv").config({ path: "../../.env" });

const places = require("./places.json");
const { MongoClient } = require("mongodb");

console.log("#places:", places.length);
// connect to db
const { MONGO_DB_NAME, MONGO_URL, MONGO_USER, MONGO_PASS } = process.env;

const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@127.0.0.1/${MONGO_DB_NAME}`;
const dbName = MONGO_DB_NAME;

MongoClient.connect(url)
  .then(async (client) => {
    const db = client.db(dbName);
    let collection = await db.collection("places");

    places.forEach(async (place) => {
      const {
        nome_fantasia,
        categoria,
        responsavel,
        telefone,
        sg_uf,
        no_uf,
        municipio,
        br,
        km,
        periodo,
        sempre_aberto,
        horario_abertura,
        horario_fechamento,
        observacoes,
        status,
        longitude,
        latitude,
      } = place;

      const record = {
        nome_fantasia,
        categoria,
        telefone,
        sg_uf,
        no_uf,
        municipio,
        br,
        km,
        periodo,
        sempre_aberto,
        horario_abertura,
        horario_fechamento,
        observacoes,
        status,

        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      };

      await collection.insert(record).catch((err) => console.log(telefone));
    });

    process.exit(0);
  })
  .catch((err) => {
    throw err;
    process.exit(1);
  });
