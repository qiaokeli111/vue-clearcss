// test.js

const assert = require('assert')
const filterCss = require('../index')

const path = require('path')
describe('scssTest.js', () => {
    it('simple',  (done) => {
         (async function () {
            try {
                let result = await filterCss(path.resolve(__dirname, './scss/scssTest.vue'))
                if (Array.isArray(result) && result.length === 1 && Array.isArray(result[0]) && result[0].length === 0 ) {
                    done()
                }else{
                    done(new Error('test fail'));
                }
            } catch (err) {
                done(err);
            }
        })();
    });
});