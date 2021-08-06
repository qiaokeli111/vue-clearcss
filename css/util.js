function TraversesFind(params) {}

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
            after: nodes.slice(i, nodes.length - 1),
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
        if (!ast) {
            return htmlEleArr
        }
        let type = ele.type
        //  这里只处理了class元素的搜索情况
        if (ast.attrsMap && ast.attrsMap.class === ele.value) {
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
    let startHead =
        "let currentIndex = 0,eleLength = searchEleResult.length,currentEle = searchEleResult[0], result = []"
    let source = `
        result.push()
        continue main
    `
    let templateBody = ""
    let typeDis = {
        tag: (name) => `
            if(currentEle.type === name){
                ${source}
            }
        `,
        class: `(ele,className)=>{
            return ele.attrsMap.class === className
        }`,
        id: `(ele,idName)=>{
            return ele.attrsMap.id === idName
        }`,
        combinator: combinator(selector.value),
    }

    let combinator = {
        " ": () => `
            n = currentEle
            while ((currentEle = currentEle.parent)) {
               ${source}
            }
            currentEle = n
        `,
    }
}
function Resolver(c, f, x, r) {
    var e,
        n,
        o,
        j = r.length - 1,
        k = -1
    main: while ((e = c[++k])) {
        if (/(^|\s)cc(\s|$)/.test(e.getAttribute("class"))) {
            n = e
            while ((e = e.parentElement)) {
                if (/(^|\s)ff(\s|$)/.test(e.getAttribute("class"))) {
                    n = e
                    while ((e = e.parentElement)) {
                        if (/(^|\s)rr(\s|$)/.test(e.getAttribute("class"))) {
                            r[++j] = c[k]
                            continue main
                        }
                    }
                    e = n
                }
            }
            e = n
        }
    }
    return r
}

module.exports = { TraversesFind, findSearchEle, findEleWithHtml }
