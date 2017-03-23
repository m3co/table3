'use strict';
test(() => {

  var table3 = document.createElement('x-table');

  assert_true(table3.setup instanceof Function, "setup fn is present");
}, "Table3 element has a defined API");
