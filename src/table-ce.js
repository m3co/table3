(() => {
  'use strict';
  //@@include('../includes/utils.js')
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
