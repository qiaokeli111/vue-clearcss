const filterCss = require('../index')
const path = require('path')
filterCss(path.resolve(__dirname, './scss/scssTest.vue')).then(e=>{
    console.log(e);
})