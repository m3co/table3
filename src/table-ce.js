(() => {
  'use strict';

  class HTMLTableElement extends HTMLElement {
    constructor() {
      super();

      // It's not in D3 flavour...
      var table = document.createElement('table');
      var thead = table.querySelector('thead');
      var tbody = table.querySelector('tbody');
      (!thead) && (thead = table.appendChild(document.createElement('thead')));
      (!tbody) && (tbody = table.appendChild(document.createElement('tbody')));

      var columns_ = [];
      Object.defineProperty(this, 'columns', {
        get: () => columns_,
        set: (columns) => {
          // It's not in D3 flavour...
          var tr = thead.querySelector('tr');
          var ths = d3.select(thead)
            .selectAll('th')
            .data(columns);

          ths.text(d => d);

          ths.enter()
            .append('th')
            .text(d => d);

          ths.exit()
            .remove();

          columns_ = columns;
        }
      });

      var data_ = [];
      Object.defineProperty(this, 'data', {
        get: () => data_,
        set: (data) => {
          // It's not in D3 flavour...
          tbody.innerHTML = '';
          data_ = [...data].map(d => {
            var tr = document.createElement('tr');
            tbody.appendChild(tr);
            return d.map(d => {
              var td = document.createElement('td');
              td.textContent = d;
              tr.appendChild(td);
              return d;
            });
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
