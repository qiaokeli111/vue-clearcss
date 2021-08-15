const postcss = require('postcss')
const util = require('./util')
const fs = require('fs')
const chalk = require('chalk')
const comment = require('postcss-comment')
var path = require('path')
var { validArr } = require('../util')

module.exports = class filterStyle {
  constructor({ lang, content }) {
    this.filterCssArray = []
    this.lang = lang
    this.originCss = content
    this.context = null
  }
  unuseCss(context) {
    this.context = context
    let htmlast = context.template
    return this.transformToCss(this.originCss, this.lang).then((e) => {
      return postcss([this.fliterPlugin(this)])
        .process(e, { from: undefined })
        .then((e) => {
          if (!context.argv.test) {
            console.log(`<--------${this.lang} style block -------->`)
            if (this.filterCssArray.length === 0) {
              console.log(chalk.green('no useless css '))
            } else {
              this.filterCssArray.forEach((i) => {
                console.log(chalk.red(`selector ${i.name}`))
                console.log(chalk.blue(i.position))
              })
            }
            console.log(`<----------------------------------------->
                            
                            `)
          }
          context.filterArr.push(this.filterCssArray)
          return this.filterCssArray
        })
    })
  }
  transformToCss(css, cssLang) {
    if (cssLang === 'less') {
      const syntax = require('postcss-less')
      return postcss([]).process(css, {
        from: undefined,
        parser: comment,
        syntax: syntax,
      })
    } else if (cssLang === 'scss') {
      //   const parse = require("precss")
      var parse = require('postcss-node-sass')
      return postcss([parse({ sourceComments: true })]).process(css, {
        from: undefined,
        parser: comment,
      })
    } else if (cssLang === 'sass') {
      var postcssSass = require('postcss-sass')
      return postcss([]).process(css, {
        from: undefined,
        parser: comment,
        syntax: postcssSass,
      })
    } else {
      return postcss([]).process(css, { from: undefined, parser: comment })
    }
  }
  fliterPlugin(opts = {}) {
    return {
      postcssPlugin: 'fliterPlugin',
      Once(root) {
        let { nodes } = root
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.type === 'rule' && node.selector) {
                let initLine =Number(/line(.*), stdin/.exec(nodes[i-1].text)[1]);
                let position = [initLine, node.source.end.line-node.source.start.line+initLine]
                const parser = require('postcss-selector-parser')
                parser((selectors) =>
                  opts.transform(selectors, position)
                ).processSync(node.selector)
            }
            // if (node.type === 'atrule' && node.name === 'import') {
            //     let url = nodes.params
            //     url = url.replace(/[\r\n\s]/gm, '') 
            //     url = /url\(['"]*(.*?)['"]*\)/.exec(url)[1]
            //     var importCSS = fs.readFileSync(path.resolve(__dirname, url), 'utf-8')
            // }
        }
      },
    }
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
    this.filterCssArray.push(css)
  }
}
