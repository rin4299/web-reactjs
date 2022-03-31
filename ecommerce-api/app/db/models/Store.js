'use strict';

const CustomModel = require('./CustomModel');

class Store extends CustomModel {
  static get tableName() {
    return 'store';
  }
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Store;