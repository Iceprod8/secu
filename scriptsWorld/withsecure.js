const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');


let csvData = [];
function attendre(min, max) {
  const temps = Math.random() * (max - min) + min;
  return new Promise(resolve => {
    setTimeout(resolve, temps);
  });
}
(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 1,
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
    await page.goto(url);
    await attendre(5000, 5000)
    const html = await page.content();
    fs.writeFileSync('scrapWith.html', html);
    await attendre(5000, 5000);
    const dom = await JSDOM.fromFile('./scrapWith.html');
    await attendre(5000, 5000)
    const donne = dom.window.document.querySelectorAll('.p-a-2');
    for (i = 0; i < donne.length; i++) {
      const nom = donne[i].querySelector('h3').textContent
      if (donne[i].querySelector('.partner-list-col2 > p:nth-child(1)') !== null) {
        adresse = donne[i].querySelector('.partner-list-col2 > p:nth-child(1)').innerHTML;
        adresseTab = adresse.split('<br>');
        adresse = ''
        for (let k = 0; k < adresseTab.length - 1; k++) {
          adresse = adresse + adresseTab[k]
          pays = adresseTab[k + 1]
        }
      } else {
        adresse = ''
        pays = ''
      }
      if (donne[i].querySelector('.partner-list-col2 > p:nth-child(2)') !== null) {
        tel = donne[i].querySelector('.partner-list-col2 > p:nth-child(2)').textContent.replace('Website', '');
      } else {
        tel = ''
      }
      if (donne[i].querySelector('.partner-list-col2 > p.m-b-1 > span:nth-child(3) > a') !== null) {
        lien = donne[i].querySelector('.partner-list-col2 > p.m-b-1 > span:nth-child(3) > a').href
      } else {
        lien = ''
      }
      const tab = [nom, adresse, pays, tel, lien, 'WithSecure']
      csvData.push(tab)
    }
  });


  await cluster.queue('https://www.withsecure.com/en/partners/find-a-partner');
  await cluster.idle();
  await cluster.close();
  await attendre(50000, 50000)
  console.log(JSON.stringify(csvData))
})();
