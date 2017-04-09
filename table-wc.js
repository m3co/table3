'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
            sort = [].concat(_toConsumableArray(_this.sort));
            sort[sort.indexOf(d)] = '-' + d;
            _this.sort = sort;
          } else if (th.classList.contains('th--sort-desc')) {
            _this.sort.delete('-' + d);
          } else {
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

  function defineSort(thead, tbody) {
    var _this2 = this;

    var sort = new Set();
    var unsorted = null;
    var doSort = function doSort() {
      var sort_ = [].concat(_toConsumableArray(sort)).map(function (d) {
        var dir = 'ascending';
        d[0] === '-' && (d = d.slice(1)) && (dir = 'descending');
        [].concat(_toConsumableArray(thead.querySelectorAll('th'))).forEach(function (c) {
          if (c.textContent === d) {
            dir === 'ascending' && c.classList.add('th--sort-asc');
            dir === 'descending' && c.classList.add('th--sort-desc');
          }
        });
        return {
          i: [].concat(_toConsumableArray(_this2.columns)).indexOf(d),
          dir: dir
        };
      });
      if (sort_.length > 0) {
        !unsorted && (unsorted = _this2.data.map(function (d) {
          return d.map(function (d) {
            return d;
          });
        }));
        _this2.data = unsorted.map(function (d) {
          return d.map(function (d) {
            return d;
          });
        }).sort(function (a, b) {
          return sort_.reduce(function (r, d) {
            if (r !== 0) {
              return r;
            }
            return d3[d.dir](a[d.i], b[d.i]);
          }, 0);
        });
      } else {
        unsorted && (_this2.data = unsorted);
        _this2.unsorted = null;
      }
    };

    function modifySet() {
      sort.add = function add(value) {
        Set.prototype.add.call(this, value);
        doSort();
      };
      sort.delete = function remove(value) {
        Set.prototype.delete.call(this, value);

        [].concat(_toConsumableArray(thead.querySelectorAll('th'))).forEach(function (c) {
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
      get: function get() {
        return sort;
      },
      set: function set(value) {
        (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === _typeof('') && (sort = new Set(value.split(',').filter(function (d) {
          return d.length;
        })));
        (Array.isArray(value) || value instanceof Set) && (sort = new Set(value));
        modifySet();
        [].concat(_toConsumableArray(thead.querySelectorAll('th'))).forEach(function (c) {
          c.classList.remove('th--sort-asc');
          c.classList.remove('th--sort-desc');
        });
        doSort();
      }
    });
  }

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
    defineSort.call(this, thead, tbody);
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