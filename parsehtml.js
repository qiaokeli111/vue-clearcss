const compiler = require('vue-template-compiler')

var fs=require("fs");
var data=fs.readFileSync("./app.vue","utf-8");

var res = compiler.parseComponent(data)
const htmlast = compiler.compile(res.template.content)

var parsecss = require('./css/precss')
parsecss(res.styles[0].content,htmlast.ast)