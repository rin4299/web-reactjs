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
    console.log("PAYLOAD", payload)
    
    const {fullName, address, note, phone, shippingTotal, itemAmount, promoTotal, totalAmount, orderBill, atStore, lop, lng, lat, isPaymentOnline} = payload
    const user = await Models.User.query().findOne('name', fullName);
    const userId = user.id; 
    const arrPQ = []
    var totalQuantity = 0
    var proQ  = lop.split(",");
      for(var i = 0; i < proQ.length; i++){
        var temp = proQ[i].split("-");
        arrPQ.push({'pId': parseInt(temp[0]), 'quantity': parseInt(temp[1])});
        totalQuantity = totalQuantity + parseInt(temp[1])
      }
    if(atStore === "All"){
      const stores = await Models.Store.query();
      // const listofStore = await Models.Distance.query().where('userId', userId);
      var listofStore = []
      
      let subString = ""
      for(var i = 0; i < stores.length; i++){
        subString = stores[i]['lng'] + "," + stores[i]['lat'] + ";" + lng + "," + lat;
        var distance = await Axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${subString}?access_token=pk.eyJ1IjoibWluaDI2NzE5OTkiLCJhIjoiY2wyYWNkZWFsMDQwZDNibnpubGo5dDlsNiJ9.wcpp7JlE8d6Ck3Z5CSWNTw`)
        stores[i]['distance'] = distance.data['routes'][0]['distance'];
        listofStore.push(stores[i])
      }
      console.log("LOS", listofStore)
      if(listofStore.length === 0){
        throw Boom.badData(`ListofStore Not Found Error!`)
      }
      listofStore.sort(function(a,b){
        return a['distance'] - b['distance']
      })
      console.log("LOS after Sort", listofStore)
      
      var tempPrice = 0;
      var tempQuantity = 0;
      var orderOfStore = []
      var returnOrderList = []
      for(var j = 0;j < listofStore.length; j++){
        var productInStore = await Models.Ownership.query().where('storeName', listofStore[j]['storeName'])
        tempPrice = 0;
        tempQuantity = 0;
        var inOneStore = {
          'storeName': listofStore[j].storeName,
          'products': []
        }
        for(var x = 0; x < arrPQ.length; x++){
          for(var y = 0; y < productInStore.length; y++){
            if(arrPQ[x]['pId'] === productInStore[y].pId){
              if(arrPQ[x].quantity > 0 && arrPQ[x].quantity > productInStore[y].quantity){
                var product = await Models.Product.query().findOne({id: arrPQ[x].pId})
                // Update Number Available
                await Models.Product.query().update({numberAvailable: product.numberAvailable - productInStore[y].quantity}).where('id', productInStore[y].pId);
                if(product.numberAvailable < arrPQ[x].quantity){
                  throw Boom.badData(`Cannot create the Order because the value of quantity of product is updated!`)
                }
                product['quantity'] = productInStore[y].quantity
                tempQuantity += productInStore[y].quantity
                tempPrice += productInStore[y].quantity * product.price;
                inOneStore['products'].push(product)
                // Update arrPQ
                arrPQ[x].quantity = arrPQ[x].quantity  - productInStore[y].quantity;
              } else {
                if(arrPQ[x].quantity > 0){
                  var product = await Models.Product.query().findOne({id: arrPQ[x].pId})
                  await Models.Product.query().update({numberAvailable: product.numberAvailable - arrPQ[x].quantity}).where('id', productInStore[y].pId);
                  if(product.numberAvailable < arrPQ[x].quantity){
                    throw Boom.badData(`Cannot create the Order because the value of quantity of product is updated!`)
                  }
                  product['quantity'] = arrPQ[x].quantity
                  tempQuantity += arrPQ[x].quantity
                  tempPrice += arrPQ[x].quantity * product.price;
                  inOneStore['products'].push(product)
                  arrPQ[x].quantity = 0;
                }  
              }
            }

          }
        }
        inOneStore['itemAmount'] = tempPrice;
        inOneStore['totalQuantity'] = tempQuantity;
        orderOfStore.push(inOneStore);
      }
      var newShippingTotal = shippingTotal;
      var newPromoTotal = promoTotal;
      var newTotalAmount = 0;
      var buffer = "";
      console.log(orderOfStore);
      for(var m = 0; m < orderOfStore.length; m++){
        // Create Order for one Store
        if(orderOfStore[m].itemAmount > 0){
          newTotalAmount = newShippingTotal + orderOfStore[m].itemAmount + newPromoTotal;
          let object = {
            fcn: "createOrder",
            peers:["peer0.org1.example.com","peer0.org2.example.com"],
            chaincodeName:"productdetail",
            channelName:"mychannel",
            args:[fullName, address, note.toString(), phone, orderOfStore[m].storeName, newShippingTotal.toString(), orderOfStore[m].itemAmount.toString(), newPromoTotal.toString(), newTotalAmount.toString(), userId.toString(), lng.toString(), lat.toString(), orderOfStore[m].totalQuantity.toString(), isPaymentOnline.toString()]
          }
          console.log(object.args);
          const res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
          if(!res){
            throw Boom.badRequest('Error')
          }
          var data = res.data.result.data;
          var listofP = Buffer.from(JSON.parse(JSON.stringify(data))).toString();
          var result = JSON.parse(listofP)
          returnOrderList.push(result)
          console.log("CREATE ORDER RESULT: ", result);
          for( var n = 0; n < orderOfStore[m].products.length; n++){
            var ProductInStore = await Models.Ownership.query().findOne({pId: orderOfStore[m].products[n].id}).where("storeName", orderOfStore[m].storeName);
            // Create OrderDetail for one kind of Product in a Store Order
            var payload = {
              'orderId': parseInt(result.id),
              'quantity': orderOfStore[m].products[n].quantity,
              'price': orderOfStore[m].products[n].price,
              'productId': orderOfStore[m].products[n].id,
              'nameProduct': orderOfStore[m].products[n].nameProduct
            }
            buffer += orderOfStore[m].products[n].id + "-" + orderOfStore[m].products[n].quantity + ",";
            await Models.OrderDetail.query().insert(payload);
            await Models.Ownership.query().update({quantity: ProductInStore.quantity - orderOfStore[m].products[n].quantity} ).where('pId', orderOfStore[m].products[n].id).where("storeName", orderOfStore[m].storeName);
          }
          // Blockchain Update Preparing Product
          buffer = buffer.slice(0, -1);
          let object_Preparing = {
            fcn: "preparingProducts",
            peers:["peer0.org1.example.com","peer0.org2.example.com"],
            chaincodeName:"productdetail",
            channelName:"mychannel",
            args:[buffer, orderOfStore[m].storeName, "true"]
          }
          const res_Preparing_Product = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object_Preparing);
          console.log("Res of Preparing Products: ",result)
          if(res_Preparing_Product){
            var stringBuffer = res_Preparing_Product.data.result.data;
            var pdinOrder = Buffer.from(JSON.parse(JSON.stringify(stringBuffer))).toString();
            console.log("FinalString in Preparing",pdinOrder);
            var payload = {
              "orderId": parseInt(result.id),
              "listPds": pdinOrder
            }
            var result_PD = await Models.ProductDetails.query().insert(payload).returning('*');
            if(!result_PD){
              throw Boom.badRequest("Can not create Product Details in Order");
            }
          }
          // reset Buffer to empty string
          buffer = "";
        }
        
      }
      return returnOrderList; // return list of new Orders which have been created!
    } else {
      let object = {
        fcn: "createOrder",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[fullName, address, note.toString(), phone, atStore, shippingTotal.toString(), itemAmount.toString(), promoTotal.toString(), totalAmount.toString(), userId.toString(), lng.toString(), lat.toString(), totalQuantity.toString(), isPaymentOnline.toString()]
      }
      const res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
      if(!res){
        throw Boom.badRequest('Error')
      }
      var data = res.data.result.data;
      var listofP = Buffer.from(JSON.parse(JSON.stringify(data))).toString();
      var result = JSON.parse(listofP)
      var buffer = "";
      console.log("CREATE ORDER RESULT: ", result);
      for(var i = 0; i < arrPQ.length; i++){
        var product = await Models.Product.query().findOne({id: arrPQ[i].pId})
        console.log(product)
        if(product.numberAvailable < arrPQ){
          throw Boom.badData(`Cannot create the Order because the value of quantity of product is updated!`)
        }
        await Models.Product.query().update({numberAvailable: product.numberAvailable - arrPQ[i].quantity}).where('id', arrPQ[i].pId);
        var ProductInStore = await Models.Ownership.query().findOne({pId: product.id}).where("storeName", atStore);
        var payload = {
          'orderId': parseInt(result.id),
          'quantity': arrPQ[i].quantity,
          'price': product.price,
          'productId': product.id,
          'nameProduct': product.nameProduct
        }
        buffer += product.id + "-" + arrPQ[i].quantity + ","
        await Models.OrderDetail.query().insert(payload);
        // console.log(ProductInStore, arrPQ[i])
        await Models.Ownership.query().update({quantity: ProductInStore.quantity - arrPQ[i].quantity} ).where('pId', product.id).where("storeName", atStore);
      }
      buffer = buffer.slice(0, -1);
      let object_Preparing_for_one_Order = {
        fcn: "preparingProducts",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[buffer, atStore, "true"]
      }
      const res_Preparing_Product = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object_Preparing_for_one_Order);
      console.log("Res of Preparing Products for One: ",res_Preparing_Product.data)
      if(res_Preparing_Product){
        var stringBuffer = res_Preparing_Product.data.result.data;
        var pdinOrder = Buffer.from(JSON.parse(JSON.stringify(stringBuffer))).toString();
        console.log("FinalString in Preparing for One",pdinOrder);
        var payload = {
          "orderId": parseInt(result.id),
          "listPds": pdinOrder
        }
        const result = await Models.ProductDetails.query().insert(payload).returning('*');
        if(!result){
          throw Boom.badRequest("Can not create Product Details in Order");
        }
      }
      // reset Buffer to empty string
      buffer = "";

      
      return [result];
    }
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
    let res = await Axios.get("http://localhost:4000/channels/mychannel/chaincodes/productdetail?args=['1']&peer=peer0.org1.example.com&fcn=queryAllOrders");
    var recMessage = res.data
    var returnArr = []
    for(var i =0 ; i < recMessage.length; i++){
      if(recMessage[i].atStore === user && recMessage[i].isActive){
        var orderDetail = await Models.OrderDetail.query().where('orderId', parseInt(recMessage[i].id));
        recMessage[i]['shippingTotal'] = parseFloat(recMessage[i]['shippingTotal'])
        recMessage[i]['itemAmount'] = parseFloat(recMessage[i]['itemAmount'])
        recMessage[i]['promoTotal'] = parseFloat(recMessage[i]['promoTotal'])
        recMessage[i]['totalAmount'] = parseFloat(recMessage[i]['totalAmount'])
        var date = new Date(recMessage[i]['createdAt'].slice(8,18)*1000)
        recMessage[i]['createdAt'] = date
        recMessage[i]['orderDetail'] = orderDetail;
        returnArr.push(recMessage[i]);
      }
    }
    const builder = {
      "results": returnArr,
      "quantity": returnArr.length
    }
    return builder;
  }

  async getOne(id) {
    let object = {
      fcn: "queryOrder",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id.toString()]
    }
    const res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
    if(!res){
      throw Boom.badRequest('Error')
    }
    var data = res.data.result.data;
    var listofP = Buffer.from(JSON.parse(JSON.stringify(data))).toString();
    var result = JSON.parse(listofP)
    console.log("CREATE ORDER RESULT: ", result);
    return result;
  }

  async updateOne(id, payload) {
    
    console.log("PAYLOAD", payload)
    var keys = Object.keys(payload)
    // for(var z = 0; z < keys.length; z++){
    //   if(!payload[keys[z]]){
    //     payload[keys[z]] = ""
    //   }
    // }
    console.log(payload)
    const {fullName, note, phone, address, shippingTotal, itemAmount, promoTotal, totalAmount, isPaid, isPaymentOnline} = payload
    // var address = ""
    let object = {
      fcn: "changeOrderInfor",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id.toString(), "Modify" ,fullName, address, note.toString(), phone, shippingTotal.toString(), itemAmount.toString(), promoTotal.toString(), totalAmount.toString(), isPaid.toString(), isPaymentOnline.toString()]
    }
    const res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
    if(!res){
      throw Boom.badRequest('Error')
    }
    var data = res.data.result.data;
    var listofP = Buffer.from(JSON.parse(JSON.stringify(data))).toString();
    var result = JSON.parse(listofP)
    console.log("CREATE ORDER RESULT: ", result);
    return result;
  }


  async changeStatus(payload) {
    const {orderId, status, atStore, fullName} = payload;
    console.log(orderId, status, atStore, fullName)
    let objectO = {
      fcn: "queryOrder",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[orderId.toString()]
    }
    const res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", objectO);
    if(!res){
      throw Boom.badRequest('Error in BC!')
    }
    var data = res.data.result.data;
    var listofP = Buffer.from(JSON.parse(JSON.stringify(data))).toString();
    var order = JSON.parse(listofP)
    console.log("ORDER FROM BC: ", order)
    
    if (status === "Shipping"){ // SHIPPING
      if(order.status === "Complete" || order.status === "Canceled" || order.status !== "Processing"){
        throw Boom.badRequest(`Can not change the ${order.status} order!`)
      }
      // Blockchain Update
      // const lopd = await Models.OrderDetail.query().where("orderId", orderId);
      // var buffer = "";
      // console.log(lopd)
      // for(var p = 0; p < lopd.length; p++){
      //   buffer += lopd[p].productId + "-" + lopd[p].quantity + ",";
      // }
      // buffer = buffer.slice(0,-1);
      // console.log(buffer)
      // let object = {
      //   fcn: "preparingProducts",
      //   peers:["peer0.org1.example.com","peer0.org2.example.com"],
      //   chaincodeName:"productdetail",
      //   channelName:"mychannel",
      //   args:[buffer, atStore, "true"]
      // }
      // const res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
      // console.log(res.data)
      // if(res){
      //   var stringBuffer = res.data.result.data;
      //   var pdinOrder = Buffer.from(JSON.parse(JSON.stringify(stringBuffer))).toString();
      //   console.log("FinalString",pdinOrder);
      //   var payload = {
      //     "orderId": orderId,
      //     "listPds": pdinOrder
      //   }
      //   const result = await Models.ProductDetails.query().insert(payload).returning('*');
      //   if(!result){
      //     throw Boom.badRequest("Can not create Product Details in Order");
      //   }

      // }
      // 1 đơn chuyển từ Confirm -> Shipping thì ko cập nhật gì thêm trừ Status
      // await Models.Order.query().update({status: status} ).where('id', orderId);
      let objectShipping = {
        fcn: "changeOrderInfor",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[orderId.toString(), "Status", status]
      }
      await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", objectShipping);
      return `Successfully change the status of Order ${orderId} from ${order.status} to ${status}!`
    } else if (status === "Complete"){ // COMPLETE
      // 1 đơn chỉ được chuyển qua Complete khi status khác Shipping
      if(order.status === "Canceled" || order.status !== "Shipping"){
        throw Boom.badRequest(`Can not change the ${order.status} order!`)
      }
      // Blockchain Update
      
      var buffer = await Models.ProductDetails.query().findOne("orderId", orderId);
      console.log(buffer)
      let object = {
        fcn: "sellingProducts",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[buffer.listPds, fullName]
      }
      const res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
      console.log(res.data)
      if(!res){
        throw Boom.badRequest("Can not selling Product Details in Order in BC");
      }
      // await Models.Order.query().update({status: status} ).where('id', orderId);
      let objectChangeStatus = {
        fcn: "changeOrderInfor",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[orderId.toString(), "Status", status]
      }
      await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", objectChangeStatus);
      return `Successfully change the status of Order ${orderId} from ${order.status} to ${status}!`
    } else if (status === "Canceled" || status === "Failed") { // CANCEL || Failed
      //1 đơn chuyển sang Canceled thì:
      if(order.status === "Complete"){ //1 đơn chỉ được chuyển qua Canceled khi status khác Complete
        throw Boom.badRequest(`Can not cancel the ${order.status} order!`)
      }
      // nếu đang Processing hoặc Shipping: thì cập nhật cộng lại Ownership và cả NumberAvailable
      if(order.status === "Shipping" || order.status === "Processing" ){
        var newVal = 0;
        const orderDetails = await Models.OrderDetail.query().where("orderId", orderId);
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
      // Update BC va xoa ProductDetails
      if(order.status === "Shipping" || order.status === "Processing"){
          var buffer = await Models.ProductDetails.query().findOne("orderId", orderId);
          console.log(buffer)
          let object = {
            fcn: "sellingProducts",
            peers:["peer0.org1.example.com","peer0.org2.example.com"],
            chaincodeName:"productdetail",
            channelName:"mychannel",
            args:[buffer.listPds, atStore, "false"]
          }
          const res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
          if(!res){
            throw Boom.badRequest(`Cannot Connect to sellingProducts`)
          }
          await Models.ProductDetails.query().delete().where('id', buffer.id);
      }
      let object = {
        fcn: "changeOrderInfor",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[orderId.toString(), "Status", status]
      }
      await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
      return `Successfully change the status of Order ${orderId} from ${order.status} to ${status}!`
    } else { // UNCONFIRM
      throw Boom.badRequest("Can not change any current status to Processing!")
    }
  }

  async deleteOrder(id){
    // Neu la 1 Canceled order thi xoa luon do da tru roi
    // const order = await Models.Order.query().findOne({id:id});
    console.log('id',id)
    let objectO = {
      fcn: "queryOrder",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id.toString()]
    }
    const res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", objectO);
    console.log('res.data',res.data)
    if(!res){
      throw Boom.badRequest('Error in BC!')
    }
    var data = res.data.result.data;
    var listofP = Buffer.from(JSON.parse(JSON.stringify(data))).toString();
    var order = JSON.parse(listofP)
    console.log("ORDER FROM BC: ", order)
    console.log('order', order, id)
    if(order.status === "Complete"){
      throw Boom.badRequest("Can not delete a Complete Order!");
    }
    if(order.status === "Canceled"){
      // await Models.Order.query().delete().where('id', id);
      let object = {
        fcn: "changeOrderInfor",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[id.toString(), "Delete"]
      }
      await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
      await Models.OrderDetail.query().delete().where("orderId", id);
      return `Delete Successfully Order of ${order.fullName}!`;
    }
    const orderDetails = await Models.OrderDetail.query().where('orderId', id);
    var newVal = 0;
    console.log('orderDetail',orderDetails)
    console.log('status', order.status, orderDetails.length)

    // Neu don dang xoa la Processing va Shipping thi cap nhat lai ownership
    if(order.status === "Processing" || order.status === "Shipping"){
      for(var i = 0; i < orderDetails.length; i++){
        var currentP = await Models.Ownership.query().findOne({pId: orderDetails[i].productId}).where("storeName", order.atStore);
        newVal = currentP.quantity + orderDetails[i].quantity;
        console.log('abc',currentP, newVal)
        await Models.Ownership.query().update({quantity: newVal} ).where('pId', orderDetails[i].productId).where("storeName", order.atStore);
      }
    }
    // Cap nhat lai thong tin ProductDetail tren BC
    if(order.status === "Shipping" || order.status === "Processing"){
      var buffer = await Models.ProductDetails.query().findOne("orderId", id);
      console.log(buffer)
      let object = {
        fcn: "sellingProducts",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"productdetail",
        channelName:"mychannel",
        args:[buffer, "emptyString", "false"]
      }
      const res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
      if(!res){
        throw Boom.badRequest(`Cannot Connect to sellingProducts`)
      }
      await Models.ProductDetails.query().delete().where('id', buffer.id);
    }
    // Update NumAvailable 
    for(var i = 0; i < orderDetails.length; i++){
      var product = await Models.Product.query().findOne({id: orderDetails[i].productId});
      newVal = product.numberAvailable + orderDetails[i].quantity;
      await Models.Product.query().update({numberAvailable: newVal}).where("id", product.id);
    }
    let object = {
      fcn: "changeOrderInfor",
      peers:["peer0.org1.example.com","peer0.org2.example.com"],
      chaincodeName:"productdetail",
      channelName:"mychannel",
      args:[id.toString(), "Delete"]
    }
    await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
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
    return return_list;
  }

  async LoadOrderInformation(id){
    let req = `http://localhost:4000/channels/mychannel/chaincodes/productdetail?args=`
    req = req + '["' + id.toString() + '"]' + `&peer=peer0.org1.example.com&fcn=getHistoryForOrder`;
    let resp = await Axios.get(req);
    let res = resp['data']
    var returnArray = []
    var unConfirm = []
    var confirm = []
    var shipping = []
    var complete = []
    
    console.log("A: ", res[0]['Value'])
    var resL = res.length
    for(var i = 0; i < resL; i++){
      res[i]['Value']['createdAt'] = new Date(parseInt(res[i]['Value']['createdAt'].split(" ")[0].slice(8)) * 1000)
      res[i]['Value']['updatedAt'] = new Date(parseInt(res[i]['Value']['updatedAt'].split(" ")[0].slice(8)) * 1000)
      if(res[i]['Value'].status === "Unconfirm"){
        unConfirm.push(res[i]['Value'])
      } else if (res[i]['Value'].status === "Confirm"){
        confirm.push(res[i]['Value'])
      } else if (res[i]['Value'].status === "Shipping"){
        shipping.push(res[i]['Value'])
      } else if (res[i]['Value'].status === "Complete"){
        complete.push(res[i]['Value'])
      }
    }
    if(unConfirm.length > 0){
      returnArray.push(unConfirm[0])
    }
    if(confirm.length > 0){
      returnArray.push(confirm[0])
    }
    if(shipping.length > 0){
      returnArray.push(shipping[0])
    }
    if(complete.length > 0){
      returnArray.push(complete[0])
    }
    console.log("RES:" , res)
    const OrderDetail = await Models.OrderDetail.query().where('orderId', parseInt(returnArray[0]['id']));
    for(var j = 0; j< returnArray.length; j++){
      returnArray[j]['orderDetail'] = OrderDetail;
    }
    return returnArray;
    

  }

  getSearchQuery(builder, q) {
    builder.andWhere(function () {
      this.whereRaw('LOWER("fullName") LIKE \'%\' || LOWER(?) || \'%\' ', q);
    });
  }
}

module.exports = OrderService;
