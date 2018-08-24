import React, { Component } from 'react';
import SuggestionResults from './suggestionResults';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { Debounce, Throttle } from 'react-throttle';
import * as actions from '../actions';

class SearchPanel extends Component {

	constructor() {
		super();
		this.state = {
			searchTitle: '',
			searchSuggestions: [],
			searched: false
		};

		this.onTextChange = this.onTextChange.bind(this);
		this.onSearch = this.onSearch.bind(this);

		this.style = {
			buttonDiv: {
				marginTop: '10px',
				marginLeft: '20px'
			}
		}
	}

	// debounce the entire onTextChange event

	onTextChange(event) {
		this.setState({ searchTitle: event.target.value }, () => {
			console.log("this is the searchTitle state", this.state.searchTitle);
		});

		// if (this.state.searchTitle === '') {
		// 	setTimeout(() => {
		// 		this.props.fetchSuggestions(this.state.searchTitle);
		// 	}, 1800);
		// }

		// else if (this.state.searchTitle.length >= 3) {
		// 	setTimeout(() => {
		// 		this.props.fetchSuggestions(this.state.searchTitle);
		// 	}, 1800);
		// }

	}

	onSearch() {
		console.log("this is on click in searchpanel");
		this.props.fetchSuggestions(this.state.searchTitle);
		this.setState({ searched: true });
	}

	stopLoad = () => {
		this.setState({ searched: false });
	}

	// renderButton() {
	// 	if(this.props.search.queried !== null) {
	// 		if(this.props.search.queried.tempSearches !== null) {
	// 			if(this.props.search.queried.tempSearches[0].Compilation !== null) {
	// 				return(
	// 					<RaisedButton label="Search this query instead" style={{ marginRight: 5, marginLeft: 15}} />
	// 				);
	// 			}
	// 		}
	// 	}
	// }

	render(){
		console.log("these are the results of the search query to go backend", this.props.search);

		return(
			<div>
				<div>
					this is the searchPanel
				</div>
				<div id="text">
					<div className="center">
					    <TextField
			         	  hintText="Enter title here"
				          floatingLabelText="Searching anime..."
				          onChange={this.onTextChange}
				        />
					</div>
					<div style={this.style.buttonDiv}>
						<RaisedButton 
							label="Search" 
							onClick={this.onSearch}
						/>
					</div>
				</div>
				<div>
					<SuggestionResults 
						suggestions={this.props.search.queried} 
						searched={this.state.searched} 
						searching={this.state.searching}
						stopLoad={this.stopLoad} 
					/>
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