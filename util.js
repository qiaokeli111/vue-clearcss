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
  str = str.replace(/[\r\n\s]/gm, '')
  let isObj = /^{.*}$/.test(str)
  let isArr = /^\[.*\]$/.test(str)
  let attrList = []
  if (isObj) {
    let grouplist = str.replace(/[{}'"]/gm, '').split(',')
    grouplist.forEach((e) => {
      if (e) {
        let value = /(.*):/.exec(e)
        attrList.push(value[1])
      }
    })
  }
  if (isArr) {
    let grouplist = str.replace(/[\[\]'"]/gm, '').split(',')
    grouplist.forEach((e) => {
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
  return attrList
}

function validArr(arr) {
  return Array.isArray(arr) && arr.length > 0
}

module.exports = {
  findFirstNotEmpty,
  getAttrFormStr,
  validArr
}
