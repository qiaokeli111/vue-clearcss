function findFirstNotEmpty() {
    let arg = arguments
    var i = -1,temp,length = arg.length
    while (length--) {
        temp = arg[++i]
        if (temp !== undefined && temp !== null) {
            break;
        }
    }
    return temp
}

function getAttrFormStr(str){
    return new Function(`return ${str}`)()
}

module.exports = {
    findFirstNotEmpty,
    getAttrFormStr
}