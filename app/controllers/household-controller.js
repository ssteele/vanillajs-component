
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
