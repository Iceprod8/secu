const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');

csvData = []
next = true
tabLien = []
first = true
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
    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);
        await attendre(1000,1000)
        if (first) {
            const donne = await page.$$('#Locator_BodyContent_ResultsContainer > div:nth-child(4) > div.col-lg-9.col-md-9.col-sm-12 > div > div');
            for (i = 1; i <= donne.length; i++) {
                const lien = await page.$('#Locator_BodyContent_ResultsContainer > div:nth-child(4) > div.col-lg-9.col-md-9.col-sm-12 > div > div:nth-child(' + i + ') > div > div.panel-body.locator-panel-styles > p > a')
                const datalien = await page.evaluate((lien) => lien.href, lien);
                tabLien.push(datalien)
            }
            if (await page.$('#Locator_BodyContent_ResultsContainer > div:nth-child(5) > div.col-md-9.col-sm-12.col-xs-12.text-center > nav > ul > li:nth-child(12) > a') !== null || await page.$('#Locator_BodyContent_ResultsContainer > div:nth-child(5) > div.col-md-9.col-sm-12.col-xs-12.text-center > nav > ul > li:nth-child(11) > a') !== null) {
            } else {
                next = false;
            }
        } else {
            taille = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[1]');
            if (await taille.length > 0) {
                nom = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[1]').then(element => element[0].evaluate(node => node.textContent));
            } else {
                nom = '';
            }
            taille = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/address');
            if (await taille.length > 0) {
                adresse = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/address').then(element => element[0].evaluate(node => node.innerHTML.replace(/(\s|<br>|&nbsp;|<span.*?>|<\/span>)/g,' ').replace(/,/g,' ').replace(/   /g,'')));
            } else {
                adresse = '';
            }
            taille = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[2]/text()');
            if (await taille.length > 0) {
                tel = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[2]/text()').then(element => element[0].evaluate(node => node.textContent));
            } else {
                tel = '';
            }
            taille = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[3]/a');
            if (await taille.length > 0) {
                lien = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[3]/a').then(element => element[0].evaluate(node => node.textContent));
            } else {
                lien = '';
            }
            const tab = [nom, adresse, tel, lien, 'Sophos'];
            csvData.push(tab)
        }

    });
    j = 0
    while (next) {
        await cluster.queue(`https://partners.sophos.com/english/directory/search?country=France&p=${j}`)
        await cluster.idle();
        j++
    }
    first = false;
    for (i = 0; i < tabLien.length; i++) {
        await cluster.queue(tabLien[i]);
    }
    await cluster.idle();
    await cluster.close();
    await attendre(5000,5000)
    console.log(JSON.stringify(csvData))
})();
