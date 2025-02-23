const { webpackPlugin } = require("@voerkai18n/plugins")

module.exports = {
    configureWebpack: {
      plugins: [
        webpackPlugin()
      ]
    }
  }