let postcss = require("postcss"),
    less = require("less")
    util = require('./util')
var { renderAfterReplace } = require('./util')
module.exports = (css,opt) => {
    return less
        .render(css, {
            ...opt,
            sourceMap: {
                outputSourceFiles: true,
            },
        })
        .then((output) => {
            return postcss.parse(renderAfterReplace(output.css), {
                map: {
                  prev: JSON.parse(output.map),
                },
              })
        })
        .catch(e=>{
            throw new Error(e)
        })
}
