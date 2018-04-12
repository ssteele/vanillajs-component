
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
