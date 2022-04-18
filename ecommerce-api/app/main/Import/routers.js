'use strict'


const handler = require('./handler');

const Routes = [
    {
        method: 'POST',
        path: '/api/v1/import/create',
        config: handler.createOne
    },
    {
        method: 'GET',
        path: '/api/v1/import/getImports',
        config: handler.getAllImportOrders
    },
    {
        method: 'GET',
        path: '/api/v1/import/getInformation',
        config: handler.getImportInformation
    },
]


module.exports = Routes;