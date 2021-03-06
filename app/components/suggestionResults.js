import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../actions';
import Loader from 'halogen/ScaleLoader';
import ShellExplorer from './shellExplorer';


class SuggestionResults extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchSuggestions: [],
			botSearch: [],
			open: false,
      newSuggest: false
		}

		this.handleNestedListToggle = this.handleNestedListToggle.bind(this);
		this.handleListItemClick = this.handleListItemClick.bind(this);
		this.addButtonClicked = this.addButtonClicked.bind(this);
		this.searchButtonClicked = this.searchButtonClicked.bind(this);
	}

  // componentWillReceiveProps(nextProps) {
  //   if(nextProps.suggestions !== null) {
  //     if(this.props.suggestions !== nextProps.suggestions) {
  //       // add listitems into the renderlist suggestion stuff down below
  //       if(this.props.suggestions.tempSearches !== null) {
  //         this.setState({ newSuggest: true })
  //       }
  //     } else {
  //       this.setState({ newSuggest: false });
  //     }
  //   }
  // }

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

  addButtonClicked(suggestion) {
  	// they're in array format
  	var tempArr = [];
  	tempArr.push(suggestion);
  	if (this.props.tempQueue.stack === null) {
  		this.props.updateTempQueue(tempArr, () => {
  			console.log("this is suggestion results tempqueue", this.props.tempQueue.stack);
  		});	
  	}

  	else {
  		// get the redux store and append the new value if it's not in it
  		var tempSuggestions = this.props.tempQueue.stack;
  		if(!_.includes(tempSuggestions, suggestion)) {
  			tempArr = tempSuggestions;
  			tempArr.push(suggestion);
  		  this.props.updateTempQueue(tempArr, () => {
  		  	console.log("this is suggestion results tempqueue", this.props.tempQueue.stack);
  		  });
  		}
  	}
  	
  }

  searchButtonClicked(suggestion) {

  	// CLEAR THE BOTSEARCHED FIRST IF USING THIS METHOD
  	console.log("this is the suggestion", suggestion);
  	this.setState({
  		botSearch: suggestion
  	}, () => {
  		console.log("this is single search", this.state.botSearch);
  	});
  }

  renderIconButtons(suggest) {
  	return(
      <div>
  			<RaisedButton 
		  		label="Add to queue" 
		  		style={{marginTop: 5.5, marginRight: 5}}
		  		onClick={() => this.addButtonClicked(suggest)} 
		  	/>
		    <RaisedButton 
		  		label="Individual Search" 
		  		style={{marginTop: 5.5, marginRight: 5}}
		  		onClick={() => this.searchButtonClicked(suggest)} 
		  	/>
      </div>
  	);
  }

  generateListSuggestion() {
  	var listSuggests;
  	var qualityError;
  	if(this.props.suggestions !== null) {
  		// add listitems into the renderlist suggestion stuff down below
  		if(this.props.suggestions.tempSearches !== null) {
  			listSuggests = this.props.suggestions.tempSearches.map((singleEpisode) => {
  				if (singleEpisode.Compilation !== null) {
  					return singleEpisode.Compilation.map((suggest, index) => {
		  				return(
			          <ListItem
			            key={index}
			            rightIconButton={
			            	this.renderIconButtons(suggest.Suggestion)
			            }
			            primaryText={suggest.Suggestion}
			            primaryTogglesNestedList={true}
			            onNestedListToggle={this.handleNestedListToggle}
			            nestedItems={this.generateListContent(suggest.SuggestionContent)}
			          />
							)
	  				});
  				}

  				else {
  					qualityError = true
  				}
  				
  			});

  			if (qualityError === true) {
  				return(
						<div>
			  			Your episode quality doesn't exist!
		  			</div>
					);
  			}
  		}
  		
  		else if (this.props.suggestions.tempErrors.Error) {
  			listSuggests = (
  				<div>
	  				<div>
		  				{this.props.suggestions.tempErrors.ErrorMessage}
		  			</div>
		  			<div>
		  				Nothing matched your search query
		  			</div>
	  			</div>
  			);
	  	}

	  	else {
	  		listSuggests = (
  				<div>
	  				Nothing matched your search query
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

  renderValid() {
  	var validQuery = false;
  	var validSuggest;

    // suggestions exists already, that's why there is no rerender
    // check that current suggestions are different from new suggestions

		if(this.props.suggestions !== null && !this.state.newSuggest) {
  		// add listitems into the renderlist suggestion stuff down below

      if(this.props.suggestions.tempSearches !== null) {
    			validSuggest = this.props.suggestions.tempSearches.map((singleEpisode) => {
    				if (singleEpisode.Compilation !== null) {
              this.props.stopLoad();
    					validQuery = true;
    				}
    			});
  		}

	  	else {
				validQuery = false;
	  	}
  	}

  	if (validQuery === true) {
  		// use these values to trigger loading icons!!!
  		return(
  			<div>
  				This is a valid request
  			</div>
  		);
  	}

  	else if (validQuery === false && this.props.searched) {
  		return(
  			<div className="center">
  				<div>
            <Loader color='#4DAF7C' size="18px" />
          </div>
  			</div>
  		);
  	}

  	else {
  		return(
  			<div>
          <br />
  				Please enter a query
          <br />
          <br />
          <div id="text">
            <div>
              <p>Example: </p>
            </div>
            <div>
              &nbsp;3-gatsu no Lion 7, 8 [720] for episodes 7, 8 and 720p quality
            </div>
          </div>
          <div>
            You may also query using a '-' for multiple episodes (1-8) ex. 3-gatsu no Lion 1-8 [720]
          </div>
          <br />
  			</div>
  		);
  	}
  }

  renderListSuggestion() {
  	if(this.props.suggestions !== null) {
  		console.log("this is suggestions", this.props.suggestions);
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
				<div className="center">
					{this.renderValid()}
          <br />
          <ShellExplorer />
				</div>
        {this.renderListSuggestion()}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		tempQueue: state.tempQueue
	}
}

export default connect(mapStateToProps, actions)(SuggestionResults);