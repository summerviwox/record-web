const path=require("path")

function resolve(dir) {
    return path.join(__dirname,dir)
}

module.exports = {
    publicPath :"./",
    assetsDir:"assets",
    outputDir:"dist",
    productionSourceMap: false,
    // devServer: {
    //     proxy:{
    //         '/api':{
    //             target:'http://222.186.36.75:9999/record-b',
    //             ws:true,
    //             changeOrigin: true,
    //             pathRewrite:{
    //                 '^/api':''
    //             }
    //         }
    //     }
    // },
    configureWebpack: {
      resolve: {
        alias: {
          '@': resolve('./src')
        }
      }
    }
}
