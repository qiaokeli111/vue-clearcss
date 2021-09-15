var parsecss = require('./css/parsecss')
const path = require('path')
const fs = require('fs')
const globby = require('globby')
var { getIgnoreConfig, validArr } = require('./util')

module.exports = function filterCss(url,opt={}) {
  url = path.resolve(process.cwd(), url)
  let isDirectory = fs.lstatSync(url).isDirectory()

  let ignoreConfig = getIgnoreConfig()
  if (validArr(ignoreConfig)) {
      opt.ignore = ignoreConfig.concat(opt.ignore)
  }
  let cssResolver
  if (isDirectory) {
    const paths = globby.sync(['**.vue'], {
      cwd: url,
      absolute: true,
    })
    return Promise.all(
      paths.map((e) => {
        let cssResolver = new parsecss(e,opt)
        return cssResolver.findUnuseCss()
      })
    )
  } else {
    cssResolver = new parsecss(url, { mode: 'singlePage' ,...opt })
    return cssResolver.findUnuseCss()
  }
}