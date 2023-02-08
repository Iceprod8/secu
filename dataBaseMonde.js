const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');

let csvData = [];
let paysMonde = ['Afghanistan', 'Albania', 'Antarctica', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Azerbaijan', 'Argentina', 'Australia', 'Austria', 'Bahamas', 'Bahrain', 'Bangladesh', 'Armenia', 'Barbados', 'Belgium', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'Belize', 'British Indian Ocean Territory', 'Solomon Islands', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Myanmar', 'Burundi', 'Belarus', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African', 'Sri Lanka', 'Chad', 'Chile', 'China', 'Taiwan', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Mayotte', 'Republic of the Congo', 'The Democratic Republic Of The Congo', 'Cook Islands', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Benin', 'Denmark', 'Dominica', 'Dominican Republic', 'Ecuador', 'El Salvador', 'Equatorial Guinea', 'Ethiopia', 'Eritrea', 'Estonia', 'Faroe Islands', 'Falkland Islands', 'South Georgia and the South Sandwich Islands', 'Fiji', 'Finland', 'Åland Islands', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Djibouti', 'Gabon', 'Georgia', 'Gambia', 'Occupied Palestinian Territory', 'Germany', 'Ghana', 'Gibraltar', 'Kiribati', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Vatican City State', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Islamic Republic of Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', "Côte d'Ivoire", 'Jamaica', 'Japan', 'Kazakhstan', 'Jordan', 'Kenya', "Democratic People's Republic of Korea", 'Republic of Korea', 'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Lebanon', 'Lesotho', 'Latvia', 'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Martinique', 'Mauritania', 'Mauritius', 'Mexico', 'Monaco', 'Mongolia', 'Republic of Moldova', 'Montserrat', 'Morocco', 'Mozambique', 'Oman', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'Aruba', 'New Caledonia', 'Vanuatu', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Norway', 'Northern Mariana Islands', 'United States Minor Outlying Islands', 'Federated States of Micronesia', 'Marshall Islands', 'Palau', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Guinea-Bissau', 'Timor-Leste', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Helena', 'Saint Kitts and Nevis', 'Anguilla', 'Saint Lucia', 'Saint-Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Vietnam', 'Slovenia', 'Somalia', 'South Africa', 'Zimbabwe', 'Spain', 'Western Sahara', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Tajikistan', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'United Arab Emirates', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'The Former Yugoslav Republic of Macedonia', 'Egypt', 'United Kingdom', 'Isle of Man', 'United Republic Of Tanzania', 'United States', 'U.S. Virgin Islands', 'Burkina Faso', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Wallis and Futuna', 'Samoa', 'Yemen', 'Serbia and Montenegro', 'Zambia']
let tabPays = ["AF", "AL", "AQ", "DZ", "AS", "AD", "AO", "AG", "AZ", "AR", "AU", "AT", "BS", "BH", "BD", "AM", "BB", "BE", "BM", "BT", "BO", "BA", "BW", "BV", "BR", "BZ", "IO", "SB", "VG", "BN", "BG", "MM", "BI", "BY", "KH", "CM", "CA", "CV", "KY", "CF", "LK", "TD", "CL", "CN", "TW", "CX", "CC", "CO", "KM", "YT", "CG", "CD", "CK", "CR", "HR", "CU", "CY", "CZ", "BJ", "DK", "DM", "DO", "EC", "SV", "GQ", "ET", "ER", "EE", "FO", "FK", "GS", "FJ", "FI", "AX", "FR", "GF", "PF", "TF", "DJ", "GA", "GE", "GM", "PS", "DE", "GH", "GI", "KI", "GR", "GL", "GD", "GP", "GU", "GT", "GN", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "CI", "JM", "JP", "KZ", "JO", "KE", "KP", "KR", "KW", "KG", "LA", "LB", "LS", "LV", "LR", "LY", "LI", "LT", "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MQ", "MR", "MU", "MX", "MC", "MN", "MD", "MS", "MA", "MZ", "OM", "NA", "NR", "NP", "NL", "AN", "AW", "NC", "VU", "NZ", "NI", "NE", "NG", "NU", "NF", "NO", "MP", "UM", "FM", "MH", "PW", "PK", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "GW", "TL", "PR", "QA", "RE", "RO", "RU", "RW", "SH", "KN", "AI", "LC", "PM", "VC", "SM", "ST", "SA", "SN", "SC", "SL", "SG", "SK", "VN", "SI", "SO", "ZA", "ZW", "ES", "EH", "SD", "SR", "SJ", "SZ", "SE", "CH", "SY", "TJ", "TH", "TG", "TK", "TO", "TT", "AE", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "MK", "EG", "GB", "IM", "TZ", "US", "VI", "BF", "UY", "UZ", "VE", "WF", "WS", "YE", "CS", "ZM"]

// fonction pour faire un temps d'attente
function attendre(min, max) {
  const temps = Math.random() * (max - min) + min;
  return new Promise(resolve => {
    setTimeout(resolve, temps);
  });
}
// cisco
(async () => {
  let lienPartner = []
  let error = []
  let csv = []
  let next = true
  let first = true
  let pageSuivant,taille,nom,adresse,adresseTab,pays,site,tel,tab,tab1,lienTotalPartner
  let nbPage = 0
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    timeout: 500000000,
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
      await page.goto(lien);
      page.on('response', async response => {
        if (response.url().includes('getPfPartners')) {
          await response.json().then(data => {
            for (let i = 0; i < 12; i++) {
              try {
                lienPartner.push(data.data[i].site_id)
              } catch (err) {
                error.push(err)
              }
            }
          })
        }
      });
      while (next) {
        nbPage++
        await attendre(10000, 10000)
        pageSuivant = await page.$('#scrollableArea > div:nth-child(2) > div > main > div > section > div.__MR_HOME_SEARCH_MAIN_RESULTS__.flex-grow.flex.flex-col.justify-center.border-t.border-cc-gray-05.px-2.\\32 xs\\:px-0.py-6 > nav > ul > li:nth-child(3) > a > span');
        if (pageSuivant !== null) {
          await pageSuivant.click();
        } else {
          next = false;
        }
        console.log(`\nCisco, page: ${nbPage}\n`)
      }
    } else {
      await page.goto(lien);
      await attendre(10000, 10000)
      taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/h3');
      if (taille.length > 0) {
        nom = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/h3').then(element => element[0].evaluate(node => node.textContent));
      } else {
        nom = '';
      }
      taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[1]');
      if (taille.length > 0) {
        adresse = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[1]').then(element => element[0].evaluate(node => node.innerHTML));
        adresseTab = adresse.split('<p>');
        adresse = ''
        for (let k = 0; k < adresseTab.length - 1; k++) {
          adresse = adresse + adresseTab[k]
          pays = adresseTab[k + 1]
        }
      } else {
        adresse = '';
        pays = '';
      }
      taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[1]/a');
      if (taille.length > 0) {
        site = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[1]/a').then(element => element[0].evaluate(node => node.textContent));
      } else {
        site = '';
      }
      taille = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[2]/a');
      if (taille.length > 0) {
        tel = await page.$x('//*[@id="scrollableArea"]/div[1]/div[1]/div[1]/section/div[2]/p[2]/a').then(element => element[0].evaluate(node => node.textContent.replace(/,/g, '').replace('FRANCE', '')));
      } else {
        tel = '';
      }
      tab = [nom, adresse, pays, tel, site, 'Cisco'];
      tab1 = tab.map(val => val.replace(/,/g, ".").replace(/<\/p>/g, " ").replace(/\n/g,''));
      csv.push(tab1);
      console.log("Il y'a pour l'instant "+csv.length+" Partenaire Cisco")
    }
  });
  await cluster.queue('https://locatr.cloudapps.cisco.com/WWChannels/LOCATR/pf/index.jsp#/')
  await cluster.idle();
  first = false
  lienTotalPartner = Array.from(new Set(lienPartner));
  for (let j = 0; j < lienTotalPartner.length; j++) {
    await cluster.queue(`https://locatr.cloudapps.cisco.com/WWChannels/LOCATR/pf/index.jsp#/partner/${lienTotalPartner[j]}`)
  }
  await cluster.idle()
  await cluster.close();
  let csv2 = Array.from(new Set(csv));
  for(let m =0;m < csv2.length;m++){
    csvData.push(csv2[m])
  }
  console.log('Cisco Effectuer')
  fs.writeFile('scrapAll.csv', csvData.join('\n'), 'utf8', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Fichier CSV de la nouvelle BDD Monde enregistré');
    }
  });
})();

// withsecure
(async () => {
  let html,dom,donne,nom,adresse,adresseTab,pays,tel,lien,tab,tab1
  let csv = []
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
    html = await page.content();
    fs.writeFileSync('scrapWith.html', html);
    await attendre(5000, 5000);
    dom = await JSDOM.fromFile('./scrapWith.html');
    await attendre(5000, 5000)
    donne = dom.window.document.querySelectorAll('.p-a-2');
    for (let i = 0; i < donne.length; i++) {
      nom = donne[i].querySelector('h3').textContent
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
      tab = [nom, adresse, pays, tel, lien, 'WithSecure']
      tab1 = tab.map(val => val.replace(/,/g, ".").replace(/\n/g,''));
      csv.push(tab1)
    }
  });


  await cluster.queue('https://www.withsecure.com/en/partners/find-a-partner');
  await cluster.idle();
  await cluster.close();
  let csv2 = Array.from(new Set(csv));
  for(let m =0;m < csv2.length;m++){
    csvData.push(csv2[m])
  }
  console.log('Withsecure Effectuer')
  fs.writeFile('scrapAll.csv', csvData.join('\n'), 'utf8', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Fichier CSV de la nouvelle BDD Monde enregistré');
    }
  });
})();

// watchguard
(async () => {
  let paysRecherche,button,donne,nomE,nom,ad,adresse,adresseTab,tel,lien,tab,tab1
  let csv = []
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
    await page.goto(url)
    await attendre(5000, 5000)
    for (let k = 0; k < paysMonde.length; k++) {
      paysRecherche = await page.$('#address');
      await paysRecherche.type(paysMonde[k]);
      await attendre(2500, 2500);
      button = await page.$('#seachByLocationRadiusDiv > ul > li:nth-child(4) > label');
      await button.click();
      await attendre(2500, 2500)
      donne = await page.$$('#sellersGrid > div.collection > div');
      for (let i = 1; i <= donne.length; i++) {
        nomE = await page.$x('//*[@id="sellersGrid"]/div[2]/div[' + i + ']/div[2]/a/h2');
        if (nomE.length > 0) {
          nom = await page.$x('//*[@id="sellersGrid"]/div[2]/div[' + i + ']/div[2]/a/h2').then(element => element[0].evaluate(node => node.textContent));
        } else {
          nom = '';
        }
        ad = await page.$x('//*[@id="sellersGrid"]/div[2]/div[' + i + ']/div[2]/div[4]/span[1]');
        if (ad.length > 0) {
          adresse = await page.$x('//*[@id="sellersGrid"]/div[2]/div[' + i + ']/div[2]/div[4]/span[1]').then(element => element[0].evaluate(node => node.textContent));
          adresseTab = adresse.split(',');
          adresse = ''
          for (let k = 1; k < adresseTab.length; k++) {
            adresse = adresse + adresseTab[k]
            pays = adresseTab[0]
          }
        } else {
          adresse = '';
        }

        tel = '';
        lien = '';
        tab = [nom, adresse, pays, tel, lien, 'WatchGuard'];
        tab1 = tab.map(val => val.replace(/,/g, "").replace(/\(\)/g, '').replace(/  /g, ''));
        csv.push(tab1);
      }
      await page.reload()
      await attendre(1000, 1000)
    }
  });
  await cluster.queue('https://findpartner.watchguard.com/')
  await cluster.idle();
  await cluster.close();
  let csv2 = Array.from(new Set(csv));
  for(let m =0;m < csv2.length;m++){
    csvData.push(csv2[m])
  }
  console.log('Watchguard Effectuer')
  fs.writeFile('scrapAll.csv', csvData.join('\n'), 'utf8', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Fichier CSV de la nouvelle BDD Monde enregistré');
    }
  });
})();

// trendMicro
(async () => {
  let first = true
  let totalPays
  let csv = []
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
    if (first) {
      await page.goto(url);
      await attendre(5000, 5000);
      totalPays = await page.$$('body > main > div.reseller.vitl.section.full-browser-width-wrap > div.child-of-full-width > div > div.form-wrap.row > div:nth-child(1) > div > select > option');
    } else {
      let selectPays,payActuel,pays,actualise,cok,next,nom,adresse
      let tabInfo = []
      let nbPage = 0
      await page.goto(url);
      await attendre(5000, 5000);
      selectPays = await page.$('body > main > div.reseller.vitl.section.full-browser-width-wrap > div.child-of-full-width > div > div.form-wrap.row > div:nth-child(1) > div > select');
      payActuel = (trendmicropays + 1).toString();
      await selectPays.select(payActuel);
      await attendre(1000,1000)
      pays = await page.evaluate(select => {
        return select.options[select.selectedIndex].text;
      }, selectPays);
      actualise = await page.$('body > main > div.reseller.vitl.section.full-browser-width-wrap > div.child-of-full-width > div > div.form-wrap.row > div.col-xs-12.col-sm-2.button-wrap > input');
      await actualise.click();
      cok = await page.$('#onetrust-accept-btn-handler');
      await cok.click();
      await attendre(3000, 3000);
      next = true;
      let nbpartenaire = 0
      while (next) {
        nbPage++
        console.log(`\nTrendMicro, pays: ${pays} page: ${nbPage} partenaire: ${nbpartenaire}\n`)
        let donne = await page.$$('body > main > div.reseller.vitl.section.full-browser-width-wrap > div.child-of-full-width > div > table > tbody > tr');
        for (let i = 1; i <= donne.length; i++) {
          nbpartenaire++
          let nomE = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[1]/div/h4');
          if (nomE.length > 0) {
            nom = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[1]/div/h4').then(element => element[0].evaluate(node => node.textContent));
          } else {
            nom = '';
          }
          let info = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[3]');
          if (info.length > 0) {
            info = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[3]').then(element => element[0].evaluate(node => node.innerHTML.replace(/\t/g, '').replace(/\n/g, '').replace(/,/g, '').replace('France', '')));
            tabInfo = info.split('<br>');
            adresse = tabInfo[0];
          } else {
            adresse = '';
          }
          let lien = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[3]/a');
          if (lien.length > 0) {
            lien = await page.$x('/html/body/main/div[1]/div[2]/div/table/tbody/tr[' + i + ']/td[3]/a').then(element => element[0].evaluate(node => node.textContent));
          } else {
            lien = '';
          }
          let tel = '';
          let tab = [nom, adresse, pays, tel, lien, 'TrendMicro'];
          let tab1 = tab.map(val => val.replace(/,/g, ".").replace(/\n/g,''));
          csv.push(tab1);
        }
        let button = await page.$('body > main > div.reseller.vitl.section.full-browser-width-wrap > div.child-of-full-width > div > nav > button.results-nav__button.next-button');
        if (button !== null) {
          let nombre1 = await page.$x('/html/body/main/div[1]/div[2]/div/nav/span/span[2]').then(element => element[0].evaluate(node => node.textContent));
          await button.click();
          await attendre(2500,3000)
          let nombre2 = await page.$x('/html/body/main/div[1]/div[2]/div/nav/span/span[2]').then(element => element[0].evaluate(node => node.textContent));
          if (nombre1 === nombre2) {
            next = false;
            console.log('10')
          }
        } else {
          next = false;
          console.log('11')
        }
      }
    }
  });
  await cluster.queue('https://www.trendmicro.com/en_us/partners/find-a-partner.html')
  await cluster.idle();
  first = false
  for (trendmicropays = 0; trendmicropays < totalPays.length; trendmicropays++) {
    await cluster.queue('https://www.trendmicro.com/en_us/partners/find-a-partner.html')
    await cluster.idle()
  }
  await cluster.close();
  let csv2 = Array.from(new Set(csv));
  for(let m =0;m < csv2.length;m++){
    csvData.push(csv2[m])
  }
  console.log('trendMicro Effectuer')
  fs.writeFile('scrapAll.csv', csvData.join('\n'), 'utf8', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Fichier CSV de la nouvelle BDD Monde enregistré');
    }
  });
})();

// //trellix
(async () => {
  let first = true
  let options,countries,firstPage,next,donne,nomE,nom,info,tabInfo,adresse,pays,tel,lien,tab,suivant
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
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
    if (first) {
      await page.goto(url);
      await attendre(5000, 5000);
      options = await page.$$('#l0 > option');
      countries = await Promise.all(options.map(async option => {
        return await page.evaluate(element => element.textContent, option);
      }));
    } else {
      await page.goto(url);
      await attendre(5000, 5000);
      firstPage = true
      next = true;
      while (next) {
        donne = await page.$$('#Locator_BodyContent_ResultsContainer > div:nth-child(4) > div.col-sm-8 > div > div');
        for (let i = 1; i <= donne.length; i++) {
          nomE = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/h3');
          if (nomE.length > 0) {
            nom = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/h3').then(element => element[0].evaluate(node => node.textContent));
          } else {
            nom = '';
          }
          info = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/div[2]/div');
          if (info.length > 0) {
            info = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/div[2]/div').then(element => element[0].evaluate(node => node.innerHTML.replace(/\t/g, '').replace(/\n/g, '').replace(/,/g, '').replace('Téléphone: ', '')));
            tabInfo = info.split('<br>');
            adresse = `${tabInfo[0]} ${tabInfo[1]}`;
            pays = `${tabInfo[2]}`
            if (tabInfo[5].includes('+')) {
              tel = tabInfo[5];
            } else if (tabInfo[4].includes('+')) {
              tel = tabInfo[4];
            } else {
              tel = '';
            }
          }

          lien = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/div[2]/div/a');
          if (lien.length > 0) {
            lien = await page.$x('//*[@id="Locator_BodyContent_ResultsContainer"]/div[4]/div[2]/div/div[' + i + ']/div/div[2]/div/a').then(element => element[0].evaluate(node => node.textContent));
          } else {
            lien = '';
          }
          tab = [nom, adresse, pays, tel, lien, "Trellix"];
          let tab1 = tab.map(val => val.replace(/,/g, ".").replace(/\n/g,''));
          csvData.push(tab1);
        }
        if (firstPage) {
          suivant = await page.$('#Locator_BodyContent_ResultsContainer > div:nth-child(3) > div > nav > ul > li:nth-child(9) > a');
          if (suivant !== null) {
            await suivant.click();
            await attendre(2000, 2000);
          } else {
            next = false;
          }
          firstPage = false;
        } else {
          suivant = await page.$('#Locator_BodyContent_ResultsContainer > div:nth-child(3) > div > nav > ul > li:nth-child(10) > a');
          if (suivant !== null) {
            await suivant.click();
            await attendre(2000, 2000);
          } else {
            next = false;
          }
        }
      }
    }
  });
  await cluster.queue('https://trellixpartners.trellix.com/fr-fr/directory');
  await cluster.idle();
  first = false
  for (let p = 0; p < countries.length; p++) {
    await cluster.queue(`https://trellixpartners.trellix.com/fr-fr/directory/search?l=${countries[p]}`);
  }
  await cluster.idle();
  await cluster.close();
  console.log('Trellix Effectuer')
  fs.writeFile('scrapAll.csv', csvData.join('\n'), 'utf8', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Fichier CSV de la nouvelle BDD Monde enregistré');
    }
  });
})();

// sophos
(async () => {
  let first = true
  let tabLien = []
  let csv = []
  let donne,lien,datalien,nom,taille,adresse,pays,tel,website,tab
  let nbPage = 0
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 10,
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
    nbPage ++
    console.log(`\nSohpos, page: ${nbPage}\n`)
    await page.goto(url);
    await attendre(5000, 5000)
    if (first) {
      donne = await page.$$('#Locator_BodyContent_ResultsContainer > div:nth-child(4) > div.col-lg-9.col-md-9.col-sm-12 > div > div');
      for (let i = 1; i <= donne.length; i++) {
        lien = await page.$('#Locator_BodyContent_ResultsContainer > div:nth-child(4) > div.col-lg-9.col-md-9.col-sm-12 > div > div:nth-child(' + i + ') > div > div.panel-body.locator-panel-styles > p > a')
        datalien = await page.evaluate((lien) => lien.href, lien);
        tabLien.push(datalien)
      }
      console.log()
    } else {
      taille = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[1]');
      if (taille.length > 0) {
        nom = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[1]').then(element => element[0].evaluate(node => node.textContent));
      } else {
        nom = '';
      }
      taille = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/address');
      if (taille.length > 0) {
        adresse = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/address').then(element => element[0].evaluate(node => node.innerHTML.replace(/(\s|<br>|&nbsp;|<span.*?>|<\/span>)/g, ' ').replace(/,/g, ' ').replace(/   /g, '')));
      } else {
        adresse = '';
      }
      taille = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/address/span[5]');
      if (taille.length > 0) {
        pays = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/address/span[5]').then(element => element[0].evaluate(node => node.textContent));
      } else {
        pays = '';
      }
      taille = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[2]/text()');
      if (taille.length > 0) {
        tel = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[2]/text()').then(element => element[0].evaluate(node => node.textContent));
      } else {
        tel = '';
      }
      taille = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[3]/a');
      if (taille.length > 0) {
        website = await page.$x('//*[@id="overview"]/div[2]/div/div[2]/span[3]/a').then(element => element[0].evaluate(node => node.textContent));
      } else {
        website = '';
      }
      tab = [nom, adresse, pays, tel, website, 'Sophos'];
      let tab1 = tab.map(val => val.replace(/,/g, ".").replace(/\n/g,''));
      csv.push(tab1)
    }

  });
  for (let j=0;j<=1000;j++) {
    await cluster.queue(`https://partners.sophos.com/english/directory/search?p=${j}`)
  }
  await cluster.idle()
  first = false;
  for (let i = 0; i < tabLien.length; i++) {
    await cluster.queue(tabLien[i]);
  }
  await cluster.idle();
  await cluster.close();
  let csv2 = Array.from(new Set(csv));
  for(let m =0;m < csv2.length;m++){
    csvData.push(csv2[m])
  }
  console.log('Sophos Effectuer')
  fs.writeFile('scrapAll.csv', csvData.join('\n'), 'utf8', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Fichier CSV de la nouvelle BDD Monde enregistré');
    }
  });
})();

// kapersky
(async () => {
  let donne,data,nom,ad,adresse,actuellePays,pays,tel,lien,tab
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 25,
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
    await page.goto(url)
    donne = await page.$x('/html/body/pre').then(element => element[0].evaluate(node => node.textContent));
    data = await JSON.parse(donne);
    for (let i = 0; i < data.length; i++) {
      nom = data[i].name
      ad = data[i].address.street + " " + data[i].address.city + " " + data[i].address.state + " " + data[i].address.zip;
      adresse = ad.replace(/\n/g, ' ').replace(/,/g, ' ').replace(/\r/g, ' ')
      actuellePays = url.replace('https://api-router.kaspersky-labs.com/partner/B2B/account/list?country=', '').replace('&take=999999', '')
      paysPosition = tabPays.indexOf(actuellePays);
      pays = paysMonde[paysPosition]
      tel = data[i].phone
      lien = data[i].website
      tab = [nom, adresse, pays, tel, lien, "Kapersky"]
      let tab1 = tab.map(val => val.replace(/,/g, ".").replace(/\n/g,''));
      csvData.push(tab1)
    }
  });
  for (let k = 0; k < tabPays.length; k++) {
    await cluster.queue(`https://api-router.kaspersky-labs.com/partner/B2B/account/list?country=${tabPays[k]}&take=999999`)
  }
  await cluster.idle();
  await cluster.close();
  console.log('Kapersky Effectuer')
  fs.writeFile('scrapAll.csv', csvData.join('\n'), 'utf8', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Fichier CSV de la nouvelle BDD Monde enregistré');
    }
  });
})();

try {
  const uri = "mongodb+srv://CyberSite:EEpwNzf1LM6R95S0@cluster0.c6zinmu.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  client.connect(err => {
    const collection = client.db('Info').collection('classementMonde');
    var today = new Date();
    for (let i = 0; i < csvAllMonde.length; i++) {
      collection.findOneAndUpdate(
        {
          "Nom": `${csvAllMonde[i][0]}`,
          "Adresse": `${csvAllMonde[i][1]}`,
          "Pays": `${csvAllMonde[i][2]}`,
          "Telephone": `${csvAllMonde[i][3]}`,
          "Lien": `${csvAllMonde[i][4]}`,
          "Marque": `${csvAllMonde[i][5]}`,
          "Actif": true
        },
        {
          $setOnInsert: { "Premier": today },
          $set: { "Dernier": today }
        },
        {
          upsert: true,
          returnOriginal: false
        },
        function (err, donne) {
          if (!err) {
            if (!donne.lastErrorObject.updatedExisting) {
              console.log('nouvelle entreprise!')
            }
          }
        }
      )
    }
    // remplacement des documents où dernier est différent de la date d'aujourd'hui
    collection.updateMany(
      { "Dernier": { $ne: today } },
      { $set: { "Actif": false } }
    );
  })

} catch (err) {
  console.error(`Error: ${err}`);
}
console.log("base du monde a ete mise a jour")
