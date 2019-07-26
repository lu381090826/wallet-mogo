'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  prototypeHOST: '"/api"',
  requestBaseURL: '"http://172.20.10.2:9022"',
})
