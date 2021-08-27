const assert = require('assert')
const path = require('path')
const util = require('../util.js')

let matchImportReg = /@import\s*url\s*\(\s*['|"]*\s*([^'|"|\s]*)\s*['|"]*\s*\);*/gm

function dynamicClassValid(url,arr) {
    let parseArr = util.getAttrFormStr(url)
    assert.strictEqual(arr.every(e=>parseArr.includes(e)), true)
}
describe('regex', () => {
  it('@import', () => {

    var testurl = `@import './aa/ee.less'`
    assert.strictEqual(matchImportReg.exec(testurl), null);
    matchImportReg.lastIndex = 0

    testurl = `@import    '  ./aa/ee.less   '   `
    assert.strictEqual(matchImportReg.exec(testurl), null);
    matchImportReg.lastIndex = 0

    testurl = `@import    url ( '  ./aa/ee.less   ' )   `
    assert.strictEqual(matchImportReg.exec(testurl)[1], './aa/ee.less');
    matchImportReg.lastIndex = 0

    testurl = `
    @import    '  ./aa/ee.less1   '  
    @import   url ( '  ./aa/ee.less2   '  )
    
    
    `
    assert.strictEqual(matchImportReg.exec(testurl)[1] , './aa/ee.less2');
    assert.strictEqual(matchImportReg.exec(testurl) , null);
  })

//   it(':class string',()=>{

//     dynamicClassValid("'info ' + (stat[item] ? stat[item] : '')",['info'])

//     dynamicClassValid("'hot'+(Map[id]<3?'hot-map':'')",['hot','hot-map'])

//   })

//   it(':class obj',()=>{

//     dynamicClassValid("['item',{'sky':detail.sky}]",['item','sky'])

//     dynamicClassValid(`{
//         icon: true,
//         "all": type === 1,
//         'all': type === 1
//     }`,['icon','all'])

//   })

//   it(':class arr',()=>{

//     dynamicClassValid("['main-container',fwe?'yyyu':'dde']",['main-container','yyyu','dde'])


//   })
})
