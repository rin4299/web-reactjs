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
        for(var i = 0; i < multiRequest.length; i++){
            var product = await Models.Product.query().findOne('nameProduct', multiRequest[i]['pName']);
            var ownership = await Models.Ownership.query().findOne({pId: product.id}).where("storeName", recUserName);
            if(multiRequest[i]['quantity'] > ownership.quantity){
              throw Boom.badRequest(`Cannot create this Request because store ${recUserName} only has ${ownership.quantity} while ${multiRequest[i]['quantity']} is needed!`)
            }
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
      args:[id, "isAccepted"]
    }
    var res = await await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
    if(res.data){
      return "Updated!"
    } else {
      throw Boom.badRequest('Failed to update!');
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
      //Check xem Address co hop le ko 
      // if(!res || err){
      //   const oS = new OrderService();
      //   const successfulMessage = await oS.deleteOrder(orderId);
      //   console.log(successfulMessage);
      //   throw Boom.badData(`Your current address ${address} is not available. Please try again with the available address!`)
      // }
      var lat = res[0]['latitude']
      var lng = res[0]['longitude']
      var listofStore = []
      var strongestFlag = true;
      // console.log("1111111111111")
      const stores = await Models.Store.query();
      // console.log(stores);
      for(var i = 0; i < stores.length; i++){
        listofStore.push({'distance': disCalculate(stores[i]['lat'],stores[i]['lng'],lat,lng),'storeName': stores[i]['storeName']})
      }
      listofStore.sort((a,b) => (a.distance > b.distance) ? 1 : (b.distance > a.distance) ? -1 : 0);
      console.log(listofStore)
      const arrPQ = []
      var proQ  = lop.split(",");
      for(var i = 0; i < proQ.length; i++){
        var temp = proQ[i].split("-");
        arrPQ.push({'pId': parseInt(temp[0]), 'quantity': parseInt(temp[1])});
      }
      var flag1 = true
      var memoryShell = [];
      
      // console.log("ARRPQ", arrPQ)

      // var firstStore = await Models.Ownership.query().where('storeName', listofStore[0]['storeName']);
      // for(var p = 0; p < arrPQ.length; p++){
      //   for(var q = 0; q < productInStore.length; q++){
      //     if(arrPQ[p]['pId'] === productInStore[q].pId){
      //       productMatch.push({'pId': arrPQ[p]['pId'], 'currentQ': productInStore[q].quantity}); //Luu thong tin cac product matching cua moi store
      //       if(arrPQ[p]['quantity'] > productInStore[q].quantity){ //quantity yeu cau > quantity co thi store do ko dap ung duoc
      //         flag1 = false;
      //         shortageShell.push({'pId': arrPQ[p]['pId'], 'lostQ': arrPQ[p]['quantity'] - productInStore[q].quantity})
      //         console.log("3333333333333", shortageShell)
      //       } 
      //     }
      //   }
      // }
      var productMatch = {};
      var shortageShell = [];
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
                flag1 = false;
                if(listofStore[j]['storeName'] === listofStore[0]['storeName']){
                  shortageShell.push({'pId': arrPQ[x]['pId'], 'lostQ': arrPQ[x]['quantity'] - productInStore[y].quantity})
                  // shortageShell[arrPQ[x]['pId']] = arrPQ[x]['quantity'] - productInStore[y].quantity
                }
                // console.log("3333333333333", shortageShell)
              } 
            }
          }
        }
        // console.log(productMatch)
        if(flag1 === true){
          await Models.Order.query().update({atStore: listofStore[j]['storeName']} ).where('id', orderId);
          // console.log(listofStore[j]['storeName']);
          strongestFlag = false;
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
      // memoryShell chua thong tin hang tai tung store 
      // shortageShell chua so luong thieu neu ko co store nao dap du
      if(strongestFlag){
        console.log('sShell',shortageShell);
        console.log('memoryShell',memoryShell);

        await Models.Order.query().update({atStore: listofStore[0]['storeName']} ).where('id', orderId);
        var candidates = {};
        var flagForOneStoreEnough = true;
        var flag2 = true;
        for(var n = 1; n < memoryShell.length; n++){
          var checker = true;
          var inputSTRForOneStoreEnough = ""
          for(var z = 0; z < shortageShell.length; z++){
            if(memoryShell[n]['products'][shortageShell[z]['pId']] < shortageShell[z]['lostQ']){
              checker =  false;
            } else {
              inputSTRForOneStoreEnough += shortageShell[z]['pId'] + "-" + shortageShell[z]['lostQ'] + ",";
            }
          }
          if(checker){
            console.log(`One Store ${memoryShell[n]['storeName']} is enough with String: ${inputSTRForOneStoreEnough}`);
            flagForOneStoreEnough = false;
            // let object = {
            //     fcn: "createExchange",
            //     peers:["peer0.org1.example.com","peer0.org2.example.com"],
            //     chaincodeName:"productdetail",
            //     channelName:"mychannel",
            //     args:[listofStore[0]['storeName'], memoryShell[n]['storeName], inputSTRForOneStoreEnough.slice(0, -1)]
            //   }
            //   console.log(object)
            //   let res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
            // console.log(res.data);
          }
        }
        if(flagForOneStoreEnough) {
          for(var n = 0; n < shortageShell.length; n++){

            for(var z = 1; z < memoryShell.length; z++){
              if(shortageShell[n]['lostQ'] > 0 && memoryShell[z]['products'][shortageShell[n]['pId']] >= shortageShell[n]['lostQ']){
                if(candidates[memoryShell[z]['storeName']] !== undefined){
                  candidates[memoryShell[z]['storeName']] += shortageShell[n]['pId'].toString() + "-" +  shortageShell[n]['lostQ'].toString() + ",";
                  shortageShell[n]['lostQ'] = shortageShell[n]['lostQ']  - memoryShell[z]['products'][shortageShell[n]['pId']];
                  flag2 = false;
                } else {
                  candidates[memoryShell[z]['storeName']] = shortageShell[n]['pId'].toString() + "-" +  shortageShell[n]['lostQ'].toString() + ",";
                  shortageShell[n]['lostQ'] = shortageShell[n]['lostQ']  - memoryShell[z]['products'][shortageShell[n]['pId']];
                  flag2 = false;
                }
              }
            }
  
            if(flag2){
              for(var z = 1; z < memoryShell.length; z++){
                if(shortageShell[n]['lostQ'] > 0 && shortageShell[n]['lostQ'] >= memoryShell[z]['products'][shortageShell[n]['pId']]){
                  if(candidates[memoryShell[z]['storeName']] !== undefined){
                    candidates[memoryShell[z]['storeName']] += shortageShell[n]['pId'].toString() + "-" +  memoryShell[z]['products'][shortageShell[n]['pId']].toString() + ",";
                    shortageShell[n]['lostQ'] = shortageShell[n]['lostQ'] - memoryShell[z]['products'][shortageShell[n]['pId']];
                    flag2 = false;
                  } else {
                    candidates[memoryShell[z]['storeName']] = shortageShell[n]['pId'].toString() + "-" +  memoryShell[z]['products'][shortageShell[n]['pId']].toString() + ",";
                    shortageShell[n]['lostQ'] = shortageShell[n]['lostQ']  - memoryShell[z]['products'][shortageShell[n]['pId']];
                    flag2 = false;
                  }
                } else {
                  if(candidates[memoryShell[z]['storeName']] !== undefined){
                    candidates[memoryShell[z]['storeName']] += shortageShell[n]['pId'].toString() + "-" +  shortageShell[n]['lostQ'].toString() + ",";
                    shortageShell[n]['lostQ'] = shortageShell[n]['lostQ'] - memoryShell[z]['products'][shortageShell[n]['pId']];
                    flag2 = false;
                  } else {
                    candidates[memoryShell[z]['storeName']] = shortageShell[n]['pId'].toString() + "-" +  shortageShell[n]['lostQ'].toString() + ",";
                    shortageShell[n]['lostQ'] = shortageShell[n]['lostQ']  - memoryShell[z]['products'][shortageShell[n]['pId']];
                    flag2 = false;
                  }
                }
              }
            } else {
              flag2 = true;
            }
          }

          console.log("Finally We have a list of candidates like this one: ",candidates);
          let obj = Object.keys(candidates);
          // for(var m = 0; m < obj.length; m++){
          //   let object = {
          //     fcn: "createExchange",
          //     peers:["peer0.org1.example.com","peer0.org2.example.com"],
          //     chaincodeName:"productdetail",
          //     channelName:"mychannel",
          //     args:[listofStore[0]['storeName'], obj[m], candidates[obj[m]].slice(0, -1)]
          //   }
          //   console.log(object)
          //   let res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
          //   console.log(res.data);
          // }
        }

        
        

        // candidates[memoryShell[z]['storeName']] = "";
         
        //     for(var o = 0; o < memoryShell[z]['products'].length; o++){
        //       if(shortageShell[memoryShell[z]['products'][o]['pId']] !== undefined && shortageShell[memoryShell[z]['products'][o]['pId']] > 0 && shortageShell[memoryShell[z]['products'][o]['pId']] <= memoryShell[z]['products'][o]['currentQ']){
        //         candidates[memoryShell[z]['storeName']] += memoryShell[z]['products'][o]['pId'].toString() + "-" + shortageShell[memoryShell[z]['products'][o]['pId']].toString() + ",";
        //         shortageShell[memoryShell[z]['products'][o]['pId']] = shortageShell[memoryShell[z]['products'][o]['pId']] - memoryShell[z]['products'][o]['currentQ'];
        //         flag2 = false;
        //       }
        //     }
  
        //     // if(flag2){
        //     //   for(var o = 0; o < memoryShell[z]['products'].length; o++){
        //     //     if(shortageShell[memoryShell[z]['products'][o]['pId']] !== undefined){
        //     //       shortageShell[memoryShell[z]['products'][o]['pId']] = shortageShell[memoryShell[z]['products'][o]['pId']]  - memoryShell[z]['products'][o]['currentQ']
        //     //       candidates[memoryShell[z]['storeName']] += memoryShell[z]['products'][o]['pId'].toString() + "-" + memoryShell[z]['products'][o]['currentQ'].toString() + ",";
        //     //     }
        //     //   }
        //     // } else{
        //     //   flag2 = true;
        //     // }


        
      }
      
    })
    return "successful"
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
