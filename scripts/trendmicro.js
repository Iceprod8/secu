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
        puppeteerOptions: {
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        },
    });
    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);
        await attendre(5000,5000);
        const france = await page.$('body > main > div.reseller.vitl.section.full-browser-width-wrap > div.child-of-full-width > div > div.form-wrap.row > div.col-xs-12.col-sm-2.button-wrap > input');
        await france.click();
        const cok = await page.$('#onetrust-accept-btn-handler');
        await cok.click();
        await attendre(5000, 5000);
        next = true;
        while (next) {
            const donne = await page.$$('body > main > div.reseller.vitl.section.full-browser-width-wrap > div.child-of-full-width > div > table > tbody > tr');
            for (i = 1; i <= donne.length; i++) {
                const nomE = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[1]/div/h4');
                if (nomE.length > 0) {
                    nom = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[1]/div/h4').then(element => element[0].evaluate(node => node.textContent));
                } else {
                    nom = '';
                }
                info = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[3]');
                if (info.length > 0) {
                    info = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[3]').then(element => element[0].evaluate(node => node.innerHTML.replace(/\t/g, '').replace(/\n/g, '').replace(/,/g, '').replace('France', '')));
                    tabInfo = info.split('<br>');
                    adresse = tabInfo[0];
                } else {
                    adresse = '';
                }
                lien = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[3]/a');
                if (lien.length > 0) {
                    lien = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[3]/a').then(element => element[0].evaluate(node => node.textContent));
                } else {
                    lien = '';
                }
                tel = '';
                tab = [nom, adresse, tel, lien, 'TrendMicro'];
                csvData.push(tab);
            }
            const button = await page.$('body > main > div.reseller.vitl.section.full-browser-width-wrap > div.child-of-full-width > div > nav > button.results-nav__button.next-button');
            if (button !== null) {
                const nombre1 = await page.$x('/html/body/main/div[1]/div[2]/div/nav/span/span[2]').then(element => element[0].evaluate(node => node.textContent));
                await button.click();
                await attendre(1000,1000);
                const nombre2 = await page.$x('/html/body/main/div[1]/div[2]/div/nav/span/span[2]').then(element => element[0].evaluate(node => node.textContent));
                if (nombre1 === nombre2) {
                    next = false;
                }
            }else{
                next = false;
            }
        }
    });
    await cluster.queue('https://www.trendmicro.com/fr_fr/partners/find-a-partner.html')
    await cluster.idle();
    await cluster.close();
    await attendre(5000,5000)
    console.log(JSON.stringify(csvData))
})();
