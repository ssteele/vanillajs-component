
/**
 * Household view: list
 * @type {Object}
 *
 * List view
 */
var HouseholdListView = {
  markup: '',

  capitalFilter: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },

  isSmokerFilter: function (isSmoker) {
    return (isSmoker) ? '' : 'non-'
  },

  render: function(el, store) {
    this.markup = ''
    store.entries.forEach(function(entry) {
      this.markup += '<li>'
      this.markup +=  '<button name="remove" type="button" value="' + entry.id + '">Remove</button> '
      this.markup +=  '<span>'
      this.markup +=    this.capitalFilter(entry.relationship) + ': ' + entry.age + '-year-old (' + this.isSmokerFilter(entry.isSmoker) + 'smoker)'
      this.markup +=  '</span>'
      this.markup += '</li>'
    }, this)

    if (store.errors.length) {
      this.markup += '<li class="error" style="color:#f00;">' + store.errors.join(' ') + '</li>'
    }
    el.innerHTML = this.markup
  }
}
