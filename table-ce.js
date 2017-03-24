(() => {
  'use strict';

  class HTMLTableElement extends HTMLElement {
    constructor() {
      super();

      // It's not in D3 flavour...
      var table = document.createElement('table');
      var thead = table.querySelector('thead');
      if (!thead) {
        thead = table.appendChild(document.createElement('thead'));
      }

      var columns_ = [];
      Object.defineProperty(this, 'columns', {
        get: () => columns_,
        set: (columns) => {
          thead.innerHTML = '<tr></tr>';
          var tr = thead.querySelector('tr');
          columns_ = [...columns].map(d => {
            var th = document.createElement('th');
            th.textContent = d;
            tr.appendChild(th);
            return d;
          });
        }
      });
      this._table = table;
    }

    connectedCallback() {
      this.appendChild(this._table);
    }

  }

  window.customElements.define('x-table', HTMLTableElement);
})();
