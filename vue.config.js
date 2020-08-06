'use strict'
const path=require("path")

function resolve(dir) {
    return path.join(__dirname,dir)
}

module.exports = {
    publicPath :"./",
    assetsDir:"assets",
    outputDir:"dist",
    productionSourceMap: false,
    devServer:{
        
    },
    configureWebpack: {
      resolve: {
        alias: {
          '@': resolve('./src')
        }
      }
    }
}