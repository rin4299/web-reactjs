'use strict';

const RoutingController = require('./controller');
// const validator = require('./validator');

const controller = new RoutingController();

  exports.routing = {
    description: 'Get Users list',
    notes: 'Return Users items',
    tags: ['api', 'v1'],
    handler: controller.routing.bind(controller),
    auth: {

    },
    validate: {
    
    }
  };