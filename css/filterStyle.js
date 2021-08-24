const postcss = require('postcss')
const util = require('./util')
const fs = require('fs')
const chalk = require('chalk')
var path = require('path')
var { validArr } = require('../util')

module.exports = class filterStyle {
  constructor({ lang, content }, opt = {}) {
    this.filterCssArray = []
    this.lang = lang
    this.originCss = content
    this.context = null
    this.opt = opt
    this.getComment = this.getCommentFun(lang)
  }
  unuseCss(context) {
    this.context = context
    let htmlast = context.template
    return this.transformToCss(this.originCss, this.lang).then((e) => {
      return postcss([this.fliterPlugin(this)])
        .process(e, { from: undefined })
        .then((e) => {
          this.filterCssArray.info = {
            lang: this.lang,
          }

          !this.opt.notPushParent && context.filterArr.push(this.filterCssArray)
          return this.filterCssArray
        })
    })
  }
  transformToCss(css, cssLang) {
    if (cssLang === 'less') {
     
      var less = require('./postcss-less');
      return less(css)
    } else if (cssLang === 'scss') {
      const comment = require('postcss-comment')
      var parse = require('postcss-node-sass')
      return postcss([parse({ sourceComments: true })]).process(css, {
        from: undefined,
        parser: comment,
      })
    } else if (cssLang === 'sass') {
      var postcssSass = require('postcss-sass')
      return postcss([]).process(css, {
        from: undefined,
        syntax: postcssSass,
      })
    } else {
      return postcss([]).process(css, { from: undefined, parser: comment })
    }
  }
  getCommentFun(lang) {
    if (lang === 'scss') {
      return function (node) {
        let comment = node.prev()
        let initLine = Number(/line(.*), stdin/.exec(comment.text)[1])
        return [
          initLine,
          node.source.end.line - node.source.start.line + initLine,
        ]
      }
    } else if(lang === 'less'){
        return function (node) {
            let positionMap = node.root().raws.positionMap
            let initLine = positionMap.get(node.source.start.line).originalLine
            return [
              initLine,
              node.source.end.line - node.source.start.line + initLine,
            ]
          }
    } else {
      return function (node) {
        return [node.source.start.line, node.source.end.line]
      }
    }
  }
  fliterPlugin(opts = {}) {
    return {
      postcssPlugin: 'fliterPlugin',
      Rule(node) {
        const parser = require('postcss-selector-parser')
        parser((selectors) =>
          opts.transform(selectors, opts.getComment(node))
        ).processSync(node.selector)
      },
      AtRule: {
        import: (node) => {
          let url = node.params
          url = url.replace(/[\r\n\s]/gm, '')
          url = /url\(['"]*(.*?)['"]*\)/.exec(url)[1]
          opts.addNewStyle(url)
        },
        lessimport:(node)=>{
            let url = node.params
            return opts.addNewStyle(url)
        }
      },
    }
  }

  addNewStyle(url){
    var importPath = path.resolve(this.context.parseUrl, '..', url)
    var content = fs.readFileSync(importPath, 'utf-8')
    let lang = path.extname(importPath)
    let importProcess = new filterStyle(
        { lang: lang.slice(1, lang.length), content },
        { notPushParent: true }
    )
    let that = this
    return importProcess.unuseCss(this.context).then((res) => {
        that.setCssArray(
        res.map((e) => ({ ...e, name: `${e.name} from ${url}` }))
        )
    })
  }

  transform(selectors, position) {
    selectors.nodes.forEach((selector) => {
      if (selector.type === 'selector') {
        let searchEle = util.findSearchEle(selector.nodes, this.context)
        let searchEleResult = util.findEleWithHtml(
          searchEle.searchEle,
          this.context.template,
          this.context
        )
        if (searchEleResult.length === 0) {
          this.setCssArray(util.assembleConsoleInfo(selector.nodes, position))
          return
        }
        let templateFun = util.generateTemplate(
          searchEle.before,
          searchEle.after
        )
        let result = templateFun(searchEleResult, util.matchEleAttr)
        if (result && result.length === 0) {
          this.setCssArray(util.assembleConsoleInfo(selector.nodes, position))
        }
      }
    })
  }
  setCssArray(css) {
    this.filterCssArray = this.filterCssArray.concat(css)
  }
}
