import React, { Component } from 'react';

import ReactGridLayout from 'react-grid-layout';
import {Responsive, WidthProvider} from 'react-grid-layout';
import { ipcRenderer }  from 'electron';

import PocketPanel from '../components/pocketPanel';
import WeatherPanel from '../components/weatherPanel';
import AnimeChartPanel from '../components/animeChartPanel';
import ForwardList from '../components/forwardList';

import { Link } from 'react-router-dom'
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as actions from '../actions';

import RaisedButton from 'material-ui/RaisedButton';

const windowID = require('electron').remote.getCurrentWindow().id;

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

	// shouldComponentUpdate(nextProps, nextState) {
	// 	console.log("this is component should update")
	// 	if (nextState !== this.state) {
	// 		return true;
	// 	}
	// }

	componentWillMount() {
		this.updateWindowDimensions();
	}

	componentDidMount() {
		global.addEventListener('resize', this.updateWindowDimensions);

		console.log('this is the get current window', require('electron').remote.getCurrentWindow().id);
		// this.mounted = true;
		// i don't have to setState i guess...
		ipcRenderer.on('send:queueDone', (event, botStack) => {
			console.log("this is the botstack from homeScreen", botStack);
			var tempDownloadList = botStack.botSearches;
			if (tempDownloadList.length > 0 && windowID == 2) {
				this.props.history.push('/downloadList');
				this.props.downloadWindowSend(tempDownloadList);
			}
		});

		ipcRenderer.on('start:downloadsDone', (event, optimizedBotStack) => {
			console.log("this is the optimizedBotStack", optimizedBotStack);
			var tempOptimizedBots = optimizedBotStack.optimizedBots;
			if (tempOptimizedBots.length > 0 && windowID === 3) {

				this.props.history.push('/downloading');
				this.props.downloadingItems(tempOptimizedBots);
			}
		});
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

	renderAnimeChartPanel() {
		if(this.props.forwardList.forwardList !== null) {
			return(
				<div id="wrapper">
					<div id="left">
						<AnimeChartPanel />
					</div>
					<div id="right">
						<ForwardList />
					</div>
				</div>
			);
		} 
		
		else {
			return(
				<div>
					<AnimeChartPanel />
				</div>
			);
		}
	}

  render() {
	// var layout = [
		// {i: 'weatherPanel', x: 0, y: 0, w: 3, h: 4},
		// {i: 'pocketPanel', x: 9, y: 7, w: 3, h: 3},
  //   ];

	  return (
	    <div>
	      <div id="alignRight">
	      	<RaisedButton 
	      		onClick={this.switchScreens.bind(this)} 
	      		style={{ marginRight: 5, marginLeft: 15}} 
	      		label="xdcc search"
	      	/>
	    	</div>
	    	{this.renderAnimeChartPanel()}
	    </div>
	  );
  }
}

function mapStateToProps(state) {
	return {
		forwardList: state.forwardList
	}
}
// export default withRouter(HomeScreen);
export default connect(mapStateToProps, actions)(withRouter(HomeScreen));