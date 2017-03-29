(() => {
  'use strict';

  function defineColumns(thead) {
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
              th.classList.add('th--sort-desc');
              var sort__ = [...this.sort];
              sort__[sort__.indexOf(d)] = '-' + d;
              this.sort = sort__;
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

  function defineData(tbody) {
    var data = [];
    Object.defineProperty(this, 'data', {
      get: () => data,
      set: (value) => {
        var tr = d3.select(tbody)
          .selectAll('tr')
          .data(value);

        var td = tr.enter()
          .append('tr')
          .merge(tr)
          .each((d, i, trs) => {
            Object.defineProperty(data, i, {
              get: () => d.reduce((tds, d, j) => {
                  var td = trs[i].querySelectorAll('td')[j]
                  Object.defineProperty(tds, j, {
                    get: () => {
                      var v = td.textContent;
                      if (Number(v).toString() === v) { return Number(v); }
                      return v;
                    },
                    set: (value) => {
                      trs[i].querySelectorAll('td')[j];
                      d3.select(td)
                        .text(value);
                    },
                    configurable: true
                  });
                  return tds;
                }, []),
              set: (value) => {
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
  }

  function defineFiltered(tbody) {
    Object.defineProperty(this, 'filtered', {
      get: () => [...tbody.querySelectorAll('tr:not([hidden])')]
        .map(tr => [...tr.querySelectorAll('td')]
          .map(td => {
            var v = td.textContent;
            if (Number(v).toString() === v) { return Number(v); }
            return v;
          }))
    });
  }

  function defineFilter(tbody) {
    var filter = '';
    Object.defineProperty(this, 'filter', {
      get: () => filter,
      set: (value) => {
        var filter_ = value.toLowerCase();
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

  function defineSort(thead) {
    var sort = new Set();
    var original = null;
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
      (!original) && (original = this.data.map(d => d.map(d => d)));
      if (sort_.length > 0) {
        this.data = original.map(d => d.map(d => d)).sort((a, b) => {
          return sort_.reduce((r, d) => {
            if (r !== 0) { return r; }
            return d3[d.dir](a[d.i], b[d.i]);
          }, 0);
        });
      } else {
        this.data = original;

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

  class HTMLTableElement extends HTMLElement {
    constructor() {
      super();

      // It's not in D3 flavour...
      var table = document.createElement('table');
      var thead = table.querySelector('thead');
      var tbody = table.querySelector('tbody');
      (!thead) && (thead = table.appendChild(document.createElement('thead')));
      (!tbody) && (tbody = table.appendChild(document.createElement('tbody')));

      defineColumns.call(this, thead);
      defineData.call(this, tbody);
      defineFilter.call(this, tbody);
      defineFiltered.call(this, tbody);
      defineSort.call(this, thead, tbody);

      this._table = table;
    }

    connectedCallback() {
      this.appendChild(this._table);
    }

  }

  window.customElements.define('x-table', HTMLTableElement);
})();
