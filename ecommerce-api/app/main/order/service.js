'use strict';

const Boom = require('@hapi/boom');
const Models = require('../../db/models');
const BaseServiceCRUD = require('../../base/BaseServiceCRUD');
const MailUtils = require('../../emailService');

class OrderService extends BaseServiceCRUD {
  constructor() {
    super(Models.Order, 'Order');
  }

  async createOne(payload) {
    const result = await this.model
      .query()
      .insert(payload)
      .returning('*');
    if(!result){
      throw Boom.badRequest('Error')
    }
    const id = payload.userId;
    const user = await Models.User.query().findById(id);
    if (!user) {
      throw Boom.notFound('user not found')
    }
    // MailUtils.sendEmailCreateOrderEmail(user.email)
    return result;
  }

  async getMany(query) {
    const builder = this.model.queryBuilder(query).eager('orderDetails');
    if (this.getSearchQuery && query.q) {
      this.getSearchQuery(builder, query.q);
    }
    return builder;
  }

  // load order with owner
  async getManyS(query, user) {
    const builder = this.model.queryBuilder(query).where('atStore', user).eager('orderDetails');
    if (this.getSearchQuery && query.q) {
      this.getSearchQuery(builder, query.q);
    }
    return builder;
  }

  async getOne(id) {
    const result = await this.model.query().findById(id).eager('orderDetails');
    if (!result) {
      throw Boom.notFound(`${this.modelName} not found`);
    }
    return result;
  }

  async updateOne(id, payload) {
    const result = await this.model.query().patchAndFetchById(id, payload);
    if (!result) {
      throw Boom.notFound(`${this.modelName} not found`);
    }
    if (payload.status === 'Confirm') {
       MailUtils.sendEmailConfirmOrderEmail(id)
    }
    if (payload.status === 'Shipping') {
      MailUtils.sendEmailShippedOrder(id)
    }
    if (payload.status === 'Complete') {
      MailUtils.sendEmailCompleteOrderEmail(id);
    }
    return result;
  }


  async changeStatus(payload) {
    const {orderId, status, atStore, fullName} = payload;
    const order = await Models.Order.query().findOne({id: orderId});

    if(status === "Confirm"){ // CONFIRM
      if(order.status === "Shipping" || order.status === "Complete"){
        throw Boom.badRequest(`Can not change the ${order.status} order!`)
      }
      var temp = 0;
      const productinOrder = await Models.OrderDetail.query().where("orderId", orderId);
      for(var i = 0; i < productinOrder.length; i++){
        var currentP = await Models.Ownership.query().findOne({pId: productinOrder[i].productId}).where("storeName", atStore);
        temp = currentP.quantity - productinOrder[i].quantity;
        if(temp < 0){
          throw Boom.badRequest(`Can not change status to from unconfirm to ${status} because ${atStore} has not enough products to sastify the Order!`)
        }
        console.log("CHANGE", temp, productinOrder[i].productId)
        await Models.Ownership.query().update({quantity: temp} ).where('pId', productinOrder[i].productId).where("storeName", atStore);
      }
      await Models.Order.query().update({status: status} ).where('id', orderId);
      return `Successfully change the status of Order ${orderId} from ${order.status} to ${status}!`
    } else if (status === "Shipping"){ // SHIPPING
      if(order.status === "Complete" || order.status === "Cancel"){
        throw Boom.badRequest(`Can not change the ${order.status} order!`)
      }
      await Models.Order.query().update({status: status} ).where('id', orderId);
      return `Successfully change the status of Order ${orderId} from ${order.status} to ${status}!`
    } else if (status === "Complete"){ // COMPLETE
      if(order.status === "Cancel"){
        throw Boom.badRequest(`Can not change the ${order.status} order!`)
      }
      await Models.Order.query().update({status: status} ).where('id', orderId);
      return `Successfully change the status of Order ${orderId} from ${order.status} to ${status}!`
    } else if (status === "Cancel") { // CANCEL
      if(order.status === "Shipping" || order.status === "Complete" || order.status === "Confirm"){
        throw Boom.badRequest(`Can not cancel the ${order.status} order!`)
      }
      await Models.Order.query().update({status: status} ).where('id', orderId);
      return `Successfully change the status of Order ${orderId} from ${order.status} to ${status}!`
    } else { // UNCONFIRM
      throw Boom.badRequest("Can not change any current status to Unconfirm!")
    }
  }



  getSearchQuery(builder, q) {
    builder.andWhere(function () {
      this.whereRaw('LOWER("fullName") LIKE \'%\' || LOWER(?) || \'%\' ', q);
    });
  }
}

module.exports = OrderService;
