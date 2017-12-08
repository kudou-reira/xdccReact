import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { ipcRenderer }  from 'electron';

ipcRenderer.on('send:queueDone', (event, botStack) => {
	console.log("this is the botstack in downloadlist", botStack);

});

class DownloadListScreen extends Component {

	componentDidMount() {

	}

	// switchScreens() {
	// 	console.log("this is the switchScreens")
	// 	this.props.history.push('/alt')
	// }

	render(){
		return(
			<div>
				<div>
					<Link to="/">
						Go to homescreen
					</Link>
				</div>
				this is the download list screen
			</div>
		);
	}
}

export default withRouter(DownloadListScreen);