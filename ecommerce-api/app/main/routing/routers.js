'use strict';

const handler = require('./handler');

const Routes = [
  {
    method: 'GET',
    path: '/api/v1/routing',
    config: handler.routing
  }
];

module.exports = Routes;
