import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

var divStyle = {
  border: 'red',
  borderWidth: 2,
  borderStyle: 'solid',
  padding: 20
};

// On clicking the store from the map my favourite list get updated
  
const Favourites = ({places}) => {

  //Will eliminate the duplicate values

  const uniquePlaces = Array.from(new Set(places));
  if (!uniquePlaces.length) {
      return <div>None</div>
  }
  return (
        <ul>
          {uniquePlaces && uniquePlaces.map(p => {
            return (
              <li>{p}</li>
            )
          })}
        </ul>
  )
}

// Conatiner to show the mexico city map

export class MapContainer extends Component {
constructor(props, context) {
    super(props, context);

    this.state = {
      places: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      favouiteStore: [],
    }
    this.onMarkerClick = this.onMarkerClick.bind(this)
  }

onReady(mapProps, map) {
  this.searchNearby(map, map.center);
}

onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      favouiteStore:[...this.state.favouiteStore, props.name]
    })
}

// This fn will get the nearby stores using googleAPI

searchNearby(map, center) {
    const {google} = this.props;
    const service = new google.maps.places.PlacesService(map);

    // Specify location, radius and place types for your Places API search.

    const request = {
       location: center,
       radius: '500',
       type: ['stores']
     };

    service.nearbySearch(request, (results, status, pagination) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {

        this.pagination = pagination;
        this.setState({
          places: results,
          hasNextPage: pagination.hasNextPage,
          center: center,
        })
      }
    })
  }

render() {

   // If the map is not loaded yet

   if (!this.props.loaded) {
      return <div>Loading...</div>
    }

    return (
      <Map google={this.props.google}
            initialCenter={{
            lat: 19.425004,
            lng: -99.126457
            }}
            onReady={this.onReady.bind(this)}
            style={{width: '100%', height: '70%', position: 'relative'}}>


        <div>
          <h3>My Favourite Stores</h3>
          <Favourites places={this.state.favouiteStore}/>
        </div>

        {this.state.places.map(place => (
           <Marker
            title='Click to Zoom'
            onClick={this.onMarkerClick}
            name={place.name}
            key={place.id}
            position={{lat: place.geometry.viewport.f.f, lng: place.geometry.viewport.b.f}} />
        ))}

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
 
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyCVH8e45o3d-5qmykzdhGKd1-3xYua5D2A'
})(MapContainer)