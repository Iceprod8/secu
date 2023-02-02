var timer = 4000;
var i = 0;
var max = $('#c > li').length;
$("#c > li").eq(i).addClass('active').css('left', '0');
$("#c > li").eq(i + 1).addClass('active').css('left', '25%');
$("#c > li").eq(i + 2).addClass('active').css('left', '50%');
$("#c > li").eq(i + 3).addClass('active').css('left', '75%');

setInterval(function () {
  $("#c > li").removeClass('active');
  $("#c > li").eq(i).css('transition-delay', '0.25s');
  $("#c > li").eq(i + 1).css('transition-delay', '0.5s');
  $("#c > li").eq(i + 2).css('transition-delay', '0.75s');
  $("#c > li").eq(i + 3).css('transition-delay', '1s');
  if (i < max - 4) {
    i = i + 4;
  }else {
    i = 0;
  }
  $("#c > li").eq(i).css('left', '0').addClass('active').css('transition-delay', '1.25s');
  $("#c > li").eq(i + 1).css('left', '25%').addClass('active').css('transition-delay', '1.5s');
  $("#c > li").eq(i + 2).css('left', '50%').addClass('active').css('transition-delay', '1.75s');
  $("#c > li").eq(i + 3).css('left', '75%').addClass('active').css('transition-delay', '2s');
}, timer);

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

const button = document.getElementById('download-button');

button.addEventListener('click', (e) => {
  e.preventDefault();
  const link = document.createElement('a');
  link.href = 'javascripts/data.csv';
  link.download = 'data.csv';
  link.click();
});


function darkModeListener() {
  document.querySelector("html").classList.toggle("dark");
}

document.querySelector("input[type='checkbox']#dark-toggle").addEventListener("click", darkModeListener);
