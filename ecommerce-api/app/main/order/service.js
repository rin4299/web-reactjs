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
      if(order.status === "Shipping" || order.status === "Complete" || order.status === "Cancel"){
        throw Boom.badRequest(`Can not change the ${order.status} order!`)
      }
      var temp = 0;
      const productinOrder = await Models.OrderDetail.query().where("orderId", orderId);
      // 1 đơn chuyển từ Unconfirm -> Confirm thì cập nhật trừ Ownership
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
      // 1 đơn chỉ được chuyển qua Shipping khi status đang là Confirm	
      if(order.status === "Complete" || order.status === "Cancel" || order.status !== "Confirm"){
        throw Boom.badRequest(`Can not change the ${order.status} order!`)
      }
      // 1 đơn chuyển từ Confirm -> Shipping thì ko cập nhật gì thêm trừ Status
      await Models.Order.query().update({status: status} ).where('id', orderId);
      return `Successfully change the status of Order ${orderId} from ${order.status} to ${status}!`
    } else if (status === "Complete"){ // COMPLETE
      // 1 đơn chỉ được chuyển qua Complete khi status khác Shipping
      if(order.status === "Cancel" || order.status !== "Shipping"){
        throw Boom.badRequest(`Can not change the ${order.status} order!`)
      }
      // Blockchain Update
      await Models.Order.query().update({status: status} ).where('id', orderId);
      return `Successfully change the status of Order ${orderId} from ${order.status} to ${status}!`
    } else if (status === "Cancel") { // CANCEL
      //1 đơn chuyển sang Canceled thì:
      if(order.status === "Complete"){ //1 đơn chỉ được chuyển qua Canceled khi status khác Complete
        throw Boom.badRequest(`Can not cancel the ${order.status} order!`)
      }
      // nếu đang Confirm hoặc Shipping: thì cập nhật cộng lại Ownership và cả NumberAvailable
      if(order.status === "Confirm" || order.status === "Shipping" ){
        var newVal = 0;
        const orderDetails = await Models.OrderDetail.query().where("orderId", id);
        console.log("OD",orderDetails)
        for(var i = 0; i < orderDetails.length; i++){
          var product = await Models.Product.query().findOne({id: orderDetails[i].productId})
          newVal = product.numberAvailable + orderDetails[i].quantity;
          console.log(newVal)
          await Models.Product.query().update({numberAvailable: newVal}).where("id", product.id);
          var currentP = await Models.Ownership.query().findOne({pId: orderDetails[i].productId}).where("storeName", atStore);
          newVal = currentP.quantity + orderDetails[i].quantity;
          await Models.Ownership.query().update({quantity: newVal} ).where('pId', orderDetails[i].productId).where("storeName", atStore);
        }
      }
      // nếu đang Unconfirm: thì cập nhật cộng lại NumberAvailable
      if(order.status === "Unconfirm"){
        var newVal = 0;
        const orderDetails = await Models.OrderDetail.query().where("orderId", id);
        console.log("OD",orderDetails)
        for(var i = 0; i < orderDetails.length; i++){
          var product = await Models.Product.query().findOne({id: orderDetails[i].productId})
          newVal = product.numberAvailable + orderDetails[i].quantity;
          console.log(newVal)
          await Models.Product.query().update({numberAvailable: newVal}).where("id", product.id);
        }
      }
      await Models.Order.query().update({status: status} ).where('id', orderId);
      return `Successfully change the status of Order ${orderId} from ${order.status} to ${status}!`
    } else { // UNCONFIRM
      throw Boom.badRequest("Can not change any current status to Unconfirm!")
    }
  }

  async deleteOrder(id){
    // Neu la 1 Canceled order thi xoa luon do da tru roi
    const order = await Models.Order.query().where('id', id);
    if(order.status === "Complete"){
      throw Boom.badRequest("Can not delete a Complete Order!");
    }
    if(order.status === "Canceled"){
      await Models.Order.query().delete().where('id', id);
      await Models.OrderDetail.query().delete().where("orderId", id);
      return `Delete Successfully Order of ${order.fullName}!`;
    }
    const orderDetails = await Models.OrderDetail.query().where('orderId', id);
    var newVal = 0;
    // Neu don dang xoa la Confirm thi cap nhat lai ownership
    if(order.status === "Confirm" || order.status === "Shipping"){
      for(var i = 0; i < orderDetails.length; i++){
        var currentP = await Models.Ownership.query().findOne({pId: orderDetails[i].productId}).where("storeName", order.atStore);
        newVal = currentP.quantity + orderDetails[i].quantity;
        await Models.Ownership.query().update({quantity: newVal} ).where('pId', orderDetails[i].productId).where("storeName", order.atStore);
      }
    }
    for(var i = 0; i < orderDetails.length; i++){
      var product = await Models.Product.query().findOne({id: orderDetails[i].productId});
      newVal = product.numberAvailable + orderDetails[i].quantity;
      await Models.Product.query().update({numberAvailable: newVal}).where("id", product.id);
    }
    await Models.Order.query().delete().where('id', id);
    await Models.OrderDetail.query().delete().where('orderId', id);
    return `Delete Successfully Order of ${order.fullName}!`;

  }

  getSearchQuery(builder, q) {
    builder.andWhere(function () {
      this.whereRaw('LOWER("fullName") LIKE \'%\' || LOWER(?) || \'%\' ', q);
    });
  }
}

module.exports = OrderService;
