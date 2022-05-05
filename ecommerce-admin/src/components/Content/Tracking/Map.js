import React , { Component } from "react";
import { GoogleMap , LoadScript, Polyline, Marker, DirectionsService, InfoWindow } from "@react-google-maps/api";
import { connect } from 'react-redux'


const mapContainerStyle = {
    height: "500px",
    width: "800px",
    "margin-left":"400px"
  };

const divStyle = {
  background: `white`,
  border: `1px solid #ccc`,
  padding: 10
}

const center = { lat:  10.773392736860279, lng: 106.66067562399535 }
const onLoad = polyline => {
    console.log('polyline: ', polyline)
}; 
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
  

// const opstions2 = { // eslint-disable-line react-perf/jsx-no-new-object-as-prop
//     destination: destination,
//     origin: center,
//     travelMode: 'DRIVING'
//   }

class Testcomponent extends Component {
    constructor (props) {
      super(props)

    
    }
    async componentDidMount(){
      // const map = new window.google.maps.Map(document.getElementById("map"),{
      //   mapContainerStyle:{mapContainerStyle},
      //   center:center,
      //   zoom:12,
      // })
    }

    onLoad = infoWindow => {
      console.log('infoWindow: ', infoWindow)
    }

    onClick = (event) => {
      console.log(event)
    }
      
    render(){
      let {path, total} = this.props
      path = [...path, {lat: center.lat, lng : center.lng}]
      path = path.reverse()
      // console.log('1',path)
      // console.log('total',total)

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
      // path.push(center)
        // var directionService = new google.maps.directionService;
        // var directionDisplay = new google.maps.dir   ectionDisplay;
        return (
            // <LoadScript
            //     googleMapsApiKey="AIzaSyCXxL0MBTRrFF9MBlEMZNwkmenz9zMRtZk" libraries={["places"]}
            // >
              <div id="map">
                
                 <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={12}
                  // onClick={this.onClick}
                  >
                    {/* {path.map((position,index) => {
                      console.log('position',position)
                        return (
                            <Marker
                            onLoad={onLoad}
                            position={position}
                            zIndex= {index}
                            animation={window.google.maps.Animation.BOUNCE}
                            onClick={() => console.log(index)}
                            />
                        )
                    })} */}
                    {total.map((item,index) => {
                      console.log('position',item)
                      let lat = item.Value.information.lat
                      let lng = item.Value.information.lng
                      let position = {lat: lat, lng : lng}
                      return (
                        <Marker
                            onLoad={onLoad}
                            position={position}
                            zIndex= {index}
                            animation={window.google.maps.Animation.BOUNCE}
                            onClick={() => console.log(item)}
                            />
                          )
                        
                    })}
                    {total.map((item,index) => {
                      console.log('position',item)
                      let lat = item.Value.information.lat
                      let lng = item.Value.information.lng
                      let position = {lat: lat, lng : lng}
                      return (
                        index+1 === total.length ? 
                          <InfoWindow
                            onLoad={onLoad}
                            position={position}
                          >
                            <div style={divStyle}>
                              <span>Index: {index+1}, Current</span>
                              <br/>
                              <span>{item.Value.ownerName}</span>

                            </div>
                          </InfoWindow>
                      : 
                          <InfoWindow
                            onLoad={onLoad}
                            position={position}
                          >
                            <div style={divStyle}>
                              <span>Index: {index+1}</span>
                              <br/>
                              <span>{item.Value.ownerName}</span>
                            </div>
                          </InfoWindow>
                          )
                        
                    })}
                    <Polyline
                        onLoad={onLoad}
                        path={path}
                        options={options}
                        // onDblClick={(event) => console.log(event)}
                    />

                    {/* {google.maps.event.addListener(Marker,"click",()=> {
                                        console.log('somethings')
                                      })} */}
                </GoogleMap>
              </div>
                
            // {/* </LoadScript> */}
        )
    }
}


export default connect(null, null)(Testcomponent)
