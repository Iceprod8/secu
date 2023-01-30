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
        await page.goto(url)
        const france = await page.$('#address');
        await france.type('France');
        const button = await page.$('#seachByLocationRadiusDiv > ul > li:nth-child(4) > label');
        await button.click();
        await attendre(5000,5000);
        const donne = await page.$$('#sellersGrid > div.collection > div');
        for(i=1;i<=donne.length;i++){

            const nomE = await page.$x('//*[@id="sellersGrid"]/div[2]/div['+i+']/div[2]/a/h2');
            if(nomE.length > 0){
                nom = await page.$x('//*[@id="sellersGrid"]/div[2]/div['+i+']/div[2]/a/h2').then(element => element[0].evaluate(node => node.textContent));
            }else{
                nom = '';
            }

            const ad = await page.$x('//*[@id="sellersGrid"]/div[2]/div['+i+']/div[2]/div[4]/span[1]');
            if(ad.length > 0){
                adresse = await page.$x('//*[@id="sellersGrid"]/div[2]/div['+i+']/div[2]/div[4]/span[1]').then(element => element[0].evaluate(node => node.textContent));
            }else{
                adresse = '';
            }

            const tel = '';
            const lien = '';
            tab = [nom,adresse,tel,lien,'WatchGuard'];
            tab1 = tab.map(val => val.replace(/,/g, "").replace('FRANCE','').replace(/FR/g,'').replace(/\(\)/g,'').replace(/  /g,''));
            csvData.push(tab1);
        }
    });
    await cluster.queue('https://findpartner.watchguard.com/')
    await cluster.idle();
    await cluster.close();
    await attendre(5000,5000)
    console.log(JSON.stringify(csvData))
})();
