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
              sort = [...this.sort];
              sort[sort.indexOf(d)] = '-' + d;
              this.sort = sort;
            } else if (th.classList.contains('th--sort-desc')) {
              this.sort.delete('-' + d);
            } else {
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
        data = value.reduce((data, row, i) => {
          Object.defineProperty(data, i, {
            get: () => value[i].reduce((data, row, j) => {
              Object.defineProperty(data, j, {
                get: () => {
                  var v = value[i][j];
                  var sv = v.toString();
                  var nv = Number(v);
                  if (nv.toString() === sv) {
                    return nv;
                  }
                  var bv = Boolean(v);
                  if (bv.toString() === sv) {
                    return bv;
                  }
                  var dv = new Date(v);
                  if (dv.toString() !== 'Invalid Date') {
                    return dv;
                  }
                  return v;
                },
                set: () => { throw new Error('row and col read only'); }
              });
              return data;
            }, []),
            set: () => { throw new Error('row read only'); }
          });
          return data;
        }, []);

        let tr = d3.select(tbody)
          .selectAll('tr')
          .data(value);

        let td = tr.enter()
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
  }

  function defineSort(thead) {
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
      if (sort_.length > 0) {
        (!unsorted) && (unsorted = this.data);
        this.data = unsorted.map(d => d.map(d => d)).sort((a, b) => {
          return sort_.reduce((r, d) => {
            if (r !== 0) { return r; }
            return d3[d.dir](a[d.i], b[d.i]);
          }, 0);
        });
      } else {
        (unsorted) && (this.data = unsorted);
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

        [...thead.querySelectorAll('th')].forEach(c => {
          if (value.toString().indexOf(c.textContent) > -1) {
            c.classList.remove('th--sort-asc');
            c.classList.remove('th--sort-desc');
          }
        });
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
        [...thead.querySelectorAll('th')].forEach(c => {
          c.classList.remove('th--sort-asc');
          c.classList.remove('th--sort-desc');
        });
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
      defineData.call(this, tbody);
      defineSort.call(this, thead);
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
