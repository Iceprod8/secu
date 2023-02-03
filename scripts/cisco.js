const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');

let csvData = [];
let arrayPartnerTotal = []
let next = true
let first = true
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
    timeout: 1000000000,
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
      page.on('response', response => {
        if (response.url().includes('getFavPartnersCount')) {
          lienPartner = response._request._postData
        }
      });
      await page.goto(lien);
      await attendre(5000, 5000);
      const button = await page.$('#scrollableArea > div:nth-child(2) > div > main > div > header > div > div.mb-5 > div > div > button');
      await button.click();
      const select = await page.$('#scrollableArea > div:nth-child(2) > div > main > div > header > div > div.mb-5 > div > div > ul > li:nth-child(77) > span');
      await select.click();
      await attendre(5000, 5000);
      while (next) {
        await attendre(10000, 10000)
        const lienPartnerClean = lienPartner.replace('{"siteIdList":"', '').replace('"}', '')
        const arrayPartner = lienPartnerClean.split(',')
        for (i = 0; i < arrayPartner.length; i++) {
          arrayPartnerTotal.push(arrayPartner[i])
        }
        const pageSuivant = await page.$('#scrollableArea > div:nth-child(2) > div > main > div > section > div.__MR_HOME_SEARCH_MAIN_RESULTS__.flex-grow.flex.flex-col.justify-center.border-t.border-cc-gray-05.px-2.\\32 xs\\:px-0.py-6 > nav > ul > li:nth-child(3) > a > span');
        if (pageSuivant !== null) {
          await pageSuivant.click();
        } else {
          next = false;
        }
      }
    } else {
      await page.goto(lien)
      await attendre(10000,10000)
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
          website = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[1]/a').then(element => element[0].evaluate(node => node.textContent));
        } else {
          website = '';
        }
        taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[2]/a');
        if (await taille.length > 0) {
          tel = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[2]/a').then(element => element[0].evaluate(node => node.textContent.replace(/,/g, '').replace('FRANCE', '')));
        } else {
          tel = '';
        }
        tab = [nom, adresse, tel, website, 'Cisco'];
        tab1 = tab.map(val => val.replace(/,/g, " ").replace('FRANCE', ' '));
        csvData.push(tab1);
      }
  });
  await cluster.queue('https://locatr.cloudapps.cisco.com/WWChannels/LOCATR/pf/index.jsp#/')
  await cluster.idle();
  first = false
  for (j = 0; j < arrayPartnerTotal; j++) {
    await cluster.queue(`https://locatr.cloudapps.cisco.com/WWChannels/LOCATR/pf/index.jsp#/partner/${arrayPartnerTotal[j]}`)
  }
  await cluster.idle()
  await cluster.close();
  await attendre(5000,5000)
  console.log(JSON.stringify(csvData))
})();
