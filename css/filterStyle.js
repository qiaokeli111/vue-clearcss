const postcss = require("postcss")
const util = require("./util")
const fs = require("fs")
const chalk = require("chalk")
var path = require("path")
var deepExtend = require("deep-extend")
var {
    validArr,
    validIsIgnoreByConfing,
    validIsIgnoreByComment,
} = require("../util")
const parseAnimationShorthand = require("./animationShorthand")

module.exports = class filterStyle {
    constructor({ lang, content }, opt = {}) {
        this.filterCssArray = []
        this.lang = lang || "css"
        this.originCss = content
        this.context = null
        this.opt = opt
        this.ignore = opt.ignore
        this.getComment = this.getCommentFun(lang)
        this.animation = opt.animation || {
            producer: [],
            consumer: [],
        }
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
            return less(util.repalceImportUrl(css), {
                paths: [path.resolve(this.context.parseUrl, "..")],
            })
        } else if (cssLang === "scss") {
            // const comment = require("postcss-comment")
            const comment = require("postcss-scss")
            var parse = require("./postcss-scss")
            return postcss([parse({ sourceComments: true })]).process(
                util.repalceImportUrl(css,this.context.opt.vueConfig),
                {
                    from: this.context.parseUrl,
                    to: "temp.scss",
                    parser: comment,
                }
            )
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
            return {
                position: [
                    initLine,
                    node.source.end.line - node.source.start.line + initLine,
                ],
                from: [".css", ".less", ".scss"].some((e) =>
                    nodeMapVal.sourceUrl.endsWith(e)
                )
                    ? `from ${nodeMapVal.sourceUrl}`
                    : "",
                sourceUrl: nodeMapVal.sourceUrl,
            }
        }
        if (lang === "scss") {
            return scss_lessComment
        } else if (lang === "less") {
            return scss_lessComment
        } else {
            return function (node) {
                return {
                    position: [node.source.start.line, node.source.end.line],
                }
            }
        }
    }
    fliterPlugin(fStyle = {}) {
        return {
            postcssPlugin: "fliterPlugin",
            Once(res) {
                var sourceMap, sourceUrl
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
            OnceExit(node) {
                if (!fStyle.opt.animation) {
                    let { producer, consumer } = fStyle.animation
                    producer.forEach((e) => {
                        if (!consumer.some((i) => i === e.aniName)) {
                            fStyle.setCssArray(e)
                        }
                    })
                }
            },
            Rule(node) {
                if (node.keyframesChild) return
                if (validIsIgnoreByComment(node)) return

                const parser = require("postcss-selector-parser")
                let selector = parser((selectors) => {
                    let comment = fStyle.getComment(node)
                    let result = fStyle.transform(selectors, comment)
                    if (!result) {
                        node.walkDecls("animation-name", (decl) => {
                            fStyle.animation.consumer.push(decl.value)
                        })
                        node.walkDecls("animation", (decl) => {
                            let ani = parseAnimationShorthand(decl.value)
                            fStyle.animation.consumer.push(ani.name)
                        })
                    }
                }).processSync(node.selector)
            },
            AtRule: {
                specialimport: (node) => {
                    let url = node.params
                    return fStyle.addNewStyle(url).catch((e) => {
                        let comment = fStyle.getComment(node)
                        this.setCssArray({
                            name: e,
                            position: `line: ${comment.position[0]}`,
                            positionData: comment,
                        })
                    })
                },
                keyframes: (node) => {
                    let comment = fStyle.getComment(node)
                    fStyle.animation.producer.push({
                        name: `${node.params}  ${
                            comment.from || fStyle.opt.url || ""
                        }`,
                        aniName: node.params,
                        position: `start:${comment.position[0]}  end:${comment.position[1]}`,
                        positionData: deepExtend(comment,{
                            from:fStyle.opt.url || comment.from,
                            sourceUrl: fStyle.opt.url || comment.sourceUrl,
                        }),
                    })
                    node.each((childNode) => {
                        childNode.keyframesChild = true
                    })
                },
            },
            Comment(node) {
                let text = node.text
                if (text.includes("ignoreConfig")) {
                    let reg = /\[.*\]/
                    let arrStr = text.match(reg)
                    let ruleFun = new Function(`
                        return ${arrStr}
                    `)
                    let ruleArr = ruleFun()
                    if (validArr(ruleArr)) {
                        fStyle.context.opt.ignore = ruleArr.concat(
                            fStyle.context.opt.ignore
                        )
                    }
                }
            },
        }
    }

    addNewStyle(url) {
        let importPath = path.resolve(this.context.parseUrl, "..", url)
        let realPath = util.findRelevanceUrl(importPath, this.lang)

        if (realPath) {
            let that = this
            let content = fs.readFileSync(realPath, "utf-8")
            let lang = path.extname(realPath)
            let importProcess = new filterStyle(
                { lang: lang.slice(1, lang.length), content },
                { notPushParent: true, animation: this.animation, url }
            )
            return importProcess.unuseCss(this.context).then((res) => {
                that.setCssArray(
                    res.map((e) => {
                        return deepExtend(e, {
                            name: `${e.name} from ${url}`,
                            positionData: {
                                sourceUrl: url,
                                from: `from ${url}`,
                            },
                        })
                    })
                )
            })
        } else {
            return Promise.reject(`@import not found this file ${url} `)
        }
    }

    transform(selectors, comment) {
        let unuse
        selectors.each((selector) => {
            if (selector.type === "selector") {
                if (
                    validIsIgnoreByConfing(
                        selector.nodes,
                        this.context.opt.ignore
                    )
                )
                    return
                let searchEle = util.findSearchEle(selector.nodes, this.context)
                let searchEleResult = util.findEleWithHtml(
                    searchEle.searchEle,
                    this.context.template,
                    this.context
                )
                if (searchEleResult.length === 0) {
                    this.setCssArray(
                        util.assembleConsoleInfo(selector.nodes, comment)
                    )
                    unuse = true
                    return
                }
                let templateFun = util.generateTemplate(
                    searchEle.before,
                    searchEle.after
                )
                let result = templateFun(searchEleResult, util.matchEleAttr)
                if (result && result.length === 0) {
                    this.setCssArray(
                        util.assembleConsoleInfo(selector.nodes, comment)
                    )
                    unuse = true
                }
            }
        })
        return unuse
    }
    setCssArray(css) {
        this.filterCssArray = this.filterCssArray.concat(css)
    }
}
