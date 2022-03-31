'use strict';

const Boom = require('@hapi/boom');
const Models = require('../../db/models');
const BaseServiceCRUD = require('../../base/BaseServiceCRUD');
const _ = require('lodash');
const PasswordUtils = require('../../services/password');
const { default: Axios } = require('axios');
const NodeGeocoder = require('node-geocoder');
// require('../../../../../../BasicNetwork-2.0/api-1.4/config.js');
// var helper = require("../../../../../../BasicNetwork-2.0/api-1.4/app/helper");
// var instantiate = require('../../../../../../BasicNetwork-2.0/api-1.4/app/instantiate-chaincode.js');
// var invoke = require('../../../../../../BasicNetwork-2.0/api-1.4/app/invoke-transaction.js');
// var query = require('../../../../../../BasicNetwork-2.0/api-1.4/app/query.js');
// require('../../../../BasicNetwork-2.0/api-1.4/config.js');
// var helper = require("../../../../BasicNetwork-2.0/api-1.4/app/helper");
// var instantiate = require('../../../../BasicNetwork-2.0/api-1.4/app/instantiate-chaincode.js');
// var invoke = require('../../../../BasicNetwork-2.0/api-1.4/app/invoke-transaction.js');
// var query = require('../../../../BasicNetwork-2.0/api-1.4/app/query.js');
class ExchangeService extends BaseServiceCRUD {
  constructor() {
    super(Models.Exchanged, 'exchanged');
  }

  // async bcCaller(peer, chaincodeName, channelName, fcn, args){
  //   console.log('channelName  : ' + channelName);
  //   console.log('chaincodeName : ' + chaincodeName);
  //   console.log('fcn  : ' + fcn);
  //   console.log('args  : ' + args);
  //   // args = args.replace(/'/g, '"');
	//   // args = JSON.parse(args);
  //   console.log('new args', typeof(peer));
  //   await helper.getRegisteredUser("tester", "Org1", true);
  //   let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, "tester", "Org1");
  //   console.log('Result Message', message);
  //   return message;
  // }

  // async bcCallerInvoke(peer, chaincodeName, channelName, fcn, args){
  //   console.log('channelName  : ' + channelName);
  //   console.log('chaincodeName : ' + chaincodeName);
  //   console.log('fcn  : ' + fcn);
  //   console.log('args  : ' + args);
  //   // args = args.replace(/'/g, '"');
	//   // args = JSON.parse(args);
  //   console.log('new args', typeof(peer));
  //   await helper.getRegisteredUser("user", "Org1", true);
  //   let message = await invoke.invokeChaincode(peer, channelName, chaincodeName, fcn, args, "user", "Org1");
  //   console.log('Result Message', message);
  //   return message;
  // }
// Van giu ID
  async getManyEx(query, payload) {
    // const {id, type} = payload;
    // let U = await Models.User.query().findOne({id: id})
    // const builder = this.model.queryBuilder(query).where(type, U.name);
    // if (this.getSearchQuery && query.q) {
    //   this.getSearchQuery(builder, query.q);
    // }
    // return builder;
    const {id, type} = payload;
    // let recM = await this.bcCaller("peer0.org1.example.com","productdetail", "mychannel", "queryAllExchanges", "1");
    // let recM = await this.bcCaller("peer0.org1.example.com","productdetail", "mychannel", "queryAllExchanges", "1");
    let res = await Axios.get("http://localhost:4000/channels/mychannel/chaincodes/productdetail?args=['1']&peer=peer0.org1.example.com&fcn=queryAllExchanges");
    var recM = res.data
    console.log(recM)
    let reValue = []
    let returning = []
    let U = await Models.User.query().findOne({id: id})
    console.log(U.name)
    console.log(recM[1])
    console.log(recM[1][type])
    for(var i = 0; i < recM.length; i++){
      if((recM[i][type] === U.name && recM[i]["isActive"] === true) && !(recM[i]["isAccepted"] === true && recM[i]["isConfirm"] === true )){
        var temp = recM[i]["listofProduct"].split(",")
        // console.log("HAHA",temp.length)
        for(var j = 0; j < temp.length; j++){
          console.log(temp[j][0])
          var product = await Models.Product.query().findOne({id: parseInt(temp[j][0])})
          product.quantity = parseInt(temp[j][2]);
          reValue.push(product);
        }
        recM[i]["products"] = reValue;
        returning.push(recM[i])
        reValue = []
      }
    }
    console.log(returning);
    return returning
  }

  // async createExchange(payload) {
  //   try {
  //       const {reqUserName, recUserName, pName, quantity} = payload;
  //       let product = await Models.Product.query().where('nameProduct', pName);
  //       if(quantity > product[0].numberAvailable){
  //         throw Boom.badRequest('The current available of the current product can not afford this quantity!');
  //       }
  //       let lop = String(product[0].id) + "-" + String(quantity)
  //       console.log(lop)
  //       // let data = this.bcCallerInvoke(["peer0.org1.example.com", "peer0.org2.example.com"], "productdetail", "mychannel", "createExchange", [reqUserName, recUserName, lop]);
  //       let object = {
  //         fcn: "createExchange",
  //         peers:["peer0.org1.example.com","peer0.org2.example.com"],
  //         chaincodeName:"productdetail",
  //         channelName:"mychannel",
  //         args:[reqUserName, recUserName, lop]
  //       }
  //       let res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
  //       console.log(res.data);
  //       if(res.data){
  //         return "Successful"
  //       } else {
  //         throw Boom.badRequest('Unsuccessful Creating!');
  //       }
  //     // let data = await Models.Exchanged.query()
  //     //   .insert(payload)
  //     //   .returning('*');
  //     // let U = await Models.User.query().whereIn('id',[data.reqUserId, data.recUserId]);
  //     // data.reqUserName = U[0].name;
  //     // data.recUserName = U[1].name;
  //     // let P = await Models.Product.query().findOne({id: data.pId});
  //     // data.pName = P.nameProduct;
  //     // return data;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  async createExchange(payload) {
    try {
        const {reqUserName, recUserName, multiRequest} = payload;
        var lop = ""
        for(var i = 0; i < multiRequest.length; i++){
            var product = await Models.Product.query().findOne('nameProduct', multiRequest[i]['pName']);
            lop = lop + String(product.id) + "-" + String(multiRequest[i]['quantity']) + ","
        }
        lop = lop.slice(0,-1)
        console.log(lop)
    
        // let data = this.bcCallerInvoke(["peer0.org1.example.com", "peer0.org2.example.com"], "productdetail", "mychannel", "createExchange", [reqUserName, recUserName, lop]);
        let object = {
          fcn: "createExchange",
          peers:["peer0.org1.example.com","peer0.org2.example.com"],
          chaincodeName:"productdetail",
          channelName:"mychannel",
          args:[reqUserName, recUserName, lop]
        }
        console.log(object)
        let res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
        console.log(res.data);
        if(res.data){
          return "Successful"
        } else {
          throw Boom.badRequest('Unsuccessful Creating!');
        }
      // let data = await Models.Exchanged.query()
      //   .insert(payload)
      //   .returning('*');
      // let U = await Models.User.query().whereIn('id',[data.reqUserId, data.recUserId]);
      // data.reqUserName = U[0].name;
      // data.recUserName = U[1].name;
      // let P = await Models.Product.query().findOne({id: data.pId});
      // data.pName = P.nameProduct;
      // return data;
    } catch (err) {
      throw err;
    }
  }

  async updateAccept(id) {
    // await Models.Exchanged.query()
    //   .update({ isAccepted: true })
    //   .where('id', id);
    // // return { message: 'Update isAccepted is successfully' };
    // let data = await Models.Exchanged.query().where('id', id);
    // return data[0];
    
    let object = {
      fcn: "changeExchangeInfor",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id, "isAccepted"]
    }
    var res = await await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
    if(res.data){
      return "Updated!"
    } else {
      throw Boom.badRequest('Failed to update!');
    }
  }


  async updateConfirm(id) {

    // let exchange = await Models.Exchanged.query().where('id', id);
    // let e = exchange[0];
    // console.log(e.pName + "AAA")
    // if(e.isAccepted === false){
    //   throw Boom.badRequest('The current Exchange Request has not been accepted yet!');
    // }
    // let product = await Models.Product.query().where('nameProduct', e.pName);
    // // let curQ = product.quantity - quantity;
    // console.log(product[0].numberAvailable)
    // console.log(e.quantity)
    // await Models.Product.query().update({numberAvailable: product[0].numberAvailable - e.quantity} ).where('id', product[0].id);
    // await Models.Exchanged.query()
    //   .update({ isReceived: true })
    //   .where('id', id);
    // let data = await Models.Exchanged.query().where('id', id);
    // // return { message: 'Update isReceived is successfully' };
    // return data[0];
    let object = {
      fcn: "changeExchangeInfor",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id, "isConfirm"]
    }
    var res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
    if(res.data){
      let object1 = {
        fcn: "changeProductDetail",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[id]
      }
        var sres = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object1);
        if(sres.data){
          return sres.data
        } else {
          throw Boom.badRequest('Failed to update ProuctDetail!');
        }
    } else {
      throw Boom.badRequest('Failed to update Exchange state!');
    }
  }


  async deleteRequest(id) {

    // let exchange = await Models.Exchanged.query().where('id', id);
    // let e = exchange[0];
    // if(e.isAccepted === true){
    //   throw Boom.badRequest('Cannot delete the current accepted Exchange Request!');
    // }
    // await Models.Exchanged.query().where('id', id).delete();
 
    // return { message: 'Delete Request is successfully done' };

    let object = {
      fcn: "changeExchangeInfor",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id, "delete"]
    }
    var res = await await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
    if(res.data){
      return "Deleted!"
    } else {
      throw Boom.badRequest('Failed to delete!');
    }
  }

  async getHistory(id) {
    // let recM = await this.bcCaller("peer0.org1.example.com","productdetail", "mychannel", "queryAllExchanges", "1");
    // let recM = await this.bcCaller("peer0.org1.example.com","productdetail", "mychannel", "queryAllExchanges", "1");
    let res = await Axios.get("http://localhost:4000/channels/mychannel/chaincodes/productdetail?args=['1']&peer=peer0.org1.example.com&fcn=queryAllExchanges");
    var recM = res.data
    console.log(recM)
    let reValue = []
    let returning = []
    let U = await Models.User.query().findOne({id: id})
    console.log(U.name)
    console.log(recM[1])
    for(var i = 0; i < recM.length; i++){
      if((recM[i]['reqUserName'] === U.name || recM[i]['recUserName'] === U.name) && recM[i]["isActive"] === true && (recM[i]["isAccepted"] === true && recM[i]["isConfirm"] === true )){
        var temp = recM[i]["listofProduct"].split(",")
        // console.log("HAHA",temp.length)
        for(var j = 0; j < temp.length; j++){
          console.log(temp[j][0])
          var product = await Models.Product.query().findOne({id: parseInt(temp[j][0])})
          product.quantity = parseInt(temp[j][2]);
          reValue.push(product);
        }
        recM[i]["products"] = reValue;
        var date = new Date(recM[i]["latestUpdate"].slice(8,18) * 1000)
        recM[i]["latestUpdate"] = date
        returning.push(recM[i])
        reValue = []
      }
    }
    console.log(returning);
    return returning
  }


  async tracking(id){
    let req = `http://localhost:4000/channels/mychannel/chaincodes/productdetail?args=`
    req = req + '["' + id.toString() + '"]' + `&peer=peer0.org1.example.com&fcn=getHistoryForAsset`;
    let res = await Axios.get(req);
    if(res.data){
      return res.data
    } else {
      throw Boom.badRequest('Failed to track product history!');
    }
  }

  async getAdminDiff(id) {
    const role = await Models.Role.query().findOne({nameRole: 'admin'});
    const users = await Models.User.query().where('roleId', '=', role.id).where('id', '!=', id);
    return users;
  }


  async getDistance (lat1, lng1, lat2, lng2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  };


  async getProductbyOwner(query, user){
    const products = Models.Ownership.queryBuilder(query).eager('[ownership]').where('storeName', user);
    console.log(products);
    return products;
  }


  async getStore(payload){
    
    let {address, orderId, lop} = payload;
    console.log( address, orderId, lop);
    var rad = function(x) {
      return x * Math.PI / 180;
    };
    var disCalculate = function getDistance (lat1, lng1, lat2, lng2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = rad(lat2 - lat1);
      var dLong = rad(lng2 - lng1);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
    };
    var geocoder = NodeGeocoder({
      provider: 'opencage',
      apiKey: 'bd94e47e842341c1a497f48a2ad09182'
    });
    geocoder.geocode({address: address}, async function(err,res){
      var lat = res[0]['latitude']
      var lng = res[0]['longitude']
      var listofStore = []
      console.log("1111111111111")
      const stores = await Models.Store.query();
      console.log(stores);
      for(var i = 0; i < stores.length; i++){
        listofStore.push({'distance': disCalculate(stores[i]['lat'],stores[i]['lng'],lat,lng),'storeName': stores[i]['storeName']})
      }
      listofStore.sort();
      console.log(listofStore)
      const arrPQ = []
      var proQ  = lop.split(",");
      for(var i = 0; i < proQ.length; i++){
        var temp = proQ[i].split("-");
        arrPQ.push({'pId': parseInt(temp[0]), 'quantity': parseInt(temp[1])});
      }
      var flag1 = true
      var memoryShell = [];
      console.log("ARRPQ", arrPQ)
      for(var j = 0;j < listofStore.length; j++){
        var productInStore = await Models.Ownership.query().where('storeName', listofStore[j]['storeName'])
        memoryShell.push({'storeName': listofStore[j]['storeName']})
        var productMatch = [];
    
        for(var x = 0; x < arrPQ.length; x++){
          for(var y = 0; y < productInStore.length; y++){
            if(arrPQ[x]['pId'] === productInStore[y].pId){
              productMatch.push({'pId': arrPQ[x]['pId'], 'currentQ': productInStore[y].quantity}); //Luu thong tin cac product matching cua moi store
              if(arrPQ[x]['quantity'] > productInStore[y].quantity){ //quantity yeu cau > quantity co thi store do ko dap ung duoc
                flag1 = false;
                console.log("3333333333333")
              }
            }
          }
        }
        console.log(productMatch)
        if(flag1 === true){
          await Models.Order.query().update({atStore: listofStore[j]['storeName']} ).where('id', orderId);
          break;
        } else {
          memoryShell[j]['products'] = productMatch;
          flag1 = true;
        }
        //get list of product by storeName in ownership
        // for loop de check => 3TH
          // 1: neu store gần nhất du thi query rồi đổi giá trị atStore trong table Order theo OrderId
          // 2: neu storeA ko du lưu giá trị của store gần nhất và check các store khác và lưu giá trị, nếu đủ stop và -> y chang 1
          // 3: neu ko có store đủ thì dựa vào độ thiếu của store gần nhất đối với mỗi sp mà tìm store phù hợp
      } // end checking 1 for each store and take the value of matching product in each store
      console.log(memoryShell);
     
    })
    return "successful"
  }
  
}

module.exports = ExchangeService;
