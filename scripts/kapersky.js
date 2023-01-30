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
        maxConcurrency: 25,
        puppeteerOptions: {
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        },
    });
    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url)
        const donne = await page.$x('/html/body/pre').then(element => element[0].evaluate(node => node.textContent));
        const data = await JSON.parse(donne);
        for (var i = 0; i < data.length; i++) {
            const nom = data[i].name
            const ad = data[i].address.street + " " + data[i].address.city + " " + data[i].address.state + " " + data[i].address.zip;
            const adresse = ad.replace(/\n/g,' ').replace(/,/g, ' ').replace(/\r/g,' ')
            const tel = data[i].phone
            const lien = data[i].website
            const tab = [nom,adresse,tel,lien,"Kapersky"]
            csvData.push(tab)
        }
    });
    await cluster.queue('https://api-router.kaspersky-labs.com/partner/B2B/account/list?country=FR&take=999999')
    await cluster.idle();
    await cluster.close()
    await attendre(5000,5000)
    console.log(JSON.stringify(csvData))
})();
