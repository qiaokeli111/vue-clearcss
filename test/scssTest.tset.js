// test.js

const assert = require('assert')
const filterCss = require('../index')

const path = require('path')

async function commonTestFunction(done,testUrl){
    try {
        let result = await filterCss(path.resolve(__dirname, testUrl))
        if (Array.isArray(result) && result.length === 1 && Array.isArray(result[0]) && result[0].length === 0 ) {
            done()
        }else{
            done(new Error('test fail'));
        }
    } catch (err) {
        done(err);
    }
}

describe('scssTest.js', () => {
    it('simple',  (done) => {
        commonTestFunction(done,'./scss/scssTest.vue')
    });
    it('cyclic',  (done) => {
        commonTestFunction(done,'./scss/scssTestCyclic.vue')
    });
});