let cache = new Map()

function setCache(attr,content) {
    cache.set(attr,content)
}
function hasCache(attr) {
    return cache.has(attr)
}
function getCache(attr) {
    return cache.get(attr)
}

function clearCache(params) {
    cache.clear()
}

function builderCacheKey(ele) {
    let type = ele.type
    var typeDispose = {
        class: (element) =>  `.${element.type}>${element.value}`,
        id: (element) => `#${element.type}>${element.value}`,
        tag: (element) =>`${element.type}>${element.value}`,
    }
    return typeDispose[type] && typeDispose[type](ele)
}

module.exports = {
    setCache,
    hasCache,
    getCache,
    clearCache,
    builderCacheKey
}