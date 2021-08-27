const postcss = require("postcss")
const util = require("./util")
const fs = require("fs")
const chalk = require("chalk")
var path = require("path")
var { validArr } = require("../util")

module.exports = class filterStyle {
    constructor({ lang, content }, opt = {}) {
        this.filterCssArray = []
        this.lang = lang || "css"
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

                    !this.opt.notPushParent &&
                        context.filterArr.push(this.filterCssArray)
                    return this.filterCssArray
                })
        })
    }
    transformToCss(css, cssLang) {
        if (cssLang === "less") {
            var less = require("./postcss-less")
            return less(util.repalceImportUrl(css),{
                'paths': [path.resolve(this.context.parseUrl,'..')],
            })
        } else if (cssLang === "scss") {
            const comment = require("postcss-comment")
            var parse = require("postcss-node-sass")
            return postcss([parse({ sourceComments: true })]).process(util.repalceImportUrl(css), {
                from: this.context.parseUrl,
                to: "temp.scss",
                parser: comment,
            })
        } else if (cssLang === "sass") {
            var postcssSass = require("postcss-sass")
            return postcss([]).process(css, {
                from: undefined,
                syntax: postcssSass,
            })
        } else {
            return Promise.resolve(postcss.parse(util.repalceImportUrl(css)))
        }
    }
    getCommentFun(lang) {
        function scss_lessComment(node) {
            let positionMap = node.root().raws.positionMap
            let nodeMapVal = positionMap.get(node.source.start.line)
            let initLine = nodeMapVal.originalLine
            return [
                [
                    initLine,
                    node.source.end.line - node.source.start.line + initLine,
                ],
                ['.css','.less','.scss'].some(e=>nodeMapVal.sourceUrl.endsWith(e)) ? `from ${nodeMapVal.sourceUrl}` : ''
            ]
        }
        if (lang === "scss") {
            return scss_lessComment
        } else if (lang === "less") {
            return scss_lessComment
        } else {
            return function (node) {
                return [[node.source.start.line, node.source.end.line]]
            }
        }
    }
    fliterPlugin(opts = {}) {
        return {
            postcssPlugin: "fliterPlugin",
            Once(res) {
                var sourceMap,sourceUrl
                try {
                    let PreviousMap = res.source.input.map.consumer()
                    sourceMap = PreviousMap._generatedMappings
                    sourceUrl = PreviousMap._absoluteSources
                } catch (error) {
                    sourceMap = []
                }

                var positionMap = new Map()
                sourceMap.forEach((e) => {
                    let cacheLine = positionMap.get(e.generatedLine)
                    if (
                        cacheLine &&
                        cacheLine.generatedColumn &&
                        cacheLine.generatedColumn > e.generatedColumn
                    ) {
                        return
                    }
                    positionMap.set(e.generatedLine, {
                        ...e,
                        sourceUrl: sourceUrl[e.source],
                    })
                })
                res.raws.positionMap = positionMap
            },
            Rule(node) {
                const parser = require("postcss-selector-parser")
                parser((selectors) =>
                    opts.transform(selectors, ...opts.getComment(node))
                ).processSync(node.selector)
            },
            AtRule: {
                specialimport: (node) => {
                    let url = node.params
                    return opts.addNewStyle(url).catch((e) => {
                        this.setCssArray({
                            name: e,
                            position: `line: ${opts.getComment(node)[0]}`,
                        })
                    })
                },
            },
        }
    }

    addNewStyle(url) {
        let importPath = path.resolve(this.context.parseUrl, "..", url)
        let realPath = util.findRelevanceUrl(importPath, this.lang)
        if (realPath) {
            let content = fs.readFileSync(realPath, "utf-8")
            let lang = path.extname(realPath)
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
        } else {
            return Promise.reject(`@import not found this file ${url} `)
        }
    }

    transform(selectors, position, remark = "") {
        selectors.nodes.forEach((selector) => {
            if (selector.type === "selector") {
                let searchEle = util.findSearchEle(selector.nodes, this.context)
                let searchEleResult = util.findEleWithHtml(
                    searchEle.searchEle,
                    this.context.template,
                    this.context
                )
                if (searchEleResult.length === 0) {
                    this.setCssArray(
                        util.assembleConsoleInfo(selector.nodes, position, remark)
                    )
                    return
                }
                let templateFun = util.generateTemplate(
                    searchEle.before,
                    searchEle.after
                )
                let result = templateFun(searchEleResult, util.matchEleAttr)
                if (result && result.length === 0) {
                    this.setCssArray(
                        util.assembleConsoleInfo(selector.nodes, position, remark)
                    )
                }
            }
        })
    }
    setCssArray(css) {
        this.filterCssArray = this.filterCssArray.concat(css)
    }
}
