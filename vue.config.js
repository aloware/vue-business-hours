module.exports = {
  chainWebpack: config => {
    // For demo/serve mode
    if (process.env.NODE_ENV !== 'production' || process.env.VUE_CLI_BUILD_TARGET !== 'lib') {
    config
      .entry('app')
      .clear()
      .add('./demo/main.js');
    }
    
    // Configure externals for library build
    if (process.env.VUE_CLI_BUILD_TARGET === 'lib') {
      config.externals({
        moment: 'moment'
      });
    }
  },
  css: {
    extract: process.env.VUE_CLI_BUILD_TARGET === 'lib' ? {
      filename: 'vue-business-hours.css'
    } : true
  }
};
