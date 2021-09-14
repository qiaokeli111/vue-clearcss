let postcss = require("postcss"),
    less = require("less")
    util = require('./util')

module.exports = (css,opt) => {
    return less
        .render(css, {
            ...opt,
            sourceMap: {
                outputSourceFiles: true,
            },
        })
        .then((output) => {
            return postcss.parse(output.css, {
                map: {
                  prev: JSON.parse(output.map),
                },
              })
        })
        .catch(e=>{
            throw new Error(e)
        })
}
