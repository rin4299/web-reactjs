'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('distance', (table) => {
    table.increments('id').primary();
    table.string('address');
    table.string('storeName');
    table.integer('userId');
    table.double('distance');
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('distance');
};
