const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { execFile } = require('child_process');
const util = require('util');
const exec = util.promisify(execFile);

const uri = "mongodb+srv://CyberSite:EEpwNzf1LM6R95S0@cluster0.c6zinmu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let csvData = [];
let tabPays = ["AF", "AL", "AQ", "DZ", "AS", "AD", "AO", "AG", "AZ", "AR", "AU", "AT", "BS", "BH", "BD", "AM", "BB", "BE", "BM", "BT", "BO", "BA", "BW", "BV", "BR", "BZ", "IO", "SB", "VG", "BN", "BG", "MM", "BI", "BY", "KH", "CM", "CA", "CV", "KY", "CF", "LK", "TD", "CL", "CN", "TW", "CX", "CC", "CO", "KM", "YT", "CG", "CD", "CK", "CR", "HR", "CU", "CY", "CZ", "BJ", "DK", "DM", "DO", "EC", "SV", "GQ", "ET", "ER", "EE", "FO", "FK", "GS", "FJ", "FI", "AX", "FR", "GF", "PF", "TF", "DJ", "GA", "GE", "GM", "PS", "DE", "GH", "GI", "KI", "GR", "GL", "GD", "GP", "GU", "GT", "GN", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "CI", "JM", "JP", "KZ", "JO", "KE", "KP", "KR", "KW", "KG", "LA", "LB", "LS", "LV", "LR", "LY", "LI", "LT", "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MQ", "MR", "MU", "MX", "MC", "MN", "MD", "MS", "MA", "MZ", "OM", "NA", "NR", "NP", "NL", "AN", "AW", "NC", "VU", "NZ", "NI", "NE", "NG", "NU", "NF", "NO", "MP", "UM", "FM", "MH", "PW", "PK", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "GW", "TL", "PR", "QA", "RE", "RO", "RU", "RW", "SH", "KN", "AI", "LC", "PM", "VC", "SM", "ST", "SA", "SN", "SC", "SL", "SG", "SK", "VN", "SI", "SO", "ZA", "ZW", "ES", "EH", "SD", "SR", "SJ", "SZ", "SE", "CH", "SY", "TJ", "TH", "TG", "TK", "TO", "TT", "AE", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "MK", "EG", "GB", "IM", "TZ", "US", "VI", "BF", "UY", "UZ", "VE", "WF", "WS", "YE", "CS", "ZM"]
function attendre(min, max) {
  const temps = Math.random() * (max - min) + min;
  return new Promise(resolve => {
    setTimeout(resolve, temps);
  });
}
(async () => {
  let csv = []
  let paysActuelle = 0
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 1,
    timeout: 500000000,
    puppeteerOptions: {
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]
    },
  });
  await cluster.task(async ({ page, data: url }) => {
    let next, j, world, button, select, donne, taille, nom, adresse, tel, lien, tab, tab1, suivant, long, pays, selectoption
    paysActuelle++
    await page.goto(url);
    next = true
    j = 1
    await attendre(5000, 5000);
    cok = await page.$("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll")
    await cok.click()
    await attendre(5000, 5000)
    world = await page.$('#country_select')
    actuellePays = tabPays[paysActuelle].toLowerCase()
    try {
      await world.select(actuellePays)
      selectoption = await page.$('#country_select');
      pays = await page.evaluate(select => select.options[select.selectedIndex].text, selectoption);
      await attendre(1000, 1000)
      select = await page.$('#per_page')
      await select.select('50');
      await attendre(1000, 1000)
      button = await page.$('#search_entries > div > div:nth-child(4) > button')
      await button.click()
      await attendre(5000, 5000)
      console.log(`BitDefender, pays: ${pays}`)
      while (next) {
        donne = await page.$$('#partner_list_rows > div');
        for (let i = 1; i <= donne.length; i++) {
          taille = await page.$x('//*[@id="partner_list_rows"]/div[' + i + ']/div[2]/span');
          if (await taille.length > 0) {
            nom = await page.$x('//*[@id="partner_list_rows"]/div[' + i + ']/div[2]/span').then(element => element[0].evaluate(node => node.textContent));
          } else {
            nom = '';
          }
          taille = await page.$x('//*[@id="partner_list_rows"]/div[' + i + ']/div[3]/span[2]');
          if (await taille.length > 0) {
            adresse = await page.$x('//*[@id="partner_list_rows"]/div[' + i + ']/div[3]/span[2]').then(element => element[0].evaluate(node => node.textContent));
          } else {
            adresse = '';
          }
          taille = await page.$x('//*[@id="partner_list_rows"]/div[' + i + ']/div[4]/div/span');
          if (await taille.length > 0) {
            tel = await page.$x('//*[@id="partner_list_rows"]/div[' + i + ']/div[4]/div/span').then(element => element[0].evaluate(node => node.textContent));
          } else {
            tel = '';
          }
          taille = await page.$x('//*[@id="partner_list_rows"]/div[' + i + ']/div[4]/div/a');
          if (await taille.length > 0) {
            lien = await page.$x('//*[@id="partner_list_rows"]/div[' + i + ']/div[4]/div/a').then(element => element[0].evaluate(node => node.textContent));
          } else {
            lien = '';
          }
          tab = [nom, adresse, pays, tel, lien, 'BitDefender'];
          tab1 = tab.map(val => val.replace(/,/g, ".").replace(/<\/p>/g, " ").replace(/\n/g, ''));
          csv.push(tab1)
        }
        j++
        suivant = await page.$('#page')
        long = await suivant.select(`${j}`)
        if (long.length !== 0) {
          await suivant.select(`${j}`)
          await attendre(5000, 5000)
        } else {
          next = false;
        }
      }
    } catch { }
  });
  for (let paysDefender = 0; paysDefender < tabPays.length; paysDefender++) {
    await cluster.queue('https://www.bitdefender.fr/partners/partner-locator.html')
  }
  await cluster.idle();
  await cluster.close();
  let csv2 = Array.from(new Set(csv));
  for (let m = 0; m < csv2.length; m++) {
    csvData.push(csv2[m])
  }
  console.log('BitDefender Effectuer')
  fs.writeFile('scrapAll.csv', csvData.join('\n'), 'utf8', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Fichier CSV de la nouvelle BDD Monde enregistré');
    }
  });
  try {
    client.connect(err => {
      const collection = client.db('Info').collection('classementMonde');
      var today = new Date();
      for (let i = 0; i < csvData.length; i++) {
        collection.findOneAndUpdate(
          {
            "Nom": `${csvData[i][0]}`,
            "Adresse": `${csvData[i][1]}`,
            "Pays": `${csvData[i][2]}`,
            "Telephone": `${csvData[i][3]}`,
            "Lien": `${csvData[i][4]}`,
            "Marque": `${csvData[i][5]}`,
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
  console.log("base du monde a ete mise a jour")
})();
