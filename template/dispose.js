let typeDis = {
    tag: (node, source) => `if(currentEle.tag === '${node.value}'){
                        ${source}
                    }`,
    defaultDis:(
        node,
        source,
        type
    ) => `if(matchEleAttr(currentEle, '${type}', '${node.value}')){
                        ${source}
                    }`,
    attribute:(
        node,
        source,
    ) => `if(matchEleAttr(currentEle, 'attribute', '${node.attribute}')){
                        ${source}
                    }`,
}

let afterCombinator = {
    " ": (source) => `
                    while (currentEle && (currentEle = currentEle.children)) {
                        for (const childEle of currentEle) {
                            currentEle = childEle
                            ${source}
                        }
                    }
                    `,
    ">": (source) => `
                    if (currentEle && (currentEle = currentEle.children)) {
                        for (const childEle of currentEle) {
                            currentEle = childEle
                            ${source}
                        }
                    }
                    `,
}
let combinator = {
    " ": (source) => `
                while ((currentEle = currentEle.parent)) {
                ${source}
                }
                `,
    ">": (source) => `
                if ((currentEle = currentEle.parent)) {
                ${source}
                }
                `,
}

module.exports = {
    typeDis,
    combinator,
    afterCombinator,
}
