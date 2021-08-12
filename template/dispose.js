let typeDis = {
    tag: (name, source) => `if(currentEle.tag === '${name}'){
                        ${source}
                    }`,
    defaultDis:(
        name,
        source,
        type
    ) => `if(matchEleAttr(currentEle, '${type}', '${name}')){
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
