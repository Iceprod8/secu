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
    });
    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);
        await attendre(2000, 2000);
        const selectElement = await page.$('#downshift-multiple-input');
        const selectButton = await page.$('#main_page_search_button');
        if (selectElement !== null && selectButton !== null) {
            const optionToSelect = 'france';
            await selectElement.type(optionToSelect);
            await attendre(2000, 2000);
            const france = await page.$('#downshift-multiple-item-0 > span.MuiButtonBase-root.MuiIconButton-root.jss145.MuiCheckbox-root.jss137 > span.MuiIconButton-label > input');
            await france.click();
            await attendre(3000, 3000);
            await selectButton.click();
            await attendre(3000, 3000);
            await page.reload()
            await attendre(3000, 3000)
            const nbPartner = await page.$('.num_of_results')
            if (nbPartner !== null) {
                p = await page.evaluate((info) => info.textContent.replace('partners', ''), nbPartner);
            } else {
                p = 'Pas d"info';
            }
            donne = await page.evaluate(() => {
                const elements = document.querySelectorAll('[id^="card_container"]');
                const IDs = [];
                for (const element of elements) {
                    IDs.push(element.id);
                }
                return IDs;
            });
            const partner = parseInt(p)
            while (donne.length < partner) {
                await page.evaluate(() => {
                    window.scrollBy(0, 3000);
                });
                await attendre(2000, 2000)
                const don = await page.evaluate(() => {
                    const elements = document.querySelectorAll(".partner_card_title");
                    const data = [];
                    for (const element of elements) {
                        data.push(element.innerHTML);
                    }
                    return data;
                });
                donne = don
            }
            const html = await page.content();
            if (html.includes('partner_card_title') !== null) {
                fs.writeFileSync('checkpoint.html', html);
                const file = './checkpoint.html'
                const dom = await JSDOM.fromFile(file);
                await attendre(3000);
                const doc = dom.window.document;
                const filteredElements = Array.from(doc.querySelectorAll('[id^="card_container"]'));
                for (i = 0; i < filteredElements.length; i++) {
                    if (filteredElements[i].textContent !== "" && filteredElements[i].textContent != 'Contact Information' && filteredElements[i].textContent != 'More Specializations') {
                        const test = filteredElements[i];
                        const partnerCards_Name = test.querySelector('.partner_card_title');
                        if (test.querySelector('.partner_card_phone') !== null) {
                            partnerCards_Phone = test.querySelector('.partner_card_phone');
                        } else {
                            partnerCards_Phone = '';
                        }
                        if (test.querySelector('.partner_card_address') !== null) {
                            partnerCards_adresse = test.querySelector('.partner_card_address');
                        } else {
                            partnerCards_adresse = '';
                        }
                        if (test.querySelector('.partner_card_website') !== null) {
                            partnerCards_url = test.querySelector('.partner_card_website');
                        } else {
                            partnerCards_url = '';
                        }
                        const lien = partnerCards_url.getAttribute('href');
                        const tab = [partnerCards_Name.textContent, partnerCards_adresse.textContent, partnerCards_Phone.textContent, lien,"CheckPoint"];
                        csvData.push(tab)
                    }
                }
            }

        }
    });
    await cluster.queue('https://partnerlocator.checkpoint.com/#/')
    await cluster.idle();
    await cluster.close();
    await attendre(10000,10000)
    console.log(JSON.stringify(csvData))
})();
