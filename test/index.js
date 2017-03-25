'use strict';
test(() => {

  var table3 = document.createElement('x-table');

  assert_true(table3.columns instanceof Set, 'columns is present');
  assert_true(table3.data instanceof Array, 'data is present');
  assert_true(table3.hasOwnProperty('filter'), 'filter is present');
  assert_true(table3.sort instanceof Set, 'sort is present');
}, 'Table3 element has a defined API');

test(() => {
  function verify(table3) {
    assert_equals(table3.querySelectorAll('th').length, [...table3.columns].length);
    [...table3.querySelectorAll('th')].forEach((th, i) => {
      assert_equals(th.textContent, [...table3.columns][i]);
    });
  }

  // [SETUP]
  var table3 = document.createElement('x-table');

  // First variant that defines the 'columns'
  table3.columns = ['Title 1', 'Title 2', 'Title 3'];

  // Second variant that defines the 'columns'
  /*
  table3.columns = [
    { title: 'Title 1' },
    { title: 'Title 2' },
    { title: 'Title 3' }
  ];
  */

  // Both cases should be considered... but let's implement at least one of them
  // First case is the case to implement...
  // [RUN]
  document.body.appendChild(table3);

  // [VERIFY]
  verify(table3);

  table3.columns = ['New title 1', 'New title 2'];
  verify(table3);

  table3.columns = ['A New title 1', 'A New title 2', 'A New title 3'];
  verify(table3);

  // [TEARDOWN]
  document.body.removeChild(table3);
}, 'Render columns');

test(() => {

  function verify(table3) {
    assert_equals(table3.querySelectorAll('tbody > tr').length,
      table3.data.length);
    [...table3.querySelectorAll('tbody > tr')].forEach((tr, i) => {
      assert_equals(tr.querySelectorAll('td').length,
        table3.data[i].length);
      [...tr.querySelectorAll('td')].forEach((td, j) => {
        assert_equals(Number(td.textContent),
          table3.data[i][j]);
      });
    });
  }

  // Here the contract is tiny simple
  // Any data MUST be presented as a MATRIX, e.g.
  // [[x1, x2, x3...], [x4, x5, x6...] ...]

  // [SETUP]
  var table3 = document.createElement('x-table');

  table3.data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

  // [RUN]
  document.body.appendChild(table3);

  // [VERIFY]
  verify(table3);

  // [SETUP RUN]
  table3.data = [[11, 12, 13], [14, 15, 16], [17, 18, 19], [20, 21, 22]];
  // [VERIFY]
  verify(table3);

  // [SETUP RUN]
  table3.data = [[21, 22], [24, 25]];
  // [VERIFY]
  verify(table3);

  // [TEARDOWN]
  document.body.removeChild(table3);

}, 'Render data');

promise_test(function() {
  return fetch('fixture1.json').then(response => response.json()).then(json => {
    // [SETUP]
    var table3 = document.createElement('x-table');

    table3.columns = json.cols;
    table3.data = json.data;
    table3.filter = 'Leo';

    // [RUN]
    document.body.appendChild(table3);

    // [VERIFY]
    var filtred = [...table3.querySelectorAll('tr:not([hidden])')];
    assert_equals(filtred.length, 3);

    // [TEARDOWN]
    document.body.removeChild(table3);
  });
}, 'Filter data');

promise_test(function() {
  return fetch('fixture1.json').then(response => response.json()).then(json => {
    // [SETUP]
    var table3 = document.createElement('x-table');

    table3.columns = json.cols;
    table3.data = json.data;

    /*
     * Let's assume that I'm able to set the sort list in different ways
     */
    // [RUN-VERIFY]
    table3.sort = ['-value', 'city'];
    assert_true(table3.sort instanceof Set);
    table3.sort = new Set(['-value', 'city']);
    assert_true(table3.sort instanceof Set);
    table3.sort = '-value,city';
    assert_true(table3.sort instanceof Set);
    assert_equals([...table3.sort][0], '-value');
    assert_equals([...table3.sort][1], 'city');

    table3.sort = new Set();
    table3.sort.add('-value');
    table3.sort.add('city');
    assert_true(table3.sort instanceof Set);

    // [RUN]
    document.body.appendChild(table3);

    // [VERIFY]
    var actual = table3.data;
    json.data.sort((a, b) => {
      if (a[2] > b[2]) return -1;
      if (a[2] < b[2]) return 1;
      if (a[1] > b[1]) return 1;
      if (a[1] < b[1]) return -1;
      return 0;
    }).forEach((expected, i) => {
      assert_equals(expected[1], actual[i][1]);
      assert_equals(expected[2], actual[i][2]);
    });

    // [TEARDOWN]
    document.body.removeChild(table3);
  });
}, 'Sort data');