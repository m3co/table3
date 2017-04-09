'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
  'use strict';

  function defineColumns(thead) {
    var _this = this;

    Object.defineProperty(this, 'columns', {
      get: function get() {
        return new Set([].concat(_toConsumableArray(thead.querySelectorAll('th'))).map(function (th) {
          return th.textContent;
        }));
      },
      set: function set(columns) {
        var th = d3.select(thead).selectAll('th').data([].concat(_toConsumableArray(new Set(columns)))); // a bit weird...

        th.text(function (d) {
          return d;
        });

        th.enter().append('th').merge(th).text(function (d) {
          return d;
        }).on('click', function (d) {
          var sort = void 0;
          var th = d3.event.target;
          if (th.classList.contains('th--sort-asc')) {
            th.classList.remove('th--sort-asc');
            th.classList.add('th--sort-desc');
            sort = [].concat(_toConsumableArray(_this.sort));
            sort[sort.indexOf(d)] = '-' + d;
            _this.sort = sort;
          } else if (th.classList.contains('th--sort-desc')) {
            th.classList.remove('th--sort-desc');
            _this.sort.delete('-' + d);
          } else {
            th.classList.add('th--sort-asc');
            _this.sort.add(d);
          }
        });

        th.exit().remove();
      }
    });
  }

  function defineData(tbody) {
    var data = [];
    Object.defineProperty(this, 'data', {
      get: function get() {
        return data;
      },
      set: function set(value) {
        data = value.reduce(function (data, row, i) {
          Object.defineProperty(data, i, {
            get: function get() {
              return value[i].reduce(function (data, row, j) {
                Object.defineProperty(data, j, {
                  get: function get() {
                    return value[i][j];
                  },
                  set: function set() {
                    throw new Error('row and col read only');
                  }
                });
                return data;
              }, []);
            },
            set: function set() {
              throw new Error('row read only');
            }
          });
          return data;
        }, []);

        var tr = d3.select(tbody).selectAll('tr').data(value);

        var td = tr.enter().append('tr').merge(tr).selectAll('td').data(function (d) {
          return d;
        });

        tr.exit().remove();

        td.text(function (d) {
          return d;
        });

        td.enter().append('td').merge(td).text(function (d) {
          return d;
        });

        td.exit().remove();
      }
    });
  }

  /*
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
                    if (unsorted) {
                      unsorted[unsorted.findIndex(row => row.every(
                        (item, j) => item === original[i][j])
                      )][j] = value;
                    } else {
                      original[i][j] = value;
                    }
                    trs[i].querySelectorAll('td')[j];
                    d3.select(td)
                      .text(value);
                  },
                  configurable: true
                });
                return tds;
              }, []),
              set: (value) => {
                if (unsorted) {
                  unsorted[unsorted.findIndex(row => row.every(
                    (item, j) => item === original[i][j])
                  )] = value;
                } else {
                  original[i] = value;
                }
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
      if (sort_.length > 0) {
        (!unsorted) && (unsorted = data.map(d => d.map(d => d)));
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
  */

  function defineFiltered(tbody) {
    Object.defineProperty(this, 'filtered', {
      get: function get() {
        return [].concat(_toConsumableArray(tbody.querySelectorAll('tr:not([hidden])'))).map(function (tr) {
          return [].concat(_toConsumableArray(tr.querySelectorAll('td'))).map(function (td) {
            var v = td.textContent;
            if (Number(v).toString() === v) {
              return Number(v);
            }
            return v;
          });
        });
      }
    });
  }

  function defineFilter(tbody) {
    var filter = '';
    Object.defineProperty(this, 'filter', {
      get: function get() {
        return filter;
      },
      set: function set(value) {
        var filter_ = value.toLowerCase();
        d3.select(tbody).selectAll('tr').each(function (d, i, trs) {
          var includes = d.join().toLowerCase().includes(filter_);
          includes && (trs[i].hidden = false);
          !includes && (trs[i].hidden = true);
        });
        filter = value;
      }
    });
  }

  var HTMLTable3Element = Object.create(HTMLElement.prototype);

  HTMLTable3Element.createdCallback = function () {
    // It's not in D3 flavour...
    var table = document.createElement('table');
    var thead = table.querySelector('thead');
    var tbody = table.querySelector('tbody');
    !thead && (thead = table.appendChild(document.createElement('thead')));
    !tbody && (tbody = table.appendChild(document.createElement('tbody')));

    defineColumns.call(this, thead);
    defineData.call(this, tbody);
    //defineDataAndSort.call(this, thead, tbody);
    defineFilter.call(this, tbody);
    defineFiltered.call(this, tbody);

    this._table = table;
  };

  HTMLTable3Element.attachedCallback = function () {
    this.appendChild(this._table);
  };

  if (!window.HTMLTable3Element) {
    window.HTMLTable3Element = HTMLTable3Element;
    document.registerElement('x-table', { prototype: HTMLTable3Element });
  }
})();