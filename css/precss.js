const postcss = require("postcss")
const precss = require("precss")
const parser = require("postcss-selector-parser")
const util = require('./util')
const chalk = require('chalk');
const comment = require('postcss-comment')
var matchCache = require("./cacheMatchElement")
var filterCssArray = []
var htmlast = {}
module.exports = function parsecss(css,ast) {
    htmlast = ast
    // reset status at the begin
    clearCssArray()
    matchCache.clearCache()
    postcss([precss()])
        .process(css, { from: undefined, parser: comment})
        .then((e) => {
            postcss([fliterPlugin()])
                .process(e, { from: undefined })
                .then((e) => {
                    if (filterCssArray.length === 0) {
                        console.log(chalk.green('no useless css'));
                    } else {
                        filterCssArray.forEach(i=>{
                            console.log(chalk.red(`selector ${i.name}`));
                            console.log(chalk.blue(i.position));
                        })
                    }
                })
        })
}

function clearCssArray() {
    filterCssArray = []
}
function setCssArray(css) {
    filterCssArray.push(css)
}

function fliterPlugin(opts = {}) {
    return {
        postcssPlugin: "fliterPlugin",
        Once(root) {
            let { nodes } = root
            nodes.forEach((node) => {
                if (node.type === "rule" && node.selector) {
                    let position = [node.source.start.line,node.source.end.line]
                    parser((selectors)=>transform(selectors,position)).processSync(node.selector)
                }
            })
        },
    }
}

const transform = (selectors,position) => {
    selectors.nodes.forEach((selector) => {
        if (selector.type === "selector") {
            let searchEle = util.findSearchEle(selector.nodes)
            let searchEleResult = util.findEleWithHtml(searchEle.searchEle,htmlast)
            if (searchEleResult.length === 0) {
                setCssArray({
                    name:selector.nodes[selector.nodes.length-1].value,
                    position:`start:${position[0]}  end:${position[1]}`
                })
                return
            }
            let templateFun = util.generateTemplate(searchEle.before,searchEle.after)
            let result = templateFun(searchEleResult)
            if (result && result.length === 0) {
                setCssArray({
                    name:selector.nodes[selector.nodes.length-1].value,
                    position:`start:${position[0]}  end:${position[1]}`
                })
            }
        }
    })
}
