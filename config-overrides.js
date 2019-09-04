const path = require('path');
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  (config) => {
    config.module.rules.push({
      loader: 'webpack-ant-icon-loader',
      enforce: 'pre',
      include: [
        path.resolve('node_modules/@ant-design/icons/lib/dist'),
      ],
    });
    return config;
  },
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#1d39c4', // 全局主色
      '@link-color': '#1d39c4', // 链接色
    },
  }),
);
