var FeatureServer = require('featureserver')

function Geoservices () {}

Geoservices.routes = require('./routes')
Geoservices.type = 'output'
Geoservices.version = require('./package.json').version

Geoservices.prototype.server = function (req, res) {
  this.execute('getServer', req, res)
}

Geoservices.prototype.layer = function (req, res) {
  this.execute('getLayer', req, res)
}

Geoservices.prototype.layers = function (req, res) {
  this.execute('getLayers', req, res)
}

Geoservices.prototype.query = function (req, res) {
  this.execute('pull', req, res)
}

Geoservices.prototype.generateRenderer = function (req, res) {
  this.execute('generateRenderer', req, res)
}

Geoservices.prototype.execute = function (action, req, res) {
  // model will be available when this is instantiated with the Koop controller
  const handler = this.selectHandler(action, this.model)
  handler(req, function (err, data) {
    if (err) res.status(err.code || 500).json({error: err.message})
    else FeatureServer.route(req, res, data)
  })
}

Geoservices.prototype.selectHandler = function (model, action) {
  const prop = this.model[action]
  if (typeof prop === 'function') return this.model[prop].bind(this.model)
  else return this.model.pull.bind(this.model)
}

module.exports = Geoservices
