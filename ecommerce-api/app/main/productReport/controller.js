'use strict';

const BaseControllerCRUD = require('../../base/BaseControllerCRUD');
const productReportService = require('./service');

class productReportController extends BaseControllerCRUD {
    constructor() {
        super(new productReportService());
    }

    async createOne(request){
        try{
            return await this.service.createOne(request.payload);
        } catch (err){
            throw err;
        }
    }

    async createNewOne(request){
        try{
            return await this.service.createNewOne(request.payload);
        } catch (err){
            throw err;
        }
    }


    async getAllProductReport(request){
        try{
            return await this.service.getAllProductReport(request.query);
        } catch (err){
            throw err;
        }
    }


    async getReportInformation(request){
        try{
            
            return await this.service.getReportInformation(request.query);
        } catch (err){
            throw err;
        }
    }


}


module.exports = productReportController;