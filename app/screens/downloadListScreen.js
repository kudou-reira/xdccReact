import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import DownloadListPanel from '../components/downloadListPanel';

class DownloadListScreen extends Component {
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
export default connect(mapStateToProps, null)(withRouter(DownloadListScreen));