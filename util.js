function findFirstNotEmpty () {
  let arg = arguments
  var i = -1,
    temp,
    length = arg.length
  while (length--) {
    temp = arg[++i]
    if (temp !== undefined && temp !== null) {
      break
    }
  }
  return temp
}

function getAttrFormStr (str) {
  str = str
    .replace(/('|")([^'|"]*)\1/gm, function (a, b, c) {
      return a.replace(/[\r\n\s]/gm, '$blank$')
    })
    .replace(/[\r\n\s]/gm, '')
  let isObj = /{.*}/.test(str)
  let isArr = /\[.*\]/.test(str)
  function getAttrInObj (str) {
    return str.replace(/{.*}/gm, function (objstr) {
      let grouplist = objstr.replace(/[{}'"]/gm, '').split(',')
      grouplist.forEach(e => {
        if (e) {
          let value = /(.*):/.exec(e)
          attrList.push(value ? value[1] : e)
        }
      })
      return ''
    })
  }
  function getAttrInArr (str) {
    let grouplist = str.replace(/[\[\]'"]/gm, '')
    if (isObj) {
      grouplist = grouplist.replace(/{.*}/gm, getAttrInObj)
    }
    grouplist.split(',').forEach(e => {
      if (e) {
        if (e.includes('?')) {
          let value = /\?(.*)/.exec(e)
          attrList = attrList.concat(value[1].split(':'))
        } else {
          attrList.push(e)
        }
      }
    })
  }
  let attrList = []
  if (isObj || isArr) {
    var complex = str.replace(/[\r\n\s]/gm, '')
    if (isObj) {
      complex = getAttrInObj(complex)
    }
    if (isArr) {
      getAttrInArr(complex)
    }
  }

  var reg = /('|")([^'|"]*)\1/gm
  let attr = {}
  while ((attr = reg.exec(str))) {
    attrList = attrList.concat(attr[2].split('$blank$'))
  }

  return attrList
}

function validArr (arr) {
  return arr && Array.isArray(arr) && arr.length > 0
}

function findEleIndexInParent (ele, childrens) {
  if (!ele) return
  let parent
  if ((parent = ele.parent)) {
    let i = 0,
      e
    while ((e = childrens[i++])) {
      if (e === ele) {
        break
      }
    }
    return i - 1
  }
}
function findMutualArr (children, blockScope) {
  if (blockScope && /if/.test(blockScope)) {
    let matchIfReg = []
    getBlockIf(blockScope, (ifId, blockId, isElse) => {
        matchIfReg.push(new RegExp(`(?<!>>${blockId})if${ifId}`))
    })

    children = children.filter(e => {
      let matchRes = true
      for (let i = 0; i < matchIfReg.length; i++) {
        const h = matchIfReg[i]
        if (h.test(e.blockScope)) {
          matchRes = false
          break
        }
      }
      return matchRes
    })
  }
  return children
}

function getChildMutual (ele, next) {
  let children = ele.parent.childrens.filter(e => e.type === 1)
  let blockScope = ele.blockScope
  let currentIndex = findEleIndexInParent(ele, children)
  children = findMutualArr(children, blockScope, false)
  if (ele.ifId) {
    var operator = next ? 1 : -1
    var tempSibling,
      delIndex = currentIndex
    while ((tempSibling = children[(eleIndex += operator)])) {
      if (tempSibling.ifId !== ele.ifId) {
        break
      }
    }
    next
      ? children.splice(currentIndex, delIndex - currentIndex)
      : children.splice(delIndex, currentIndex - delIndex)
  }
  return children
}

function findSibling (ele, next = true) {
  let children = getChildMutual(ele, next)
  let eleIndex = findEleIndexInParent(ele, children)
  var operator = next ? 1 : -1
  function findIfConditionsCollention (sibEle, index) {
    let collectionArr = []
    let { ifId, forId } = sibEle
    while (ifId !== -1) {
      let collection = ifId
        ? children.filter(e => e.ifId === id && e.forId === forId)
        : [sibEle]
      let existElse = collection.find(e => e.else)
      collectionArr = collectionArr.concat(collection)
      if (existElse) {
        break
      } else {
        index = index + collection.length * operator
        ifId = children[index] ? children[index].ifId : -1
        forId = children[index] ? children[index].forId : -1
      }
    }
    return collectionArr
  }
  if (typeof eleIndex === 'number') {
    let currentIndex = eleIndex
    parseIfInBlock(children, ele)

    if (siblingEle && (siblingEle.ifId || siblingEle.blockScope)) {
      return findIfConditionsCollention(siblingEle, eleIndex)
    } else {
      return [siblingEle]
    }
  }
  return []
}
function findSiblingAll (ele, next = true) {
  var currentIndex = findEleIndexInParent(ele),
    childrens = ele.parent.childrens.filter(e => e.type === 1),
    operator = next ? 1 : -1,
    conditionId = ele.ifId
  if (typeof currentIndex === 'number') {
    var siblingEle,
      eleIndex = currentIndex
    if (conditionId) {
      var tempSibling
      while ((tempSibling = childrens[(eleIndex += operator)])) {
        if (tempSibling.ifId !== conditionId) {
          break
        }
      }
      eleIndex -= operator
    }
    if (next) {
      return childrens.slice(eleIndex + 1, childrens.length)
    } else {
      return childrens.slice(0, eleIndex)
    }
  }
  return []
}

function parseIfInBlock (child, ele) {
  let ifCondition = {}
  let muaIf = {}

  getBlockIf(ele.blockScope, (ifId, blockId, isElse) => {
    muaIf[ifId] = blockId
  })

  child.forEach(e => {
    getBlockIf(e.blockScope, (ifId, blockId, isElse) => {
        if (!muaIf[ifId]) {
            if (!ifCondition[ifId]) {
                ifCondition[ifId] = {}
            }
            ifCondition[ifId][blockId] = isElse
        }
    })
  })
  let regIfArr = []
  Object.keys(ifCondition).forEach(e => {
    let regIf = [],
      elseExist = false
    Object.keys(ifCondition[e]).forEach(i => {
      let value = ifCondition[e][i]
      if (value) {
        elseExist = true
      }
      // ifid和blockid完全匹配或者不包含ifId
      regIf.push(`((?<=>>${i})if${e})|(^((?!if${e}).)*$)`)
    })
    if (!elseExist) {
      // 不包含ifid>> 且以ifid结尾
      // regIf.push(`(^((?!if${e}>>).)*$)((?<!if${e})$)`)
      regIf.push(`^((?!if${e}).)*$`)
    }
    regIfArr.push(regIf)
  })
  let ifCombine = combine_arr(regIfArr)
  let ifChild = ifCombine.map(e =>
    child.filter(ele => !ele.blockScope || e.test(ele.blockScope))
  )
  let ss = ifChild.map(e => e.map(i => i.attrsMap))
  console.log(ss)
  debugger
}

function combine_arr (arr) {
  var sarr = [[]]
  for (var i = 0; i < arr.length; i++) {
    var tarr = []
    for (var j = 0; j < sarr.length; j++)
      for (var k = 0; k < arr[i].length; k++)
        tarr.push(sarr[j].concat(`(?=.*(${arr[i][k]}))`).toString())
    sarr = tarr
  }
  return sarr.map(e => new RegExp(e))
}

function getBlockIf (scope, cb) {
  if (scope) {
    let matchIf = scope.match(/\d*if\d*(!!)?/g)
    Array.isArray(matchIf) &&
      matchIf.map(e => {
        var attr = e.split('if')
        var ifId = attr[1].replace(/!!/, '').toString()
        cb(ifId, attr[0].toString(), attr[1].endsWith('!!'))
      })
  }
}

module.exports = {
  findFirstNotEmpty,
  getAttrFormStr,
  validArr,
  findSibling,
  findSiblingAll
}
