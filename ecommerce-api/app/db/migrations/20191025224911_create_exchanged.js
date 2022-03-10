'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('exchanged', (table) => {
    table.increments('id').primary();
    table.integer('reqUserId');
    table.integer('recUserId');
    table.integer('pId');
    table.integer('quantity');
    table.boolean('isAccepted').defaultTo(false);
    table.boolean('isReceived').defaultTo(false);
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('exchanged');
};
