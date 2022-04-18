'use strict';

const CustomModel = require('./CustomModel');

class Import extends CustomModel {
  static get tableName() {
    return 'importOrder';
  }
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Import;