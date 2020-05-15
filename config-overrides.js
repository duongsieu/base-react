/* config-overrides.js */
const {
  // fixBabelImports,
  addBabelPlugins,
  override,
  addLessLoader
} = require('customize-cra');

module.exports = override(
  ...addBabelPlugins(
    'lodash'
  ),
  // fixBabelImports('import', {
  //   libraryName: 'antd',
  //   libraryDirectory: 'es'
  // }),
  addLessLoader({
    javascriptEnabled: true
  })
);
