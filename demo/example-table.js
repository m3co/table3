'use strict';

var data = [
  {id:1, name:"Oli Bob \n steve", age:"12", gender:"male", height:1, col:"red", dob:"", cheese:1, lucky_no:5},
  {id:2, name:"Mary May", age:"1", gender:"female", height:2, col:"blue", dob:"14/05/1982", cheese:true, lucky_no:10},
  {id:3, name:"Christine Lobowski", age:"42", height:0, col:"green", dob:"22/05/1982", cheese:"true", lucky_no:12},
  {id:4, name:"Brendon Philips", age:"125", gender:"male", height:1, col:"orange", dob:"01/08/1980", lucky_no:18},
  {id:5, name:"Margret Marmajuke", age:"16", gender:"female", height:5, col:"yellow", dob:"31/01/1999", lucky_no:33},
  {id:6, name:"Frank Harbours", age:"38", gender:"male", height:4, col:"red", dob:"", cheese:1, lucky_no:2},
  {id:7, name:"Jamie Newhart", age:"23", gender:"male", height:3, col:"green", dob:"14/05/1985", cheese:true, lucky_no:63},
  {id:8, name:"Gemma Jane", age:"60", height:0, col:"red", dob:"22/05/1982", cheese:"true", lucky_no:72},
  {id:9, name:"Emily Sykes", age:"42", gender:"female", height:1, col:"maroon", dob:"11/11/1970", lucky_no:44},
  {id:10, name:"James Newman", age:"73", gender:"male", height:5, col:"red", dob:"22/03/1998", lucky_no:9},
];

var table = d3.select('#example-table');
var columns = Object.keys(data[0] ? data[0] : {}).map(c => {
  return {
    sort: null,
    text: c,
    key: c
  };
});

function isNumber(n) {
  return isFinite(n) && +n === n;
}

table.select('thead tr').selectAll('th')
  .data(columns)
  .enter()
  .append('th')
  .text(d => d.text)
  .on('click', (d, i, ths) => {
    ths.forEach(th => th.classList.remove('th--sort-asc', 'th--sort-desc'));
    if (!d.sort) d.sort = 'asc';
    else if (d.sort == 'asc') d.sort = 'desc';
    else if (d.sort == 'desc') d.sort = null;

    let data_ = data.map(d => d);
    columns.forEach((d, i) => {
      let th = ths[i];
      if (d.sort === 'asc') {
        th.classList.add('th--sort-asc');
        data_.sort((a, b) => {
          let a_ = isNumber(a[d.key]) ? Number(a[d.key]) : a[d.key];
          let b_ = isNumber(b[d.key]) ? Number(b[d.key]) : b[d.key];
          return d3.ascending(a_, b_);
        });
      } else if (d.sort === 'desc') {
        th.classList.add('th--sort-desc');
        data_.sort((a, b) => {
          let a_ = isNumber(a[d.key]) ? Number(a[d.key]) : a[d.key];
          let b_ = isNumber(b[d.key]) ? Number(b[d.key]) : b[d.key];
          return d3.descending(a_, b_);
        });
      }
    });
    renderBody(data_);

    /*
      renderBody(data.map(d => d).sort((a, b) =>
        Number(a[d.key]) >= Number(b[d.key])
      ));
      renderBody(data.map(d => d).sort((a, b) =>
        Number(a[d.key]) <= Number(b[d.key])
      ));
    } else {
    }
    */
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
