'use strict';
document.currentFragment.loaded.then(fragment => {
  var url = fragment.dataset.url;
  fetch(url)
    .then(response => response.json())
    .then(json => {
      document.querySelector('[src="/trunk/example-table.html"]').loaded.then((fragment) => {
        var table3 = fragment.querySelector('x-table');
        table3.data = json.data.map(item => {
          return Object.keys(item.attributes).map(function(key) {
            return this[key];
          }, item.attributes);
        });
        table3.columns = Object.keys(json.data[0].attributes);
      });
    });
});
