'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('productReportDetail', (table) => {
    table.increments('id').primary();
    table.integer('prId');
    table.integer('pId');
    table.string('pdId');
    table.string('type');
    table.integer('quantity');
    table.string('note');
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('productReportDetail');
};
