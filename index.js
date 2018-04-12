
// dynamically load a script
function loadScript(url) {
  var script = document.createElement("script")
  script.src = url
  document.body.appendChild(script)
}

// load script dependencies
function loadScripts() {
  return new Promise(function(resolve, reject) {
    loadScript('app/constants.js')
    loadScript('app/models/household-entry.js')
    loadScript('app/services/sanitizer.js')
    loadScript('app/services/dom-registry.js')
    loadScript('app/services/household-store.js')
    loadScript('app/views/household-list.js')
    loadScript('app/views/household-debug.js')
    loadScript('app/controllers/household-controller.js')

    // loop until all dependencies are loaded
    var timer = setInterval(function() {
      if (
        'object' === typeof validRelationships
        && 'function' === typeof HouseholdEntry
        && 'function' === typeof sanitizeInput
        && 'object' === typeof DomRegistry
        && 'object' === typeof HouseholdStore
        && 'object' === typeof HouseholdListView
        && 'object' === typeof HouseholdDebugView
        && 'object' === typeof HouseholdController
      ) {
        clearInterval(timer)
        resolve(true)
      }
    }, 10)
  })
}

// initialize app once scripts have loaded
loadScripts().then(function() {
  HouseholdController.initialize()
  console.log('Ready')
})
