import React , { Component } from "react";
import { GoogleMap , LoadScript, Polyline, Marker, DirectionsService , InfoWindow, DirectionsRenderer } from "@react-google-maps/api";

import { connect } from 'react-redux'


const mapContainerStyle = {
    height: "500px",
    width: "800px",
    "marginLeft":"350px"
  };

let center = { lat:  10.773392736860279, lng: 106.66067562399535 }
  const onLoad = polyline => {
    console.log('polyline: ', polyline)
};
const destination = {
    lat: 10.781580679125028,lng: 106.66052273809483
}  
const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 10
  }
// const path = [
//     {lat : 10.773392736860279,lng: 106.66067562399535},
//     {lat: 10.781580679125028,lng: 106.66052273809483},
//     {lat: 10.771146448286187,lng: 106.65402106401018},
//     {lat: 10.780737522390018,lng: 106.69914654453824}
// ];

var lineSymbol = {
    path: 'M 1.5 1 L 1 0 L 1 2 M 0.5 1 L 1 0',
    fillColor: 'black',
    strokeColor: 'black',
    strokeWeight: 2,
    strokeOpacity: 1
};
let path = []
// let directionService
class Map extends Component {
    constructor (props) {
        super(props)
        this.state = {
            response: null,
            travelMode: 'DRIVING',
          }
    }

    async componentDidMount(){
         
        
    }

    generateDirection = async () => {
        // eslint-disable-next-line no-undef
        const directionService = new google.maps.DirectionsService()
        const results = await directionService.route({
            origin: center,
            destination: center,
            waypoints:path,
            //eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING
        })
        console.log('response', results)
        this.setState({
            response : results
        })
    };

    directionsCallback (response) {
        console.log('response')
        console.log(response)
    
        if (response !== null) {
          if (response.status === 'OK') {
            this.setState(
              {
                  response: response
              }
            )
          } else {
            console.log('response: ', response)
          }
        }
      }
    
      
    render(){
        // const { destination } = this.state;
        let {listRouting} = this.props
        if(listRouting && listRouting.length) {
            listRouting.map((item,index) => {
                // path.push({
                //     location : {lat : item.lat,lng :item.lng},
                //     stopover: true,

                // })
                console.log('index',index)
                if(index == 0){
                    center = {lat : item.lat,lng :item.lng}
                }else{
                    path = [...path, {
                        location : {lat : item.lat,lng :item.lng},
                        stopover: true,
                    }]
                }
            })
            // console.log('center', center)
            // console.log('path',path)
        }
    //   path = [...path, {lat: center.lat, lng : center.lng}]
        console.log('routing',listRouting)
        

        const options = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 5,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: 30000,
            paths: path,
            zIndex: 1,
            icons:[{
                icon: lineSymbol,
                offset: '100%',
                repeat: '50px'
            }]
          };
        // var directionService = new google.maps.directionService;
        // var directionDisplay = new google.maps.directionDisplay;
        return (
            // <LoadScript
            //     googleMapsApiKey="AIzaSyCXxL0MBTRrFF9MBlEMZNwkmenz9zMRtZk" libraries={["places"]}
            // >
            <div className="map">
                <div className="map-container">
                    <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={13}
                    >
                        {/* {path && path.length ? path.map((position) => {
                            return (
                                <Marker
                                onLoad={onLoad}
                                position={position}
                                />
                            )
                        }): null} */}
                        {/* <Marker
                            onLoad={onLoad}
                            position={center}
                            // animation={window.google.maps.Animation.BOUNCE}
                        /> */}
                        {/* {listRouting.map((item,index) => {
                        console.log('position',item)
                        let lat = item.lat
                        let lng = item.lng
                        let position = {lat: lat, lng : lng}
                        return (
                            <Marker
                                onLoad={onLoad}
                                position={position}
                                onClick={() => console.log(item)}
                                // visible={false}
                            />
                        )
                            
                        })} */}
                        {/* <Polyline
                            onLoad={onLoad}
                            path={path}
                            options={options}
                        /> */}
                            {/* {
                                            (
                                destination !== '' &&
                                center !== ''
                            ) && (
                                <DirectionsService
                                // required
                                
                                options={{ 
                                    // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                                    destination : destination,
                                    origin: center,
                                    travelMode: "DRIVING",
                                    // waypoints: destination,
                                }}
                                // required
                                callback={this.directionsCallback}
                                onLoad={directionsService => {
                                    console.log('DirectionsService onLoad directionsService: ', directionsService)
                                }}
                                />
                            )}

                            {console.log('response', this.state.response)} */}

                            {
                            this.state.response !== null && 
                                <DirectionsRenderer
                                // required
                                // options={{ 
                                //     // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                                //     directions: this.state.response
                                // }}
                                directions={this.state.response}
                                panel={document.getElementById('panel')}
                                // optional
                                onLoad={directionsRenderer => {
                                    console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
                                }}
                                // optional
                                onUnmount={directionsRenderer => {
                                    console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
                                }}
                                />
                        }
                        
                        
                    </GoogleMap>
                    <div>
                        {/* <button type="button" className="btn btn-warning" onClick={this.generateDirection}>generate</button> */}
                    </div>
                </div>
                <div id='panel'>

                </div>
            </div>
            // </LoadScript>
        )
    }
}


export default connect(null, null)(Map)