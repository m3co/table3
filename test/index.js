'use strict';
test(() => {

  var table3 = document.createElement('x-table');

  assert_true(table3.columns instanceof Array, "columns is present");
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
}, "Setup columns");
