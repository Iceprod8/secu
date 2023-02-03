const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');



let csvData = [];
csvData.push(['']);
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
    maxConcurrency: 1,
    puppeteerOptions: {
      headless: false,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    },
  });
  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url);
    await attendre(5000,5000)
    page.on('response', response => {
      console.log(response.url());
    });
    });
await cluster.queue('https://locatr.cloudapps.cisco.com/WWChannels/LOCATR/pf/index.jsp#/')
await cluster.idle();
await cluster.close();
}) ();
