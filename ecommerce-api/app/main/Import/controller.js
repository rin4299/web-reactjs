'use strict';

const BaseControllerCRUD = require('../../base/BaseControllerCRUD');
const IEService = require('./service');

class IEController extends BaseControllerCRUD {
    constructor() {
        super(new IEService());
    }

    async createOne(request){
        try{
            return await this.service.createOne(request.payload);
        } catch (err){
            throw err;
        }
    }


    async getAllImportOrders(request){
        try{
            return await this.service.getAllImportOrders(request.query);
        } catch (err){
            throw err;
        }
    }


    async getImportInformation(request){
        try{
            return await this.service.getImportInformation(request.query);
        } catch (err){
            throw err;
        }
    }


}


module.exports = IEController;