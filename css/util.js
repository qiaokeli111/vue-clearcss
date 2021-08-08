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
      after: nodes.slice(i+1, nodes.length),
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
      class: ({ value }) => ast.attrsMap && ast.attrsMap.class === value,
      id: ({ value }) => ast.attrsMap && ast.attrsMap.id === value,
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
                  let currentIndex = -1,currentEle, result = [], temp = []
                  main: while ((currentEle = searchEleResult[++currentIndex])) {
                  `
  let endHead = `
                return result
                `
  let source = `
                temp.push(searchEleResult[currentIndex])
                continue main
                `
  let combinator = {
    ' ': () => `
                while ((currentEle = currentEle.parent)) {
                ${source}
                }
                `,
  }
  let afterCombinator = {
    ' ': () => `
                while (currentEle && currentEle.children) {
                    currentEle.children.forEach(childEle=>{
                        currentEle = childEle
                        ${source}
                    })
                }
            `,
  }
  
  // todo 没有解析动态的class id
  let typeDis = {
    tag: (name) => `if(currentEle.tag === '${name}'){
                        ${source}
                    }`,
    class: (
      name
    ) => `if(currentEle.attrsMap && currentEle.attrsMap.class === '${name}'){
                        ${source}
                    }`,
    id: (
      name
    ) => `if(currentEle.attrsMap && currentEle.attrsMap.id === '${name}'){
                        ${source}
                    }`,

    combinator: (selector) => combinator[selector](),
    afterCombinator:(selector) => afterCombinator[selector](),
  }
  // 先解析before
  for (let i = 0; i < before.length; i++) {
    const e = before[i]
    source = typeDis[e.type](e.value)
  }
  source += `
            }
            `

  if (Array.isArray(after) && after.length > 0) {
    var afterHead = `
            var afterIndex = -1
            after: while ((currentEle = temp[++afterIndex])) {
        `
    var endAfterHead = `
            }
    `
    let afterSource = `
                        result.push(temp[currentIndex])
                        continue after
                      `

    for (let i = 0; i < after.length; i++) {
      const e = after[i]
      if (e.type === 'combinator') {
        afterSource = typeDis['afterCombinator'](e.value)
      } else {
        afterSource = typeDis[e.type](e.value)
      }
      
    }
    source += afterHead + afterSource + endAfterHead
  } else {
    source += `
        result = temp
    `
  }
  
  let templateFun = new Function(
    'searchEleResult',
    startHead + source + endHead
  )
  return templateFun
}
function Resolver(c, f, x, r) {
  var e,
    n,
    o,
    j = r.length - 1,
    k = -1
  main: while ((e = c[++k])) {
    if (/(^|\s)cc(\s|$)/.test(e.getAttribute('class'))) {
      n = e
      while ((e = e.parentElement)) {
        if (/(^|\s)ff(\s|$)/.test(e.getAttribute('class'))) {
          n = e
          while ((e = e.parentElement)) {
            if (/(^|\s)rr(\s|$)/.test(e.getAttribute('class'))) {
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

module.exports = {
  TraversesFind,
  findSearchEle,
  findEleWithHtml,
  generateTemplate,
}
