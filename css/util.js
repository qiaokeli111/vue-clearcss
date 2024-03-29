var argv = require('minimist')(process.argv.slice(2))
var { findFirstNotEmpty, validArr } = require('../util')
var { matcherMethod } = require('./matcher')
var util = require('../util')
var path = require('path')
const fs = require('fs')
const globby = require('globby')

function matchEleAttr (matcher, type, value, ...arg) {
  if (matcher) {
    if (matcherMethod[type]) {
      return matcherMethod[type].apply(this, [matcher, value].concat(arg))
    } else {
      return true
    }
  }
}
matchEleAttr.util = util

function findSearchEle (nodes, matchCache) {
  let lastClassIndex,
    lastIdIndex,
    lastTagIndex,
    cacheLastClassIndex,
    cacheLastIdIndex,
    cacheLastTagIndex
  var typeDispose = {
    class: (i, element) => {
      if (
        !cacheLastClassIndex &&
        matchCache.hasCache(matchCache.builderCacheKey(element))
      ) {
        cacheLastClassIndex = i
      }
      if (!lastClassIndex) {
        lastClassIndex = i
      }
    },
    id: (i, element) => {
      if (
        !cacheLastIdIndex &&
        matchCache.hasCache(matchCache.builderCacheKey(element))
      ) {
        cacheLastIdIndex = i
      }
      if (!lastIdIndex) {
        lastIdIndex = i
      }
    },
    tag: (i, element) => {
      if (
        !cacheLastTagIndex &&
        matchCache.hasCache(matchCache.builderCacheKey(element))
      ) {
        cacheLastTagIndex = i
      }
      if (!lastTagIndex) {
        lastTagIndex = i
      }
    }
  }
  function disposeNode (i) {
    return {
      searchEle: nodes[i],
      before: nodes.slice(0, i),
      after: nodes.slice(i + 1, nodes.length)
    }
  }
  for (let i = nodes.length - 1; i >= 0; i--) {
    const element = nodes[i]
    let type = element.type
    typeDispose[type] && typeDispose[type](i, element)
  }
  return disposeNode(
    findFirstNotEmpty(
      cacheLastClassIndex,
      cacheLastIdIndex,
      cacheLastTagIndex,
      lastClassIndex,
      lastIdIndex,
      lastTagIndex,
      nodes.length - 1
    )
  )
}

function findEleWithHtml (ele, ast, matchCache) {
  let htmlEleArr = []
  if (matchCache.hasCache(matchCache.builderCacheKey(ele))) {
    return matchCache.getCache(matchCache.builderCacheKey(ele))
  }
  function traversesWithHtml (ele, ast) {
    if (!ast || ast.type !== 1) return
    let type = ele.type
    let typeDis = {
      tag: ({ value }) => ast.tag === value,
      class: ({ value }) => matchEleAttr(ast, 'class', value),
      id: ({ value }) => matchEleAttr(ast, 'id', value),
      attribute: ele => matchEleAttr(ast, 'attribute', ele.attribute)
    }
    if (typeDis[type] && typeDis[type](ele)) {
      htmlEleArr.push(ast)
    }

    ast.childrens &&
      ast.childrens.forEach(child => {
        traversesWithHtml(ele, child)
      })
  }
  if (Object.getOwnPropertyNames(ast).length > 0) {
    traversesWithHtml(ele, ast)
  }
  matchCache.setCache(matchCache.builderCacheKey(ele), htmlEleArr)
  return htmlEleArr
}

function generateTemplate (before, after) {
  let startHead = `
                  let currentIndex, currentEle, result = searchEleResult
                  `
  let endTail = `
                return result
                `

  // todo 没有解析动态的class id

  var { createTemplate } = require('../template/createTemplate')
  var { typeDis, afterCombinator, combinator } = require('../template/dispose')

  // 先解析before
  var beforeTemplate, beforeStr
  if (validArr(before)) {
    beforeTemplate = new createTemplate(typeDis, combinator)
    beforeStr = beforeTemplate.builderTemplate(before)
  }

  var afterTemplate, afterStr
  if (validArr(after)) {
    afterTemplate = new createTemplate(typeDis, afterCombinator)
    afterStr = afterTemplate.builderTemplate(after.reverse())
  }

  let functionBody = startHead + (beforeStr || '') + (afterStr || '') + endTail

  let templateFun = new Function(
    'searchEleResult',
    'matchEleAttr',
    functionBody
  )
  return templateFun
}

function wrapFunction (fun) {
  let midFun = function () {
    argv.perf && console.time(`${fun.name}`)
    let res = fun.apply(this, arguments)
    argv.perf && console.timeEnd(`${fun.name}`)
    return res
  }
  Object.getOwnPropertyNames(fun).forEach(attr => {
    midFun[attr] = fun[attr]
  })
  return midFun
}

function assembleConsoleInfo (nodes, comment) {
  let { position, from: remark } = comment
  let attr = nodes[nodes.length - 1].attribute
  return {
    name: `${attr || nodes[nodes.length - 1].value} ${remark || ''}`,
    position: `start:${position[0]}  end:${position[1]}`,
    positionData: comment
  }
}
function  generateIdent(nodes, comment) {
    let attr = nodes[nodes.length - 1].attribute
    let { position, from: remark } = comment
    let name = `${attr || nodes[nodes.length - 1].value} ${remark || ''}`
    return `${name}$$${position.toString()}`
}

function findRelevanceUrl (importPath, cssStyle) {
  var fileInfo, realpath
  try {
    fileInfo = fs.statSync(importPath, 'utf-8')
    if (fileInfo.isFile()) {
      realpath = importPath
    }
  } catch (error) {
    let fileDir = path.dirname(importPath)
    let fileName = path.basename(importPath)
    const paths = globby.sync(
      [
        `${fileName}`,
        `${fileName}.less`,
        `${fileName}.scss`,
        `${fileName}.sass`,
        `${fileName}.css`
      ],
      {
        cwd: fileDir,
        absolute: true
      }
    )
    if (paths.length === 1) {
      realpath = paths[0]
    } else if (paths.length > 1) {
      let url = paths.find(e => e.endsWith(cssStyle))
      realpath = url || paths[0]
    }
  }
  return realpath
}

function renderAfterReplace (css) {
  return css.replace(
    /@import\s*['|"]*\s*([^'|"|\s]*)\s*['|"]*\s*;*/gm,
    `@specialimport $1;`
  )
}

function repalceImportUrl (css, vueConfig) {
  var slash = require('slash')

  let replaceCss = css.replace(
    /@import\s*url\s*\(\s*['|"]*\s*([^'|"|\s]*)\s*['|"]*\s*\);*/gm,
    `@specialimport $1;`
  )
  try {
    vueConfig.forEach(vueConfigData => {
        let alias = {}
        var i
        if ((i = vueConfigData) && (i = i.configureWebpack)) {
          if (Object.prototype.toString.call(i) === '[object Function]') {
            i = i()
          }
          if (
            Object.prototype.toString.call(i) === '[object Object]' &&
            (i = i.resolve) &&
            (i = i.alias)
          ) {
            alias = i
          }
        }
        Object.keys(alias).forEach(e => {
          replaceCss = replaceCss.replace(
            new RegExp(`~${e}`, 'gm'),
            slash(alias[e])
          )
        })
      })
      vueConfig.forEach(vueConfigData => {
        let alias = {}
        var i
        if ((i = vueConfigData) && (i = i.chainWebpack)) {
          const Config = require('webpack-chain')
          const config = new Config()
          if (Object.prototype.toString.call(i) === '[object Function]') {
            i(config)
            var chainConfig = config.toConfig()
            if (
              Object.prototype.toString.call(chainConfig) === '[object Object]' &&
              (i = chainConfig) &&
              (i = i.resolve) &&
              (i = i.alias)
            ) {
              alias = i
            }
          }
        }
        Object.keys(alias).forEach(e => {
          replaceCss = replaceCss.replace(
            new RegExp(`~${e}`, 'gm'),
            slash(alias[e])
          )
        })
      })
  } catch (e) {}
 

  return replaceCss
}

module.exports = {
  findSearchEle: wrapFunction(findSearchEle),
  findEleWithHtml: wrapFunction(findEleWithHtml),
  generateTemplate: wrapFunction(generateTemplate),
  matchEleAttr: wrapFunction(matchEleAttr),
  assembleConsoleInfo,
  findRelevanceUrl,
  repalceImportUrl,
  renderAfterReplace,
  generateIdent
}
