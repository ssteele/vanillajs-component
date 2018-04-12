
/**
 * Household store
 * @type {Object}
 *
 * Collection of household entries
 */
var HouseholdStore = {
  entries: [],
  errors: [],
  payload: '',
  debug: true,

  generateId: function() {
    // grab the last id from the current stack and add 1
    return (this.entries.length) ? this.entries[this.entries.length - 1].id + 1 : 1
  },

  add: function(entry) {
    this.errors = []
    if (entry.isValid()) {
      this.entries.push(entry)
    } else if (entry.errors.length) {
      this.errors = entry.errors
    }
  },

  remove: function(entryId) {
    entryId = parseInt(entryId)
    if (Number.isInteger(entryId)) {
      this.entries = this.entries.filter(function(el) { return el.id !== entryId })
    }
  },

  generatePayload: function() {
    var transformedEntries = JSON.parse(JSON.stringify(this.entries))
    for (var i = 0; i < transformedEntries.length; i++) {
      transformedEntries[i].rel = transformedEntries[i].relationship
      transformedEntries[i].smoker = transformedEntries[i].isSmoker
      delete transformedEntries[i].errors
      delete transformedEntries[i].id
      delete transformedEntries[i].relationship
      delete transformedEntries[i].isSmoker
    }
    this.payload = JSON.stringify(transformedEntries)
  },

  submit: function() {
    // submit the payload via ajax - out of scope
  }
}
