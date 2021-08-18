const compiler = require('vue-template-compiler')
var fs = require('fs')
var path = require('path')
module.exports = function filterCss(url) {
  return new Promise((resolve) => {
    var data = fs.readFileSync(path.resolve(__dirname, url), 'utf-8')
    var { validArr } = require('./util')
    var res = compiler.parseComponent(data, { pad: 'line' })
    const htmlast = compiler.compile(res.template.content)
    
    var parsecss = require('./css/parsecss')
    let filterArr = []
    if (validArr(res.styles)) {
       var cssResolver = new parsecss(res,htmlast)
       cssResolver.findUnuseCss().then(e=>resolve(e))
    //   Promise.all(
    //     res.styles.map((style) =>
    //       parsecss(style.content, htmlast.ast, style.lang).then((e) => {
    //         filterArr.push(e)
    //       })
    //     )
    //   ).then(e=>resolve(filterArr))
    }else{
        resolve(filterArr)
    }
  })
}
