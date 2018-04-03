
// define valid relationship types
var validRelationships = [
  'self',
  'spouse',
  'child',
  'parent',
  'grandparent',
  'other'
]

// hopelessly inadequate custom vanillajs user input sanitizer :)
var sanitizeInput = function(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Household entry
 * @type {Object}
 *
 * Individual household entry with self-contained property validation
 */
var HouseholdEntry = function() {
  this.errors = []
}

/*
validation
 */
HouseholdEntry.prototype.isValid = function() {
  return 0 === this.errors.length && ! (null == this.age || null == this.relationship)
}

HouseholdEntry.prototype.appendErrorMessage = function(message) {
  this.errors.push(message)
}

HouseholdEntry.prototype.validateAge = function(age) {
  var isValid = age && age > 0
  if (! isValid) {
    this.appendErrorMessage('Age is required and must be greater than zero.')
  }
  return isValid
}

HouseholdEntry.prototype.validateRelationship = function(relationship) {
  var isValid = -1 !== validRelationships.indexOf(relationship)
  if (! isValid) {
    this.appendErrorMessage('Please choose a relationship option from the dropdown.')
  }
  return isValid
}

/*
setters
 */
HouseholdEntry.prototype.setId = function(id) {
  this.id = id
}

HouseholdEntry.prototype.setAge = function(age) {
  this.age = this.validateAge(age) ? age : null
}

HouseholdEntry.prototype.setRelationship = function(relationship) {
  this.relationship = this.validateRelationship(relationship) ? relationship : null
}

HouseholdEntry.prototype.setIsSmoker = function(isSmoker) {
  this.isSmoker = !! isSmoker
}

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

/**
 * DOM registry
 * @type {Object}
 *
 * Responsible for fetching and registering DOM elements/values
 */
var DomRegistry = {
  /*
  get elements
   */
  getAddButtonElement: function() {
    return document.getElementsByClassName('add')[0]
  },

  getRemoveButtonElement: function(id) {
    return document.querySelectorAll('[name="remove"][value="' + id + '"]')[0]
  },

  getSubmitButtonElement: function() {
    return document.querySelectorAll('[type="submit"]')[0]
  },

  getEntryListElement: function() {
    return document.getElementsByClassName('household')[0]
  },

  getDebugElement: function() {
    return document.getElementsByClassName('debug')[0]
  },

  getAgeFormField: function() {
    return document.querySelectorAll('[name="age"]')[0]
  },

  getRelationshipFormField: function() {
    return document.querySelectorAll('[name="rel"]')[0]
  },

  getSmokerFormField: function() {
    return document.querySelectorAll('[name="smoker"]')[0]
  },

  /*
  get values
   */
  getAgeValueFromForm: function() {
    return sanitizeInput(document.querySelectorAll('[name="age"]')[0].value)
  },

  getRelationshipValueFromForm: function() {
    return sanitizeInput(document.querySelectorAll('[name="rel"]')[0].value)
  },

  getIsSmokerValueFromForm: function() {
    return document.querySelectorAll('[name="smoker"]')[0].checked
  }
}

/**
 * Household controller
 * @type {Object}
 *
 * Tie together dom, entry, store, and views
 */
var HouseholdController = {
  initialize: function() {
    this.dom = DomRegistry
    this.store = HouseholdStore
    this.listView = HouseholdListView
    this.debugView = HouseholdDebugView

    // register add button
    var addButton = this.dom.getAddButtonElement()
    addButton.addEventListener("click", this.hasClickedAdd.bind(this), false)

    // register submit button
    var submitButton = this.dom.getSubmitButtonElement()
    submitButton.addEventListener("click", this.hasClickedSubmit.bind(this), false)
  },

  // whenever an entry is added or deleted, the list view is redrawn and remove buttons must be re-registered
  registerRemoveButtons: function() {
    this.store.entries.forEach(function(entry) {
      var removeButton = this.dom.getRemoveButtonElement(entry.id)
      removeButton.addEventListener("click", this.hasClickedRemove.bind(this), false)
    }, this)
  },

  // reset formfield values to default
  resetFormFields: function() {
    this.dom.getAgeFormField().value = ''
    this.dom.getRelationshipFormField().value = ''
    this.dom.getSmokerFormField().checked = false
  },

  /*
  events
   */
  // add button event handler
  hasClickedAdd: function(e) {
    e.preventDefault()

    // set entry attributes
    var entry = new HouseholdEntry
    entry.setId(this.store.generateId())
    entry.setAge(this.dom.getAgeValueFromForm())
    entry.setRelationship(this.dom.getRelationshipValueFromForm())
    entry.setIsSmoker(this.dom.getIsSmokerValueFromForm())

    // add entry to store
    this.store.add(entry)

    // render the list view
    this.listView.render(this.dom.getEntryListElement(), this.store)
    this.registerRemoveButtons()
    if (0 === this.store.errors.length) {
      this.resetFormFields()
    }
  },

  // remove button event handler
  hasClickedRemove: function(e) {
    e.preventDefault()

    // remove entry from the store
    this.store.remove(e.target.value)

    // render the list view
    this.listView.render(this.dom.getEntryListElement(), this.store)
    this.registerRemoveButtons()
  },

  // submit button event handler
  hasClickedSubmit: function(e) {
    e.preventDefault()

    this.store.generatePayload()
    if ('[]' !== this.store.payload) {
      if (! this.store.debug) {
        this.store.submit()
      }
    } else {
      this.store.errors[0] = 'You must add household entries in order to submit.'
      this.listView.render(this.dom.getEntryListElement(), this.store)
    }

    if (this.store.debug) {
      this.debugView.render(this.dom.getDebugElement(), this.store)
    }
  }
}

// start the party
HouseholdController.initialize()
