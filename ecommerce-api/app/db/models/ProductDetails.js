'use strict';
const path = require('path');
const CustomModel = require('./CustomModel');

class ProductDetails extends CustomModel {
  static get tableName() {
    return 'productdetails';
  }
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get relationMappings() {
    return {
      ownership: {
        relation: CustomModel.HasManyRelation,
        modelClass: path.join(__dirname, '/Order'),
        join: {
          from: 'productdetails.orderId',
          to: 'order.id'
        }
      }
    };
  }

}

module.exports = ProductDetails;