const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');


let csvData = [];
totalpartner = 0
next = true
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
        await attendre(10000,10000)
        if(first){
            const test = await page.$x('//*[@id="partnerResults"]/div/div[2]/div[3]/div[1]/p/b')
            if(test !== null){
                const total = await page.$x('//*[@id="partnerResults"]/div/div[2]/div[3]/div[1]/p/b').then(element => element[0].evaluate(node => node.textContent));
                totalpartner = parseInt(total)
                first = false
            }
        }
        const valide = await page.$$('.panel-header')
        if(valide.length !== 0){
            for(i=1;i<=valide.length;i++){
                taille = await page.$x('//*[@id="partnerResults"]/div/div[2]/div[2]/div['+i+']/div/div[1]/div/div[1]/b/h3')
                if(taille.length > 0){
                    nom = await page.$x('//*[@id="partnerResults"]/div/div[2]/div[2]/div['+i+']/div/div[1]/div/div[1]/b/h3').then(element => element[0].evaluate(node => node.textContent));
                }else{
                    nom = ''
                }
                taille = await page.$x('//*[@id="partnerResults"]/div/div[2]/div[2]/div['+i+']/div/div[2]/div[1]/div/div[1]/p/text()[1]')
                if(taille.length > 0){
                    adresse = await page.$x('//*[@id="partnerResults"]/div/div[2]/div[2]/div['+i+']/div/div[2]/div[1]/div/div[1]/p/text()[1]').then(element => element[0].evaluate(node => node.textContent));
                }else{
                    adresse = ''
                }
                taille = await page.$x('//*[@id="partnerResults"]/div/div[2]/div[2]/div['+i+']/div/div[2]/div[1]/div/div[1]/p/text()[2]')
                if(taille.length > 0){
                    tel = await page.$x('//*[@id="partnerResults"]/div/div[2]/div[2]/div['+i+']/div/div[2]/div[1]/div/div[1]/p/text()[2]').then(element => element[0].evaluate(node => node.textContent));
                }else{
                    tel = ''
                }
                taille = await page.$x('//*[@id="partnerResults"]/div/div[2]/div[2]/div['+i+']/div/div[2]/div[1]/div/div[1]/p/a')
                if(taille.length > 0){
                    lien = await page.$x('//*[@id="partnerResults"]/div/div[2]/div[2]/div['+i+']/div/div[2]/div[1]/div/div[1]/p/a').then(element => element[0].evaluate(node => node.href));
                }else{
                    lien = ''
                }
                tab = [nom, adresse, tel, lien, 'Fortinet']
                tab1 = tab.map(val => val.replace(/,/g, "").replace(/\n/g,'').replace(/  /g,'').replace('Phone:', ''));
                csvData.push(tab1)
            }
        }else{
            if(csvData.length == totalpartner){
                next = false
            }else{
                k= k-1
            }
        }
    });
    k=0
    while(next){
        await cluster.queue(`https://partnerportal.fortinet.com/directory/search?l=France&p=${k}`)
        await cluster.idle();
        k++
    }
    await cluster.close();
    await attendre(5000,5000)
    console.log(JSON.stringify(csvData))
})();
