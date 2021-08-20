const filterCss = require('../index')
const path = require('path')
filterCss(path.resolve(__dirname, './aa.vue1')).then(e=>{
    // console.log(e);
})