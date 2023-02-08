var express = require('express');
var router = express.Router();
const json2csv = require('json2csv').parse;
const fs = require('fs');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://CyberSite:EEpwNzf1LM6R95S0@cluster0.c6zinmu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


/* GET home page. */
router.get('/', (req, res) => {
  client.connect(async err => {
    collection = client.db('Info').collection('classement');
    collectionMonde = client.db('Info').collection('classementMonde')


    // pour trouver dans la base de donne le nombre de partenaire le nombre de partenaire perdu et le nombre de partenaire gagner
    async function compte(nomEntreprise) {
      const total = collection.find({
        "Marque": nomEntreprise,
        $and: [
          { "Actif": true },
        ]
      })
      const perd = await collection.find({
        "Marque": nomEntreprise,
        $and: [
          { "Actif": { $ne: true } },
        ]
      });
      const gain = await collection.find({
        "Marque": nomEntreprise,
        $expr: {
          $eq: ["$Premier", "$Dernier"]
        }
      })
      const pays = await collection.find({
        "Marque": nomEntreprise,
      })
      const tabPerduGagner = [await total.count(), await perd.count(), await gain.count(), await pays.count()];
      return tabPerduGagner;
    }

    // pour trouver dans la base de donne Monde le nombre de partenaire le nombre de partenaire perdu et le nombre de partenaire gagner
    async function compteMonde(nomEntreprise) {
      const total = collectionMonde.find({
        "Marque": nomEntreprise,
        $and: [
          { "Actif": true },
        ]
      })
      const perd = await collectionMonde.find({
        "Marque": nomEntreprise,
        $and: [
          { "Actif": { $ne: true } },
        ]
      });
      const gain = await collectionMonde.find({
        "Marque": nomEntreprise,
        $expr: {
          $eq: ["$Premier", "$Dernier"]
        }
      })
      const pays = await collectionMonde.find({
        "Marque": nomEntreprise,
      })
      const tabPerduGagner = [await total.count(), await perd.count(), await gain.count(), await pays.count()];
      return tabPerduGagner;
    }

    // exemple de scrap telechargable sur le site
    fs.writeFileSync('./public/javascripts/data.csv', '')
    async function limitCsv(nomEntreprise) {
      const limit25 = collection.find({
        "Marque": nomEntreprise
      }).limit(25).toArray()
      const fields = ['Nom', 'Adresse', 'Telephone', 'Lien', "Marque"];
      const csv = json2csv(await limit25, { fields });
      fs.appendFileSync('./public/javascripts/data.csv', csv + "\n");
      return csv
    }

    // France
    const cisco = await compte("Cisco");
    const trellix = await compte("Trellix");
    const trendmicro = await compte("TrendMicro");
    const watchguard = await compte("WatchGuard");
    const withsecure = await compte("WithSecure");
    const bitdefender = await compte("BitDefender");
    const sophos = await compte("Sophos")
    const kapersky = await compte("Kapersky")
    const checkpoint = await compte("CheckPoint")
    const fortinet = await compte("Fortinet")

    // Monde
    const ciscoWorld = await compteMonde("Cisco");
    const trellixWorld = await compteMonde("Trellix");
    const trendmicroWorld = await compteMonde("TrendMicro");
    const watchguardWorld = await compteMonde("WatchGuard");
    const withsecureWorld = await compteMonde("WithSecure");
    const bitdefenderWorld = await compteMonde("BitDefender");
    const sophosWorld = await compteMonde("Sophos")
    const kaperskyWorld = await compteMonde("Kapersky")


    // envoi des donnes au site
    await limitCsv("Cisco"), await limitCsv("Trellix"), await limitCsv("TrendMicro"), await limitCsv("Watch Guard"), await limitCsv("WithSecure"), await limitCsv('BitDefender'), await limitCsv('Sophos'), await limitCsv("Kapersky"), await limitCsv("CheckPoint"), await limitCsv("Fortinet")
    const csvData = fs.readFileSync('./public/javascripts/data.csv', 'utf-8');
    const rows = csvData.split('\n');
    const uniqueRows = new Set();
    rows.forEach(row => {
      uniqueRows.add(row);
    });
    fs.writeFileSync('./public/javascripts/data.csv', [...uniqueRows].join('\n'));

    res.render('index', { cisco, trellix, trendmicro, watchguard, withsecure, bitdefender, sophos, kapersky, checkpoint, fortinet, ciscoWorld, trellixWorld, trendmicroWorld, watchguardWorld, withsecureWorld, bitdefenderWorld, sophosWorld, kaperskyWorld});
  })
})

module.exports = router;
