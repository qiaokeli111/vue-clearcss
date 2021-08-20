
var parsecss = require('./css/parsecss')
module.exports = function filterCss(url) {
  let cssResolver = new parsecss(url)
  return new Promise((resolve) => {
    cssResolver.findUnuseCss().then(e=>resolve(e))
  })
}
