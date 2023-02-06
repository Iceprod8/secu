const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');
const { JSDOM } = require('jsdom');


let tabPays = ["AF","AL","AQ","DZ","AS","AD","AO","AG","AZ","AR","AU","AT","BS","BH","BD","AM","BB","BE","BM","BT","BO","BA","BW","BV","BR","BZ","IO","SB","VG","BN","BG","MM","BI","BY","KH","CM","CA","CV","KY","CF","LK","TD","CL","CN","TW","CX","CC","CO","KM","YT","CG","CD","CK","CR","HR","CU","CY","CZ","BJ","DK","DM","DO","EC","SV","GQ","ET","ER","EE","FO","FK","GS","FJ","FI","AX","FR","GF","PF","TF","DJ","GA","GE","GM","PS","DE","GH","GI","KI","GR","GL","GD","GP","GU","GT","GN","GY","HT","HM","VA","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IL","IT","CI","JM","JP","KZ","JO","KE","KP","KR","KW","KG","LA","LB","LS","LV","LR","LY","LI","LT","LU","MO","MG","MW","MY","MV","ML","MT","MQ","MR","MU","MX","MC","MN","MD","MS","MA","MZ","OM","NA","NR","NP","NL","AN","AW","NC","VU","NZ","NI","NE","NG","NU","NF","NO","MP","UM","FM","MH","PW","PK","PA","PG","PY","PE","PH","PN","PL","PT","GW","TL","PR","QA","RE","RO","RU","RW","SH","KN","AI","LC","PM","VC","SM","ST","SA","SN","SC","SL","SG","SK","VN","SI","SO","ZA","ZW","ES","EH","SD","SR","SJ","SZ","SE","CH","SY","TJ","TH","TG","TK","TO","TT","AE","TN","TR","TM","TC","TV","UG","UA","MK","EG","GB","IM","TZ","US","VI","BF","UY","UZ","VE","WF","WS","YE","CS","ZM"]
let paysMonde = ['Afghanistan', 'Albania', 'Antarctica', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Azerbaijan', 'Argentina', 'Australia', 'Austria', 'Bahamas', 'Bahrain', 'Bangladesh', 'Armenia', 'Barbados', 'Belgium', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'Belize', 'British Indian Ocean Territory', 'Solomon Islands', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Myanmar', 'Burundi', 'Belarus', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African', 'Sri Lanka', 'Chad', 'Chile', 'China', 'Taiwan', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Mayotte', 'Republic of the Congo', 'The Democratic Republic Of The Congo', 'Cook Islands', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Benin', 'Denmark', 'Dominica', 'Dominican Republic', 'Ecuador', 'El Salvador', 'Equatorial Guinea', 'Ethiopia', 'Eritrea', 'Estonia', 'Faroe Islands', 'Falkland Islands', 'South Georgia and the South Sandwich Islands', 'Fiji', 'Finland', 'Åland Islands', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Djibouti', 'Gabon', 'Georgia', 'Gambia', 'Occupied Palestinian Territory', 'Germany', 'Ghana', 'Gibraltar', 'Kiribati', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Vatican City State', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Islamic Republic of Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', "Côte d'Ivoire", 'Jamaica', 'Japan', 'Kazakhstan', 'Jordan', 'Kenya', "Democratic People's Republic of Korea", 'Republic of Korea', 'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Lebanon', 'Lesotho', 'Latvia', 'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Martinique', 'Mauritania', 'Mauritius', 'Mexico', 'Monaco', 'Mongolia', 'Republic of Moldova', 'Montserrat', 'Morocco', 'Mozambique', 'Oman', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'Aruba', 'New Caledonia', 'Vanuatu', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Norway', 'Northern Mariana Islands', 'United States Minor Outlying Islands', 'Federated States of Micronesia', 'Marshall Islands', 'Palau', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Guinea-Bissau', 'Timor-Leste', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Helena', 'Saint Kitts and Nevis', 'Anguilla', 'Saint Lucia', 'Saint-Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Vietnam', 'Slovenia', 'Somalia', 'South Africa', 'Zimbabwe', 'Spain', 'Western Sahara', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Tajikistan', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'United Arab Emirates', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'The Former Yugoslav Republic of Macedonia', 'Egypt', 'United Kingdom', 'Isle of Man', 'United Republic Of Tanzania', 'United States', 'U.S. Virgin Islands', 'Burkina Faso', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Wallis and Futuna', 'Samoa', 'Yemen', 'Serbia and Montenegro', 'Zambia']

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
        const donne = await page.$x('/html/body/pre').then(element => element[0].evaluate(node => node.textContent));
        const data = await JSON.parse(donne);
        for (var i = 0; i < data.length; i++) {
            const nom = data[i].name
            const ad = data[i].address.street + " " + data[i].address.city + " " + data[i].address.state + " " + data[i].address.zip;
            const adresse = ad.replace(/\n/g,' ').replace(/,/g, ' ').replace(/\r/g,' ')
            const actuellePays = url.replace('https://api-router.kaspersky-labs.com/partner/B2B/account/list?country=','').replace('&take=999999','')
            const paysPosition = tabPays.indexOf(actuellePays);
            const pays = paysMonde[paysPosition]
            const tel = data[i].phone
            const lien = data[i].website
            const tab = [nom,adresse,pays,tel,lien,"Kapersky"]
            csvData.push(tab)
        }
    });
    for(k=0;k<tabPays.length;k++){
        await cluster.queue(`https://api-router.kaspersky-labs.com/partner/B2B/account/list?country=${tabPays[k]}&take=999999`)
    }
    await cluster.idle();
    await cluster.close()
    await attendre(5000,5000)
    console.log(JSON.stringify(csvData))
})();
