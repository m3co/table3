'use strict';
document.currentFragment.loaded.then(fragment => {
  var filter = fragment.querySelector('#filter');
  var table = fragment.querySelector('x-table');
  filter.addEventListener('keyup', e => {
    table.filter = e.target.value;
  });
});
