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
      const {payload} = request;
      return await this.service.updateAccept(payload);
    } catch (err) {
      throw err;
    }
  };

  async updateConfirm(request) {
    try {
      const {
        payload
      } = request;
      return await this.service.updateConfirm(payload);
    } catch (err) {
      throw err;
    }
  };

  async changeStatus(request) {
    try {
      const {
        payload
      } = request;
      return await this.service.changeStatus(payload);
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

  async getStoreDistance(request) {
    try {
      const {
        payload
      } = request;
      return await this.service.getStoreDistance(payload);
    } catch (err) {
      throw err;
    }
  };

  async getSuggestion(request) {
    try {
      const {
        payload
      } = request;
      return await this.service.getSuggestion(payload);
    } catch (err) {
      throw err;
    }
  };

  async getParseOrder(request) {
    try {
      const {
        payload
      } = request;
      return await this.service.getParseOrder(payload);
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

   async getDetailForAnExchange(request) {
    try {
      const {id} = request.params;
      return await this.service.getDetailForAnExchange(id);
    } catch (err) {
      throw err;
    }
  };
  
  
  async initProductDetails(request) {
    try {
      return await this.service.initProductDetails();
    } catch (err) {
      throw err;
    }
  };

}

module.exports = ExchangeController;
