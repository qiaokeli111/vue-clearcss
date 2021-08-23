// test.js

const assert = require('assert')
const filterCss = require('../index')

const path = require('path')

function detectLoopResult(list) {
  const result = true
  var loop = (arr) => {
    if (Object.prototype.toString.call(arr) === '[object Object]') {
      result = false
      return
    }
    Array.isArray(arr) &&
      arr.forEach((e) => {
        loop(e)
      })
  }
  loop(list)
  return result
}

async function commonTestFunction(done, testUrl) {
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

describe('scssTest.js', () => {
  it('simple', (done) => {
    commonTestFunction(done, './scss/scssTest.vue')
  })
  it('cyclic', (done) => {
    commonTestFunction(done, './scss/scssTestCyclic.vue')
  })
  it('directory', (done) => {
    commonTestFunction(done, './scss')
  })
  it('importcss', (done) => {
    commonTestFunction(done, './scss/scssTestImport.vue')
  })
  it('multiStyle', (done) => {
    commonTestFunction(done, './scss/scssTestMulti.vue')
  })
})