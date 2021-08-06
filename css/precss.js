const postcss = require("postcss")
const precss = require("precss")
const parser = require("postcss-selector-parser")
const util = require('./util')
var filterCssArray = []
var htmlast = {}
module.exports = function parsecss(css,ast) {
    htmlast = ast
    clearCssArray()
    postcss([precss()])
        .process(css, { from: undefined })
        .then((e) => {
            postcss([fliterPlugin()])
                .process(e, { from: undefined })
                .then((e) => {})
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
                    parser(transform).processSync(node.selector)
                }
            })
        },
    }
}
fliterPlugin.postcss = true

const transform = (selectors) => {
    selectors.nodes.forEach((selector) => {
        if (selector.type === "selector") {
            let searchEle = util.findSearchEle(selector.nodes)
            let searchEleResult = util.findEleWithHtml(searchEle.searchEle,htmlast)
            let templateFun = util.generateTemplate(searchEle.before,searchEle.after)
            debugger;
        }
    })
}
