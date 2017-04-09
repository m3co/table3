(() => {
  'use strict';
  //@@include('../includes/utils.js')
  var HTMLTable3Element = Object.create(HTMLElement.prototype);

  HTMLTable3Element.createdCallback = function() {
    // It's not in D3 flavour...
    let table = document.createElement('table');
    let thead = table.querySelector('thead');
    let tbody = table.querySelector('tbody');
    (!thead) && (thead = table.appendChild(document.createElement('thead')));
    (!tbody) && (tbody = table.appendChild(document.createElement('tbody')));

    defineColumns.call(this, thead);
    defineData.call(this, tbody);
    //defineDataAndSort.call(this, thead, tbody);
    defineFilter.call(this, tbody);
    defineFiltered.call(this, tbody);

    this._table = table;
  };

  HTMLTable3Element.attachedCallback = function() {
    this.appendChild(this._table);
  };

  if (!window.HTMLTable3Element) {
    window.HTMLTable3Element = HTMLTable3Element;
    document.registerElement('x-table', { prototype: HTMLTable3Element });
  }
})();
