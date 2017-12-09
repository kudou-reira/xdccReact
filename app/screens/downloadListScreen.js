import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { ipcRenderer }  from 'electron';
import { connect } from 'react-redux';
import * as actions from '../actions';

import DownloadListPanel from '../components/downloadListPanel';

class DownloadListScreen extends Component {

	constructor() {
		super();
		this.state = {
			downloadList: []
		}
	}

	componentDidMount() {
		ipcRenderer.on('send:queueDone', (event, botStack) => {
			console.log("this is the downloadListener", botStack);
			this.setState({
				downloadList: botStack
			}, () => {
				console.log("this is downloadlist", this.state.downloadList);
				this.props.downloadWindowSend(this.state.downloadList);
			});
		});
	}

	// switchScreens() {
	// 	console.log("this is the switchScreens")
	// 	this.props.history.push('/alt')
	// }

	render(){
		console.log("this is downloadlist props", this.props.downloadList)
		return(
			<div>
				<div>
					<Link to="/">
						Go to homescreen
					</Link>
				</div>
				<DownloadListPanel list={this.props.downloadList} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		downloadList: state.downloadList
	}
}

// export default withRouter(DownloadListScreen);
export default connect(mapStateToProps, actions)(withRouter(DownloadListScreen));