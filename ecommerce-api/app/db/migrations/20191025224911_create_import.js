'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('importOrder', (table) => {
    table.increments('id').primary();
    table.string('storeName');
    table.string('createdBy');
    table.string('listOfProductDetails');
    table.string('listOfProducts');
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ieorder');
};
