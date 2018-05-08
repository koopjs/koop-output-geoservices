var FeatureServer = require('../FeatureServer/src')

function Geoservices () {}

Geoservices.prototype.featureServer = function (req, res) {
  // model will be available when this is instantiated with the Koop controller
  this.model.pull(req, function (err, data) {
    if (err) res.status(err.code || 500).json({error: err.message})
    else FeatureServer.route(req, res, data)
  })
}

/**
 * Handler for the $namepace/rest/info route. Inspects provider for authentation info and passes any on to the 
 * FeatureServer handler
 * @param {*} req 
 * @param {*} res 
 */
Geoservices.prototype.featureServerRestInfo = function (req, res) {
  // Inspect provider for an "authInfo" controller; if undefined create a dummy function that returns an empty object
  let authInfo = this.authInfo || function() { return {} }
  FeatureServer.route(req, res, authInfo(`${req.protocol}://${req.headers.host}`))
}

/**
 * Collection of route objects that define geoservices
 *
 * These routes are bound to the Koop API for each provider. Note that FeatureServer,
 * FeatureServer/layers, FeatureServer/:layer, and FeatureServer/:layer/:method are found
 * in the collection with and without the "$namespace/rest/services/$providerParams" prefix.
 * These prefixed routes have been added due to some clients requiring the "rest/services"
 * URL fragment in geoservices routes. The $namespace and $providerParams are placeholders
 * that koop-core replaces with provider-specific settings. The 'host' and 'disableIdParam'
 * properties of a route object will override the properties of the provider - thus, in the
 * example below '$namespace/rest/info' is not transformed into '$namespace/:host/:id/rest/info
 * if a provider's 'host' property is true.
 */
Geoservices.routes = [
  {
    path: '$namespace/rest/info',
    methods: ['get', 'post'],
    handler: 'featureServerRestInfo',
    hosts: false,
    disableIdParam: true
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/:method',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer/layers',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer/:layer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer/:layer/:method',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer/layers',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer/:layer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  }
]

Geoservices.type = 'output'
Geoservices.version = require('./package.json').version

module.exports = Geoservices
