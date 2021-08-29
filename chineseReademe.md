# vue-clearcss

这是一个用来找出vue sfc类型文件中多余无用css代码的工具，完美解析scss和less，sass仅支持嵌套写法。
随着项目的不断迭代文件里会残留着大量多余且无用css，不像js和html，人为处理起来会非常麻烦且不可靠，所以就出现了这个库，
网上有几个评价不错的css处理工具如uncss等都不能直接在vue里面使用，所以我利用了[vue]的编译工具和[postcss]来完成这个功能

[Vue]: https://cn.vuejs.org/v2/guide/
[PostCSS]: https://github.com/postcss/postcss

## Installation


```js
npm install -g vue-clearcss
```

## Usage
推荐用法如下，可以输入一个文件或是一个包含vue的目录

```js
unvuecss ./src/App.vue
```
你也可以在node里面使用来做其他处理

```js
const clearcss = require('vue-clearcss')
// your vue file url
clearcss('./test/aa.vue').then(e=>{
    // todo
})
```
目前暂时不需要配置文件
 

# Note

* 所有的伪类选择器都认为是有用的
* 所有的属性选择器 (除了[attribute] 和 [attribute=value] 可以完美过滤)，其他都是使用js的includes方法来匹配
* 过滤结果只针对该文件,找到的无用css元素可能影响到子组件，需要你自己确认
* 动态class除了在js里赋值的情况都可以解析，例如:class='classobjinjs' 这种无法解析
* 如果匹配的结果有误，欢迎提出
