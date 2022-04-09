'use strict';
const path = require('path');
const CustomModel = require('./CustomModel');

class Ownership extends CustomModel {
  static get tableName() {
    return 'ownership';
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
        relation: CustomModel.BelongsToOneRelation,
        modelClass: path.join(__dirname, '/Product'),
        join: {
          from: 'product.id',
          to: 'ownership.pId'
        }
      }
    };
  }

}

module.exports = Ownership;