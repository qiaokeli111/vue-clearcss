const filterCss = require('../index')
const path = require('path')
filterCss(path.resolve(__dirname, './aa.vue')).then(e=>{
    console.log(e);
})