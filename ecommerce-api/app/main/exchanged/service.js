'use strict';

const Boom = require('@hapi/boom');
const Models = require('../../db/models');
const BaseServiceCRUD = require('../../base/BaseServiceCRUD');
const _ = require('lodash');
const PasswordUtils = require('../../services/password');

class ExchangeService extends BaseServiceCRUD {
  constructor() {
    super(Models.Exchanged, 'exchanged');
  }

  async getManyEx(query, payload) {
    const {id, type} = payload;
    const builder = this.model.queryBuilder(query).where(type, id);
    if (this.getSearchQuery && query.q) {
      this.getSearchQuery(builder, query.q);
    }
    return builder;
  }

  async createExchange(payload) {
    try {
        const {pId, quantity} = payload;
        let id = pId;
        console.log("#####################################")
        console.log(typeof pId);
        let product = await Models.Product.query().where('id', pId);
        if(quantity > product[0].numberAvailable){
          throw Boom.badRequest('The current available of the current product can not afford this quantity!');
        }
      let data = await Models.Exchanged.query()
        .insert(payload)
        .returning('*');
      return data;
    } catch (err) {
      throw err;
    }
  }

  async updateAccept(id) {
    await Models.Exchanged.query()
      .update({ isAccepted: true })
      .where('id', id);
    // return { message: 'Update isAccepted is successfully' };
    let data = await Models.Exchanged.query().where('id', id);
    return data[0];
  }


  async updateConfirm(id) {

    let exchange = await Models.Exchanged.query().where('id', id);
    let e = exchange[0];
    if(e.isAccepted === false){
      throw Boom.badRequest('The current Exchange Request has not been accepted yet!');
    }
    let product = await Models.Product.query().where('id', e.pId);
    // let curQ = product.quantity - quantity;
    await Models.Product.query().update({numberAvailable: product[0].numberAvailable - e.quantity} ).where({id});
    await Models.Exchanged.query()
      .update({ isReceived: true })
      .where('id', id);
    let data = await Models.Exchanged.query().where('id', id);
    // return { message: 'Update isReceived is successfully' };
    return data[0];
  }
  
}

module.exports = ExchangeService;
