'use strict';

const BaseControllerCRUD = require('../../base/BaseControllerCRUD');
const ExchangeService = require('./service');

class ExchangeController extends BaseControllerCRUD {
  constructor() {
    super(new ExchangeService());
  }

 
  async getManyEx(request) {
    try {
      console.log(request)
      const {payload} = request;
      return await this.service.getManyEx(request.query, payload);
    } catch (err) {
      throw err;
    }
  };

  async createExchange(request) {
    try {
      const {
        payload
      } = request;
      return await this.service.createExchange(payload);
    } catch (err) {
      throw err;
    }
  };


  async updateAccept(request) {
    try {
      const {id} = request.params;
      return await this.service.updateAccept(id);
    } catch (err) {
      throw err;
    }
  };

  async updateConfirm(request) {
    try {
      const {
        id
      } = request.params;
      return await this.service.updateConfirm(id);
    } catch (err) {
      throw err;
    }
  };

  async getAdminDiff(request) {
    try {
      const {id} = request.params;
      return await this.service.getAdminDiff(id);
    } catch (err) {
      throw err;
    }
  };

  async deleteRequest(request) {
    try {
      const {id} = request.params;
      return await this.service.deleteRequest(id);
    } catch (err) {
      throw err;
    }
  };

  async tracking(request) {
    try {
      const {
        id
      } = request.params;
      return await this.service.tracking(id);
    } catch (err) {
      throw err;
    }
  };

}

module.exports = ExchangeController;
