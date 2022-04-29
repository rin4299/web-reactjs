'use strict';

const BaseControllerCRUD = require('../../base/BaseControllerCRUD');
const RoutingService = require('./service');

class RoutingController extends BaseControllerCRUD {
    constructor() {
      super(new RoutingService());
    }

    async routing() {
        try {
            // const a = await this.service.routing();
            // console.log("AA", a)
            // return a;
          return await this.service.routing();
        } catch (err) {
          throw err;
        }
      };

}

module.exports = RoutingController;