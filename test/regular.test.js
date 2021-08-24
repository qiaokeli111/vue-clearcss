// test.js

const assert = require('assert')
const path = require('path')


async function regexTest(done, testUrl) {
  try {
    let result = await filterCss(path.resolve(__dirname, testUrl))
    if (Array.isArray(result) && detectLoopResult(result)) {
      done()
    } else {
      done(new Error('test fail'))
    }
  } catch (err) {
    done(err)
  }
}
let matchImportReg = /@import\s*(?:url)?\s*\(?\s*['|"]*\s*([^'|"|\s]*)\s*['|"]*\s*\)?;*/gm
let cleanSpaceReg = /[\r\n\s]/gm
let matchUrlReg = /url\(['"]*(.*?)['"]*\)/
describe('regex', () => {
  it('@import', () => {

    var testurl = `@import './aa/ee.less'`
    assert.strictEqual(matchImportReg.exec(testurl)[1], './aa/ee.less');
    matchImportReg.lastIndex = 0

    testurl = `@import    '  ./aa/ee.less   '   `
    assert.strictEqual(matchImportReg.exec(testurl)[1], './aa/ee.less');
    matchImportReg.lastIndex = 0

    testurl = `@import    url ( '  ./aa/ee.less   ' )   `
    assert.strictEqual(matchImportReg.exec(testurl)[1], './aa/ee.less');
    matchImportReg.lastIndex = 0

    testurl = `
    @import    '  ./aa/ee.less1   '  
    @import   url ( '  ./aa/ee.less2   '  )
    
    
    `
    assert.strictEqual(matchImportReg.exec(testurl)[1] , './aa/ee.less1');
    assert.strictEqual(matchImportReg.exec(testurl)[1] , './aa/ee.less2');
  })
})
