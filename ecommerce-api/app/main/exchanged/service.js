'use strict';

const Boom = require('@hapi/boom');
const Models = require('../../db/models');
const BaseServiceCRUD = require('../../base/BaseServiceCRUD');
const _ = require('lodash');
const PasswordUtils = require('../../services/password');
const { default: Axios } = require('axios');
const NodeGeocoder = require('node-geocoder');
const OrderService = require('../order/service');
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
    for(var i = 0; i < recM.length; i++){
      if((recM[i][type] === U.name && recM[i]["isActive"] === true) && !(recM[i]["isAccepted"] === true && recM[i]["isConfirm"] === true )){
        var temp = recM[i]["listofProduct"].split(",")
        // console.log("HAHA",temp.length)
        for(var j = 0; j < temp.length; j++){
          // console.log(temp[j][0])
          var infor = temp[j].split("-")
          var product = await Models.Product.query().findOne({id: parseInt(infor[0])})
          product.quantity = parseInt(infor[1]);
          console.log(product, infor[1])
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
        var TotalQuantity = 0
        for(var i = 0; i < multiRequest.length; i++){
            var product = await Models.Product.query().findOne('nameProduct', multiRequest[i]['pName']);
            var ownership = await Models.Ownership.query().findOne({pId: product.id}).where("storeName", recUserName);
            if(multiRequest[i]['quantity'] > ownership.quantity){
              throw Boom.badRequest(`Cannot create this Request because store ${recUserName} only has ${ownership.quantity} while ${multiRequest[i]['quantity']} is needed!`)
            }
            lop = lop + String(product.id) + "-" + String(multiRequest[i]['quantity']) + ",";
            TotalQuantity += multiRequest[i]['quantity']
        }
        lop = lop.slice(0,-1)
        console.log(lop)
        const Address_Of_Receiver = await Models.Store.query().findOne({storeName: recUserName})
        // let data = this.bcCallerInvoke(["peer0.org1.example.com", "peer0.org2.example.com"], "productdetail", "mychannel", "createExchange", [reqUserName, recUserName, lop]);
        let object = {
          fcn: "createExchange",
          peers:["peer0.org1.example.com","peer0.org2.example.com"],
          chaincodeName:"productdetail",
          channelName:"mychannel",
          args:[reqUserName, recUserName, lop, Address_Of_Receiver['lng'].toString(), Address_Of_Receiver['lat'].toString(), TotalQuantity.toString()]
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

  async updateAccept(payload) {
    console.log(payload)
    const {id, lop, storeName} = payload;
    console.log(lop)
    var temp = lop.split(",");
    for(var i = 0; i < temp.length; i++){
      var infor = temp[i].split("-");
      var productQ = await Models.Ownership.query().where('storeName', storeName).findOne({pId: parseInt(infor[0])});
      if(productQ.quantity >= parseInt(infor[1])){
        await Models.Ownership.query().update({quantity: productQ.quantity - parseInt(infor[1])} ).where('storeName', storeName).where('pId', productQ.pId);
      } else {
        throw Boom.badRequest(`The number of product which has ID = ${productQ.pId} is lower than requested (${parseInt(infor[1])} > ${productQ.quantity})`);
      }
    }

    let object = {
      fcn: "changeExchangeInfor",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id.toString(), "isAccepted"]
    }
    var res = await await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
    if(!res.data){
      throw Boom.badRequest('Failed to update!');
    }
    // Taken PDs
    let object1 = {
      fcn: "changeProductDetail",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id.toString(), "preparing"]
    }
      var sres = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object1);
      if(!sres){
        throw Boom.badRequest('Failed to update ProuctDetail!');
      }
      console.log("Exchange | changeStatus | UpdateShipping: ",sres.data)

    return "Updated!"
  }


  async changeStatus(payload) {
    console.log(payload)
    const {id, status} = payload;
    let objectExchange = {
      fcn: "queryExchange",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id.toString()]
    }
    const res_Exchange_Infor = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", objectExchange);
    if(!res_Exchange_Infor){
      throw Boom.badRequest('Error in BC!')
    }
    var data = res_Exchange_Infor.data.result.data;
    var listofP = Buffer.from(JSON.parse(JSON.stringify(data))).toString();
    var exchangeInfor = JSON.parse(listofP)
    console.log("Exchange FROM BC: ", exchangeInfor)
    if (status === "Shipping"){ // SHIPPING
      if(exchangeInfor.status === "Complete" || exchangeInfor.status === "Canceled" || exchangeInfor.status !== "Processing"){
        throw Boom.badRequest(`Can not change the ${exchangeInfor.status} Exchange!`)
      }
      // // Taken PDs
      // let object1 = {
      //   fcn: "changeProductDetail",
      //   peers:["peer0.org1.example.com","peer0.org2.example.com"],
      //   chaincodeName:"productdetail",
      //   channelName:"mychannel",
      //   args:[id.toString(), "preparing"]
      // }
      //   var sres = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object1);
      //   if(!sres){
      //     throw Boom.badRequest('Failed to update ProuctDetail!');
      //   }
      //   console.log("Exchange | changeStatus | UpdateShipping: ",sres.data)
      // Update Status

      let object = {
        fcn: "changeExchangeInfor",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[id.toString(), "status", status]
      }
      var res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
      if(res.data){
        return `Successfully change the status of Exchange ${id} from ${exchangeInfor.status} to ${status}!`
      } else {
        throw Boom.badRequest('Failed to update!');
      }
      
    } else if (status === "Complete"){ // COMPLETE
      // 1 đơn chỉ được chuyển qua Complete khi status khác Shipping
      if(exchangeInfor.status === "Canceled" || exchangeInfor.status !== "Shipping"){
        throw Boom.badRequest(`Can not change the ${exchangeInfor.status} Exchange!`)
      }
      
      let object = {
        fcn: "changeExchangeInfor",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[id.toString(), "status", status]
      }
      var res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
      if(res.data){
        return `Successfully change the status of Exchange ${id} from ${exchangeInfor.status} to ${status}!`
      } else {
        throw Boom.badRequest('Failed to update!');
      }
      
    } else if (status === "Canceled") { // CANCEL
      //1 đơn chuyển sang Canceled thì:
      if(exchangeInfor.status === "Complete"){ //1 đơn chỉ được chuyển qua Canceled khi status khác Complete
        throw Boom.badRequest(`Can not cancel the ${exchangeInfor.status} Exchange!`)
      }
      if (exchangeInfor.status === "Processing" || exchangeInfor.status === "Shipping"){
        // Cap nhat lai Ownership
        var liss_Of_Products_in_Exchange = exchangeInfor.listofProduct;
        var temp = liss_Of_Products_in_Exchange.split(",");
        for(var i = 0; i < temp.length; i++){
          var infor = temp[i].split("-");
          var productQ = await Models.Ownership.query().where('storeName', storeName).findOne({pId: parseInt(infor[0])});
          await Models.Ownership.query().update({quantity: productQ.quantity + parseInt(infor[1])} ).where('storeName', storeName).where('pId', productQ.pId);
        }
      }
      if(exchangeInfor.status === "Shipping" || exchangeInfor.status === "Processing") {
        // Cap nhat lai isTaken = false 
        let object_Change_IsTaken = {
          fcn: "changeProductDetail",
          peers:["peer0.org1.example.com","peer0.org2.example.com"],
          chaincodeName:"productdetail",
          channelName:"mychannel",
          args:[id.toString(), "unpreparing"]
        }
          var Change_IsTaken_res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object_Change_IsTaken);
          if(!Change_IsTaken_res){
            throw Boom.badRequest('Failed to update ProuctDetail in DeleteRequest!');
          }
      }

      let object = {
        fcn: "changeExchangeInfor",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[id.toString(), "status", status]
      }
      var res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
      if(res.data){
        return `Successfully change the status of Exchange ${id} from ${exchangeInfor.status} to ${status}!`
      } else {
        throw Boom.badRequest('Failed to update!');
      }
    } else { // UNCONFIRM
      throw Boom.badRequest("Can not change any current status to Processing!")
    }
  }


  async updateConfirm(payload) {
    console.log(payload)
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
    const {id, lop, storeName} = payload
    var temp = lop.split(",");
    for(var i = 0; i < temp.length; i++){
      var infor = temp[i].split("-");
      var productQ = await Models.Ownership.query().where('storeName', storeName).findOne({pId: parseInt(infor[0])});
      await Models.Ownership.query().update({quantity: productQ.quantity + parseInt(infor[1])} ).where('storeName', storeName).where('pId', productQ.pId);
    }

    let object = {
      fcn: "changeExchangeInfor",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id.toString(), "isConfirm"]
    }
    var res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
    if(res.data){
      let object1 = {
        fcn: "changeProductDetail",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[id.toString()]
      }
        var sres = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object1);
        if(sres.data){
          // console.log(sres.data)
          // var data = sres.data.result.data;
          // var listofP = Buffer.from(JSON.parse(JSON.stringify(data))).toString();
          // console.log(listofP);
          // var information = listofP.split(",")
          // var shell = []
          // var return_list = {}
          // for(var j = 0; j < information.length; j++){
          //   var split_data = information[j].split(",");
          //   if(shell.includes(split_data[0])){
          //     return_list[split_data[0]]['ids'] += "," + split_data[1];
          //     return_list[split_data[0]]['quantity'] += 1;
          //   } else{
          //     shell.push(split_data[0]);
          //     var product_infor = await Models.Product.query().findOne({id: parseInt(split_data[0])})
          //     var obj = {
          //       'ids': split_data[1],
          //       'quantity': 1,
          //       'product': product_infor
          //     }
          //     return_list[split_data[0]] = obj;
          //   }
          // }
          return sres.data
        } else {
          throw Boom.badRequest('Failed to update ProuctDetail!');
        }
    } else {
      throw Boom.badRequest('Failed to update Exchange state!');
    }
  }


  async deleteRequest(id) {

    let objectExchange = {
      fcn: "queryExchange",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id.toString()]
    }
    const res_Exchange_Infor = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", objectExchange);
    if(!res_Exchange_Infor){
      throw Boom.badRequest('Error in BC!')
    }
    var data = res_Exchange_Infor.data.result.data;
    var listofP = Buffer.from(JSON.parse(JSON.stringify(data))).toString();
    var exchangeInfor = JSON.parse(listofP)
    console.log("Exchange FROM BC: ", exchangeInfor)
    if(exchangeInfor.status === "Complete") {
      throw Boom.badRequest(`Cannot Delete Exchange with Id = ${id} whose status is Complete!`)
    }
    if((exchangeInfor.status === "Processing" && exchangeInfor.isAccepted === true) || exchangeInfor.status === "Shipping"){
      // Update Ownership
      var liss_Of_Products_in_Exchange = exchangeInfor.listofProduct;
      var temp = liss_Of_Products_in_Exchange.split(",");
      for(var i = 0; i < temp.length; i++){
        var infor = temp[i].split("-");
        var productQ = await Models.Ownership.query().where('storeName', exchangeInfor.recUserName).findOne({pId: parseInt(infor[0])});
        await Models.Ownership.query().update({quantity: productQ.quantity + parseInt(infor[1])}).where('storeName', exchangeInfor.recUserName).where('pId', productQ.pId);
      }
    }

    if(exchangeInfor.status === "Shipping" || exchangeInfor.status === "Processing") {
      // Cap nhat lai isTaken = false 
      let object_Change_IsTaken = {
        fcn: "changeProductDetail",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[id.toString(), "unpreparing"]
      }
        var Change_IsTaken_res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object_Change_IsTaken);
        if(!Change_IsTaken_res){
          throw Boom.badRequest('Failed to update ProuctDetail in DeleteRequest!');
        }
    }

    let object = {
      fcn: "changeExchangeInfor",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id.toString(), "delete"]
    }
    var res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
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
      var returnArray = []
      var tempJSON = {}
      for(var i =0; i < res.data.length; i++){
        if(tempJSON.hasOwnProperty(res.data[i]['Value']["ownerName"])){
          tempJSON[res.data[i]['Value']["ownerName"]].push(res.data[i])
        } else {
          tempJSON[res.data[i]['Value']["ownerName"]] = []
          tempJSON[res.data[i]['Value']["ownerName"]].push(res.data[i])
        }
      }
      var countKeys = Object.keys(tempJSON);
      var len = 0;
      for(var k = 0; k < countKeys.length; k++){
        returnArray.push(tempJSON[countKeys[k]][0])
        len = returnArray.length;
        if(returnArray[len-1]['Value']["ownerName"].slice(0,5) === "Store"){
          var storeInfor = await Models.Store.query().findOne({storeName: returnArray[len-1]['Value']["ownerName"]});
          returnArray[len-1]['Value']['information'] = storeInfor;
        } else {
          let stringS = returnArray[len-1]['Value']['pid'] + "-" +returnArray[len-1]['Value']['id'];
          console.log(stringS)
          // var listOfOrderDetails = await Models.ProductDetails.query().whereRaw(`"listPds" LIKE \'%\' || ${stringS} || \'%\' `);
          var OrderDetails = await Models.ProductDetails.query().where("listPds", 'like', `%${stringS}%`);
          console.log("Pleased!",OrderDetails);
          let object = {
            fcn: "queryOrder",
            peers:["peer0.org1.example.com","peer0.org2.example.com"],
            chaincodeName:"productdetail",
            channelName:"mychannel",
            args:[OrderDetails[0]['orderId'].toString()]
          }
          console.log(object)
          let res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
          if(!res){
            throw Boom.badRequest("Cannot connect to BC!")
          } 
          var data = res.data.result.data;
          var listofP = Buffer.from(JSON.parse(JSON.stringify(data))).toString();
          var result = JSON.parse(listofP)
          returnArray[len-1]['Value']['information'] = result;
        }
      }
      console.log("Tracking ReturnArray, :" ,returnArray)
      return returnArray
    } else {
      throw Boom.badRequest('Failed to track product history!');
    }
  }

  async getAdminDiff(id) {
    const role = await Models.Role.query().findOne({nameRole: 'admin'});
    const users = await Models.User.query().where('roleId', '=', role.id).where('id', '!=', id);
    return users;
  }

  async getProductbyOwner(query, user){
    const products = Models.Product.queryBuilder(query).eager('[ownership]');
    console.log(products);
    if (this.getSearchQuery && query.q) {
      this.getSearchQuery(products, query.q);
    }
    return products;
  }

  getSearchQuery(builder, q) {
    builder.andWhere(function () {
      this.whereRaw('LOWER("nameProduct") LIKE \'%\' || LOWER(?) || \'%\' ', q);
    });
  }

  async getStoreDistance(payload){
    
    let {address, userId, lat, lng} = payload;
    console.log( address, userId, lat, lng);

    // var rad = function(x) {
    //   return x * Math.PI / 180;
    // };
    // var disCalculate = function getDistance (lat1, lng1, lat2, lng2) {
    //   var R = 6378137; // Earth’s mean radius in meter
    //   var dLat = rad(lat2 - lat1);
    //   var dLong = rad(lng2 - lng1);
    //   var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //     Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
    //     Math.sin(dLong / 2) * Math.sin(dLong / 2);
    //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //   var d = R * c;
    //   return d; // returns the distance in meter
    // };
    // var geocoder = NodeGeocoder({
    //   provider: 'opencage',
    //   apiKey: 'bd94e47e842341c1a497f48a2ad09182'
    // });

    // geocoder.geocode({address: address}, async function(err,res){
      //Check xem Address co hop le ko 
      // if(!res || err){
      //   const oS = new OrderService();
      //   const successfulMessage = await oS.deleteOrder(orderId);
      //   console.log(successfulMessage);
      //   throw Boom.badData(`Your current address ${address} is not available. Please try again with the available address!`)
      // }
      let distance = 0
      let subString = ""
      // var lat = res[0]['latitude']
      // var lng = res[0]['longitude']
      // var listofStore = []
      // var strongestFlag = true;
      // console.log("1111111111111")
      const stores = await Models.Store.query();
      // console.log(stores);
      for(var i = 0; i < stores.length; i++){
        // listofStore.push({'distance': disCalculate(stores[i]['lat'],stores[i]['lng'],lat,lng),'storeName': stores[i]['storeName']})
        var existed = await Models.Distance.query().findOne({userId: userId}).where('storeName',stores[i].storeName)
        subString = stores[i]['lng'] + "," + stores[i]['lat'] + ";" + lng + "," + lat;
        console.log(subString)
        distance = await Axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${subString}?access_token=pk.eyJ1IjoibWluaDI2NzE5OTkiLCJhIjoiY2wyYWNkZWFsMDQwZDNibnpubGo5dDlsNiJ9.wcpp7JlE8d6Ck3Z5CSWNTw`)
        
        if(existed){
          await Models.Distance.query().update({address: address, distance: distance.data['routes'][0]['distance']}).where('userId', userId).where('storeName', stores[i].storeName);
        } else {
          var obj = {
            'storeName': stores[i].storeName,
            'address': address,
            'userId': userId,
            'distance': distance.data['routes'][0]['distance']
          }
          await Models.Distance.query().insert(obj).returning('*');
        }
        
      }
      
    // })
    ///////////////////////////////////////////////////////////////////

    return "successful"
  }


  async getSuggestion(payload){

    const {userId, lop} = payload
    const listofStore = await Models.Store.query();
    console.log("LOS", listofStore)
    if(listofStore.length === 0){
      throw Boom.badData(`ListofStore Not Found Error!`)
    }
    
    const arrPQ = []
    var proQ  = lop.split(",");
    for(var i = 0; i < proQ.length; i++){
      var temp = proQ[i].split("-");
      arrPQ.push({'pId': parseInt(temp[0]), 'quantity': parseInt(temp[1])});
    }
    var flag1 = true
    var memoryShell = [];
    var productMatch = {};
    var shortageShell = [];
    var suggestion = []

    for(var j = 0;j < listofStore.length; j++){
      var productInStore = await Models.Ownership.query().where('storeName', listofStore[j]['storeName'])
      memoryShell.push({'storeName': listofStore[j]['storeName']})
      
      productMatch = {};
      // shortageShell = [];
      for(var x = 0; x < arrPQ.length; x++){
        for(var y = 0; y < productInStore.length; y++){
          if(arrPQ[x]['pId'] === productInStore[y].pId){
            productMatch[arrPQ[x]['pId']] = productInStore[y].quantity
            // productMatch.push({'pId': arrPQ[x]['pId'], 'currentQ': productInStore[y].quantity}); //Luu thong tin cac product matching cua moi store
            if(arrPQ[x]['quantity'] > productInStore[y].quantity){ //quantity yeu cau > quantity co thi store do ko dap ung duoc
              flag1 = false; // Store ko dap ung dc don
              var product = await Models.Product.query().findOne({id: arrPQ[x]['pId']})
	            product['quantity'] = productInStore[y].quantity
              shortageShell.push({'pId': arrPQ[x]['pId'], 'product': product})
            } else {
              var product = await Models.Product.query().findOne({id: arrPQ[x]['pId']})
	            product['quantity'] = arrPQ[x]['quantity']
              shortageShell.push({'pId': arrPQ[x]['pId'], 'product': product})
            }
          }
        }
      }
      // console.log(productMatch)
      // Neu ma co store du thi return de tao 1 Order
      if(flag1 === true){
        // await Models.Order.query().update({atStore: listofStore[j]['storeName']} ).where('id', orderId);
        console.log(listofStore[j]['storeName']);
        return [listofStore[j]['storeName']]
      } else {
        memoryShell[j]['products'] = productMatch;
        var tempObj = {
          'storeName': listofStore[j]['storeName'],
          'suggestionList': shortageShell
        }
        suggestion.push(tempObj);
        shortageShell = []
        flag1 = true;
      }
    } // end checking 1 for each store and take the value of matching product in each store
    
    // Chia nho Order hoac la tao goi y tai tung store
    
    // memoryShell chua thong tin hang tai tung store 
    // shortageShell chua so luong thieu neu ko co store nao dap du
    
    var returnObj = 
      [
        suggestion,
        []
      ] 
    
    return returnObj;
    //   if(flagForOneStoreEnough) {
    //     for(var n = 0; n < shortageShell.length; n++){

    //       for(var z = 1; z < memoryShell.length; z++){
    //         if(shortageShell[n]['lostQ'] > 0 && memoryShell[z]['products'][shortageShell[n]['pId']] >= shortageShell[n]['lostQ']){
    //           if(candidates[memoryShell[z]['storeName']] !== undefined){
    //             candidates[memoryShell[z]['storeName']] += shortageShell[n]['pId'].toString() + "-" +  shortageShell[n]['lostQ'].toString() + ",";
    //             shortageShell[n]['lostQ'] = shortageShell[n]['lostQ']  - memoryShell[z]['products'][shortageShell[n]['pId']];
    //             flag2 = false;
    //           } else {
    //             candidates[memoryShell[z]['storeName']] = shortageShell[n]['pId'].toString() + "-" +  shortageShell[n]['lostQ'].toString() + ",";
    //             shortageShell[n]['lostQ'] = shortageShell[n]['lostQ']  - memoryShell[z]['products'][shortageShell[n]['pId']];
    //             flag2 = false;
    //           }
    //         }
    //       }

    //       if(flag2){
    //         for(var z = 1; z < memoryShell.length; z++){
    //           if(shortageShell[n]['lostQ'] > 0 && shortageShell[n]['lostQ'] >= memoryShell[z]['products'][shortageShell[n]['pId']]){
    //             if(candidates[memoryShell[z]['storeName']] !== undefined){
    //               candidates[memoryShell[z]['storeName']] += shortageShell[n]['pId'].toString() + "-" +  memoryShell[z]['products'][shortageShell[n]['pId']].toString() + ",";
    //               shortageShell[n]['lostQ'] = shortageShell[n]['lostQ'] - memoryShell[z]['products'][shortageShell[n]['pId']];
    //               flag2 = false;
    //             } else {
    //               candidates[memoryShell[z]['storeName']] = shortageShell[n]['pId'].toString() + "-" +  memoryShell[z]['products'][shortageShell[n]['pId']].toString() + ",";
    //               shortageShell[n]['lostQ'] = shortageShell[n]['lostQ']  - memoryShell[z]['products'][shortageShell[n]['pId']];
    //               flag2 = false;
    //             }
    //           } else {
    //             if(candidates[memoryShell[z]['storeName']] !== undefined){
    //               candidates[memoryShell[z]['storeName']] += shortageShell[n]['pId'].toString() + "-" +  shortageShell[n]['lostQ'].toString() + ",";
    //               shortageShell[n]['lostQ'] = shortageShell[n]['lostQ'] - memoryShell[z]['products'][shortageShell[n]['pId']];
    //               flag2 = false;
    //             } else {
    //               candidates[memoryShell[z]['storeName']] = shortageShell[n]['pId'].toString() + "-" +  shortageShell[n]['lostQ'].toString() + ",";
    //               shortageShell[n]['lostQ'] = shortageShell[n]['lostQ']  - memoryShell[z]['products'][shortageShell[n]['pId']];
    //               flag2 = false;
    //             }
    //           }
    //         }
    //       } else {
    //         flag2 = true;
    //       }
    //     }

    //     console.log("Finally We have a list of candidates like this one: ",candidates);
    //     let obj = Object.keys(candidates);
    //     for(var m = 0; m < obj.length; m++){
    //       let object = {
    //         fcn: "createExchange",
    //         peers:["peer0.org1.example.com","peer0.org2.example.com"],
    //         chaincodeName:"productdetail",
    //         channelName:"mychannel",
    //         args:[listofStore[0]['storeName'], obj[m], candidates[obj[m]].slice(0, -1)]
    //       }
    //       console.log(object)
    //       let res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
    //       console.log(res.data);
    //     }
    //   }
      
    // }
  }

  async getParseOrder(payload){
  
      const {userId, lop, lat, lng} = payload

      let distance = 0
      let subString = ""
      var listofStore = []
      const stores = await Models.Store.query();
     
      for(var i = 0; i < stores.length; i++){
        // var existed = await Models.Distance.query().findOne({userId: userId}).where('storeName',stores[i].storeName)
        subString = stores[i]['lng'] + "," + stores[i]['lat'] + ";" + lng + "," + lat;
        // console.log(subString)
        distance = await Axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${subString}?access_token=pk.eyJ1IjoibWluaDI2NzE5OTkiLCJhIjoiY2wyYWNkZWFsMDQwZDNibnpubGo5dDlsNiJ9.wcpp7JlE8d6Ck3Z5CSWNTw`)
        stores[i]['distance'] = distance.data['routes'][0]['distance'];
        listofStore.push(stores[i])
        // if(existed){
        //   await Models.Distance.query().update({address: address, distance: distance.data['routes'][0]['distance']}).where('userId', userId).where('storeName', stores[i].storeName);
        // } else {
        //   var obj = {
        //     'storeName': stores[i].storeName,
        //     'address': address,
        //     'userId': userId,
        //     'distance': distance.data['routes'][0]['distance']
        //   }
        //   await Models.Distance.query().insert(obj).returning('*');
        // }
      }
      // const listofStore = await Models.Distance.query().where('userId', userId);
      // console.log("LOS", listofStore)
      if(listofStore.length === 0){
        throw Boom.badData(`ListofStore Not Found Error!`)
      }
      listofStore.sort(function(a,b){
        return a['distance'] - b['distance']
      })
      // console.log("LOS after Sort", listofStore)
      const arrPQ = []
      var proQ  = lop.split(",");
      for(var i = 0; i < proQ.length; i++){
        var temp = proQ[i].split("-");
        arrPQ.push({'pId': parseInt(temp[0]), 'quantity': parseInt(temp[1])});
      }
      // var flag1 = true
      var memoryShell = [];
      var productMatch = {};
      // var shortageShell = [];
      // var suggestion = []
  
      for(var j = 0;j < listofStore.length; j++){
        var productInStore = await Models.Ownership.query().where('storeName', listofStore[j]['storeName'])
        memoryShell.push({'storeName': listofStore[j]['storeName']})
        
        productMatch = {};
        // shortageShell = [];
        for(var x = 0; x < arrPQ.length; x++){
          for(var y = 0; y < productInStore.length; y++){
            if(arrPQ[x]['pId'] === productInStore[y].pId){
              productMatch[arrPQ[x]['pId']] = productInStore[y].quantity
              // productMatch.push({'pId': arrPQ[x]['pId'], 'currentQ': productInStore[y].quantity}); //Luu thong tin cac product matching cua moi store
              // if(arrPQ[x]['quantity'] > productInStore[y].quantity){ //quantity yeu cau > quantity co thi store do ko dap ung duoc
              //   // flag1 = false; // Store ko dap ung dc don
              //   var product = await Models.Product.query().findOne({id: arrPQ[x]['pId']})
              //   product['quantity'] = productInStore[y].quantity
              //   shortageShell.push({'pId': arrPQ[x]['pId'], 'product': product})
              // } else {
              //   var product = await Models.Product.query().findOne({id: arrPQ[x]['pId']})
              //   product['quantity'] = arrPQ[x]['quantity']
              //   shortageShell.push({'pId': arrPQ[x]['pId'], 'product': product})
              // }
            }
          }
        }
        // console.log(productMatch)
        // Neu ma co store du thi return de tao 1 Order
        // if(flag1 === true){
        //   // await Models.Order.query().update({atStore: listofStore[j]['storeName']} ).where('id', orderId);
        //   // console.log(listofStore[j]['storeName']);
        //   return [listofStore[j]['storeName']]
        // } else {
        memoryShell[j]['products'] = productMatch;
        // var tempObj = {
        //   'storeName': listofStore[j]['storeName'],
        //   'suggestionList': shortageShell
        // }
        // suggestion.push(tempObj);
        // shortageShell = []
        // flag1 = true;
        // }
      } // end checking 1 for each store and take the value of matching product in each store
      
      // Chia nho Order hoac la tao goi y tai tung store
      
      // memoryShell chua thong tin hang tai tung store 
      // shortageShell chua so luong thieu neu ko co store nao dap du
  
      // if(strongestFlag){
      //   console.log('memoryShell',memoryShell);
  
      //   await Models.Order.query().update({atStore: listofStore[0]['storeName']} ).where('id', orderId);
      //   var candidates = {};
      //   var flagForOneStoreEnough = true;
      //   var flag2 = true;
  
      // console.log('memoryShell',memoryShell);
      // console.log('arrPQ',arrPQ);
      // console.log('arrPQ',arrPQ[0]);
      var orderOfStore = []
      for(var n = 0; n < memoryShell.length; n++){
        var inOneStore = {
          'storeName': memoryShell[n].storeName,
          'products': []
        }
        for(var m = 0; m < arrPQ.length; m++){
          if(arrPQ[m].quantity > 0 && arrPQ[m].quantity > memoryShell[n]['products'][arrPQ[m].pId]){
            var product = await Models.Product.query().findOne({id: arrPQ[m].pId})
            product['quantity'] = memoryShell[n]['products'][arrPQ[m].pId.toString()]
            inOneStore['products'].push({'pId': arrPQ[m].pId, 'product': product})
      
            arrPQ[m].quantity = arrPQ[m].quantity  - memoryShell[n]['products'][arrPQ[m].pId.toString()];
          } else {
            if(arrPQ[m].quantity > 0){
              var product = await Models.Product.query().findOne({id: arrPQ[m].pId})
              product['quantity'] = arrPQ[m].quantity
              inOneStore['products'].push({'pId': arrPQ[m].pId, 'product': product})
              arrPQ[m].quantity = 0;
            }  
          }
        }
        orderOfStore.push(inOneStore);
      }
      // console.log(orderOfStore)
      const finalReturn = orderOfStore.filter(order => order['products'].length>0);
      console.log(finalReturn.length)
      return finalReturn.length
  }

  async loadProductDetailinExchange(str){
    var return_list = {}
    var shell = [];
    var listofProduct = str.split(",");
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
    return return_list;
  }


  async initProductDetails(){
    const products = await Models.Product.query().eager('[ownership]');
    console.log(products.length)
    for( var i = 0; i < products.length; i++){
      console.log(products[i].ownership.length)
      var str = "";
      for(var j = 0; j < products[i].ownership.length; j++){
        str += products[i].ownership[j].storeName + "-" + products[i].ownership[j].quantity.toString() + ",";
      }
      let object = {
        fcn: "initProductDetail",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[products[i].id.toString(), products[i].nameProduct, str.slice(0, -1)]
      }
      console.log(object)
      let res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
      if(!res){
        return `This ${products[i].nameProduct} is failed!`
      } 
    }
    return `successful`
  }

}

module.exports = ExchangeService;
