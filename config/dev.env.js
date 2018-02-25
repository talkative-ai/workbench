var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  'SHIVA_URL': '"http://localhost:8000/workbench/v1/"',
  'BRAHMAN_URL': '"http://localhost:9001/ai/v1/"',
  // 'API_URL': '"https://shiva.ngrok.io/workbench/v1/"'
  SOURCEMAPS: 'true'
})
