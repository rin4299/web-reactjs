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

  exports.updateConfirmWrong = {
    description: 'Update Order',
    notes: 'Return updated Order by id',
    tags: ['api', 'v1'],
    handler: controller.updateConfirmWrong.bind(controller),
    auth: {
      strategy: 'jwt',
    },
    validate: {

    }
  };


  exports.changeStatus = {
    description: 'Update Order',
    notes: 'Return updated Order by id',
    tags: ['api', 'v1'],
    handler: controller.changeStatus.bind(controller),
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


  exports.getHistory = {
    description: 'Tracking product',
    notes: 'Return list of history',
    tags: ['api', 'v1'],
    handler: controller.getHistory.bind(controller),
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

  exports.getStoreDistance = {
    description: 'Tracking product',
    notes: 'Return list of history',
    tags: ['api', 'v1'],
    handler: controller.getStoreDistance.bind(controller),
    auth: 'jwt',
    validate: {

    }
  };

  exports.getSuggestion = {
    description: 'Tracking product',
    notes: 'Return list of history',
    tags: ['api', 'v1'],
    handler: controller.getSuggestion.bind(controller),
    auth: 'jwt',
    validate: {

    }
  };

  exports.getParseOrder = {
    description: 'Tracking product',
    notes: 'Return list of history',
    tags: ['api', 'v1'],
    handler: controller.getParseOrder.bind(controller),
    auth: 'jwt',
    validate: {

    }
  };


  exports.getProductbyOwner = {
    description: 'Tracking product',
    notes: 'Return list of history',
    tags: ['api', 'v1'],
    handler: controller.getProductbyOwner.bind(controller),
    auth: 'jwt',
    validate: {

    }
  };

  exports.loadProductDetailinExchange = {
    description: 'Tracking product',
    notes: 'Return list of history',
    tags: ['api', 'v1'],
    handler: controller.loadProductDetailinExchange.bind(controller),
    auth: 'jwt',
    validate: {

    }
  };

  exports.initProductDetails = {
    description: 'Tracking product',
    notes: 'Return list of history',
    tags: ['api', 'v1'],
    handler: controller.initProductDetails.bind(controller),
    // auth: 'jwt',
    validate: {

    }
  };

  exports.getDetailForAnExchange = {
    description: 'Update Order',
    notes: 'Return updated Order by id',
    tags: ['api', 'v1'],
    handler: controller.getDetailForAnExchange.bind(controller),
//     auth: {},
    validate: {

    }
  };
