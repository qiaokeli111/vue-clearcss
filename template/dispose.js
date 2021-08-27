let typeDis = {
  tag: (node, source) => `if(currentEle.tag === '${node.value}'){
                        ${source}
                    }`,
  defaultDis: (
    node,
    source,
    type
  ) => `if(matchEleAttr(currentEle, '${type}', '${node.value}')){
                        ${source}
                    }`,
  attribute: (
    node,
    source
  ) => `if(matchEleAttr(currentEle, 'attribute', '${node.attribute}')){
                        ${source}
                    }`,
}

let afterCombinator = {
  ' ': (source) => `
                    let cyclic =  [].concat(currentEle.childrens || [])
                    while (cyclic.length > 0) {
                        let tempCyclic = []
                        for (const childEle of cyclic) {
                            currentEle = childEle
                            tempCyclic = (currentEle.childrens || []).concat(tempCyclic)
                            ${source}
                        }
                        cyclic = tempCyclic
                    }
                    `,
  '>': (source) => `
                    if (currentEle && (currentEle = currentEle.childrens)) {
                        for (const childEle of currentEle) {
                            currentEle = childEle
                            ${source}
                        }
                    }
                    `,
  '~': (source) => `
                    let temp = currentEle
                    if (currentEle && (currentEle = matchEleAttr.util.findSiblingAll(currentEle))) {
                        for (const childEle of currentEle) {
                            currentEle = childEle
                            ${source}
                        }
                    }
                    currentEle = temp
                    `,
  '+': (source) => `
                    let temp = currentEle
                    if (currentEle && (currentEle = matchEleAttr.util.findSibling(currentEle))) {
                        for (const childEle of currentEle) {
                            currentEle = childEle
                            ${source}
                        }
                    }
                    currentEle = temp
                    `,
}
let combinator = {
  ' ': (source) => `
                while (currentEle && (currentEle = currentEle.parent)) {
                ${source}
                }
                `,
  '>': (source) => `
                if (currentEle && (currentEle = currentEle.parent)) {
                ${source}
                }
                `,
  '~': (source) => `
                    let temp = currentEle
                    if (currentEle && (currentEle = matchEleAttr.util.findSiblingAll(currentEle,false))) {
                        for (const childEle of currentEle) {
                            currentEle = childEle
                            ${source}
                        }
                    }
                    currentEle = temp
                `,
  '+': (source) => `
                let temp = currentEle
                if (currentEle && (currentEle = matchEleAttr.util.findSibling(currentEle,false))) {
                    for (const childEle of currentEle) {
                        currentEle = childEle
                        ${source}
                    }
                }
                currentEle = temp
                `,
}

module.exports = {
  typeDis,
  combinator,
  afterCombinator,
}
