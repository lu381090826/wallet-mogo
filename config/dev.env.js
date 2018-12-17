'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  prototypeHOST: '"/api"',
  requestBaseURL: '"http://192.168.8.125:9022"',
})
