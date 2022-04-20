'use strict';

const Boom = require('@hapi/boom');
const _ = require('lodash');
const Models = require('../../db/models');
const { COMPLETE } = require('../../config/type')
const { default: Axios } = require('axios');
exports.countDashboard = async (query) => {
  const { startTime, endTime, name } = query;
  if(name){
    console.log(name)
    let res = await Axios.get("http://localhost:4000/channels/mychannel/chaincodes/productdetail?args=['1']&peer=peer0.org1.example.com&fcn=queryAllOrders");
    var recMessage = res.data
    let countCustomer = Models.User.query().where('roleId', 3).count();
    let countOrder = 0;
    let sumRevenue = 0.0;
    console.log("DASHBOARD LIST: ", recMessage)
    // let countOrder = Models.Order.query().where('atStore', name).count();
    // let sumRevenue = Models.Order.query().where('atStore', name).sum('totalAmount as total').where('isPaid', true);
    if (startTime && endTime) {
      countCustomer.whereBetween('createdAt', [startTime, endTime]);
      // countOrder.whereBetween('createdAt', [startTime, endTime]);
      // sumRevenue.whereBetween('createdAt', [startTime, endTime]);
      for(var i = 0; i < recMessage.length; i++){
        if(recMessage[i]['atStore'] === name && recMessage[i]['isActive']){
          var time = new Date(parseInt(recMessage[i]['createdAt'].split(" ")[0].slice(8)) * 1000);
          if(time >= startTime && time <= endTime){
            countOrder = countOrder + 1;
            if(recMessage[i]['isPaid']){
              sumRevenue = sumRevenue + (recMessage[i]['totalAmount'] === '' ? 0 : parseFloat(recMessage[i]['totalAmount']));
            }
          }
        }
      }
    } else {
      for(var i = 0; i < recMessage.length; i++){
        if(recMessage[i]['atStore'] === name && recMessage[i]['isActive']){
          countOrder = countOrder + 1;
          if(recMessage[i]['isPaid']){
            // console.log(parseFloat(recMessage[i]['totalAmount']))
            sumRevenue = sumRevenue + (recMessage[i]['totalAmount'] === '' ? 0 : parseFloat(recMessage[i]['totalAmount']));
          }
        }
      }
    }
    console.log("INCOME: ", sumRevenue)
    const countProduct = Models.Product.query().count();
    let [customer, product] = await Promise.all([countCustomer, countProduct])
    const result = {
      customerCount: customer[0].count ? customer[0].count : 0,
      orderCount: countOrder,
      income: sumRevenue,
      productCount: product[0].count ? product[0].count : 0
    }
    return result;
  } else {
    console.log(name)
    let res = await Axios.get("http://localhost:4000/channels/mychannel/chaincodes/productdetail?args=['1']&peer=peer0.org1.example.com&fcn=queryAllExchanges");
    var recMessage = res.data
    let countCustomer = Models.User.query().where('roleId', 3).count();
    let countOrder = 0;
    let sumRevenue = 0;
    
    // let countOrder = Models.Order.query().where('atStore', name).count();
    // let sumRevenue = Models.Order.query().where('atStore', name).sum('totalAmount as total').where('isPaid', true);
    if (startTime && endTime) {
      countCustomer.whereBetween('createdAt', [startTime, endTime]);
      // countOrder.whereBetween('createdAt', [startTime, endTime]);
      // sumRevenue.whereBetween('createdAt', [startTime, endTime]);
      for(var i = 0; i < recMessage.length; i++){
        if(recMessage[i].isActive){
          var time = new Date(parseInt(recMessage[i].createdAt.split(" ")[0].slice(8)) * 1000);
          if(time >= startTime && time <= endTime){
            countOrder = countOrder + 1;
            if(recMessage[i].isPaid){
              sumRevenue = sumRevenue + (recMessage[i]['totalAmount'] === '' ? 0 : parseFloat(recMessage[i]['totalAmount']));
            }
          }
        }
      }
    } else {
      for(var i = 0; i < recMessage.length; i++){
        if(recMessage[i].isActive){
          countOrder = countOrder + 1;
          if(recMessage[i].isPaid){
            sumRevenue = sumRevenue + (recMessage[i]['totalAmount'] === '' ? 0 : parseFloat(recMessage[i]['totalAmount']));
          }
        }
      }
    }
    const countProduct = Models.Product.query().count();
    let [customer, product] = await Promise.all([countCustomer, countProduct])
    const result = {
      customerCount: customer[0].count ? customer[0].count : 0,
      orderCount: countOrder,
      income: sumRevenue,
      productCount: product[0].count ? product[0].count : 0
    }
    return result;
  }
  
}



