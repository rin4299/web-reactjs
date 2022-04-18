'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('productReport', (table) => {
    table.increments('id').primary();
    table.string('createdBy');
    table.string('storeName');
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('productReport');
};
