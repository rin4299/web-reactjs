import React , { Component } from "react";
import { GoogleMap , LoadScript, Polyline, Marker, DirectionsService } from "@react-google-maps/api";
import { connect } from 'react-redux'


const mapContainerStyle = {
    height: "400px",
    width: "800px"
  };

const center = { lat:  10.7719937, lng: 106.7057951 }
// const center = { lat: 24.886, lng: -70.268 }
const onLoad = polyline => {
    console.log('polyline: ', polyline)
};
const destination = {
    lat: 10.781580679125028,lng: 106.66052273809483
}  
const path = [
    {lat : 10.773392736860279,lng: 106.66067562399535},
    {lat: 10.781580679125028,lng: 106.66052273809483},
    {lat: 10.771146448286187,lng: 106.65402106401018},
    {lat: 10.780737522390018,lng: 106.69914654453824}
    // { lat: 25.774, lng: -80.19 },
    // { lat: 18.466, lng: -66.118 },
    // { lat: 32.321, lng: -64.757 },
    // { lat: 25.774, lng: -80.19 }
];

// const path = [
//     { lat: 25.774, lng: -80.19 },
//     { lat: 18.466, lng: -66.118 },
//     { lat: 32.321, lng: -64.757 },
//     { lat: 25.774, lng: -80.19 }
//   ]

// var lineSymbol = {
//     path: 'M 1.5 1 L 1 0 L 1 2 M 0.5 1 L 1 0',
//     fillColor: 'black',
//     strokeColor: 'black',
//     strokeWeight: 2,
//     strokeOpacity: 1
// };
  
const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 3.5,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: path,
    zIndex: 1,
    // icons:[{
    //     icon: lineSymbol,
    //     offset: '100%',
    //     repeat: '50px'
    // }]
};

// const opstions2 = { // eslint-disable-line react-perf/jsx-no-new-object-as-prop
//     destination: destination,
//     origin: center,
//     travelMode: 'DRIVING'
//   }

class Testcomponent extends Component {
    constructor (props) {
        super(props)
    
        this.state = {
          response: null,
          travelMode: 'DRIVING',
          origin: '',
          destination: ''
        }

    this.directionsCallback = this.directionsCallback.bind(this)
    this.checkDriving = this.checkDriving.bind(this)
    this.checkBicycling = this.checkBicycling.bind(this)
    this.checkTransit = this.checkTransit.bind(this)
    this.checkWalking = this.checkWalking.bind(this)
    this.getOrigin = this.getOrigin.bind(this)
    this.getDestination = this.getDestination.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onMapClick = this.onMapClick.bind(this)
    }
    
    directionsCallback (response) {
        console.log(response)
    
        if (response !== null) {
          if (response.status === 'OK') {
            this.setState(
              () => ({
                response
              })
            )
          } else {
            console.log('response: ', response)
          }
        }
      }

      onMapClick (...args) {
        console.log('onClick args: ', args)
      }

      
    render(){
        // var directionService = new google.maps.directionService;
        // var directionDisplay = new google.maps.directionDisplay;
        return (
            <LoadScript
                googleMapsApiKey="AIzaSyCXxL0MBTRrFF9MBlEMZNwkmenz9zMRtZk"
            >
                <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
                >
                    {path.map((position) => {
                        return (
                            <Marker
                            onLoad={onLoad}
                            position={position}
                            />
                        )
                    })}
                    {/* <Marker
                        onLoad={onLoad}
                        position={center}
                    /> */}
                    <Polyline
                        onLoad={onLoad}
                        path={path}
                        options={options}
                    />
                    
                {/* <DirectionsService
                  // required
                //   options= {opstions2}
                
                  // required
                  callback={this.directionsCallback}
                /> */}
                {/* {directionService.route({
                    origin: center,
                    destination:center,
                    waypoints:path[0],
                    travelMode:'DRIVING'

                })} */}
                    
                </GoogleMap>
            </LoadScript>
        )
    }
}


export default connect(null, null)(Testcomponent)
