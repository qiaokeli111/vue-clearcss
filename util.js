function findFirstNotEmpty() {
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

function getAttrFormStr(str) {
    str = str
        .replace(/('|")([^'|"]*)\1/gm, function (a, b, c) {
            return a.replace(/[\r\n\s]/gm, "$blank$")
        })
        .replace(/[\r\n\s]/gm, "")
    let isObj = /{.*}/.test(str)
    let isArr = /\[.*\]/.test(str)
    function getAttrInObj(str) {
        return str.replace(/{.*}/gm, function (objstr) {
            let grouplist = objstr.replace(/[{}'"]/gm, "").split(",")
            grouplist.forEach((e) => {
                if (e) {
                    let value = /(.*):/.exec(e)
                    attrList.push(value ? value[1] : e)
                }
            })
            return ""
        })
    }
    function getAttrInArr(str) {
        let grouplist = str.replace(/[\[\]'"]/gm, "")
        if (isObj) {
            grouplist = grouplist.replace(/{.*}/gm, getAttrInObj)
        }
        grouplist.split(",").forEach((e) => {
            if (e) {
                if (e.includes("?")) {
                    let value = /\?(.*)/.exec(e)
                    attrList = attrList.concat(value[1].split(":"))
                } else {
                    attrList.push(e)
                }
            }
        })
    }
    let attrList = []
    if (isObj || isArr) {
        var complex = str.replace(/[\r\n\s]/gm, "")
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
        attrList = attrList.concat(attr[2].split("$blank$"))
    }

    return attrList
}

function validArr(arr) {
    return arr && Array.isArray(arr) && arr.length > 0
}

function findEleIndexInParent(ele,childrens) {
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
var cacheScope = new Map()
function findMutualArr(children,blockScope,isCache = true) {
    if (blockScope && /if/.test(blockScope)) {
        if (isCache && cacheScope.has(blockScope)) {
            return cacheScope.get(blockScope)
        }
        let matchIf = blockScope.match(/\d*if\d*/g)
        let matchIfReg = matchIf.map(e=>{
            let attr = e.split('if')
            return new RegExp(`(?<!>>${attr[0]})if${attr[1]}`)
        })
        children = children.filter(e=>{
            let matchRes = true
            for (let i = 0; i < matchIfReg.length; i++) {
                const h = matchIfReg[i];
                if (h.test(e.blockScope)) {
                    matchRes =false
                    break
                }
            }
            return matchRes
        })
        if (isCache) {
            cacheScope.set(blockScope,children)
        }
    }
    return children
}

function getChildMutual(ele) {
    let children = ele.parent.childrens.filter((e) => e.type === 1)
    let blockScope = ele.blockScope
    let currentIndex = findEleIndexInParent(ele,children)
    children = findMutualArr(children,blockScope,false)
    if (ele.ifId) {
        var operator = next ? 1 : -1
        var tempSibling,delIndex = currentIndex
        while ((tempSibling = children[(eleIndex += operator)])) {
            if (
                tempSibling.ifId !== ele.ifId
            ) {
                break
            }
        }
        next ? children.splice(currentIndex,delIndex-currentIndex) : children.splice(delIndex,currentIndex-delIndex)
    }
    return children
}

function findSibling(ele, next = true) {
    cacheScope = new Map()
    let children = getChildMutual(ele,next)   
    let currentIndex = findEleIndexInParent(ele,children)
    var operator = next ? 1 : -1
    function findIfConditionsCollention(sibEle, index) {
        let collectionArr = []
        let {ifId,forId} = sibEle
        while (ifId !== -1) {
            let collection = ifId
                ? children.filter((e) => e.ifId === id && e.forId === forId)
                : [sibEle]
            let existElse = collection.find((e) => e.else)
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
    if (typeof currentIndex === "number") {
        var siblingEle,
            eleIndex = currentIndex

            findAllIf(children)
        if (ele.ifId) {
            var tempSibling,delIndex = eleIndex
            while ((tempSibling = children[(eleIndex += operator)])) {
                if (
                    tempSibling.ifId !== ele.ifId
                ) {
                    break
                }
            }
            siblingEle = tempSibling
        } else {
            siblingEle = children[(eleIndex += operator)]
        }

        if (siblingEle && (siblingEle.ifId || siblingEle.blockScope)) {
            return findIfConditionsCollention(siblingEle, eleIndex)
        } else {
            return [siblingEle]
        }
    }
    return []
}
function findSiblingAll(ele, next = true) {
    var currentIndex = findEleIndexInParent(ele),
        childrens = ele.parent.childrens.filter((e) => e.type === 1),
        operator = next ? 1 : -1,
        conditionId = ele.ifId
    if (typeof currentIndex === "number") {
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

function findAllIf(child){
    let ifCondition = {}

    child.forEach(e=>{
        if (e.blockScope) {
            let matchIf = e.blockScope.match(/\d*if\d*(!!)?/g)
            let matchIfReg = matchIf.map(e=>{
                var attr = e.split('if')
                var ifId = attr[1].replace(/!!/,'').toString()
                if (!ifCondition[ifId]) {
                    ifCondition[ifId] = {}
                }
                ifCondition[ifId][attr[0].toString()] = attr[1].endsWith('!!')
            })
        }
    })
    let regIfArr = []
    Object.keys(ifCondition).forEach(e=>{
        let regIf = [],elseExist = false
        Object.keys(ifCondition[e]).forEach(i=>{
            let value = ifCondition[e][i]
            if (value) {
                elseExist = true
            }
            regIf.push(new RegExp(`(?<=>>${i})if${i}`))
        })
        if (!elseExist) {
            regIf.push(new RegExp(`^((?!aaa).)*$`))
        }
    })
    debugger;
}

// function validBlockLevel(sibScope, scope) {
//     if (!sibScope) return true
//     let sibScopeData = parseBlockScope(sibScope)
//     let scopeData = parseBlockScope(scope)
//     for (let i = 0; i < scopeData.length; i++) {
//         const block = scopeData[i]
//         if (block.ifId) {
//             let sibBlock = findBlockByIf(block.ifId, sibScopeData)
//             if (sibBlock && sibBlock.blockId !== block.blockId) {
//                 return false
//             }
//         }
//     }
//     return true
// }

function findBlockByIf(id, data) {
    return data.find((e) => e.ifId === id)
}

function findBlockByBlock(id, data) {
    return data.find((e) => e.blockId === id)
}

function parseBlockScope(scope) {
    let rex = /!!/g
    return scope
        .split(">>")
        .filter((e) => e !== "")
        .map((e) => {
            let data = e.split("if")
            return {
                blockId: data[0],
                ifId: data[1].replace(rex,''),
                ifElse: rex.test(data[1]),
            }
        })
}

module.exports = {
    findFirstNotEmpty,
    getAttrFormStr,
    validArr,
    findSibling,
    findSiblingAll,
}
