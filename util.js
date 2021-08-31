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
  str = str.replace(/('|")([^'|"]*)\1/gm,function (a,b,c) {
      return a.replace(/[\r\n\s]/gm, '$blank$')
  }).replace(/[\r\n\s]/gm, '')
  let isObj = /{.*}/.test(str)
  let isArr = /\[.*\]/.test(str)
  function getAttrInObj (str) {
    return str.replace(/{.*}/gm, function (objstr) {
      let grouplist = objstr.replace(/[{}'"]/gm, '').split(',')
      grouplist.forEach(e => {
        if (e) {
          let value = /(.*):/.exec(e)
          attrList.push(value?value[1]:e)
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

function findEleIndexInParent (ele) {
  if (!ele) return
  let parent
  if ((parent = ele.parent)) {
    let i = 0,
      e,
      childrens = parent.childrens.filter(e => e.type === 1)
    while ((e = childrens[i++])) {
      if (e === ele) {
        break
      }
    }
    return i - 1
  }
}

function findSibling (ele, next = true) {
  let currentIndex = findEleIndexInParent(ele)
  let children = ele.parent.childrens.filter(e => e.type === 1)
  var operator = next ? 1 : -1
  function findIfConditionsCollention (id,forId, index) {
    let collectionArr = []
    while (id !== -1) {
      let collection = id
        ? children.filter(e => e.ifId === id && e.forId === forId )
        : [children[index]]
      let existElse = collection.find(e => e.else)
      collectionArr = collectionArr.concat(collection)
      if (existElse) {
        break
      } else {
        index = index + collection.length * operator
        id = children[index] ? children[index].ifId : -1
        forId = children[index] ? children[index].forId : -1
      }
    }
    return collectionArr
  }
  if (typeof currentIndex === 'number') {
    var siblingEle, eleIndex= currentIndex
    if (ele.ifId || ele.blockScope) {
      var tempSibling
      while ((tempSibling = children[(eleIndex += operator)])) {
        if (tempSibling.ifId !== ele.ifId || (tempSibling.blockId === ele.blockId)) {
          break
        }
      }
      siblingEle = tempSibling
    } else {
      siblingEle = children[(eleIndex += operator)]
    }

    if (siblingEle && siblingEle.ifId) {
      return findIfConditionsCollention(
        siblingEle.ifId,
        siblingEle.forId,
        eleIndex
      )
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
    var siblingEle, eleIndex= currentIndex
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

module.exports = {
  findFirstNotEmpty,
  getAttrFormStr,
  validArr,
  findSibling,
  findSiblingAll
}
