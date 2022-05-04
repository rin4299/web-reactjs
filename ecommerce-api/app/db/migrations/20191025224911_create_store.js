'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('store', (table) => {
    table.increments('id').primary();
    table.string('storeName');
    table.double('lat');
    table.double('lng');
    table.string('address');
    table.string('phone');
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('store');
};
