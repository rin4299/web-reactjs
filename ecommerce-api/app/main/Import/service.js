'use strict';

const Boom = require('@hapi/boom');
const Models = require('../../db/models');
const BaseServiceCRUD = require('../../base/BaseServiceCRUD');
const { default: Axios } = require('axios');

class IEService extends BaseServiceCRUD {
    constructor() {
      super(Models.Import, 'Import');
    }

    async createOne(payload){
        const {storeName, userName, listOfProducts} = payload;
        var lop = "";
        var lopd = "";
        // listOfProducts is an array of object, object contains: pId, pName, quantity
        for(var i = 0; i < listOfProducts.length; i++){
            //Check available in Ownership
            var productInstore = await Models.Ownership.query().where('pId',listOfProducts[i].pId).findOne('storeName', storeName);
            if(!productInstore){
                throw Boom(`Cannot find product which name is ${listOfProducts[i].pName} in ${storeName}!`);
            }
            //Check available in Product
            var product = await Models.Product.query().findOne('id', listOfProducts[i].pId);
            if(!product){
                throw Boom(`Cannot find product which name is ${listOfProducts[i].pName}`);
            }
            //Update quantity in Ownership
            await Models.Ownership.query().update({quantity: productInstore.quantity + listOfProducts[i].quantity} ).where('pId', listOfProducts[i].pId).where('storeName',storeName);
            //Update number Available
            await Models.Product.query().update({numberAvailable: product.numberAvailable + listOfProducts[i].quantity} ).where('id', listOfProducts[i].pId);
            //Create list of products for Import Order
            lop = lop + listOfProducts[i].pId.toString() + "-" + listOfProducts[i].quantity.toString() + ",";
            //Create ProductDetail on BC
            let object = {
                fcn: "initProductDetail",
                peers:["peer0.org1.example.com","peer0.org2.example.com"],
                chaincodeName:"productdetail",
                channelName:"mychannel",
                args:[listOfProducts[i].pId.toString(), listOfProducts[i].pId.toString(), storeName+"-"+listOfProducts[i].quantity.toString()]
            }
            let res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
            console.log('Create Function Data in res: ',res.data);
            if(!res) {
                throw Boom('Failed to connect to blockchain!')
            } 
            var stringBuffer = res.data.result.data;
            var pdinOrder = Buffer.from(JSON.parse(JSON.stringify(stringBuffer))).toString();
            console.log("FinalString: ",pdinOrder);
            //Create list of ProductDetails for Import Order
            lopd = lopd + listOfProducts[i].pId + "-" + pdinOrder + ",";
            console.log("listofproductDetailsString: ",lopd);
        }
        //Create Import Order in database 
        console.log("lop & lopd", lop, lopd)
        var payload = {
            'storeName': storeName,
            'createdBy': userName,
            'listOfProductDetails': lopd.slice(0, -1),
            'listOfProducts': lop.slice(0, -1)
        }
        const result = await Models.Import.query().insert(payload).returning('*');
        if(!result){
            throw Boom('Cannot create Import Order!')
        }
        return result
    }


    async getAllImportOrders(query){
        const {storeName, startTime, endTime} = query
        let result = Models.Import.query().where('storeName', storeName);
        if(!result){
            throw Boom(`Cannot find any imports from store: ${storeName}!`)
        }
        if(startTime && endTime){
            result.whereBetween('createAt', [startTime, endTime]);
        }
        return result;

    }

    async getImportInformation(query){
        const {id} = query
        const result = await Models.Import.query().findOne({id: id});
        if(!result){
            throw Boom(`Cannot find any imports having id: ${id}!`)
        }
        var arr = result.listOfProductDetails.split(",")
        var res = []
        var count = 0;
        for(var i =0; i < arr.length; i++){
            var infor = arr[i].split("-");
            var tempSTR = ""
            for(var j = 1; j < infor.length; j++){
                tempSTR = tempSTR + infor[j] + ",";
                count = count + 1;
            }
            var product = await Models.Product.query().findOne({id: parseInt(infor[0])});
            var obj = {
                'pId': infor[0],
                'product': product,
                'ids': tempSTR.slice(0, -1),
                'quantity': count
            }
            res.push(obj)
            count = 0;
        }
        return res;
    }



}


module.exports = IEService;