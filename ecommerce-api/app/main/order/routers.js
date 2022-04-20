'use strict';

const handler = require('./handler');

const Routes = [
  {
    method: 'GET',
    path: '/api/v1/orders',
    config: handler.getMany
  },
  // Modifying
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
  // Modifying
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
  // Modifying
  {
    method: 'POST',
    path: '/api/v1/order/changestatus',
    config: handler.changeStatus
  },
  // Modifying
  {
    method: 'GET',
    path: '/api/v1/orders/delete/{id}',
    config: handler.deleteOrder
  },
  // Modifying
  {
    method: 'GET',
    path: '/api/v1/orders/productdetails/{id}',
    config: handler.loadProductDetailinOrder
  },
  {
    method: 'GET',
    path: '/api/v1/orders/orderStatus/{id}',
    config: handler.LoadOrderInformation
  },
];

module.exports = Routes;
