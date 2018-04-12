
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
