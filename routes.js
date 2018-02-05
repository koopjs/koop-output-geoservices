module.exports = [
  {
    path: 'FeatureServer/:layer/query',
    methods: ['get', 'post'],
    handler: 'query'
  },
  {
    path: 'FeatureServer/:layer/generateRenderer',
    methods: ['get', 'post'],
    handler: 'generateRenderer'
  },
  {
    path: 'FeatureServer/layers',
    methods: ['get', 'post'],
    handler: 'layers'
  },
  {
    path: 'FeatureServer/:layer',
    methods: ['get', 'post'],
    handler: 'layer'
  },
  {
    path: 'FeatureServer',
    methods: ['get', 'post'],
    handler: 'server'
  }
]
