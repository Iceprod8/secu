const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');

let csvData = [];
let next = true
let first = true
let lienPartner = []
let error = []
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
  await cluster.task(async ({ page, data: lien }) => {
    if (first) {
      await page.goto(lien);
      page.on('response', async response => {
        if (response.url().includes('getPfPartners')) {
          await response.json().then(data => {
            for (let i = 0; i < 12; i++) {
              try {
                lienPartner.push(data.data[i].site_id)
              } catch (err) {
                error.push(err)
              }
            }
          })
        }
      });
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
      await page.goto(lien);
      await attendre(10000, 10000)
      taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/h3');
      if (await taille.length > 0) {
        nom = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/h3').then(element => element[0].evaluate(node => node.textContent));
      } else {
        nom = '';
      }
      taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[1]');
      if (await taille.length > 0) {
        adresse = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[1]').then(element => element[0].evaluate(node => node.innerHTML));
        adresseTab = adresse.split('<p>');
        adresse = ''
        for (let k = 0; k < adresseTab.length - 1; k++) {
          adresse = adresse + adresseTab[k]
          pays = adresseTab[k + 1]
        }
      } else {
        adresse = '';
        pays = '';
      }
      taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[1]/a');
      if (await taille.length > 0) {
        site = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[1]/a').then(element => element[0].evaluate(node => node.textContent));
      } else {
        sites = '';
      }
      taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[2]/a');
      if (await taille.length > 0) {
        tel = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[2]/a').then(element => element[0].evaluate(node => node.textContent.replace(/,/g, '').replace('FRANCE', '')));
      } else {
        tel = '';
      }
      tab = [nom, adresse, pays, tel, site, 'Cisco'];
      tab1 = tab.map(val => val.replace(/,/g, "").replace(/<\/p>/g, " "));
      csvData.push(tab1);
    }
  });
  await cluster.queue('https://locatr.cloudapps.cisco.com/WWChannels/LOCATR/pf/index.jsp#/')
  await cluster.idle();
  first = false
  const lienTotalPartner = Array.from(new Set(lienPartner));
  for (j = 0; j < lienTotalPartner.length; j++) {
    await cluster.queue(`https://locatr.cloudapps.cisco.com/WWChannels/LOCATR/pf/index.jsp#/partner/${lienTotalPartner[j]}`)
  }
  await cluster.idle()
  await cluster.close();
  console.log(JSON.stringify(csvData))
})();
