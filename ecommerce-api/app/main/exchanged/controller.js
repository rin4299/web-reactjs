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
      const {id, listofProducts, storeName} = request.params;
      return await this.service.updateAccept(id, listofProducts, storeName);
    } catch (err) {
      throw err;
    }
  };

  async updateConfirm(request) {
    try {
      const {
        id, listofProducts, storeName
      } = request.params;
      return await this.service.updateConfirm(id, listofProducts, storeName);
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

  async getHistory(request) {
    try {
      const {
        id
      } = request.params;
      return await this.service.getHistory(id);
    } catch (err) {
      throw err;
    }
  };

  async getStore(request) {
    try {
      const {
        payload
      } = request;
      return await this.service.getStore(payload);
    } catch (err) {
      throw err;
    }
  };

  async getProductbyOwner(request) {
    try {
      const {
        user
      } = request.params;
      return await this.service.getProductbyOwner(request.query, user);
    } catch (err) {
      throw err;
    }
  };

  async loadProductDetailinExchange(request) {
    try {
      const {
        str
      } = request.params;
      return await this.service.loadProductDetailinExchange(str);
    } catch (err) {
      throw err;
    }
  };

}

module.exports = ExchangeController;
