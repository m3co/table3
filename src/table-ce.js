(() => {
  'use strict';

  class HTMLTableElement extends HTMLElement {
    constructor() {
      super();
    }

    setup() {

    }

  }

  window.customElements.define('x-table', HTMLTableElement);
})();
