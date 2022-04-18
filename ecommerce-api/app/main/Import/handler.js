'use strict';

const IEController = require('./controller');

const controller = new IEController();

exports.createOne = {
    description: 'Create an import Order',
    notes: 'Return information of the created import Order',
    tags: ['api', 'v1'],
    handler: controller.createOne.bind(controller),
    auth: {
      strategy: 'jwt',
    },
    validate: {}
}

exports.getAllImportOrders = {
  description: 'Get all import Orders of a store',
  notes: 'Return list of import Orders of a store',
  tags: ['api', 'v1'],
  handler: controller.getAllImportOrders.bind(controller),
  auth: {
    strategy: 'jwt',
  },
  validate: {}
}


exports.getImportInformation = {
  description: 'Get information of an import Order',
  notes: 'Return information of an import Order',
  tags: ['api', 'v1'],
  handler: controller.getImportInformation.bind(controller),
  auth: {
    strategy: 'jwt',
  },
  validate: {}
}