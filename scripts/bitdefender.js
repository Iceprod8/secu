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
        timeout: 1000000000,
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
        next = true
        j=1
        await attendre(5000, 5000);
        const select = await page.$('#per_page')
        await select.select('50');
        await attendre(5000, 5000)
        while(next){
            const donne = await page.$$('#partner_list_rows > div');
            for (i = 1; i <= donne.length; i++) {
                taille = await page.$x('//*[@id="partner_list_rows"]/div['+i+']/div[2]/span');
                if (await taille.length > 0) {
                    nom = await page.$x('//*[@id="partner_list_rows"]/div['+i+']/div[2]/span').then(element => element[0].evaluate(node => node.textContent));
                } else {
                    nom = '';
                }
                taille = await page.$x('//*[@id="partner_list_rows"]/div['+i+']/div[3]/span[2]');
                if (await taille.length > 0) {
                    adresse = await page.$x('//*[@id="partner_list_rows"]/div['+i+']/div[3]/span[2]').then(element => element[0].evaluate(node => node.textContent));
                } else {
                    adresse = '';
                }
                taille = await page.$x('//*[@id="partner_list_rows"]/div['+i+']/div[4]/div/span');
                if (await taille.length > 0) {
                    tel = await page.$x('//*[@id="partner_list_rows"]/div['+i+']/div[4]/div/span').then(element => element[0].evaluate(node => node.textContent));
                } else {
                    tel = '';
                }
                taille = await page.$x('//*[@id="partner_list_rows"]/div['+i+']/div[4]/div/a');
                if (await taille.length > 0) {
                    lien = await page.$x('//*[@id="partner_list_rows"]/div['+i+']/div[4]/div/a').then(element => element[0].evaluate(node => node.textContent));
                } else {
                    lien = '';
                }
                const tab = [nom,adresse,tel,lien,'BitDefender'];
                csvData.push(tab)
            }
            j= j+1
            const suivant = await page.$('#page')
            const long = await suivant.select(`${j}`)
            if(long.length !== 0){
                await suivant.select(`${j}`)
                await attendre(5000,5000)
            }else{
                next = false;
            }
        }
    });
    await cluster.queue('https://www.bitdefender.fr/partners/partner-locator.html')
    await cluster.idle();
    await cluster.close();
    await attendre(5000,5000)
    console.log(JSON.stringify(csvData))
})();
