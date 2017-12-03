import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';

class SuggestionResults extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchSuggestions: [],
			open: false
		}

		this.handleToggle = this.handleToggle.bind(this);
		this.handleNestedListToggle = this.handleNestedListToggle.bind(this);
		this.handleListItemClick = this.handleListItemClick.bind(this);
	}

	// componentWillReceiveProps(nextProps){
	// 	if(nextProps.suggestions !== this.props.suggestions){
	// 		if(nextProps.suggestions !== null) {
	// 			this.setState({ searchSuggestions: this.props.results }, () => {
	// 				console.log("new component", this.state.searchSuggestions);
	// 			});
	// 		}
	// 	}
	// }

	handleToggle() {
    this.setState({
      open: !this.state.open,
    });
  };

	handleNestedListToggle(item) {
    this.setState({
      open: item.state.open
    });
  };

  handleListItemClick(item) {
    this.setState({
      open: item.state.open
    });
  };

  renderButton() {
  	return(
  		<div>
  			Click me
  		</div>
  	);
  }

  generateListSuggestion() {
  	var listSuggests;
  	if(this.props.suggestions !== null) {
  		// add listitems into the renderlist suggestion stuff down below
  		if(this.props.suggestions.tempSearches !== null) {
  			listSuggests = this.props.suggestions.tempSearches.map((suggest, index) => {
  			// create the array of nested items here
  			// it will be the content from go backend
					return(
	          <ListItem
	            key={index}
	            rightIconButton={
								<RaisedButton label="Search" style={{marginTop: 5.5, marginRight: 5}} />
				      }
	            primaryText={suggest.Suggestion}
	            primaryTogglesNestedList={true}
	            onNestedListToggle={this.handleNestedListToggle}
	            nestedItems={this.generateListContent(suggest.SuggestionContent)}
	          />
					)
				});
  		}
  		
  		else if (this.props.suggestions.tempSearches === null) {
  			listSuggests = (
  				<div>
	  				Nothing matched your searches
	  			</div>
  			);
	  	}
  	}

  	console.log("this is suggestions", this.props.suggestions);
  	return listSuggests;
  }

  generateListContent(suggestContent) {
  	var listContent = suggestContent.map((content, index) => {
  		// var titleText = `Last Modified: ${content.LastModified} 
  		// Bot ID: ${content.BotId}`;
  		return(
  			<ListItem
  				key={index}
  				primaryText={'hello'}
  			>
  				{this.generateLabels(content)}
  			</ListItem>
  		);
  	});
  	return listContent;
  };

  generateLabels(content) {
  	return(
  		<div>
	  		<div>
	  			Last Modified: {content.LastModified}
	  		</div>
	  		<div>
	  			Bot Id: {content.BotId}
	  		</div>
	  		<div>
	  			Number: {content.Number}
	  		</div>
	  		<div>
	  			Size: {content.Size}
	  		</div>
  		</div>
  	);
  }

  renderListSuggestion() {
  	if(this.props.suggestions !== null) {
  		console.log("this is suggestions", this.props.suggestions);
  		console.log("this is state search", this.state.searches);
  		return(
	  		<div>
	        <br />
		      <List>
		        <Subheader>Did you mean...?</Subheader>
		        {this.generateListSuggestion()}
		      </List>
		    </div>
	  	);	
  	}
  }


	render() {
		// can maybe use svg icons to get anime icon info from an api
		// myanimelist?
		// atarashii?
		// https://github.com/AniList/ApiV2-GraphQL-Docs


		return(
			<div>
				"this is the suggestion results window"
        {this.renderListSuggestion()}
			</div>
		)
	}
}

export default SuggestionResults;