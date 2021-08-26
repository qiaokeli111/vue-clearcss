#!/usr/bin/env node
const filterCss = require('../index.js')
let url = process.argv[2]
console.log(process.execPath)
console.log(__dirname)
console.log(process.cwd())
filterCss(url)