import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import * as actions from '../actions';

class RenderedListSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	searchTitle: ''
    }

    this.onTextChange = this.onTextChange.bind(this);
  }

  onTextChange(event) {
		this.setState({ searchTitle: event.target.value }, () => {
			console.log("this is the searchTitle state", this.state.searchTitle);
			this.props.renderedSearch(this.state.searchTitle);
		});
	}

  render() {
  	return(
  		<div>
  			<TextField
         	hintText="Enter query (title, studio, genre)"
	        floatingLabelText="Search for anime?"
	        onChange={this.onTextChange}
	      />
  		</div>
  	);
  }
}

export default connect(null, actions)(RenderedListSearch);

