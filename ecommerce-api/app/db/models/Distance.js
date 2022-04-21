'use strict';

const CustomModel = require('./CustomModel');

class Distance extends CustomModel {
  static get tableName() {
    return 'distance';
  }
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Distance;