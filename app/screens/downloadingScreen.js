import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import DownloadingItemsPanel from '../components/downloadingItemsPanel';

class DownloadingScreen extends Component {
	render(){
		console.log("this is props in downloadingScreen", this.props.startDownload)
		return(
			<div>
				<div>
					<Link to="/">
						Go to homescreen
					</Link>
				</div>
				<DownloadingItemsPanel items={this.props.startDownload} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		startDownload: state.startDownload
	}
}

// export default withRouter(DownloadListScreen);
export default connect(mapStateToProps, null)(withRouter(DownloadingScreen));