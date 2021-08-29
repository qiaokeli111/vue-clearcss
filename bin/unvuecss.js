#!/usr/bin/env node
const filterCss = require('../index.js')
let url = process.argv[2]
filterCss(url)