'use strict';

var table = d3.select('#example-table');
fetch('data.json').then(response => response.json()).then(data => {

var columns = Object.keys(data[0] ? data[0] : {}).map(c => {
  return {
    sort: null,
    text: c,
    key: c
  };
});

// filtering
table.select('#filter').on('keyup', () => {
  let value = d3.event.target.value;
  table.select('tbody')
    .selectAll('tr')
    .each((d, i, trs) => {
      let tr = trs[i];
      if (value === '')
        tr.hidden = false;
      else if (tr.textContent.indexOf(value) === -1)
        tr.hidden = true;
    });
});

// head & sorting
table.select('thead tr').selectAll('th')
  .data(columns)
  .enter()
  .append('th')
  .text(d => d.text)
  .on('click', (d, i, ths) => {
    if (!d.sort) {
      d.sort = 'asc';
      ths[i].classList.add('th--sort-asc');
    } else if (d.sort == 'asc') {
      d.sort = 'desc';
      ths[i].classList.add('th--sort-desc');
    } else if (d.sort == 'desc') {
      d.sort = null;
      ths[i].classList.remove('th--sort-asc');
      ths[i].classList.remove('th--sort-desc');
    }

    let isNumber = n => (isFinite(n) && +n === n);
    let prepare = d => (isNumber(d) ? Number(d) : (!d ? '' : d));

    renderBody(data.map(d => d).sort((a, b) =>
      columns.reduce((r, d) => {
        if (r !== 0) return r;
        if (d.sort == null) return 0;
        let a_ = prepare(a[d.key]); // this may be in other place
        let b_ = prepare(b[d.key]); // this may be in other place
        if (d.sort === 'asc') {
          return d3.ascending(a_, b_);
        } else if (d.sort === 'desc') {
          return d3.descending(a_, b_);
        }
      }, 0)
    ));
  });

renderBody(data);

function renderBody(data) {
  var tr = table.select('tbody')
    .selectAll('tr')
    .data(data);

  var td = tr.enter()
    .append('tr')
    .merge(tr).selectAll('td')
      .data(d => columns.map(c => d[c.key]));

  td.enter()
    .append('td')
    .merge(td)
    .text(d => d);
}

});
