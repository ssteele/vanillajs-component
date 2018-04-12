
// hopelessly inadequate custom vanillajs user input sanitizer :)
var sanitizeInput = function(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
