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

describe('cssTest', () => {
  it('simple import', (done) => {
    commonTestFunction(done, './css/cssTest.vue')
  })
  it('animation', (done) => {
    commonTestFunction(done, './css/cssAnimationTest.vue')
  })
})
