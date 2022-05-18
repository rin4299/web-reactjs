'use strict';

const productReportController = require('./controller');

const controller = new productReportController();

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

exports.createNewOne = {
  description: 'Create an import Order',
  notes: 'Return information of the created import Order',
  tags: ['api', 'v1'],
  handler: controller.createNewOne.bind(controller),
  auth: {
    strategy: 'jwt',
  },
  validate: {}
}

exports.getAllProductReport = {
  description: 'Get all import Orders of a store',
  notes: 'Return list of import Orders of a store',
  tags: ['api', 'v1'],
  handler: controller.getAllProductReport.bind(controller),
  auth: {
    strategy: 'jwt',
  },
  validate: {}
}


exports.getReportInformation = {
  description: 'Get information of an import Order',
  notes: 'Return information of an import Order',
  tags: ['api', 'v1'],
  handler: controller.getReportInformation.bind(controller),
  auth: {
    strategy: 'jwt',
  },
  validate: {}
}