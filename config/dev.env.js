'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  prototypeHOST: '"/api"',
  requestBaseURL: '"http://192.168.1.124:9022"',
})
