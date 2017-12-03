import React, { Component } from 'react';
import SuggestionResults from './suggestionResults';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { Debounce } from 'react-throttle';
import * as actions from '../actions';

class SearchPanel extends Component {

	constructor() {
		super();
		this.state = {
			searchTitle: '',
			searchSuggestions: []
		};
		this.onTextChange = this.onTextChange.bind(this);
	}

	// debounce the entire onTextChange event

	onTextChange(event) {
		this.setState({ searchTitle: event.target.value }, () => {
			console.log(this.state.searchTitle);
		});

		if(this.state.searchTitle.length >= 3) {
			this.props.fetchSuggestions(this.state.searchTitle)
		}
	}

	render(){
		console.log("these are the results of the search query to go backend", this.props.search);

		return(
			<div>
				<div>
					this is the searchPanel
				</div>
				<div>
					<Debounce time="400" handler="onChange">
						<TextField
		         	hintText="Enter title here"
			        floatingLabelText="Searching anime..."
			        onChange={this.onTextChange}
			      />
		      </Debounce>
				</div>
				<div>
					<SuggestionResults suggestions={this.props.search.queried} />
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		search: state.search
	}
}

export default connect(mapStateToProps, actions)(SearchPanel);