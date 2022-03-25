'use strict';

const ExchangeController = require('./controller');
// const validator = require('./validator');

const controller = new ExchangeController();

  exports.getManyEx = {
    description: 'Get Users list',
    notes: 'Return Users items',
    tags: ['api', 'v1'],
    handler: controller.getManyEx.bind(controller),
    auth: {
      strategy: 'jwt',
    },
    validate: {
    
    }
  };

  exports.createExchange = {
  description: 'Create a new Users',
  notes: 'Return created Users',
  tags: ['api', 'v1'],
  handler: controller.createExchange.bind(controller),
  auth: {
    strategy: 'jwt',
  },
  validate: {
 
  }
};

  exports.updateAccept = {
    description: 'Update Order',
    notes: 'Return updated Order by id',
    tags: ['api', 'v1'],
    handler: controller.updateAccept.bind(controller),
    auth: {
      strategy: 'jwt',
    },
    validate: {

    }
  };

  exports.updateConfirm = {
    description: 'Update Order',
    notes: 'Return updated Order by id',
    tags: ['api', 'v1'],
    handler: controller.updateConfirm.bind(controller),
    auth: {
      strategy: 'jwt',
    },
    validate: {

    }
  };

  exports.getAdminDiff = {
    description: 'Get Users list',
    notes: 'Return Users items',
    tags: ['api', 'v1'],
    handler: controller.getAdminDiff.bind(controller),
    auth: {
      strategy: 'jwt',
    },
    validate: {
   
    }
  };

  exports.tracking = {
    description: 'Tracking product',
    notes: 'Return list of history',
    tags: ['api', 'v1'],
    handler: controller.tracking.bind(controller),
    auth: {
      strategy: 'jwt',
    },
    validate: {

    }
  };

  exports.deleteRequest = {
    description: 'Update Order',
    notes: 'Return updated Order by id',
    tags: ['api', 'v1'],
    handler: controller.deleteRequest.bind(controller),
    auth: {
      strategy: 'jwt',
    },
    validate: {

    }
  };