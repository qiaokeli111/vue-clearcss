const assert = require('assert')
const path = require('path')

let matchImportReg = /@import\s*(?:url)?\s*\(?\s*['|"]*\s*([^'|"|\s]*)\s*['|"]*\s*\)?;*/gm
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
