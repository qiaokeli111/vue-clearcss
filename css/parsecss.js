const filterStyle = require('./filterStyle');
var argv = require('minimist')(process.argv.slice(2))
module.exports = class parsecss{
    constructor({script,styles,},htmlast){
        this.script = script
        this.styles = styles
        this.template = htmlast.ast
        this.matchCache = new Map()
        this.filterArr = []
        this.argv = argv
        this.filterStyleProcess = []
        this.styles.forEach(style=>{
            this.filterStyleProcess.push(new filterStyle(style))
        })
    }
    findUnuseCss(){
        return Promise.all(
            this.filterStyleProcess.map((process) =>
              process.unuseCss(this)
            )
          ).then(()=>{
              return this.filterArr
          })
    }

    setCache(attr,content) {
        this.matchCache.set(attr,content)
    }
    hasCache(attr) {
        return this.matchCache.has(attr)
    }
    getCache(attr) {
        return this.matchCache.get(attr)
    }
    
    clearCache(params) {
        this.matchCache.clear()
    }
    
    builderCacheKey(ele) {
        let type = ele.type
        var typeDispose = {
            class: (element) =>  `.${element.type}>${element.value}`,
            id: (element) => `#${element.type}>${element.value}`,
            tag: (element) =>`${element.type}>${element.value}`,
        }
        return typeDispose[type] && typeDispose[type](ele)
    }
}