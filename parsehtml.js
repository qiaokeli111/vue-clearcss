const compiler = require('vue-template-compiler')
console.time(`aa`)
var fs=require("fs");
var data=fs.readFileSync("./test/bb.vue","utf-8");

var res = compiler.parseComponent(data,{ pad: "space" })
const htmlast = compiler.compile(res.template.content)
// todo 多个style的情况
var parsecss = require('./css/precss')
parsecss(res.styles[0].content,htmlast.ast)
console.timeEnd(`aa`)