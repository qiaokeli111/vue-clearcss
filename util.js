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
    str = str.replace(/[\r\n\s]/gm, "")
    let isObj = /{.*}/.test(str)
    let isArr = /\[.*\]/.test(str)
    function getAttrInObj(str) {
        return str.replace(/{.*}/gm, function (objstr) {
            let grouplist = objstr.replace(/[{}'"]/gm, "").split(",")
            grouplist.forEach((e) => {
                if (e) {
                    let value = /(.*):/.exec(e)
                    attrList.push(value[1])
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
        var complex = str
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
        attrList.push(attr[2])
    }

    return attrList
}

function validArr(arr) {
    return arr && Array.isArray(arr) && arr.length > 0
}

function findEleIndexInParent(ele) {
    if (!ele) return
    let parent
    if ((parent = ele.parent)) {
        let i = 0,
            e,
            children = parent.children.filter((e) => e.type === 1)
        while ((e = children[i++])) {
            if (e === ele) {
                break
            }
        }
        return i - 1
    }
}

function findSibling(ele, next = true) {
    let currentIndex = findEleIndexInParent(ele)
    if (currentIndex) {
        return ele.parent.children.filter((e) => e.type === 1)[
            next ? currentIndex : currentIndex - 2
        ]
    }
}
function findSiblingAll(ele, next = true) {
    let currentIndex = findEleIndexInParent(ele)
    if (currentIndex !== undefined || currentIndex !== null) {
        let children = ele.parent.children.filter((e) => e.type === 1)
        if (next) {
            return children.slice(currentIndex + 1, children.length)
        } else {
            return children.slice(0, currentIndex)
        }
    }
    return []
}

module.exports = {
    findFirstNotEmpty,
    getAttrFormStr,
    validArr,
    findSibling,
    findSiblingAll,
}
