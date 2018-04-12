
/**
 * Household view: debug
 * @type {Object}
 *
 * Debug view
 */
var HouseholdDebugView = {
  render: function(el, store) {
    el.innerHTML = store.payload
    el.style.display = 'block'
    el.style.overflow = 'auto'
  }
}
