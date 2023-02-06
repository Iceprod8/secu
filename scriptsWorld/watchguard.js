const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');


const paysMonde = ['Afghanistan', 'Albania', 'Antarctica', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Azerbaijan', 'Argentina', 'Australia', 'Austria', 'Bahamas', 'Bahrain', 'Bangladesh', 'Armenia', 'Barbados', 'Belgium', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'Belize', 'British Indian Ocean Territory', 'Solomon Islands', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Myanmar', 'Burundi', 'Belarus', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African', 'Sri Lanka', 'Chad', 'Chile', 'China', 'Taiwan', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Mayotte', 'Republic of the Congo', 'The Democratic Republic Of The Congo', 'Cook Islands', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Benin', 'Denmark', 'Dominica', 'Dominican Republic', 'Ecuador', 'El Salvador', 'Equatorial Guinea', 'Ethiopia', 'Eritrea', 'Estonia', 'Faroe Islands', 'Falkland Islands', 'South Georgia and the South Sandwich Islands', 'Fiji', 'Finland', 'Åland Islands', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Djibouti', 'Gabon', 'Georgia', 'Gambia', 'Occupied Palestinian Territory', 'Germany', 'Ghana', 'Gibraltar', 'Kiribati', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Vatican City State', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Islamic Republic of Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', "Côte d'Ivoire", 'Jamaica', 'Japan', 'Kazakhstan', 'Jordan', 'Kenya', "Democratic People's Republic of Korea", 'Republic of Korea', 'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Lebanon', 'Lesotho', 'Latvia', 'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Martinique', 'Mauritania', 'Mauritius', 'Mexico', 'Monaco', 'Mongolia', 'Republic of Moldova', 'Montserrat', 'Morocco', 'Mozambique', 'Oman', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'Aruba', 'New Caledonia', 'Vanuatu', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Norway', 'Northern Mariana Islands', 'United States Minor Outlying Islands', 'Federated States of Micronesia', 'Marshall Islands', 'Palau', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Guinea-Bissau', 'Timor-Leste', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Helena', 'Saint Kitts and Nevis', 'Anguilla', 'Saint Lucia', 'Saint-Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Vietnam', 'Slovenia', 'Somalia', 'South Africa', 'Zimbabwe', 'Spain', 'Western Sahara', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Tajikistan', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'United Arab Emirates', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'The Former Yugoslav Republic of Macedonia', 'Egypt', 'United Kingdom', 'Isle of Man', 'United Republic Of Tanzania', 'United States', 'U.S. Virgin Islands', 'Burkina Faso', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Wallis and Futuna', 'Samoa', 'Yemen', 'Serbia and Montenegro', 'Zambia']
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
    await page.goto(url)
    await attendre(5000, 5000)
    for (k = 0; k < paysMonde.length; k++) {
      const paysRecherche = await page.$('#address');
      await paysRecherche.type(paysMonde[k]);
      await attendre(2500, 2500);
      const button = await page.$('#seachByLocationRadiusDiv > ul > li:nth-child(4) > label');
      await button.click();
      await attendre(2500, 2500)
      const donne = await page.$$('#sellersGrid > div.collection > div');
      for (i = 1; i <= donne.length; i++) {
        const nomE = await page.$x('//*[@id="sellersGrid"]/div[2]/div[' + i + ']/div[2]/a/h2');
        if (nomE.length > 0) {
          nom = await page.$x('//*[@id="sellersGrid"]/div[2]/div[' + i + ']/div[2]/a/h2').then(element => element[0].evaluate(node => node.textContent));
        } else {
          nom = '';
        }
        const ad = await page.$x('//*[@id="sellersGrid"]/div[2]/div[' + i + ']/div[2]/div[4]/span[1]');
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

        const tel = '';
        const lien = '';
        tab = [nom, adresse, pays, tel, lien, 'WatchGuard'];
        tab1 = tab.map(val => val.replace(/,/g, "").replace(/\(\)/g, '').replace(/  /g, ''));
        csvData.push(tab1);
      }
      await page.reload()
      await attendre(1000, 1000)
    }
  });
  await cluster.queue('https://findpartner.watchguard.com/')
  await cluster.idle();
  await cluster.close();
  const csv = Array.from(new Set(csvData));
  await attendre(5000, 5000)
  console.log(JSON.stringify(csv))
})();
