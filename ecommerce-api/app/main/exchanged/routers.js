'use strict';

const handler = require('./handler');

const Routes = [
  {
    method: 'POST',
    path: '/api/v1/exchange',
    config: handler.getManyEx
  },
  {
    method: 'POST',
    path: '/api/v1/exchange/createExchange',
    config: handler.createExchange
  },
  {
    method: 'PUT',
    path: '/api/v1/exchange/accept/{id}',
    config: handler.updateAccept
  },
  {
    method: 'GET',
    path: '/api/v1/exchange/confirm/{id}',
    config: handler.updateConfirm
  },
  {
    method: 'GET',
    path: '/api/v1/admindiff/{id}',
    config: handler.getAdminDiff
  },
  {
    method: 'GET',
    path: '/api/v1/exchange/delete/{id}',
    config: handler.deleteRequest
  },
  {
    method: 'GET',
    path: '/api/v1/tracking/{id}',
    config: handler.tracking
  },
  {
    method: 'GET',
    path: '/api/v1/history/{id}',
    config: handler.getHistory
  },
  {
    method: 'POST',
    path: '/api/v1/getstore',
    config: handler.getStore
  },
  {
    method: 'GET',
    path: '/api/v1/getproductbyowner/{user}',
    config: handler.getProductbyOwner
  },
];

module.exports = Routes;
