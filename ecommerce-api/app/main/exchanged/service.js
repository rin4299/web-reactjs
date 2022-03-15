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
// Van giu ID
  async getManyEx(query, payload) {
    const {id, type} = payload;
    let U = await Models.User.query().findOne({id: id})
    const builder = this.model.queryBuilder(query).where(type, U.name);
    if (this.getSearchQuery && query.q) {
      this.getSearchQuery(builder, query.q);
    }
    return builder;
  }

  async createExchange(payload) {
    try {
        const {pName, quantity} = payload;
        let product = await Models.Product.query().where('nameProduct', pName);
        if(quantity > product[0].numberAvailable){
          throw Boom.badRequest('The current available of the current product can not afford this quantity!');
        }
      let data = await Models.Exchanged.query()
        .insert(payload)
        .returning('*');
      // let U = await Models.User.query().whereIn('id',[data.reqUserId, data.recUserId]);
      // data.reqUserName = U[0].name;
      // data.recUserName = U[1].name;
      // let P = await Models.Product.query().findOne({id: data.pId});
      // data.pName = P.nameProduct;
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
    let product = await Models.Product.query().where('nameProduct', e.pName);
    // let curQ = product.quantity - quantity;
    await Models.Product.query().update({numberAvailable: product[0].numberAvailable - e.quantity} ).where({id});
    await Models.Exchanged.query()
      .update({ isReceived: true })
      .where('id', id);
    let data = await Models.Exchanged.query().where('id', id);
    // return { message: 'Update isReceived is successfully' };
    return data[0];
  }


  async getAdminDiff(id) {
    const role = await Models.Role.query().findOne({nameRole: 'admin'});
    const users = await Models.User.query().where('roleId', '=', role.id).where('id', '!=', id);
    return users;
  }
  
}

module.exports = ExchangeService;
