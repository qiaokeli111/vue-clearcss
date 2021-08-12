const chalk = require('chalk');
var cid = 0

class createTemplate {
    constructor(typeDis, combinator,startHead,endTail,source) {
        this.typeDis = typeDis
        this.combinator = combinator
        this.cid = ++cid
        this.startHead =startHead ||  `
            result = [];
            currentIndex = -1;
            main${this.cid}: while ((currentEle = searchEleResult[++currentIndex])) {
            `
        this.endTail = endTail || `
            }
            searchEleResult = result
            `
        this.source =source || `
                result.push(searchEleResult[currentIndex]);
                continue main${this.cid}
            `
    }
    builderTemplate(chain){
        for (let i = 0; i < chain.length; i++) {
            const e = chain[i]
            if (e.type === 'combinator') {
                if (this.combinator[e.value]) {
                    this.source = this.combinator[e.value](this.source)
                } else {
                    console.log(chalk.red(`该标识还没有做兼容。相关数据可能过滤有误 ${e.value}`));
                }
            } else {
                this.source = this.typeDis[e.type] ? this.typeDis[e.type](e.value,this.source) : this.typeDis['defaultDis'](e.value,this.source,e.type)
            }
          }
          return  this.startHead + this.source + this.endTail
    }
}
module.exports = {
    createTemplate,
}
