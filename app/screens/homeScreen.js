import React, { Component } from 'react';

import ReactGridLayout from 'react-grid-layout';
import {Responsive, WidthProvider} from 'react-grid-layout';

import PocketPanel from '../components/pocketPanel';
import WeatherPanel from '../components/weatherPanel';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router';

// import '../layout/reactGrid/styles.css';
// import '../layout/reactResizable/styles.css';

if (process.env.BROWSER) {
	require('../layout/reactGrid/styles.css');
	require('../layout/reactResizable/styles.css');
	// var styles = require('./layout/index.css');
}

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class HomeScreen extends Component {
	constructor() {
		super();
		this.state = {
			widthWindow: '0',
			heightWindow: '0'
		}

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentWillMount() {
		this.updateWindowDimensions();
	}

	componentDidMount() {
		global.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		// window.removeEventListener('resize', this.updateWindowDimensions);
		global.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		var w = window,
	        d = document,
	        documentElement = d.documentElement,
	        body = d.getElementsByTagName('body')[0],
	        width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
	        height = w.innerHeight || documentElement.clientHeight || body.clientHeight;

		this.setState({ widthWindow: width, heightWindow: height });
	}

	switchScreens() {
		console.log("this is the switchScreens")
		this.props.history.push('/alt')
	}


  render() {
  	var layout = [
			{i: 'weatherPanel', x: 0, y: 0, w: 3, h: 4},
			{i: 'pocketPanel', x: 9, y: 7, w: 3, h: 3},
	    ];

    return (
      <div>
        <h1>This is the homescreen</h1>
      	<Link to='/alt'>
      		go to altscreen
      	</Link>
      	<button onClick={this.switchScreens.bind(this)}>
      		withRouter altscreen
      	</button>
				<ReactGridLayout 
					className="layout" 
					layout={layout}
					cols={12}
					rowHeight={30}
					width={this.state.widthWindow}
				>
	        <div key="weatherPanel">
	            <PocketPanel />
	        </div>
	        <div key="pocketPanel">
	        	<WeatherPanel />
	        </div>
	    	</ReactGridLayout>
      </div>
    );
  }
}

export default withRouter(HomeScreen);
