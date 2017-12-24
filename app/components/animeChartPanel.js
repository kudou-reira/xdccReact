import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");

const styles = {
  customWidth: {
    width: 182
  }
};

class AnimeChartPanel extends Component {
	constructor() {
		super();
		this.state = {
			series: true,
			sort: 'alphabetically',
			type: 'tv',
			order: 'ascending',
			season: 'fall'
		}

		this.handleSeasonChange = this.handleSeasonChange.bind(this);
		this.handleOrderChange = this.handleOrderChange.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
		this.handleTypeChange = this.handleTypeChange.bind(this);
	}

	componentDidMount() {
		this.props.fetchAnime(this.state.season.toUpperCase(), "2017%");
	}

	renderAnimeOrOtherChart() {
		var anime;
		console.log("inside anilist is not null");
		if(this.state.type === 'tv') {
			anime = this.props.animeList.anime.media.filter((media) => {
				return media.format === "TV";
			});

			anime = this.renderAnimeSeries(anime);
		}

		else if (this.state.type === 'single') {
			anime = this.props.animeList.anime.media.filter((media) => {
				return media.format === "MOVIE" || media.format === "OVA";
			});

			anime = this.renderAnimeSeries(anime);
		}
		return anime;
	}

	renderAnimeSeries(anime) {
		if(this.props.animeList.anime !== null) {
			console.log("this is filtered anime", anime);

			anime = anime.map((anime) => {
				return(
					<div 
						className="card cardBorder"
						key={anime.id}
					>
						<div>
							{this.renderAiring(anime.nextAiringEpisode.timeUntilAiring, anime.status)}
						</div>
						<hr />
						<div id="wide">
							<div className="center topMargin3">
								<img className="imgRound" src={anime.coverImage.large} />
								{this.renderStudio(anime.studios.nodes[0])}
							</div>
						</div>
						<div id="narrow">
							<div className="center topMargin2">
								<h2>
									{anime.title.userPreferred}
								</h2>
							</div>
							<div id="topMargin">
								{this.formatDescription(anime.description)}
								<div id="alignRight">
									{this.formatSource(anime.description)}
								</div>
								<hr />
								<div>
									{this.renderEpisodes(anime.episodes)}
								</div>
								<div>
									{this.renderGenre(anime.genres)}
								</div>
								<div>
									{this.renderAverageScore(anime.averageScore)}
								</div>
								<div>
									{this.renderPopularity(anime.popularity)}
								</div>
							</div>
						</div>
					</div>
				);
			});
		}
		return anime;
	}

	renderPopularity(popularity) {
		return(
			<div id="alignLeft">
				<div id="text">
					<div>
						<p>Popularity: </p>
					</div>
					<div>
						&nbsp;#{popularity}
					</div>
				</div>
			</div>
		);
	}

	renderAverageScore(avgScore) {
		return(
			<div id="alignLeft">
				<div id="text">
					<div>
						<p>Average score: </p>
					</div>
					<div>
						&nbsp;{avgScore}/100
					</div>
				</div>
			</div>
		);
	}

	renderEpisodes(episodes) {
		return(
			<div id="alignLeft" className="topMargin2">
				<div id="text">
					<div>
						<p>Number of Episodes: </p>
					</div>
					<div>
						&nbsp;{episodes}
					</div>
				</div>
			</div>
		);
	}

	renderGenre(genres) {
		console.log("these are the genres", genres);
		genres = genres.join(', ');

		return(
			<div id="alignLeft">
				<div id="text">
					<div>
					<p>Genres: </p>
					</div>
					<div>
						&nbsp;{genres}
					</div>
				</div>
			</div>
		);
	}

	renderStudio(nodes) {
		if(nodes !== undefined) {
			console.log("this is nodes", nodes);
			return(
				<div className="topMargin2">
					<div id="text">
						<div>
						<p>Studio: </p>
						</div>
						<div>
							&nbsp;{nodes.name}
						</div>
					</div>
				</div>
			);
		}
	}

	renderAiring(time, status) {
		if (status === "RELEASING" && time !== 0) {
			return(
				<div id="wrapper2" className="bottomMargin">
					<div id="wide" className="center">
						<p>Next episode airs in:</p>
					</div>
					<div id="narrow">
						<div className="center">
							{moment.duration(time, "seconds").format("d [days]  h [hours]  m [minutes]  s [seconds]")}
						</div>
					</div>
				</div>
			);
		}

		else if (status === "FINISHED" || status === "NOT_YET_RELEASED" || time === 0) {
			return(
				<div id="wrapper2" className="bottomMargin">
					<div id="wide" className="center">
						<p>
							Status:
						</p>
					</div>
					<div id="narrow">
						<div className="center">
							{this.formatStatus(status)}
						</div>
					</div>
				</div>
			);
		}
	}

	handleSeasonChange(event, index, value){
		this.setState({
			season: value
		}, () => {
			console.log("this is season", this.state.season);
			this.props.fetchAnime(this.state.season.toUpperCase(), "2017%");
		});
	} 

	renderSeason() {
		return(
			<div>
        <DropDownMenu
          value={this.state.season}
          onChange={this.handleSeasonChange}
          name="order"
          style={styles.customWidth}
          autoWidth={false}
        >
        	<MenuItem value="spring" primaryText="Spring" />
        	<MenuItem value="summer" primaryText="Summer" />
          <MenuItem value="fall" primaryText="Fall" />
          <MenuItem value="winter" primaryText="Winter" />
        </DropDownMenu>
      </div>
		);
	}

	handleOrderChange(event, index, value){
		this.setState({
			order: value
		}, () => {
			console.log("this is order", this.state.order);
		});
	} 

	renderOrder() {
		return(
			<div>
        <DropDownMenu
          value={this.state.order}
          onChange={this.handleOrderChange}
          name="order"
          style={styles.customWidth}
          autoWidth={false}
        >
          <MenuItem value="ascending" primaryText="Ascending" />
          <MenuItem value="descending" primaryText="Descending" />
        </DropDownMenu>
      </div>
		);
	}


	handleSortChange(event, index, value){
		this.setState({
			sort: value
		}, () => {
			console.log("this is sort", this.state.sort);
		});
	} 

	renderSort() {
		return(
			<div>
        <DropDownMenu
          value={this.state.sort}
          onChange={this.handleSortChange}
          style={styles.customWidth}
          autoWidth={false}
        >
          <MenuItem value="alphabetically" primaryText="Alphabetically" />
          <MenuItem value="score" primaryText="Score" />
          <MenuItem value="popularity" primaryText="Popularity" />
          <MenuItem value="next episode" primaryText="Next episode" />
          <MenuItem value="episode length" primaryText="Episode length" />
        </DropDownMenu>
      </div>
		);
	}

	handleTypeChange(event, index, value){
		this.setState({
			type: value
		}, () => {
			console.log("this is type", this.state.type);
		});
	} 

	renderFormatSelect() {
		return(
			<div>
        <DropDownMenu
          value={this.state.type}
          onChange={this.handleTypeChange}
          style={styles.customWidth}
          autoWidth={false}
        >
          <MenuItem value="tv" primaryText="TV Series" />
          <MenuItem value="single" primaryText="Movie/OVA" />
        </DropDownMenu>
      </div>
		);
	}

	formatStatus(status) {
		var tempStatus = status.toLowerCase();
		return tempStatus.charAt(0).toUpperCase() + tempStatus.slice(1);
	}

	formatDescription(description) {
		console.log("this is description", description);
		description = description.replace(/<br\s*[\/]?>/gi, "")
		description = description.replace(/<i>/gi, "")
		description = description.replace(/<\/i>/gi, "")

		var parens = this.formatSource(description);
		// var i = this.formatI(description);


		console.log("this is parens", parens);

		description = description.replace(parens, "")
		// description = description.replace(i, "")

		var finalDescription = description.split('\n').map(function(item, key) {
		  return (
		  	<div>
			    <span key={key}>
			      {item}
			    </span>
			    <div id="source">
			    </div>
			    <div id="source">
			    </div>
		    </div>
		  )
		});

		return finalDescription;
	}

	formatSource(description) {
		var parens;
		parens = description.match(/\(([^()]+)\)/g);
		console.log("this is parens", parens);
		if (parens !== null) {
			console.log("this is parens length", parens.length);
			return parens[parens.length-1]
		}
	}

	formatI(description) {
		var i;
		i = description.match(/<i>(.*?)<\/i>/g);
		console.log("this is i", i);
		if (i !== null) {
			console.log("this is the first element of i", i[0]);
			return i[0];
		}
	}

	replaceI(i) {
		if (i !== null) {
			i = i.replace(/<i>/gi, "");
			i = i.replace(/<\/i>/gi, "");
			return i;
		}
	}


	render() {
		return(
			<div>
				<div className="center">
					this is the anime chart
				</div>
				{
					(this.props.animeList.anime === null)
						? <div className="center">Loading...</div>
						: <div>
								<div className="groupDrop">
									<div>
										{this.renderSeason()}
									</div>
									<div id="dropdown">
										{this.renderFormatSelect()}
										{this.renderSort()}
										{this.renderOrder()}
									</div>
								</div>
								<div className="cards">
									{this.renderAnimeOrOtherChart()}
								</div>
							</div>
				}

			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		animeList: state.animeList
	}
}

export default connect(mapStateToProps, actions)(AnimeChartPanel);