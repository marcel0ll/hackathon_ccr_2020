require("dotenv").config({ path: "../../.env" });

const places = require("./places.json").Pontos.Ponto;
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

    let toInsert = places
      .map((place) => {
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

        if (!longitude || !latitude) {
          return;
        }

        const record = {
          nomeFantasia: nome_fantasia,
          telefone,
          uf: sg_uf,
          municipio,
          horarioAbertura: horario_abertura,
          horarioFechamento: horario_fechamento,
          tags: [categoria],
          score: 0,
          partner: false,

          latitude: parseFloat(longitude),
          longitude: parseFloat(latitude),

          location: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        };

        return record;
      })
      .filter((a) => typeof a !== "undefined")
      .filter((a, i, arr) => {
        return arr.findIndex((b) => b.telefone === a.telefone) === i;
      })
      .filter((a, i, arr) => {
        return (
          arr.findIndex(
            (b) =>
              b.nomeFantasia === a.nomeFantasia &&
              b.uf === a.uf &&
              b.municipio === a.municipio
          ) === i
        );
      })
      .filter((a, i, arr) => {
        return (
          arr.findIndex(
            (b) => b.longitude === a.longitude && b.latitude === a.latitude
          ) === i
        );
      });

    console.log("Filtered:", toInsert.length);

    let promises = toInsert.map((place) => collection.insert(place));

    await Promise.all(promises);
    console.log("Inserted all");

    process.exit(0);
  })
  .catch((err) => {
    throw err;
    process.exit(1);
  });
