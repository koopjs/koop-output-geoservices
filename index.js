var FeatureServer = require('featureserver')

function Geoservices () {}

Geoservices.prototype.featureServer = function (req, res) {
  // model will be available when this is instantiated with the Koop controller
  this.model.pull(req, function (err, data) {
    if (err) res.status(err.code || 500).json({error: err.message})
    else FeatureServer.route(req, res, data)
  })
}

/**
 * Handler for the $namepace/rest/info route. Inspects model for authentation info and passes any on to the
 * FeatureServer handler
 * @param {*} req
 * @param {*} res
 */
Geoservices.prototype.featureServerRestInfo = function (req, res) {
  // Inspect model for an "serviceAuthenticationSpecification" function; if undefined create a dummy function that returns an empty object
  let authSpecs = this.model.serviceAuthenticationSpecification || function () { return {} }
  FeatureServer.route(req, res, authSpecs(`${req.protocol}://${req.headers.host}`))
}

/**
 * Handler for $namespace/authenticate route. Passes request and response object to the model's "authenticate" function
 * @param {*} req
 * @param {*} res
 */
Geoservices.prototype.authenticate = function (req, res) {
  this.model.authenticate(req, res)
}

/**
 * Collection of route objects that define geoservices
 *
 * These routes are bound to the Koop API for each provider. Note that FeatureServer,
 * FeatureServer/layers, FeatureServer/:layer, and FeatureServer/:layer/:method are found
 * in the collection with and without the "$namespace/rest/services/$providerParams" prefix.
 * These prefixed routes have been added due to some clients requiring the "rest/services"
 * URL fragment in geoservices routes. The $namespace and $providerParams are placeholders
 * that koop-core replaces with provider-specific settings.
 */
Geoservices.routes = [
  {
    path: '$namespace/rest/info',
    methods: ['get', 'post'],
    handler: 'featureServerRestInfo'
  },
  {
    path: '$namespace/authenticate',
    methods: ['get', 'post'],
    handler: 'authenticate'
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
