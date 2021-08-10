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
                this.source = this.combinator[e.value](this.source)
            } else {
                this.source = this.typeDis[e.type](e.value,this.source)
            }
          }
          return  this.startHead + this.source + this.endTail
    }
}
module.exports = {
    createTemplate,
}
