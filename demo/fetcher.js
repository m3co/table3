'use strict';
document.currentFragment.loaded.then(fragment => {
  var url = fragment.dataset.url;
  fetch(url)
    .then(response => response.json())
    .then(json => {
      document.querySelector('[data-from="fetcher"]').render(json);
    });
});
