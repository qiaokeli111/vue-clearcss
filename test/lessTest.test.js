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

describe('lessTest', () => {
  it('simple', (done) => {
    commonTestFunction(done, './less/lessTest.vue')
  })
  it('cyclic', (done) => {
    commonTestFunction(done, './less/lessTestCyclic.vue')
  })
  it('directory', (done) => {
    commonTestFunction(done, './less')
  })
  it('importcss', (done) => {
    commonTestFunction(done, './less/lessTestMulti.vue')
  })
  it('multiStyle', (done) => {
    commonTestFunction(done, './less/lessTestMulti.vue')
  })
})
