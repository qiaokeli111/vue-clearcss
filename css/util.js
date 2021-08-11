var argv = require("minimist")(process.argv.slice(2))
function matchEleAttr(matcher, value) {
    if (Object.prototype.toString.call(matcher) === "[object String]") {
        matcher = matcher.split(" ")
        return matcher.includes(value)
    }
}

function findSearchEle(nodes) {
    let lastClassIndex, lastIdIndex, lastTagIndex
    var typeDispose = {
        class: (i) => {
            if (!lastClassIndex) {
                lastClassIndex = i
            }
        },
        id: (i) => {
            if (!lastIdIndex) {
                lastIdIndex = i
            }
        },
        tag: (i) => {
            if (!lastTagIndex) {
                lastTagIndex = i
            }
        },
    }
    function disposeNode(i) {
        return {
            searchEle: nodes[i],
            before: nodes.slice(0, i),
            after: nodes.slice(i + 1, nodes.length),
        }
    }
    for (let i = nodes.length - 1; i >= 0; i--) {
        const element = nodes[i]
        let type = element.type
        typeDispose[type] && typeDispose[type](i)
    }
    return disposeNode(
        lastClassIndex || lastIdIndex || lastTagIndex || nodes.length - 1
    )
}

function findEleWithHtml(ele, ast) {
    let htmlEleArr = []
    function traversesWithHtml(ele, ast) {
        if (!ast) return
        let type = ele.type
        let typeDis = {
            tag: ({ value }) => ast.tag === value,
            class: ({ value }) =>
                ast.attrsMap && matchEleAttr(ast.attrsMap.class, value),
            id: ({ value }) =>
                ast.attrsMap && matchEleAttr(ast.attrsMap.id, value),
        }
        if (typeDis[type](ele)) {
            htmlEleArr.push(ast)
        }
        ast.children &&
            ast.children.forEach((child) => {
                traversesWithHtml(ele, child)
            })
    }
    if (Object.getOwnPropertyNames(ast).length > 0) {
        traversesWithHtml(ele, ast)
    }
    return htmlEleArr
}

function generateTemplate(before, after) {
    let startHead = `
                  let currentIndex, currentEle, result = searchEleResult
                  `
    let endTail = `
                return result
                `

    // todo 没有解析动态的class id

    var { createTemplate } = require("../template/createTemplate")
    var {
        typeDis,
        afterCombinator,
        combinator,
    } = require("../template/dispose")

    // 先解析before
    var beforeTemplate, beforeStr
    if (Array.isArray(before) && before.length > 0) {
        beforeTemplate = new createTemplate(typeDis, combinator)
        beforeStr = beforeTemplate.builderTemplate(before)
    }

    var afterTemplate, afterStr
    if (Array.isArray(after) && after.length > 0) {
        afterTemplate = new createTemplate(typeDis, afterCombinator)
        afterStr = afterTemplate.builderTemplate(after.reverse())
    }

    let functionBody =
        startHead + (beforeStr || "") + (afterStr || "") + endTail

    let templateFun = new Function("searchEleResult", functionBody)
    return templateFun
}

function wrapFunction(fun) {
    return function () {
        argv.perf && console.time(`${fun.name}`)
        let res = fun.apply(this, arguments)
        argv.perf && console.timeEnd(`${fun.name}`)
        return res
    }
}

module.exports = {
    findSearchEle: wrapFunction(findSearchEle),
    findEleWithHtml: wrapFunction(findEleWithHtml),
    generateTemplate: wrapFunction(generateTemplate),
}
