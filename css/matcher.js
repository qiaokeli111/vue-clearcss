var { getAttrFormStr } = require("../util")

exports.matcherMethod = {
    'class':(matcher, value)=>{
        let classList = []
        if (matcher.classBinding) {
            let bindClass = getAttrFormStr(matcher.classBinding)
            classList = classList.concat(bindClass)
        }
        if (matcher.attrsMap && matcher.attrsMap.class) {
            classList = classList.concat(matcher.attrsMap.class.split(" "))
        }
        return classList.includes(value)
    },
    'id':(matcher, value)=>{
        if (matcher.attrsMap && matcher.attrsMap.id) {
            return matcher.attrsMap.id === value
        }
    },
    'attribute':(matcher, value)=>{
        if (matcher.attrsMap && matcher.attrsMap.id) {
            return matcher.attrsMap.id === value
        }
    },
}