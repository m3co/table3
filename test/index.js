'use strict';
test(() => {

  var table3 = document.createElement('x-table');

  assert_true(table3.columns instanceof Array, "columns is present");
  assert_true(table3.data instanceof Array, "data is present");
}, "Table3 element has a defined API");

test(() => {
  // [SETUP]
  var table3 = document.createElement('x-table');

  // First variant that defines the "columns"
  table3.columns = ['Title 1', 'Title 2', 'Title 3'];

  // Second variant that defines the "columns"
  /*
  table3.columns = [
    { title: "Title 1" },
    { title: "Title 2" },
    { title: "Title 3" }
  ];
  */

  // Both cases should be considered... but let's implement at least one of them
  // First case is the case to implement...
  // [RUN]
  document.body.appendChild(table3);

  // [VERIFY]
  [...table3.querySelectorAll('th')].forEach((th, i) => {
    assert_equals(th.textContent, table3.columns[i]);
  });

  table3.columns = ['New title 1', 'New title 2'];
  [...table3.querySelectorAll('th')].forEach((th, i) => {
    assert_equals(th.textContent, table3.columns[i]);
  });

  // [TEARDOWN]
  document.body.removeChild(table3);
}, "Render columns");

test(() => {

  // Here the contract is tiny simple
  // Any data MUST be presented as a MATRIX, e.g.
  // [[x1, x2, x3...], [x4, x5, x6...] ...]

  // [SETUP]
  var table3 = document.createElement('x-table');

  table3.data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

  // [RUN]
  document.body.appendChild(table3);

  // [VERIFY]
  assert_equals(table3.querySelectorAll('tbody > tr').length, table3.data.length);
  [...table3.querySelectorAll('tbody > tr')].forEach((tr, i) => {
    assert_equals(tr.querySelectorAll('td').length, table3.data[i].length);
    [...tr.querySelectorAll('td')].forEach((td, j) => {
      assert_equals(Number(td.textContent), table3.data[i][j]);
    });
  });

  // [SETUP RUN]
  table3.data = [[11, 12, 13], [14, 15, 16], [17, 18, 19], [20, 21, 22]];
  // [VERIFY]
  assert_equals(table3.querySelectorAll('tbody > tr').length, table3.data.length);
  [...table3.querySelectorAll('tbody > tr')].forEach((tr, i) => {
    assert_equals(tr.querySelectorAll('td').length, table3.data[i].length);
    [...tr.querySelectorAll('td')].forEach((td, j) => {
      assert_equals(Number(td.textContent), table3.data[i][j]);
    });
  });

  // [TEARDOWN]
  document.body.removeChild(table3);

}, "Render data");
