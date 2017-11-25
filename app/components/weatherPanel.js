import React, { Component } from 'react';
import { connect } from 'react-redux';

//use openweather api

class WeatherPanel extends Component {
	componentDidMount() {
		function success(position) {
		    var latitude  = position.coords.latitude;
		    var longitude = position.coords.longitude;
		    console.log("this is the latitude", latitude);
		    console.log("this is the longitude", longitude);
		}

		function error() {
		  console.log("error")
		}

		navigator.geolocation.getCurrentPosition(success, error);
	}

  render() {
    return (
      <div>
        <h1>
          Weather View
        </h1>
      </div>
    );
  }
}

export default WeatherPanel;
