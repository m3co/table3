(() => {
  'use strict';

  function modifySet(set, doSort) {
    set.add = function add(value) {
      Set.prototype.add.call(this, value);
      doSort();
    };
    set.delete = function remove(value) {
      Set.prototype.delete.call(this, value);
      doSort();
    };
  }

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

  function defineData(tbody, internalParams) {
    Object.defineProperty(this, 'data', {
      get: () => internalParams.data,
      set: (value) => {
        internalParams.data = value;
        internalRender(tbody, internalParams.data);
      }
    });
  }

  function internalRender(tbody, data) {
    var tr = d3.select(tbody)
      .selectAll('tr')
      .data(data);

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
      .remove();

    td.text(d => d);

    td.enter()
      .append('td')
      .merge(td)
      .text(d => d);

    td.exit()
      .remove();
  }

  function defineFilter(tbody, internalParams) {
    Object.defineProperty(this, 'filter', {
      get: () => internalParams.filter,
      set: (filter) => {
        var filter_ = filter.toLowerCase();
        d3.select(tbody).selectAll('tr')
          .each((d, i, trs) => {
            let includes = d.join().toLowerCase().includes(filter_);
            includes && (trs[i].hidden = false);
            !includes && (trs[i].hidden = true);
          });
        internalParams.filter = filter;
      }
    });
  }

  function defineSort(thead, internalParams) {
    let doSort = () => {
      let sort = [...internalParams.sort].map((d) => {
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

      if (sort.length > 0) {
        this.data = internalParams.data.sort((a, b) => {
          return sort.reduce((r, d) => {
            if (r !== 0) { return r; }
            return d3[d.dir](a[d.i], b[d.i]);
          }, 0);
        });
      } else {
        this.data = internalParams.data;
      }
    };

    modifySet(internalParams.sort, doSort);
    Object.defineProperty(this, 'sort', {
      get: () => internalParams.sort,
      set: (sort) => {
        typeof(sort) === typeof('') &&
          (internalParams.sort = new Set(sort.split(',').filter(d => d.length)));
        ((Array.isArray(sort)) || (sort instanceof Set)) &&
          (internalParams.sort = new Set(sort));
        modifySet(internalParams.sort, doSort);
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

      var internalParams = {
        data: [],
        filter: '',
        sort: new Set()
      };

      defineColumns.call(this, thead);
      defineData.call(this, tbody, internalParams);
      defineFilter.call(this, tbody, internalParams);
      defineFiltered.call(this, tbody);
      defineSort.call(this, thead, internalParams);

      this._table = table;
    }

    connectedCallback() {
      this.appendChild(this._table);
    }

  }

  window.customElements.define('x-table', HTMLTableElement);
})();
