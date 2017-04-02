(() => {
  'use strict';
  function defineColumns(thead) {
    Object.defineProperty(this, 'columns', {
      get: () => new Set([...thead.querySelectorAll('th')]
        .map(th => th.textContent)),
      set: (columns) => {
        let th = d3.select(thead)
          .selectAll('th')
          .data([...new Set(columns)]); // a bit weird...

        th.text(d => d);

        th.enter()
          .append('th')
          .merge(th)
          .text(d => d)
          .on('click', d => {
            let sort;
            let th = d3.event.target;
            if (th.classList.contains('th--sort-asc')) {
              th.classList.remove('th--sort-asc');
              th.classList.add('th--sort-desc');
              sort = [...this.sort];
              sort[sort.indexOf(d)] = '-' + d;
              this.sort = sort;
            } else if (th.classList.contains('th--sort-desc')) {
              th.classList.remove('th--sort-desc');
              this.sort.delete('-' + d);
            } else {
              th.classList.add('th--sort-asc');
              this.sort.add(d);
            }
          });

        th.exit()
          .remove();
      }
    });
  }

  function defineDataAndSort(thead, tbody) {
    let data = [];
    Object.defineProperty(this, 'data', {
      get: () => data,
      set: (value) => {
        let original = value;
        let tr = d3.select(tbody)
          .selectAll('tr')
          .data(value);

        let td = tr.enter()
          .append('tr')
          .merge(tr)
          .each((d, i, trs) => {
            Object.defineProperty(data, i, {
              get: () => d.reduce((tds, d, j) => {
                let td = trs[i].querySelectorAll('td')[j];
                Object.defineProperty(tds, j, {
                  get: () => {
                    let v = td.textContent;
                    if (Number(v).toString() === v) { return Number(v); }
                    return v;
                  },
                  set: (value) => {
                    original[i][j] = value;
                    trs[i].querySelectorAll('td')[j];
                    d3.select(td)
                      .text(value);
                  },
                  configurable: true
                });
                return tds;
              }, []),
              set: (value) => {
                original[i] = value;
                d3.select(trs[i])
                  .selectAll('td')
                  .data(value)
                  .text(d => d);
              },
              configurable: true
            });
          })
          .selectAll('td')
          .data(d => d);

        tr.exit()
          .each((d, i) => {
            (data.length > i) && (data.length = i);
          })
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

    let sort = new Set();
    let unsorted = null;
    let doSort = () => {
      let sort_ = [...sort].map((d) => {
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
      (!unsorted) && (unsorted = data.map(d => d.map(d => d)));
      if (sort_.length > 0) {
        this.data = unsorted.map(d => d.map(d => d)).sort((a, b) => {
          return sort_.reduce((r, d) => {
            if (r !== 0) { return r; }
            return d3[d.dir](a[d.i], b[d.i]);
          }, 0);
        });
      } else {
        this.data = unsorted;
        this.unsorted = null;
      }
    };

    function modifySet() {
      sort.add = function add(value) {
        Set.prototype.add.call(this, value);
        doSort();
      };
      sort.delete = function remove(value) {
        Set.prototype.delete.call(this, value);
        doSort();
      };
    }
    modifySet();
    Object.defineProperty(this, 'sort', {
      get: () => sort,
      set: (value) => {
        typeof(value) === typeof('') &&
          (sort = new Set(value.split(',').filter(d => d.length)));
        ((Array.isArray(value)) || (value instanceof Set)) &&
          (sort = new Set(value));
        modifySet();
        doSort();
      }
    });
  }

  function defineFiltered(tbody) {
    Object.defineProperty(this, 'filtered', {
      get: () => [...tbody.querySelectorAll('tr:not([hidden])')]
        .map(tr => [...tr.querySelectorAll('td')]
          .map(td => {
            let v = td.textContent;
            if (Number(v).toString() === v) { return Number(v); }
            return v;
          }))
    });
  }

  function defineFilter(tbody) {
    let filter = '';
    Object.defineProperty(this, 'filter', {
      get: () => filter,
      set: (value) => {
        let filter_ = value.toLowerCase();
        d3.select(tbody).selectAll('tr')
          .each((d, i, trs) => {
            let includes = d.join().toLowerCase().includes(filter_);
            includes && (trs[i].hidden = false);
            !includes && (trs[i].hidden = true);
          });
        filter = value;
      }
    });
  }

  class HTMLTable3Element extends HTMLElement {
    constructor() {
      super();

      // It's not in D3 flavour...
      let table = document.createElement('table');
      let thead = table.querySelector('thead');
      let tbody = table.querySelector('tbody');
      (!thead) && (thead = table.appendChild(document.createElement('thead')));
      (!tbody) && (tbody = table.appendChild(document.createElement('tbody')));

      defineColumns.call(this, thead);
      defineDataAndSort.call(this, thead, tbody);
      defineFilter.call(this, tbody);
      defineFiltered.call(this, tbody);

      this._table = table;
    }

    connectedCallback() {
      this.appendChild(this._table);
    }
  }

  if (!window.HTMLTable3Element) {
    window.HTMLTable3Elemen = HTMLTable3Element;
    window.customElements.define('x-table', HTMLTable3Element);
  }
})();
