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
    method: 'POST',
    path: '/api/v1/exchange/accept',
    config: handler.updateAccept
  },
  {
    method: 'POST',
    path: '/api/v1/exchange/confirm',
    config: handler.updateConfirm
  },
  {
    method: 'POST',
    path: '/api/v1/exchange/changeStatus',
    config: handler.changeStatus
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
    config: handler.getStoreDistance
  },
  {
    method: 'POST',
    path: '/api/v1/getsuggestion',
    config: handler.getSuggestion
  },
  {
    method: 'GET',
    path: '/api/v1/getproductbyowner/{user}',
    config: handler.getProductbyOwner
  },
  {
    method: 'GET',
    path: '/api/v1/getproductdetaillist/{str}',
    config: handler.loadProductDetailinExchange
  },
  {
    method: 'GET',
    path: '/api/v1/initProductDetails',
    config: handler.initProductDetails
  },
];

module.exports = Routes;
