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

      Object.defineProperty(this, 'columns', {
        get: () => [...thead.querySelectorAll('th')]
            .map(th => th.textContent),
        set: (columns) => {
          var th = d3.select(thead)
            .selectAll('th')
            .data(columns);

          th.text(d => d);

          th.enter()
            .append('th')
            .merge(th)
            .text(d => d);

          th.exit()
            .remove();
        }
      });

      Object.defineProperty(this, 'data', {
        get: () => [...tbody.querySelectorAll('tr')]
            .map(tr => [...tr.querySelectorAll('td')]
              .map(td => td.textContent)),
        set: (data) => {
          var tr = d3.select(tbody)
            .selectAll('tr')
            .data(data);

          var td = tr.enter()
            .append('tr')
            .merge(tr)
            .selectAll('td')
            .data(d => d)

          tr.exit()
            .remove();

          td.text(d => d);

          td.enter()
            .append('td')
            .merge(td)
            .text(d => d);

          td.exit()
            .remove();
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
