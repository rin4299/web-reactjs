'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('exchanged', (table) => {
    table.increments('id').primary();
    table.string('reqUserName');
    table.string('recUserName');
    table.string('pName');
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
