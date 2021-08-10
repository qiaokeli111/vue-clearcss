let typeDis = {
    tag: (name, source) => `if(currentEle.tag === '${name}'){
                        ${source}
                    }`,
    class: (
        name,
        source
    ) => `if(currentEle.attrsMap && currentEle.attrsMap.class === '${name}'){
                        ${source}
                    }`,
    id: (
        name,
        source
    ) => `if(currentEle.attrsMap && currentEle.attrsMap.id === '${name}'){
                        ${source}
                    }`,
}

let afterCombinator = {
    " ": (source) => `
                while (currentEle && currentEle.children) {
                    for (const childEle of currentEle.children) {
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
}
module.exports = {
    typeDis,
    combinator,
    afterCombinator
}
