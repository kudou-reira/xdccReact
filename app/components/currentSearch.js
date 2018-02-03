import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

class CurrentSearch extends Component {
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
		});
	}

  render() {
  	return(
  		<div>
  			<TextField
         	hintText="Enter title here"
	        floatingLabelText="Searching anime..."
	        onChange={this.onTextChange}
	      />
  		</div>
  	);
  }

}

export default CurrentSearch;

