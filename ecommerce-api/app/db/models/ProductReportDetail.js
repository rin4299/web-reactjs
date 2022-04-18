'use strict';
const path = require('path');
const CustomModel = require('./CustomModel');

class ProductDetails extends CustomModel {
  static get tableName() {
    return 'productReportDetail';
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
      productReport: {
        relation: CustomModel.BelongsToOneRelation,
        modelClass: path.join(__dirname, '/ProductReportDetail'),
        join: {
          from: 'productReportDetail.prId',
          to: 'productReport.id'
        }
      }
    };
  }

}

module.exports = ProductDetails;