const postcss = require('postcss')

var argv = require('minimist')(process.argv.slice(2))

const util = require('./util')
const chalk = require('chalk')
const comment = require('postcss-comment')
var matchCache = require('./cacheMatchElement')
var filterCssArray = []
var htmlast = {}
module.exports = function parsecss(css, ast, cssLang) {
  htmlast = ast
  // reset status at the begin
  clearCssArray()
  matchCache.clearCache()
  return transformToCss(css, cssLang).then((e) => {
    return postcss([fliterPlugin()])
      .process(e, { from: undefined })
      .then((e) => {
        if (!argv.test) {
          console.log('<-------- style block -------->')
          if (filterCssArray.length === 0) {
            console.log(chalk.green('no useless css '))
          } else {
            filterCssArray.forEach((i) => {
              console.log(chalk.red(`selector ${i.name}`))
              console.log(chalk.blue(i.position))
            })
          }
          console.log(`<------------------------------>
                        
                        `)
        }
        // clearCssArray()
        return filterCssArray
      })
  })
}

function transformToCss(css, cssLang) {
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
    return postcss([parse({sourceComments:true})]).process(css, {
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

function clearCssArray() {
  filterCssArray = []
}
function setCssArray(css) {
  filterCssArray.push(css)
}

function fliterPlugin(opts = {}) {
  return {
    postcssPlugin: 'fliterPlugin',
    Once(root) {
      let { nodes } = root
      nodes.forEach((node) => {
        if (node.type === 'rule' && node.selector) {
          let position = [node.source.start.line, node.source.end.line]
          const parser = require('postcss-selector-parser')
          parser((selectors) => transform(selectors, position)).processSync(
            node.selector
          )
        }
      })
    },
  }
}

const transform = (selectors, position) => {
  selectors.nodes.forEach((selector) => {
    if (selector.type === 'selector') {
      let searchEle = util.findSearchEle(selector.nodes)
      let searchEleResult = util.findEleWithHtml(searchEle.searchEle, htmlast)
      if (searchEleResult.length === 0) {
        setCssArray(util.assembleConsoleInfo(selector.nodes, position))
        return
      }
      let templateFun = util.generateTemplate(searchEle.before, searchEle.after)
      let result = templateFun(searchEleResult, util.matchEleAttr)
      if (result && result.length === 0) {
        setCssArray(util.assembleConsoleInfo(selector.nodes, position))
      }
    }
  })
}
