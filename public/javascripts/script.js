const compare = (ids, asc) => (row1, row2) => {
  const tdValue = (row, ids) => row.children[ids].textContent;
  const tri = (v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
  return tri(tdValue(asc ? row1 : row2, ids), tdValue(asc ? row2 : row1, ids));
};

const tbody = document.querySelector('tbody');
const thx = document.querySelectorAll('th');
const trxb = tbody.querySelectorAll('tr');
thx.forEach(th => th.addEventListener('click', () => {
  let classe = Array.from(trxb).sort(compare(Array.from(thx).indexOf(th), this.asc = !this.asc));
  classe.forEach(tr => tbody.appendChild(tr));
}));

const element = document.querySelector('.countdown::after');
const value = 40000;
element.style.setProperty('--my-custom-property', value + 's');

const button = document.getElementById('download-button');

button.addEventListener('click', (e) => {
  e.preventDefault();
  const link = document.createElement('a');
  link.href = 'javascripts/data.csv';
  link.download = 'data.csv';
  link.click();
});
