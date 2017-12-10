import React, { Component } from 'react';
import SearchPanel from '../components/searchPanel';
import TempSearchQueuePanel from '../components/tempSearchQueuePanel';
import DownloadListScreen from './downloadListScreen';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router';


class AltScreen extends Component {

	renderTempSearchQueueOrNot() {
		if(this.props.tempQueue.stack !== null) {
			return(
				<div id="wrapper">
					<div id="left">
						<SearchPanel />
					</div>
					<div id="right">
						<TempSearchQueuePanel />
					</div>
				</div>
			);
		} 
		
		else {
			return(
				<div>
					<SearchPanel />
				</div>
			);
		}

	}

	render() {
		return(
			<div>
				<Link to="/">
					go to homescreen
				</Link>
				<h1>
					this is the alternate screen
				</h1>
				{this.renderTempSearchQueueOrNot()}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		tempQueue: state.tempQueue
	}
}

// export default withRouter(AltScreen);
export default connect(mapStateToProps, null)(withRouter(AltScreen));