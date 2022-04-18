'use strict';
const path = require('path');
const CustomModel = require('./CustomModel');

class ProductDetails extends CustomModel {
  static get tableName() {
    return 'productReport';
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
      reportDetails: {
        relation: CustomModel.HasManyRelation,
        modelClass: path.join(__dirname, '/ProductReportDetail'),
        join: {
          from: 'productReport.id',
          to: 'reportDetails.prId'
        }
      }
    };
  }

}

module.exports = ProductDetails;