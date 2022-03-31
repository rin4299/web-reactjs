'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('ownership', (table) => {
    table.increments('id').primary();
    table.string('storeName');
    table.integer('pId');
    table.integer('quantity');
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ownership');
};
