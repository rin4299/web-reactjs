import React , { Component } from "react";
import { GoogleMap , LoadScript, Polyline, Marker, DirectionsService } from "@react-google-maps/api";
import { connect } from 'react-redux'


const mapContainerStyle = {
    height: "400px",
    width: "800px"
  };

const center = { lat:  10.773392736860279, lng: 106.66067562399535 }
const onLoad = polyline => {
    console.log('polyline: ', polyline)
};
const destination = {
    lat: 10.781580679125028,lng: 106.66052273809483
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
  
// const options = {
//     strokeColor: '#FF0000',
//     strokeOpacity: 0.8,
//     strokeWeight: 3.5,
//     fillColor: '#FF0000',
//     fillOpacity: 0.35,
//     clickable: false,
//     draggable: false,
//     editable: false,
//     visible: true,
//     radius: 30000,
//     paths: path,
//     zIndex: 1,
//     icons:[{
//         icon: lineSymbol,
//         offset: '100%',
//         repeat: '50px'
//     }]
// };

// const opstions2 = { // eslint-disable-line react-perf/jsx-no-new-object-as-prop
//     destination: destination,
//     origin: center,
//     travelMode: 'DRIVING'
//   }

class Testcomponent extends Component {
    constructor (props) {
        super(props)

    
      }

      
    render(){
      let {path} = this.props
      console.log('1',path)
      path.push(center)
      console.log('2',path)
        // var directionService = new google.maps.directionService;
        // var directionDisplay = new google.maps.dir   ectionDisplay;
        return (
            // <LoadScript
            //     googleMapsApiKey="AIzaSyCXxL0MBTRrFF9MBlEMZNwkmenz9zMRtZk" libraries={["places"]}
            // >
                <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
                >'
                {console.log('3',path)}
                    {path.map((position) => {
                      console.log('position',position)
                        return (
                            <Marker
                            onLoad={onLoad}
                            position={position}
                            />
                        )
                    })}
                    <Marker
                        onLoad={onLoad}
                        position={center}
                    />
                    {/* <Polyline
                        onLoad={onLoad}
                        path={path}
                        options={options}
                    /> */}
                    
                    
                </GoogleMap>
            // {/* </LoadScript> */}
        )
    }
}


export default connect(null, null)(Testcomponent)
