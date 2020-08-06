const path=require("path")

function resolve(dir) {
    return path.join(__dirname,dir)
}

module.exports = {
    publicPath :"./",
    assetsDir:"assets",
    outputDir:"dist",
    productionSourceMap: false,
    devServer: {
        proxy:'http://222.186.36.75:9999/record-b'
    },
    configureWebpack: {
      resolve: {
        alias: {
          '@': resolve('./src')
        }
      }
    }
}
