'use strict';

const Boom = require('@hapi/boom');
const Models = require('../../db/models');
const BaseServiceCRUD = require('../../base/BaseServiceCRUD');
const { default: Axios } = require('axios');

class productReportService extends BaseServiceCRUD {
    constructor() {
      super(Models.Product, 'Product');
    }

    async createOne(payload){
       const {storeName, userName, listOfReports} = payload;
       //List of Reports : pId, pdId (string), quantity, type ["Broken", "Lost"], note 
       let pl = {
           'createdBy': userName,
           'storeName': storeName
       }
       const pR = await Models.ProductReport.query().insert(pl).returning('*');
       for(var i = 0; i < listOfReports.length; i++){
           // Create Product Report Detail
            let PRDpayload = {
                'prId': pR.id,
                'pId': listOfReports[i].pId,
                'pdId': listOfReports[i].pdId,
                'type': listOfReports[i].type,
                'quantity': listOfReports[i].quantity,
                'note': listOfReports[i].note
            }
            await Models.ProductReportDetail.query().insert(PRDpayload);
            //Update Quantity in Ownership and NumberAvailable
            const ownership = await Models.Ownership.query().where('storeName', storeName).findOne({pId: listOfReports[i].pId});
            const product = await Models.Product.query().findOne('id', listOfReports[i].pId);
            //Update quantity in Ownership
            await Models.Ownership.query().update({quantity: ownership.quantity - listOfReports[i].quantity} ).where('pId', listOfReports[i].pId).where('storeName',storeName);
            //Update number Available
            await Models.Product.query().update({numberAvailable: product.numberAvailable - listOfReports[i].quantity} ).where('id', listOfReports[i].pId);

            // Update on BC 
            var listOfPD = listOfReports[i].pdId.split("-");
            for(let j = 0; j < listOfPD.length; j++){
                let object = {
                    fcn: "changeProductDetail",
                    peers:["peer0.org1.example.com","peer0.org2.example.com"],
                    chaincodeName:"productdetail",
                    channelName:"mychannel",
                    args:[listOfPD[j], "unActive", listOfReports[i].type]
                }
                let res = await Axios.post("http://localhost:4000/channels/mychannel/chaincodes/productdetail", object);
                if(!res) {
                    throw Boom('Failed to connect to blockchain!')
                } 
            }
       }

       return pR;
    }


    async getAllProductReport(query){
        const {storeName, startTime, endTime} = query
        let result = Models.ProductReport.query().where('storeName', storeName);
        if(!result){
            throw Boom(`Cannot find any imports from store: ${storeName}!`)
        }
        if(startTime && endTime){
            result.whereBetween('createAt', [startTime, endTime]);
        }
        return result;
    }

    async getReportInformation(query){
        const {id} = query
        const listOfPRD = await Models.ProductReportDetail.query().where('prId', id);
        for(var i = 0; i < listOfPRD.length; i++){
            let product = await Models.Product.query().findOne({id: listOfPRD[i].pId});
            listOfPRD[i]['product'] = product;
        }
        return listOfPRD;
    }



}


module.exports = productReportService;