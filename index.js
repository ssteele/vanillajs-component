
function loadScript(url) {
  var script = document.createElement("script")
  script.src = url

  document.body.appendChild(script)
}
loadScript('app/constants.js')
loadScript('app/models/household-entry.js')
loadScript('app/services/sanitizer.js')
loadScript('app/services/dom-registry.js')
loadScript('app/services/household-store.js')
loadScript('app/views/household-list.js')
loadScript('app/views/household-debug.js')
loadScript('app/controllers/household-controller.js')

// TODO: promise instead
setTimeout(function() {
  // start the party
  HouseholdController.initialize()
}, 100);
