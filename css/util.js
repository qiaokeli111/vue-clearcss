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
                  let currentIndex, currentEle, result
                  `
  let endHead = `
                return result
                `
  
  // todo 没有解析动态的class id

  var {createTemplate} = require('../template/createTemplate')
  var {typeDis,afterCombinator,combinator} = require('../template/dispose')
  
  // 先解析before
  var beforeTemplate
  if (Array.isArray(before) && before.length > 0) {
    beforeTemplate =new createTemplate(typeDis,combinator)
    beforeStr = beforeTemplate.builderTemplate(before)
  }



  var afterTemplate
  if (Array.isArray(after) && after.length > 0) {
    afterTemplate =new createTemplate(typeDis,afterCombinator)
    afterStr = afterTemplate.builderTemplate(after.reverse())
  } 
  let functionBody = startHead + beforeStr + afterStr + endHead
  
  let templateFun = new Function(
    'searchEleResult',
    functionBody
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
