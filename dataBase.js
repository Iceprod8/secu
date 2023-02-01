const fs = require('fs');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { execFile } = require('child_process');
const util = require('util');
const exec = util.promisify(execFile);

(async () => {
    try {
        csvAll = []
        const { stdout: stdoutTrellix } = await exec('node', ['./scripts/trellix.js']);
        const resultTrellix = JSON.parse(stdoutTrellix);
        resultTrellix.forEach(element => {
            csvAll.push(element)
        });
        console.log('1er effectuer')
        const { stdout: stdoutWatch } = await exec('node', ['./scripts/watchguard.js']);
        const resultWatch = JSON.parse(stdoutWatch);
        resultWatch.forEach(element => {
            csvAll.push(element)
        });
        console.log('2eme site effectuer')
        const { stdout: stdoutWith } = await exec('node', ['./scripts/withsecure.js']);
        const resultWith = JSON.parse(stdoutWith);
        resultWith.forEach(element => {
            csvAll.push(element)
        });
        console.log('3eme site effectuer')
        const { stdout: stdoutSophos } = await exec('node', ['./scripts/sophos.js']);
        const resultSophos = JSON.parse(stdoutSophos);
        resultSophos.forEach(element => {
            csvAll.push(element)
        });
        console.log('4eme site effectuer')
        const { stdout: stdoutBitDef } = await exec('node', ['./scripts/bitdefender.js']);
        const resultBitDef = JSON.parse(stdoutBitDef);
        resultBitDef.forEach(element => {
            csvAll.push(element)
        });
        console.log('5eme site effectuer')
        const { stdout: stdoutTrend } = await exec('node', ['./scripts/trendmicro.js']);
        const resultTrend = JSON.parse(stdoutTrend);
        resultTrend.forEach(element => {
            csvAll.push(element)
        });
        console.log('6eme site effectuer')
        const { stdout: stdoutCisco } = await exec('node', ['./scripts/cisco.js']);
        const resultCisco = JSON.parse(stdoutCisco);
        resultCisco.forEach(element => {
            csvAll.push(element)
        });
        console.log('7eme site effectuer')
        const { stdout: stdoutKapersky } = await exec('node', ['./scripts/kapersky.js']);
        const resultKapersky = JSON.parse(stdoutKapersky);
        resultKapersky.forEach(element => {
            csvAll.push(element)
        });
        console.log('8eme site effectuer')
        const { stdout: stdoutCheck } = await exec('node', ['./scripts/checkpoint.js']);
        const resultCheck = JSON.parse(stdoutCheck);
        resultCheck.forEach(element => {
            csvAll.push(element)
        });
        console.log('9eme site effectuer')
        const { stdout: stdoutFort } = await exec('node', ['./scripts/fortinet.js']);
        const resultFort = JSON.parse(stdoutFort);
        resultFort.forEach(element => {
            csvAll.push(element)
        });
        console.log('10eme site effectuer')
        fs.writeFile('scrapAll.csv', csvAll.join('\n'), 'utf8', function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log('Fichier CSV de la nouvelle BDD enregistré');
            }
        });
        const uri = "mongodb+srv://CyberSite:EEpwNzf1LM6R95S0@cluster0.c6zinmu.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        client.connect(err => {
            const collection = client.db('Info').collection('classement');
            var today = new Date();
            for (i = 0; i < csvAll.length; i++) {
                collection.findOneAndUpdate(
                    {
                        "Nom": `${csvAll[i][0]}`,
                        "Adresse": `${csvAll[i][1]}`,
                        "Telephone": `${csvAll[i][2]}`,
                        "Lien": `${csvAll[i][3]}`,
                        "Entreprise": `${csvAll[i][4]}`,
                        "Actif": true
                    },
                    {
                        $setOnInsert: { "Premier": today },
                        $set: { "Dernier": today }
                    },
                    {
                        upsert: true,
                        returnOriginal: false
                    },
                    function (err, donne) {
                        if (!err) {
                            if (!donne.lastErrorObject.updatedExisting) {
                                console.log('nouvelle entreprise!')
                            }
                        }
                    }
                )
            }
            // remplacement des documents où dernier est différent de la date d'aujourd'hui
            collection.updateMany(
                { "Dernier": { $ne: today } },
                { $set: { "Actif": false } }
            );
        })

    } catch (err) {
        console.error(`Error: ${err}`);
    }
    console.log("base mise a jour")
})();
