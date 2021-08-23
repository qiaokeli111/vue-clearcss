/**
 * POSTCSS-NODE-SASS
 * A PostCSS plugin to parse styles with node-sass
 */

let postcss = require('postcss'),
  less = require('less')

module.exports = (opt) => ({
  postcssPlugin: 'postcss-less',
  Once(root, { result }) {
    let map = typeof result.opts.map === 'object' ? result.opts.map : {}
    let css = root.toResult(
      Object.assign(result.opts, {
        map: Object.assign(
          {
            annotation: false,
            inline: false,
            sourcesContent: true,
          },
          map
        ),
      })
    )
    return less
      .render(css.css, {
        sourceMap: {
          outputSourceFiles: true,
        },
      })
      .then((output) => {
        return postcss.parse(output.css, {
          map: {
            prev: JSON.parse(output.map),
          },
        })
      })
      .then((res) => {
          var aa = res.source.input.map.consumer()
        result.root = res
      })
  },
})

module.exports.postcss = true
