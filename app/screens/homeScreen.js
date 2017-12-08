import React, { Component } from 'react';

import ReactGridLayout from 'react-grid-layout';
import {Responsive, WidthProvider} from 'react-grid-layout';
import { ipcRenderer }  from 'electron';

import PocketPanel from '../components/pocketPanel';
import WeatherPanel from '../components/weatherPanel';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

// import '../layout/reactGrid/styles.css';
// import '../layout/reactResizable/styles.css';

if (process.env.BROWSER) {
	require('../layout/reactGrid/styles.css');
	require('../layout/reactResizable/styles.css');
	// var styles = require('./layout/index.css');
}

var tempDownloadList

ipcRenderer.on('send:queueDone', (event, botStack) => {
	console.log("this is the botstack from homeScreen", botStack);
	tempDownloadList = botStack.botSearches
});
// ipcRenderer.on('send:queueDone', (event, botStack) => {
// 	console.log("this is the botstack from homeScreen", botStack);
// 	this.setState({
// 		tempDownloadList: botStack.botSearches
// 	}, () => {
// 		if (this.state.tempDownloadList.length > 0) {
// 			this.props.history.push('/downloadList');
// 		}
// 	})
// });

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class HomeScreen extends Component {
	constructor() {
		super();
		this.state = {
			widthWindow: '0',
			heightWindow: '0',
			tempDownloadList: tempDownloadList
		}

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log("this is component should update")
		if (nextState !== this.state) {
			return true;
		}
	}

	componentWillMount() {
		this.updateWindowDimensions();
	}

	componentDidMount() {
		global.addEventListener('resize', this.updateWindowDimensions);
		// this.mounted = true;
		console.log("this is tempdownload list length", this.state.tempDownloadList)
		if (this.state.tempDownloadList !== undefined) {
			if (this.state.tempDownloadList.length > 0) {
				console.log("this is tempdownload list length", this.state.tempDownloadList)
				this.props.history.push('/downloadList');
			}
		}
	}

	componentWillUnmount() {
		// window.removeEventListener('resize', this.updateWindowDimensions);
		global.removeEventListener('resize', this.updateWindowDimensions);
		// this.mounted = false;
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

	  console.log("this is the downloadList", this.props.downloadList);

    return (
      <div>
        <h1>This is the homescreen</h1>
      	<Link to='/downloadList'>
      		go to downloadscreen
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

// function mapStateToProps(state) {
// 	return {
// 		downloadList: state.download
// 	}
// }
export default withRouter(HomeScreen);
// export default connect(mapStateToProps, null)(withRouter(HomeScreen));