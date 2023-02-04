const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');

let csvData = [];
let next = true
let first = true
let lienPartner = []
// fonction pour faire un temps d'attente
function attendre(min, max) {
  const temps = Math.random() * (max - min) + min;
  return new Promise(resolve => {
    setTimeout(resolve, temps);
  });
}

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 10,
    timeout: 100000000,
  });
  await cluster.task(async ({ page, data: lien }) => {
    if (first) {
      await page.goto(lien);
      await attendre(5000, 5000);
      const button = await page.$('#scrollableArea > div:nth-child(2) > div > main > div > header > div > div.mb-5 > div > div > button');
      await button.click();
      const select = await page.$('#scrollableArea > div:nth-child(2) > div > main > div > header > div > div.mb-5 > div > div > ul > li:nth-child(77) > span');
      page.on('response', async response => {
        if (response.url().includes('getPfPartners')) {
          await response.json().then(data => {
            for (let i = 0; i < 12; i++) {
                lienPartner.push(data.data[i].site_id)
            }
          })
        }
      });
      await select.click();
      while (next) {
        await attendre(10000, 10000)
        const pageSuivant = await page.$('#scrollableArea > div:nth-child(2) > div > main > div > section > div.__MR_HOME_SEARCH_MAIN_RESULTS__.flex-grow.flex.flex-col.justify-center.border-t.border-cc-gray-05.px-2.\\32 xs\\:px-0.py-6 > nav > ul > li:nth-child(3) > a > span');
        if (pageSuivant !== null) {
          await pageSuivant.click();
        } else {
          next = false;
        }
      }
    } else {
      const donne = await page.$$("#scrollableArea > div:nth-child(2) > div > main > div > section > div.__MR_HOME_SEARCH_MAIN_RESULTS__.flex-grow.flex.flex-col.justify-center.border-t.border-cc-gray-05.px-2.\\32 xs\\:px-0.py-6 > ul > li");
      for (i = 1; i <= donne.length; i++) {
        const suivant = await page.$('#scrollableArea > div:nth-child(2) > div > main > div > section > div.__MR_HOME_SEARCH_MAIN_RESULTS__.flex-grow.flex.flex-col.justify-center.border-t.border-cc-gray-05.px-2.\\32 xs\\:px-0.py-6 > ul > li:nth-child(' + i + ') > article');
        await suivant.click();
        await attendre(2000, 3000);
        taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/h3');
        if (await taille.length > 0) {
          nom = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/h3').then(element => element[0].evaluate(node => node.textContent));
        } else {
          nom = '';
        }
        taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[1]');
        if (await taille.length > 0) {
          adresse = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[1]').then(element => element[0].evaluate(node => node.textContent));
        } else {
          adresse = '';
        }
        taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[1]/a');
        if (await taille.length > 0) {
          lien = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[1]/a').then(element => element[0].evaluate(node => node.textContent));
        } else {
          lien = '';
        }
        taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[2]/a');
        if (await taille.length > 0) {
          tel = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[2]/a').then(element => element[0].evaluate(node => node.textContent.replace(/,/g, '').replace('FRANCE', '')));
        } else {
          tel = '';
        }
        tab = [nom, adresse, tel, lien, 'Cisco'];
        tab1 = tab.map(val => val.replace(/,/g, " ").replace('FRANCE', ' '));
        csvData.push(tab1);
      }
    }
  });
  await cluster.queue('https://locatr.cloudapps.cisco.com/WWChannels/LOCATR/pf/index.jsp#/')
  await cluster.idle();
  first = false
  const lienTotalPartner = Array.from(new Set(lienPartner));
  for (j = 0; j < lienTotalPartner; j++) {
    await cluster.queue(`https://locatr.cloudapps.cisco.com/WWChannels/LOCATR/pf/index.jsp#/partner/${lienTotalPartner[j]}`)
  }
  await cluster.idle()
  await cluster.close();
  console.log(JSON.stringify(csvData))
})();
