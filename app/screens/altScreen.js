import React, { Component } from 'react';
import SearchPanel from '../components/searchPanel'
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
				<SearchPanel />
			</div>
		);
	}
}

export default withRouter(AltScreen);