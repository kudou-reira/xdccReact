import React, { Component } from 'react';
import SearchPanel from '../components/searchPanel';
import TempSearchQueuePanel from '../components/tempSearchQueuePanel';
import DownloadListScreen from './downloadListScreen';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router';

class AltScreen extends Component {
	render() {
		return(
			<div>
				<Link to="/">
					go to homescreen
				</Link>
				<h1>
					this is the alternate screen
				</h1>
				<div id="wrapper">
					<div id="left">
						<SearchPanel />
					</div>
					<div id="right">
						<TempSearchQueuePanel />
					</div>
				</div>
				<DownloadListScreen>
					<div>
						hi
					</div>
				</DownloadListScreen>
			</div>
		);
	}
}

export default withRouter(AltScreen);