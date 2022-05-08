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
                return [response, data.distances]
            }
       }

       return y(a)
    }

    async routing(storeName){
        
        var Store_Information = await Models.Store.query().findOne('storeName', storeName);
        var capacity = 7;
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
        if(List_Of_Exchanges.length === 0 && List_Of_Orders.length === 0){
            return []
        }
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
        
        // Proving List of Distances
        var distance_Matrix = List_Of_Optimized_Shipping[1]
        console.log("?",distance_Matrix)
        const permutations = arr => {
            if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
            return arr.reduce(
              (acc, item, i) =>
                acc.concat(
                  permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [
                    item,
                    ...val,
                  ])
                ),
              []
            );
          };
        var listOFNumbers = [...Array(Array_Of_Capacity.length + 1).keys()]
        // console.log("L", listOFNumbers)
        var Array_Of_Permutations = []
        
        Array_Of_Permutations = permutations(listOFNumbers).filter(each => each[0] == 0)
        // console.log("L", Array_Of_Permutations)
        var listOfDistances = []
        var totalDistance = 0.0;
        var Distance_Infor = {}
        var string_of_Routing = storeName + "->";
        for(var z = 0 ; z < Array_Of_Permutations.length; z++){
            Array_Of_Permutations[z].push(0)
            Distance_Infor = {
                'option': Array_Of_Permutations[z]
            }
            console.log(Array_Of_Permutations[z])
            for(var q = 0; q < Array_Of_Permutations[z].length - 1; q++){
                if(q > 0 && q < Array_Of_Permutations[z].length - 1){
                    console.log(true)
                    string_of_Routing = string_of_Routing + Array_Of_Capacity[Array_Of_Permutations[z][q] - 1]['specialId'] + "->" 
                }
               
                totalDistance = totalDistance + distance_Matrix[Array_Of_Permutations[z][q]][Array_Of_Permutations[z][q+1]]
            }
            Distance_Infor['totalDistance'] = totalDistance;
            Distance_Infor['routing_Order'] = string_of_Routing + storeName;
            listOfDistances.push(Distance_Infor);
            Distance_Infor = {}
            totalDistance = 0.0
            string_of_Routing = storeName + "->";
        }
        listOfDistances.sort((a,b)=>{
            return a['totalDistance'] - b['totalDistance'];
        })
        // Take Order/Exchange Infor
        console.log(List_Of_Optimized_Shipping[0])
        for(var m = 1; m<List_Of_Optimized_Shipping[0].length - 1; m++){
            returnArray.push(Array_Of_Capacity[List_Of_Optimized_Shipping[0][m] - 1])
        }
        return [returnArray, listOfDistances]
        // return returnArray
    }

    

}

module.exports = RoutingService;