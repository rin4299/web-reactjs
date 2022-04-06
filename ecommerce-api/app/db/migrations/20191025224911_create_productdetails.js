'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('productdetails', (table) => {
    table.increments('id').primary();
    table.string('listPds');
    table.integer('orderId');
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('productdetails');
};