'use strict';

const Boom = require('@hapi/boom');
const Models = require('../../db/models');
const { default: Axios } = require('axios');
var solver = require('node-tspsolver')
class RoutingService {
    constructor() {
    }

    async getMatrix(listOfOrders){
        
        const a = async () => {
            const response = await Axios.get(`https://api.mapbox.com/directions-matrix/v1/mapbox/cycling/${listOfOrders}?annotations=distance,duration&access_token=pk.eyJ1IjoibWluaDI2NzE5OTkiLCJhIjoiY2wyYWNkZWFsMDQwZDNibnpubGo5dDlsNiJ9.wcpp7JlE8d6Ck3Z5CSWNTw`);
            if(response){
                return response.data;
            }
        }

        return a()
    }

    async getListOfOptimized(listOfOrders) {
        var a = await this.getMatrix(listOfOrders);
        const y = async (data) => {
            const response = await solver.solveTsp(data.distances, true, {});
            if(response){
                // var totalDistance = 0.0
                // console.log(data.distances)
                // for(var i = 0; i < response.length - 1; i++){
                //     console.log(data.distances[i][i+1])
                //     totalDistance = totalDistance + data.distances[response[i]][response[i+1]]
                // }
                return response
            }
       }

       return y(a)
    }

    async routing(storeName){
        
        var Store_Information = await Models.Store.query().findOne('storeName', storeName);
        var capacity = 30;
        var List_Of_Orders = []
        var List_Of_Exchanges = []
        var listOfData = []
        const root = {"lat": Store_Information['lat'], "lng": Store_Information['lng']}
        //Load Orders
        let res = await Axios.get("http://localhost:4000/channels/mychannel/chaincodes/productdetail?args=['1']&peer=peer0.org1.example.com&fcn=queryAllOrders");
        if(!res){
            throw Boom.badRequest('Cannot load data of Orders from BC!')
        }
        var Received_List_Of_Orders = res.data
        console.log("RoO", Received_List_Of_Orders)
        for(var or_counter = 0; or_counter < Received_List_Of_Orders.length; or_counter++){
            if( Received_List_Of_Orders[or_counter]['isActive'] === true && Received_List_Of_Orders[or_counter]['atStore'] === storeName && Received_List_Of_Orders[or_counter]['status'] === "Processing"){
                Received_List_Of_Orders[or_counter]['specialId'] = "O-" +  Received_List_Of_Orders[or_counter]['id'];
                Received_List_Of_Orders[or_counter]['createdAt'] = new Date(Received_List_Of_Orders[or_counter]['createdAt'].slice(8,18) * 1000);
                List_Of_Orders.push(Received_List_Of_Orders[or_counter]);
            }   
        }
        let res_Exchange = await Axios.get("http://localhost:4000/channels/mychannel/chaincodes/productdetail?args=['1']&peer=peer0.org1.example.com&fcn=queryAllExchanges");
        if(!res_Exchange){
            throw Boom.badRequest('Cannot load data of Exchanges from BC!')
        }
        var Received_List_Of_Exchanges = res_Exchange.data
        console.log("RoE", Received_List_Of_Exchanges)
        for(var ex_counter = 0; ex_counter < Received_List_Of_Exchanges.length; ex_counter++){
            if(Received_List_Of_Exchanges[ex_counter]['isActive'] === true && Received_List_Of_Exchanges[ex_counter]['recUserName'] === storeName && Received_List_Of_Exchanges[ex_counter]['isAccepted'] === true && Received_List_Of_Exchanges[ex_counter]['status'] === "Processing"){
                Received_List_Of_Exchanges[ex_counter]['specialId'] = "E-" + Received_List_Of_Exchanges[ex_counter]['id'];
                Received_List_Of_Exchanges[ex_counter]['createdAt'] = new Date(Received_List_Of_Exchanges[ex_counter]['createdAt'].slice(8,18) * 1000);;
                var store_Information = await Models.Store.query().findOne("storeName", Received_List_Of_Exchanges[ex_counter]['reqUserName']);
                Received_List_Of_Exchanges[ex_counter]['information'] = store_Information;
                List_Of_Exchanges.push(Received_List_Of_Exchanges[ex_counter]);
            }
        }
        console.log("LoO", List_Of_Orders)
        console.log("LoE", List_Of_Exchanges)
        listOfData = List_Of_Orders .concat(List_Of_Exchanges);
        console.log("LoData", listOfData)
        listOfData.sort((a,b) => {
            return a['createdAt'] - b['createdAt'];
        })
        console.log("LoData After Sorting", listOfData)
        var Array_Of_Capacity = []
        var geoString = root['lng'].toString() + "," + root['lat'].toString() + ";";
        for (var i = 0; i < listOfData.length; i++){
            capacity = capacity- listOfData[i]['totalQuantity']
            if(capacity > 0){
                Array_Of_Capacity.push(listOfData[i])
                geoString += listOfData[i]['lng'].toString() + "," + listOfData[i]['lat'].toString() + ";";
            }
        }

        console.log("Array_Based_On_Max_Cap: ", Array_Of_Capacity)
        geoString = geoString.slice(0, geoString.length - 1)
        console.log("GeoString: ", geoString)
        
        
        const List_Of_Optimized_Shipping = await this.getListOfOptimized(geoString);
        console.log("List Of Optimized Shipping Routing: ", List_Of_Optimized_Shipping)

        var returnArray = [Store_Information]
        for(var m = 1; m<List_Of_Optimized_Shipping.length - 1; m++){
            returnArray.push(Array_Of_Capacity[List_Of_Optimized_Shipping[m] - 1])
        }
        return returnArray
    }

    

}

module.exports = RoutingService;