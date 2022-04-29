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
            const response = await Axios.get(`https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${listOfOrders}?access_token=pk.eyJ1IjoibWluaDI2NzE5OTkiLCJhIjoiY2wyYWNkZWFsMDQwZDNibnpubGo5dDlsNiJ9.wcpp7JlE8d6Ck3Z5CSWNTw`);
            if(response){
                return response.data;
            }
        }

        return a()
    }

    async getListOfOptimized(listOfOrders) {
        var a = await this.getMatrix(listOfOrders);
        const y = async (data) => {
            const response = await solver.solveTsp(data.durations, true, {});
            if(response){
                return response
            }
       }

       return y(a)
    }

    async routing(){
        var capacity = 30;
        const root = {"lat": 10.770418589006429, "lng": 106.65940945485951} //Bv Trung Vuong
        var listOfData = [
            {
                "orderId": 1,
                "quantity": 4,
                "createdDate": new Date(2022,3,28,17,11,10,0),
                "lat": 10.773437530712947, 
                "lng": 106.66075877249628
            }, //DDH BK HCM
            {
                "orderId": 2,
                "quantity": 9,
                "createdDate": new Date(2022,3,28,17,33,10,0),
                "lat": 10.764295513785777, 
                "lng": 106.6596164671719
            }, // Ho boi Phu Tho
            {
                "orderId": 3,
                "quantity": 11,
                "createdDate": new Date(2022,3,28,18,10,10,0),
                "lat": 10.77388036853931,
                "lng": 106.66594462505371
            }, // DH PNT
            {
                "orderId": 4,
                "quantity": 7,
                "createdDate": new Date(2022,3,28,20,10,10,0),
                "lat": 10.762730749864517, 
                "lng": 106.66962553574938
            }, // Bv Hoa Hao 
            {
                "orderId": 5,
                "quantity": 3,
                "createdDate":new Date(2022,3,28,15,10,10,0),
                "lat": 10.759595359260528, 
                "lng": 106.6822344896001
            }, //DH Sai Gon 
            {
                "orderId": 6,
                "quantity": 14,
                "createdDate": new Date(2022,3,28,13,10,10,0),
                "lat": 10.793679933916495, 
                "lng": 106.6545222982223
            } // THPT Nguyen Thuong Hien
        ];
        listOfData.sort((a,b) => {
            return a.createdDate - b.createdDate;
        })
        var newArray = []
        var geoString = root['lng'].toString() + "," + root['lat'].toString() + ";";
        for (var i = 0; i < listOfData.length; i++){
            capacity = capacity- listOfData[i]['quantity']
            if(capacity > 0){
                newArray.push(listOfData[i])
                geoString += listOfData[i]['lng'].toString() + "," + listOfData[i]['lat'].toString() + ";";
            }
        }

        console.log("NEW", newArray)
        geoString = geoString.slice(0, geoString.length - 1)
        console.log("NEW", geoString)
        
        
        const a = await this.getListOfOptimized(geoString);
        console.log("AA", a)

        var returnArray = []
        for(var m = 1; m<a.length - 1; m++){
            returnArray.push(newArray[a[m] - 1])
        }
        return returnArray;
    }

    

}

module.exports = RoutingService;