'use strict'


const handler = require('./handler');

const Routes = [
    {
        method: 'POST',
        path: '/api/v1/productreport/create',
        config: handler.createOne
    },
    {
        method: 'GET',
        path: '/api/v1/productreport/getReport',
        config: handler.getAllProductReport
    },
    {
        method: 'GET',
        path: '/api/v1/productreport/getInformation',
        config: handler.getReportInformation
    },
]


module.exports = Routes;