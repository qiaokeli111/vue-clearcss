# vue-clearcss
[中文介绍]

this is a lib to find unUse css in [Vue] , can perfect parse SCSS and LESS , only nesting is supported for SASS

As you iterate through the project, you get a lot of redundant and useless CSS left in your files. Unlike JS and HTML, which can be very cumbersome and unreliable to handle manually, so this library came into being,  
Several CSS processing tools such as UNCSS are not available in Vue, so I used vue compilation tools and [PostCSS] to complete this function

[Vue]: https://cn.vuejs.org/v2/guide/
[PostCSS]: https://github.com/postcss/postcss
[中文介绍]: https://github.com/qiaokeli111/vue-clearcss/blob/master/Readme-cn.md

Use with vscode extension (search vue-cleacss-ext in vscode extension)
![avatar](https://s3.bmp.ovh/imgs/2021/09/bfae04de325f707a.gif)
## Installation


```js
npm install -g vue-clearcss
```

## Usage

After installation, you can use it in your vue project like this.

```js
unvuecss ./src/App.vue
```
or Programmatic Usage, This takes the following format.

```js
const clearcss = require('vue-clearcss')
// your vue file url
clearcss('./test/aa.vue').then(e=>{
    // todo
})
```
you can input a sfc vue file url or a directory containing sfc vue file .

Currently this lib no option  

# Note

* all pseudo selector are considered legal
* all attribute selector (except [attribute] and [attribute=value] perfect match) is match by includes method
* The result of filtering is for this file only,does not detect whether the CSS affects child components
* dynamic class like :class='classobjinjs' this classobjinjs attr in js are not supported
* Welcome to issue  if something wrong