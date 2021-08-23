/**
 * POSTCSS-NODE-SASS
 * A PostCSS plugin to parse styles with node-sass
 */

let postcss = require("postcss"),
    less = require("less")

module.exports = (css) => {
    let replaceCss  = css.replace(/@import\s*['|"]*\s*([^'|"]*)\s*['|"]*/gm,function(importAttr,url){
        return `@import1 url('${url}');`
    })
    return less
        .render(replaceCss, {
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
        .then((res) => {
            var sourceMap
            try {
                sourceMap = res.source.input.map.consumer()._generatedMappings
            } catch (error) {
                sourceMap = []
            }

            var positionMap = new Map()
            sourceMap.forEach((e) => {
                let cacheLine = positionMap.get(e.generatedLine)
                if (
                    cacheLine &&
                    cacheLine.generatedColumn &&
                    cacheLine.generatedColumn > e.generatedColumn
                ) {
                    return
                }
                positionMap.set(e.generatedLine, e)
            })
            res.raws.positionMap = positionMap
            return res
        }).catch(e=>{
            throw new Error(e)
        })
}
