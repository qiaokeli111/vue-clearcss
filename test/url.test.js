const assert = require('assert')
const path = require('path')
var { findRelevanceUrl } = require('../css/util')
var slash = require('slash')
function commonTestFun(url, absoluteUrl,lang) {
  var testurl = path.resolve(__dirname, url)
  let parseUrl = findRelevanceUrl(testurl,lang)
  if (parseUrl) {
	assert.strictEqual(slash(parseUrl), absoluteUrl)
  }else{
	assert.strictEqual(parseUrl, absoluteUrl)
  }
}
describe('urlParse', () => {
  it('scssUrl', () => {
   
	commonTestFun('./scss/testCommon.scss','D:/czj/node/vue-clearcss/test/scss/testCommon.scss')

	commonTestFun('./scss/testCommon','D:/czj/node/vue-clearcss/test/scss/testCommon.scss')

	commonTestFun('./scss/testCommon2',undefined)

	commonTestFun('./scss/',undefined)
 
  })

  it('lessUrl', () => {
   
	commonTestFun('./less/testCommon1.less','D:/czj/node/vue-clearcss/test/less/testCommon1.less')

	commonTestFun('./less/testCommon2','D:/czj/node/vue-clearcss/test/less/testCommon2.less')

	commonTestFun('./less/testCommon1','D:/czj/node/vue-clearcss/test/less/testCommon1.css','css')

	commonTestFun('./less/testCommon1','D:/czj/node/vue-clearcss/test/less/testCommon1.less','less')

	commonTestFun('./less/testCommon3',undefined)

	commonTestFun('./less/',undefined)
 
  })
})
