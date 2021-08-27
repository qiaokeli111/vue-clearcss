const filterStyle = require('./filterStyle')
var argv = require('minimist')(process.argv.slice(2))
const chalk = require('chalk')
module.exports = class parsecss {
  constructor(url, opt = {}) {
    this.script = null
    this.styles = null
    this.template = null
    this.matchCache = new Map()
    this.filterArr = []
    this.parseUrl = url
    this.argv = argv
    this.filterStyleProcess = []
    this.suffixName = ''
    this.mode = opt.mode || 'normal'
    this.templateModule = {
        transformNode(e){
            e.childrens = e.children
        }
    }
  }
  initParse(url) {
    var fs = require('fs')
    const compiler = require('vue-template-compiler')
    var path = require('path')
    this.suffixName = path.extname(path.resolve(process.execPath, url))
    if (this.suffixName !== '.vue') {
      return
    }
    var data = fs.readFileSync(path.resolve(process.execPath, url), 'utf-8')
    var { validArr } = require('../util')
    var res = compiler.parseComponent(data, { pad: 'line' })
    const htmlast = compiler.compile(res.template.content,{modules:[this.templateModule]})
    let filterArr = []

    this.script = res.script
    this.styles = res.styles
    this.template = htmlast.ast

    if (validArr(res.styles)) {
      this.styles.forEach((style) => {
        this.filterStyleProcess.push(new filterStyle(style))
      })
    }
  }
 
  findUnuseCss() {
    this.initParse(this.parseUrl)
    return Promise.all(
      this.filterStyleProcess.map((process) => process.unuseCss(this))
    ).then(() => {
      if (!this.argv.test) {
        console.log(chalk.cyan(`file directory: ${this.parseUrl}`))
        if (this.suffixName !== '.vue' && this.mode === 'singlePage') {
          console.log(chalk.yellow('only parse vue SFC'))
        } else if (!this.filterArr.find((e) => e.length > 0)) {
          console.log(chalk.green('no useless css '))
        } else {
          this.filterArr
            .filter((e) => e.length > 0)
            .forEach((e) => {
              console.log(`<--------${e.info.lang} style block -------->`)
              e.forEach((i) => {
                console.log(chalk.red(`selector ${i.name}`))
                console.log(chalk.blue(i.position))
              })
              console.log(`<--------------------------------->
                            
                            `)
            })
        }
      }
      return this.filterArr
    })
  }

  setCache(attr, content) {
    this.matchCache.set(attr, content)
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
      class: (element) => `.${element.type}>${element.value}`,
      id: (element) => `#${element.type}>${element.value}`,
      tag: (element) => `${element.type}>${element.value}`,
    }
    return typeDispose[type] && typeDispose[type](ele)
  }
}
