'use strict';

const Models = require('../../db/models');
const BaseServiceCRUD = require('../../base/BaseServiceCRUD');
const MailUtils = require('../../emailService');

class ContactService extends BaseServiceCRUD {
  constructor() {
    super(Models.Contact, 'Contact');
  }
  async createOne(payload) {
    const result = await this.model
      .query()
      .insert(payload)
      .returning('*');
    if(!result){
      throw Boom.badRequest('Error')
    }
    // MailUtils.sendEmailContactEmail(payload.email)
    return result;
  }

  async getManyContacts(query) {
    const { atStore } = query
    const builder = Models.Contact.queryBuilder(query).where('atStore', atStore);
    if (this.getSearchQuery && query.q) {
      this.getSearchQuery(builder, query.q);
    }
    return builder;
  }

  getSearchQuery(builder, q) {
    builder.andWhere(function (){
      this.whereRaw('LOWER("email") LIKE \'%\' || LOWER(?) || \'%\' ', q);
    });
  }
}

module.exports = ContactService;
