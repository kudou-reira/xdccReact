import React, { Component } from 'react';

class SuggestionResults extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchSuggestions: []
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.results!== this.props.results){
			if(nextProps.results !== null) {
				this.setState({ searchSuggestions: this.props.results }, () => {
					console.log("new component", this.props.results);
				});
			}
		}
	}

	render() {
		return(
			<div>
				"this is the suggestion results window"
			</div>
		)
	}
}

export default SuggestionResults;