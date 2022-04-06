'use strict';

const handler = require('./handler');

const Routes = [
  {
    method: 'GET',
    path: '/api/v1/orders',
    config: handler.getMany
  },
  {
    method: 'GET',
    path: '/api/v1/orders/new/{user}',
    config: handler.getManyS
  },
  {
    method: 'GET',
    path: '/api/v1/orders/{id}',
    config: handler.getOne
  },
  {
    method: 'GET',
    path: '/api/v1/orders/count',
    config: handler.count
  },
  {
    method: 'POST',
    path: '/api/v1/orders',
    config: handler.createOne
  },
  {
    method: 'PUT',
    path: '/api/v1/orders/{id}',
    config: handler.updateOne
  },
  {
    method: 'DELETE',
    path: '/api/v1/orders/{id}',
    config: handler.deleteOne
  },
  {
    method: 'GET',
    path: '/api/v1/orders/exportExcel',
    config: handler.exportExcel
  },
  {
    method: 'POST',
    path: '/api/v1/order/changestatus',
    config: handler.changeStatus
  },
  {
    method: 'GET',
    path: '/api/v1/orders/delete/{id}',
    config: handler.deleteOrder
  },
  {
    method: 'GET',
    path: '/api/v1/orders/productdetails/{id}',
    config: handler.loadProductDetailinOrder
  },
];

module.exports = Routes;
