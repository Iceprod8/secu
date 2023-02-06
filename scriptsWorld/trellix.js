const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');

let csvData = [];
let first = true
function attendre(min, max) {
  const temps = Math.random() * (max - min) + min;
  return new Promise(resolve => {
    setTimeout(resolve, temps);
  });
}
(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    timeout: 500000000,
    puppeteerOptions: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]
    },
  });
  await cluster.task(async ({ page, data: url }) => {
    if (first) {
      await page.goto(url);
      await attendre(5000, 5000);
      const options = await page.$$('#l0 > option');
      countries = await Promise.all(options.map(async option => {
        return await page.evaluate(element => element.textContent, option);
      }));
    } else {
      await page.goto(url);
      await attendre(5000, 5000);
      firstPage = true
      next = true;
      while (next) {
        const donne = await page.$$('#Locator_BodyContent_ResultsContainer > div:nth-child(4) > div.col-sm-8 > div > div');
        for (i = 1; i <= donne.length; i++) {
          const nomE = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/h3');
          if (nomE.length > 0) {
            nom = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/h3').then(element => element[0].evaluate(node => node.textContent));
          } else {
            nom = '';
          }
          info = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/div[2]/div');
          if (info.length > 0) {
            info = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/div[2]/div').then(element => element[0].evaluate(node => node.innerHTML.replace(/\t/g, '').replace(/\n/g, '').replace(/,/g, '').replace('Téléphone: ', '')));
            tabInfo = info.split('<br>');
            adresse = `${tabInfo[0]} ${tabInfo[1]}`;
            pays = `${tabInfo[2]}`
            if (tabInfo[5].includes('+')) {
              tel = tabInfo[5];
            } else if (tabInfo[4].includes('+')) {
              tel = tabInfo[4];
            } else {
              tel = '';
            }
          }

          lien = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/div[2]/div/a');
          if (lien.length > 0) {
            lien = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/div[2]/div/a').then(element => element[0].evaluate(node => node.textContent));
          } else {
            lien = '';
          }
          tab = [nom, adresse, pays, tel, lien, "Trellix"];
          csvData.push(tab);
        }
        if (firstPage) {
          const suivant = await page.$('#Locator_BodyContent_ResultsContainer > div:nth-child(3) > div > nav > ul > li:nth-child(9) > a');
          if (suivant !== null) {
            await suivant.click();
            await attendre(2000, 2000);
          } else {
            next = false;
          }
          firstPage = false;
        } else {
          const suivant = await page.$('#Locator_BodyContent_ResultsContainer > div:nth-child(3) > div > nav > ul > li:nth-child(10) > a');
          if (suivant !== null) {
            await suivant.click();
            await attendre(2000, 2000);
          } else {
            next = false;
          }
        }
      }
    }
  });
  await cluster.queue('https://trellixpartners.trellix.com/fr-fr/directory');
  await cluster.idle();
  first = false
  for (p = 0; p < countries.length; p++) {
    await cluster.queue(`https://trellixpartners.trellix.com/fr-fr/directory/search?l=${countries[p]}`);
  }
  await cluster.idle();
  await cluster.close();
  await attendre(50000, 50000)
  console.log(JSON.stringify(csvData))
})();
