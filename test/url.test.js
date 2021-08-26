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
   
	commonTestFun('./scss/testCommon.scss',slash(path.resolve(__dirname,'./scss/testCommon.scss')))

	commonTestFun('./scss/testCommon',slash(path.resolve(__dirname,'./scss/testCommon.scss')))

	commonTestFun('./scss/testCommon2',undefined)

	commonTestFun('./scss/',undefined)
 
  })

  it('lessUrl', () => {
   
	commonTestFun('./less/testCommon1.less',slash(path.resolve(__dirname,'./less/testCommon1.less')))

	commonTestFun('./less/testCommon2',slash(path.resolve(__dirname,'./less/testCommon2.less')))

	commonTestFun('./less/testCommon1',slash(path.resolve(__dirname,'./less/testCommon1.css')),'css')

	commonTestFun('./less/testCommon1',slash(path.resolve(__dirname,'./less/testCommon1.less')),'less')

	commonTestFun('./less/testCommon3',undefined)

	commonTestFun('./less/',undefined)
 
  })
})
