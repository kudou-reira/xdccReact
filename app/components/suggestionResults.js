import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';

class SuggestionResults extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchSuggestions: [],
			open: false
		}

		this.handleToggle = this.handleToggle.bind(this);
		this.handleNestedListToggle = this.handleNestedListToggle.bind(this);
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

  renderListSuggestion() {
  	if(this.props.suggestions !== null) {
  		// add listitems into the renderlist suggestion stuff down below
  		var listSuggests = this.props.suggestions.tempSearches.map((suggest, index) => {
				return(
					<div>
						hi
					</div>
				)
			});
  	}
  	console.log("this is suggestions", this.props.suggestions);

  	<div>
      <List>
        <Subheader>Nested List Items</Subheader>
        <ListItem primaryText="Sent mail" />
        <ListItem primaryText="Drafts" />
        <ListItem
          primaryText="Inbox"
          initiallyOpen={true}
          primaryTogglesNestedList={true}
          nestedItems={[
            <ListItem
              key={1}
              primaryText="Starred"
            />,
            <ListItem
              key={2}
              primaryText="Sent Mail"
              nestedItems={[
                <ListItem key={1} primaryText="Drafts" />,
              ]}
            />,
            <ListItem
              key={3}
              primaryText="Inbox"
              open={this.state.open}
              onNestedListToggle={this.handleNestedListToggle}
              nestedItems={[
                <ListItem key={1} primaryText="Drafts" />,
              ]}
            />,
          ]}
        />
      </List>
    </div>
  }


	render() {
		// can maybe use svg icons to get anime icon info from an api
		// myanimelist?
		// atarashii?
		// https://github.com/AniList/ApiV2-GraphQL-Docs


		return(
			<div>
				"this is the suggestion results window"
				<Toggle
          toggled={this.state.open}
          onToggle={this.handleToggle}
          labelPosition="right"
          label="This toggle controls the expanded state of the submenu item."
        />
        <br />
        {this.renderListSuggestion()}
			</div>
		)
	}
}

export default SuggestionResults;