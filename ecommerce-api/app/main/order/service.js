'use strict';

const Boom = require('@hapi/boom');
const Models = require('../../db/models');
const BaseServiceCRUD = require('../../base/BaseServiceCRUD');
const MailUtils = require('../../emailService');
const { default: Axios } = require('axios');

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
      const lopd = await Models.OrderDetail.query().where("orderId", orderId);
      var buffer = "";
      for(var p = 0; p < lopd.length; p++){
        buffer += lopd[p].productId + "-" + lopd[p].quantity + ",";
      }
      buffer = buffer.slice(0,-1);
      console.log(buffer)
      let object = {
        fcn: "sellingProducts",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[buffer, atStore, fullName]
      }
      const res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
      if(res){
        var stringBuffer = res.data.result.data;
        var pdinOrder = Buffer.from(JSON.parse(JSON.stringify(stringBuffer))).toString();
        console.log("FinalString",pdinOrder);
        var payload = {
          "orderId": orderId,
          "listPds": pdinOrder
        }
        const result = await Models.ProductDetails.query().insert(payload).returning('*');
        if(!result){
          throw Boom.badRequest("Can not create Product Details in Order");
        }

      }
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
    const order = await Models.Order.query().findOne({id:id});
    console.log('order', order, id)
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
    console.log('orderDetail',orderDetails)
    console.log('status', order.status, orderDetails.length)

    // Neu don dang xoa la Confirm thi cap nhat lai ownership
    if(order.status === "Confirm" || order.status === "Shipping"){
      for(var i = 0; i < orderDetails.length; i++){
        var currentP = await Models.Ownership.query().findOne({pId: orderDetails[i].productId}).where("storeName", order.atStore);
        newVal = currentP.quantity + orderDetails[i].quantity;
        console.log('abc',currentP, newVal)
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

  async loadProductDetailinOrder(id){
    const infor = await Models.ProductDetails.query().findOne({orderId: id});
    var return_list = {}
    var shell = [];
    var listofProduct = infor.listPds.split(",");
    for(var l = 0; l < listofProduct.length; l++){
        var split_data = listofProduct[l].split("-");
        if(shell.includes(split_data[0])){
          return_list[split_data[0]]['ids'] += "," + split_data[1];
          return_list[split_data[0]]['quantity'] += 1;
        } else{
          shell.push(split_data[0]);
          var product_infor = await Models.Product.query().findOne({id: parseInt(split_data[0])})
          var obj = {
            'ids': split_data[1],
            'quantity': 1,
            'product': product_infor
          }
          return_list[split_data[0]] = obj;
        }
    }
  }

  getSearchQuery(builder, q) {
    builder.andWhere(function () {
      this.whereRaw('LOWER("fullName") LIKE \'%\' || LOWER(?) || \'%\' ', q);
    });
  }
}

module.exports = OrderService;
