const { defineConfig } = require("@vue/cli-service");

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    productionSourceMap: false,
    filenameHashing: true,
    configureWebpack: (config) => {
      config.output.filename = "js/[name].[hash].js";
      config.output.chunkFilename = "js/[name].[hash].js";
    },
    devServer: {
      disableHostCheck: true,
      watchOptions: {
        poll: false
      }
    }
  };
} else {
  module.exports = {
    filenameHashing: true,
    configureWebpack: (config) => {
      config.output.filename = "js/[name].[hash].js";
      config.output.chunkFilename = "js/[name].[hash].js";

    },
    devServer: {
      disableHostCheck: true,
      historyApiFallback: true,
      hot: true,
      watchOptions: {
        poll: false
      },
      proxy: {
        '/voctopcmwav.do': { target: 'http://172.30.115.206:7210/voctopcmwav.do', changeOrigin: true, pathRewrite: { "^/voctopcmwav.do": '' } },  //녹취파일 다운로드용, 운영은 nginx.conf 맨 하단에 설정되어있음.
        '/upload/images': { target: 'http://localhost:8443/upload/images', changeOrigin: true, pathRewrite: { "^/upload/images": '' } },
        '/upload/ap': { target: 'http://localhost:8443/upload/ap', changeOrigin: true, pathRewrite: { "^/upload/ap": '' } },
        '/upload/videos': { target: 'http://localhost:8443/upload/videos', changeOrigin: true, pathRewrite: { "^/upload/videos": '' } },
        '/error': { target: 'http://localhost:8443/error', changeOrigin: true, pathRewrite: { "^/error": '' } },
        '/api': { target: 'http://localhost:8443/api', changeOrigin: true, pathRewrite: { "^/api": '' } },
        '/v3-api': { target: 'http://localhost:8443/v3-api', changeOrigin: true, pathRewrite: { "^/v3-api": '' } },
        '/auth-api': { target: 'http://localhost:8443/auth-api', changeOrigin: true, pathRewrite: { "^/auth-api": '' } },
        '/chat-api': { target: 'http://localhost:8443/chat-api', changeOrigin: true, pathRewrite: { "^/chat-api": '' } },
        '/phone-api': { target: 'http://localhost:8443/phone-api', changeOrigin: true, pathRewrite: { "^/phone-api": '' } },
        '/system-api': { target: 'http://localhost:8443/system-api', changeOrigin: true, pathRewrite: { "^/system-api": '' } },
        '/interestarea-service': { target: 'http://localhost:8443/interestarea-service', changeOrigin: true, pathRewrite: { "^/interestarea-service": '' } },
        '/secured/ws-stomp': {
          target: 'http://localhost:8443/secured/ws-stomp',                           //로컬_웹소켓 Poolling 정보 (백엔드 서버정보)  Arthur.Kim
          //target: 'https://dev.hkpalette.com/secured/ws-stomp',                     //운영_웹소켓 Poolling 정보 (백엔드 서버정보)  Arthur.Kim
          changeOrigin: true,
          pathRewrite: {
            "^/secured/ws-stomp": ''
          }
        },
        '/sse-api': {
          target: 'http://localhost:8443/sse-api', changeOrigin: true, pathRewrite: { "^/sse-api": '' }
        },
        '/message': {
          target: 'http://localhost:8443/message',                                 //로컬_레파지토리 정보 Arthur.Kim
          //target: 'https://dev.hkpalette.com/Repository',                           //운영_레파지토리 정보 Arthur.Kim
          changeOrigin: true,
          pathRewrite: {
            "^/message": ''
          }
        },
        '/reference': {
          target: 'http://localhost:8443/reference',                                 //로컬_레파지토리 정보 Arthur.Kim
          //target: 'https://dev.hkpalette.com/Repository',                           //운영_레파지토리 정보 Arthur.Kim
          changeOrigin: true,
          pathRewrite: {
            "^/reference": ''
          }
        },
        '/expired_session': {
          target: 'http://localhost:8443/expired_session',                                 //로컬_레파지토리 정보 Arthur.Kim
          //target: 'https://dev.hkpalette.com/Repository',                           //운영_레파지토리 정보 Arthur.Kim
          changeOrigin: true,
          pathRewrite: {
            "^/expired_session": ''
          }
        },
      }
    },
  };
}
