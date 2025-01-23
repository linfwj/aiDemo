const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.scss";`
      },
      postcss: {
        postcssOptions: {
          config: './postcss.config.js'
        }
      }
    }
  }
})
