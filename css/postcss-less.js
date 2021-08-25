/**
 * POSTCSS-NODE-SASS
 * A PostCSS plugin to parse styles with node-sass
 */

let postcss = require("postcss"),
    less = require("less")
    util = require('./util')

module.exports = (css) => {
    return less
        .render(css, {
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
            // return postcss().process(output.css, {
            //     from: undefined,
            //     map: {
            //         prev: JSON.parse(output.map),
            //     },
            // })
        })
        .catch(e=>{
            throw new Error(e)
        })
}
