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
        get: () => new Set([...thead.querySelectorAll('th')]
            .map(th => th.textContent)),
        set: (columns) => {
          var th = d3.select(thead)
            .selectAll('th')
            .data([...new Set(columns)]); // a bit weird...

          th.text(d => d);

          th.enter()
            .append('th')
            .merge(th)
            .text(d => d)
            .on('click', d => {
              let th = d3.event.target;
              if (th.classList.contains('th--sort-asc')) {
                th.classList.remove('th--sort-asc');
                Set.prototype.delete.call(sort_, d);
                th.classList.add('th--sort-desc');
                Set.prototype.add.call(sort_, '-' + d);
              } else if (th.classList.contains('th--sort-desc')) {
                th.classList.remove('th--sort-desc');
                Set.prototype.delete.call(sort_, '-' + d);
              } else {
                th.classList.add('th--sort-asc');
                Set.prototype.add.call(sort_, d);
              }
              doSort();
            });

          th.exit()
            .remove();
        }
      });

      Object.defineProperty(this, 'data', {
        get: () => [...tbody.querySelectorAll('tr:not([hidden])')]
            .map(tr => [...tr.querySelectorAll('td')]
              .map(td => {
                var v = td.textContent;
                if (Number(v).toString() === v) { return Number(v); }
                return v;
              })),
        set: (data) => {
          var tr = d3.select(tbody)
            .selectAll('tr')
            .data(data);

          var td = tr.enter()
            .append('tr')
            .merge(tr)
            .selectAll('td')
            .data(d => d);

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

      var filter_ = '';
      Object.defineProperty(this, 'filter', {
        get: () => filter_,
        set: (filter) => {
          var filter_ = filter.toLowerCase();
          d3.select(tbody).selectAll('tr')
            .each((d, i, trs) => {
              let includes = d.join().toLowerCase().includes(filter_);
              includes && (trs[i].hidden = false);
              !includes && (trs[i].hidden = true);
            });
          filter_ = filter;
        }
      });

      var sort_ = new Set();
      function modifySet(set) {
        set.add = function add(value) {
          Set.prototype.add.call(this, value);
          doSort();
        };
        set.delete = function remove(value) {
          Set.prototype.delete.call(this, value);
          doSort();
        };
      }

      let doSort = () => {
        let sort = [...sort_].map((d) => {
          let dir = 'ascending';
          (d[0] === '-') && (d = d.slice(1)) && (dir = 'descending');
          [...thead.querySelectorAll('th')].forEach(c => {
            if (c.textContent === d) {
              (dir === 'ascending' && c.classList.add('th--sort-asc'));
              (dir === 'descending' && c.classList.add('th--sort-desc'));
            }
          });
          return {
            i: [...this.columns].indexOf(d),
            dir: dir
          };
        });

        this.data = this.data.sort((a, b) => {
          return sort.reduce((r, d) => {
            if (r !== 0) { return r; }
            return d3[d.dir](a[d.i], b[d.i]);
          }, 0);
        });
      };

      modifySet(sort_);
      Object.defineProperty(this, 'sort', {
        get: () => sort_,
        set: (sort) => {
          typeof(sort) === typeof('') &&
            (sort_ = new Set(sort.split(',').filter(d => d.length)));
          ((Array.isArray(sort)) || (sort instanceof Set)) &&
            (sort_ = new Set(sort));
          modifySet(sort_);
          doSort();
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
