'use strict';

const BaseControllerCRUD = require('../../base/BaseControllerCRUD');
const RoutingService = require('./service');

class RoutingController extends BaseControllerCRUD {
    constructor() {
      super(new RoutingService());
    }

    async routing(request) {
        try {
            // const a = await this.service.routing();
            // console.log("AA", a)
            // return a;
          const {
              storeName
            } = request.params;
          return await this.service.routing(storeName);
        } catch (err) {
          throw err;
        }
      };

}

module.exports = RoutingController;