'use strict';

const BaseControllerCRUD = require('../../base/BaseControllerCRUD');
const ContactService = require('./service');

class ContactController extends BaseControllerCRUD {
  constructor() {
    super(new ContactService());
  }

  async getManyContacts(request) {
    try {
      
      return await this.service.getManyContacts(request.query);
    } catch (err) {
      throw err;
    }
  };
}

module.exports = ContactController;
