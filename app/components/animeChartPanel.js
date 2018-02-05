import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import RenderedListSearch from './renderedListSearch';
import _ from 'lodash';

var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");

const styles = {
  customWidth: {
    width: 200
  }
};

class AnimeChartPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			series: true,
			sort: 'next episode',
			type: 'tv',
			order: 'ascending',
			season: this.findCurrentSeason(),
			continuingSeason: this.findContinuingSeason(),
			startDate: this.findCurrentDate("string"),
			continuingDate: this.findContinuingDate(),
			current: true,
			showRecent: false,
			searchTitle: '',
			recentParam: 24,
			open: false
		}

		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleSeasonChange = this.handleSeasonChange.bind(this);
		this.handleOrderChange = this.handleOrderChange.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.handleRecentSortChange = this.handleRecentSortChange.bind(this);

		this.addButtonClicked = this.addButtonClicked.bind(this);
		this.handleNestedListToggle = this.handleNestedListToggle.bind(this);
	}

	componentDidMount() {
		console.log("this is continuingSeason", this.state.continuingSeason);
		console.log("this is continuingDate", this.state.continuingDate);
		console.log("this is startDate", this.state.startDate);
		this.props.fetchAnime(this.state.season.toUpperCase(), this.state.startDate);
		console.log("this is the continuing season", this.state.continuingSeason);
		console.log("this is the continuing date", this.state.continuingDate);
		this.props.fetchContinuingAnime(this.state.continuingSeason.toUpperCase(), this.state.continuingDate);
	}

	handleNestedListToggle(item) {
    this.setState({
      open: item.state.open
    });
  };

  processSearchQuery(title, studio, genres, query) {
  	var cleanedArr = [];
  	var contains = [];
  	var amalgam = [];
  	var numberOfTrue = 0;
  	var trueCounter = 0;

  	title = this.cleanString(title);
  	studio = this.cleanString(studio);
		genres = this.processGenres(genres);

		amalgam = genres;
		amalgam.push(title);
		amalgam.push(studio);
		amalgam = amalgam.filter(Boolean);

		cleanedArr = this.formatQuery(query);
		// if(cleanedArr.length > 0) {
		// 	cleanedArr = cleanedArr.filter(Boolean);
		// }
		console.log("this is amalgam", amalgam);


		// separate into cleaned objects?
		for(let queryStr of cleanedArr) {
			for(let amalgamStr of amalgam) {
				contains.push(amalgamStr.indexOf(queryStr) !== -1)
			}
		}

		console.log("this is amalgam", amalgam);
		console.log("this is the cleaned query", cleanedArr);
		console.log("this is contains", contains);

		numberOfTrue = cleanedArr.length;
		for(let val of contains) {
			if(val === true) {
				trueCounter++;
			}
		}

		if(trueCounter === numberOfTrue) {
			return true;
		}

		return false;
	}

	processGenres(genres) {
		var cleanedGenres = [];
		for(let genre of genres) {
			cleanedGenres.push(this.cleanString(genre));
		}
		return cleanedGenres;
	}

	formatQuery(query) {
		var queryArr = query.split(",");
		var cleanedArr = [];
		for(let str of queryArr) {
			cleanedArr.push(this.cleanString(str));
		}

		return cleanedArr;
	}

	cleanString(str) {
		if(str.length > 0) {
			return str.replace(/[^\w]/g, "").toLowerCase();
		}
	}

	containsGenre(genres, search) {
		var cleanedGenres = [];
		for(let genre of genres) {
			cleanedGenres.push(this.cleanString(genre));
		}

		for(let genre of cleanedGenres) {
			if(genre.indexOf(search) !== -1) {
				return true;
			}
		}

		return false;
	}

	renderRecentList() {
		var anime = this.props.animeList.anime.media;
		console.log("this is renderRecentList", anime);
		anime = anime.filter((media) => {
			return media.format === "TV";
		});
		anime = this.filterByRecentParams(anime);
		anime = this.nextEpisodeRecent(anime);
		anime = this.renderAnimeSeries(anime);
		return anime;
	}

	renderAnimeOrOtherChart(typeOfFetch) {
		if(typeOfFetch === "new") {
			var anime = this.props.animeList.anime.media;
		}

		else if(typeOfFetch === "continuing") {
			// do double fetches in component did mount;
			var anime = this.props.animeList.continuingAnime.media;
			anime = anime.filter((anime) => {
				return anime.nextAiringEpisode.timeUntilAiring !== 0;
			});
		}

		if(this.props.animeList.search.length > 0) {
			anime = anime.filter((media) => {
				var studio = media.studios.nodes.length > 0 ? media.studios.nodes[0].name : '';
				var genres = media.genres.length > 0 ? media.genres : [];

				if(studio.length > 0 && genres.length > 0) {
					// return this.cleanString(media.title.userPreferred).indexOf(this.cleanString(this.props.animeList.search)) !== -1 || 
					// 			this.cleanString(studio).indexOf(this.cleanString(this.props.animeList.search)) !== -1 || this.containsGenre(genres, this.cleanString(this.props.animeList.search));
					return this.processSearchQuery(media.title.userPreferred, studio, genres, this.props.animeList.search);
				} else {
					return this.processSearchQuery(media.title.userPreferred, "", "", this.props.animeList.search);
				}
			});
		}

		console.log("inside anilist is not null");
		console.log("this is sort", this.state.sort);
		switch(this.state.sort) {
			case 'alphabetically':
				anime = this.alphabetize(anime);
				break;
			case 'score':
				anime = this.score(anime);
				break;
			case 'popularity':
				anime = this.popularity(anime);
				break;
			case 'next episode':
				anime = this.nextEpisode(anime);
				break;
			case 'series length':
				anime = this.seriesLength(anime);
				break;
		}

		if(this.state.type === 'tv') {
			anime = anime.filter((media) => {
				return media.format === "TV";
			});

			anime = this.renderAnimeSeries(anime);
		}

		else if (this.state.type === 'single') {
			anime = anime.filter((media) => {
				return media.format === "MOVIE" || media.format === "OVA" || media.format === "SPECIAL";
			});

			anime = this.renderAnimeSeries(anime);
		}
		return anime;
	}

	seriesLength(anime) {
		if(this.state.order === 'descending') {
			anime.sort(function(a, b){
				return b.episodes - a.episodes;
			});
		}

		else if(this.state.order === 'ascending') {
			anime.sort(function(a, b){
				return a.episodes - b.episodes;
			});
		}

		return anime;
	}

	nextEpisode(anime) {
		if(this.state.order === 'descending') {
			anime.sort(function(a, b){
				return b.nextAiringEpisode.timeUntilAiring - a.nextAiringEpisode.timeUntilAiring;
			});
		}

		else if(this.state.order === 'ascending') {
			anime.sort(function(a, b){
				return a.nextAiringEpisode.timeUntilAiring - b.nextAiringEpisode.timeUntilAiring;
			});
		}

		return anime;
	}

	filterByRecentParams(anime) {
		var now = moment(new Date());

		anime = anime.filter((media) => {
			var unixTime = media.nextAiringEpisode.airingAt;
			console.log("this should be unix time", unixTime);
			var end = moment.unix(unixTime)
			var duration = moment.duration(now.diff(end));
			var hoursDuration = duration.asHours();

			return Math.abs(7*24 - Math.abs(hoursDuration)) <= this.state.recentParam;
		});

		return anime;
	}

	nextEpisodeRecent(anime) {
		anime.sort(function(a, b){
			return a.nextAiringEpisode.timeUntilAiring - b.nextAiringEpisode.timeUntilAiring;
		});
		return anime;
	}

	popularity(anime) {
		if(this.state.order === 'descending') {
			anime.sort(function(a, b){
				return b.popularity - a.popularity;
			});
		}

		else if(this.state.order === 'ascending') {
			anime.sort(function(a, b){
				return a.popularity - b.popularity;
			});
		}

		return anime;
	}

	score(anime) {
		if(this.state.order === 'descending') {
			anime.sort(function(a, b){
				return b.averageScore - a.averageScore;
			});
		}

		else if(this.state.order === 'ascending') {
			anime.sort(function(a, b){
				return a.averageScore - b.averageScore;
			});
		}
		return anime;
	}

	alphabetize(anime) {
		function compareDescending(a,b) {
		  if (a.title.userPreferred < b.title.userPreferred){
		    return -1;
		  }
		  if (a.title.userPreferred > b.title.userPreferred){
		    return 1;
		  }
		  return 0;
		}

		function compareAscending(a,b) {
		  if (a.title.userPreferred > b.title.userPreferred){
		    return -1;
		  }
		  if (a.title.userPreferred < b.title.userPreferred){
		    return 1;
		  }
		  return 0;
		}

		if(this.state.order === 'ascending') {
			anime.sort(compareDescending);
		} 

		else if(this.state.order === 'descending') {
			anime.sort(compareAscending);
		}

		return anime;
	}

	renderAnimeSeries(anime) {
		if(this.props.animeList.anime !== null) {
			anime = anime.map((anime) => {
				return(
					<div 
						className="card cardBorder"
						key={anime.id}
					>
						<div>
							{this.renderAiring(anime.nextAiringEpisode.timeUntilAiring, anime.status, anime.nextAiringEpisode.episode)}
						</div>
						<div className="fade">
							<hr />
							<div>
								{this.renderSources()}
							</div>
							<hr />
						</div>
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
						&nbsp;{popularity}
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

addButtonClicked() {
	// they're in array format
  	console.log("this is the add button in anime chart panel");
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

  generateListContent() {
  	return(
  		[
  			<ListItem>
					inner list
				</ListItem>
  		]
  	);
  }

	renderIconButtons() {
  	return(
      <div>
  			<RaisedButton 
		  		label="Add to queue" 
		  		style={{marginTop: 5.5, marginRight: 5}}
		  		onClick={() => this.addButtonClicked()} 
		  	/>
      </div>
  	);
  }

	renderListItem() {
		return(
			<ListItem
        rightIconButton={
        	this.renderIconButtons()
        }
        primaryText={"hi"}
        primaryTogglesNestedList={true}
        nestedItems={this.generateListContent()}
      />
		);
	}

	renderSources() {
		return(
			<div id="wrapper2" className="bottomMargin">
				<div id="wide" className="center">
					<p>Available Sources</p>
					Up to episode
				</div>
				<div id="narrow">
					<div className="center">
						testHold
					</div>
					<List>
						{this.renderListItem()}
					</List>
				</div>
			</div>
		);
	}

	renderAiring(time, status, nextEpisode) {
		if (time !== 0) {
			return(
				<div id="wrapper2" className="bottomMargin">
					<div id="wide" className="center">
						<p>Episode {nextEpisode} airs in:</p>
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

	findContinuingDate() {
		var currentSeason = this.findCurrentSeason();
		var currentDate = this.findCurrentDate("int");
		var continuingDate;

		if(currentSeason === 'winter') {
			continuingDate = (this.findCurrentDate("int") - 1) + "%";
		}

		else {
			continuingDate = this.findCurrentDate("string");
		}

		return continuingDate;

	}

	findContinuingSeason() {
		var currentSeason = this.findCurrentSeason();
		var currentDate = this.findCurrentDate("int");
		var continuingSeason;

		if(currentSeason === 'winter') {
			continuingSeason = 'fall';
		}

		else if(currentSeason === 'fall') {
			continuingSeason = 'spring';
		}

		else if(currentSeason === 'summer') {
			continuingSeason = 'spring';
		}

		else if(currentSeason === 'spring') {
			continuingSeason = 'winter';
		}

		return continuingSeason;
	}

	findCurrentSeason() {
		var nowMonth = moment().month();
		console.log("this is now month", nowMonth);

		if (0 <= nowMonth <= 2) {
			return 'winter';
		}

		else if(3 <= nowMonth <= 5) {
			return 'spring';
		}

		else if(6 <= nowMonth <= 8) {
			return 'summer';
		}

		else if(9 <= nowMonth <= 11) {
			return 'fall';
		}
	}

	findCurrentDate(formatType) {
		var newYear;
		var nowYear = moment().year();
		var nowMonth = moment().month();

		console.log("this is now month", nowMonth);
		
		if (formatType === "string") {
			newYear = nowYear + "%";
		}
	
		else if (formatType === "int") {
			newYear = nowYear;
		}
		return newYear;
	}

	handleStartDateChange(event, index, value){
		this.setState({
			startDate: value
		}, () => {
			console.log("this is startDate", this.state.startDate);
			this.props.fetchAnime(this.state.season.toUpperCase(), this.state.startDate);
		});
	} 

	renderStartDate() {
		return(
			<div>
        <DropDownMenu
          value={this.state.startDate}
          onChange={this.handleStartDateChange}
          name="order"
          style={styles.customWidth}
          autoWidth={false}
        >
        	{this.generateStartDates()}
        </DropDownMenu>
      </div>
		);
	}

	generateStartDates() {
		var nowMonth = moment().month();
		var currentDateToUse = this.findCurrentDate("int");
		if(nowMonth === 11) {
			currentDateToUse += 1;
		}

		var tempStartDates = [];
		console.log("this is generateStartDates");
		for(var i = currentDateToUse; i > 1923; i--) {
			tempStartDates.push(i); 
		}

		console.log("this is tempStartDates", tempStartDates);

		tempStartDates = tempStartDates.map((year) => {
			return(
				<MenuItem value={this.formatYear(year)} primaryText={year} />
			);
		})

  	return tempStartDates;
	}

	formatYear(year) {
		return year + "%";
	}

	handleSeasonChange(event, index, value){
		this.setState({
			season: value
		}, () => {
			console.log("this is season", this.state.season);
			// var continuing = this.props.animelist.anime.media.map((anime) => {
			// 	return anime.endDate.year === null;
			// });
			// console.log("this is continuing", continuing);
			this.props.fetchAnime(this.state.season.toUpperCase(), this.state.startDate);
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
          <MenuItem value="series length" primaryText="Series length" />
        </DropDownMenu>
      </div>
		);
	}

	handleRecentSortChange(event, index, value){
		this.setState({
			recentParam: value
		}, () => {
			console.log("this is recentParam sort", this.state.recentParam);
		});
	} 

	renderRecentSort() {
		return(
			<div>
        <DropDownMenu
          value={this.state.recentParam}
          onChange={this.handleRecentSortChange}
          style={styles.customWidth}
          autoWidth={false}
        >
          <MenuItem value={12} primaryText="Within half a day" />
          <MenuItem value={24} primaryText="Within 1 Day" />
          <MenuItem value={48} primaryText="Within 2 Days" />
          <MenuItem value={72} primaryText="Within 3 Days" />
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
		tempStatus = tempStatus.charAt(0).toUpperCase() + tempStatus.slice(1);
		tempStatus = tempStatus.replace(/_/g, ' ');;
		return tempStatus;
	}

	formatDescription(description) {
		description = description.replace(/<br\s*[\/]?>/gi, "")
		description = description.replace(/<i>/gi, "")
		description = description.replace(/<\/i>/gi, "")

		var parens = this.formatSource(description);
		// var i = this.formatI(description);

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
		if (parens !== null) {
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

	renderCards() {
		return(
			<div className="cards">
				{
					(this.state.current)
					? this.renderAnimeOrOtherChart("new")
					: this.renderAnimeOrOtherChart("continuing")
				}
		  </div>
		);
	}

	renderRecentlyAired() {
		return(
			<div>
				<div className="center2">
					<div className="groupDrop">
						<div id="dropdown1">
						</div>
						<div id="dropdown2">
							<p>Recently Aired</p>
							<div>
								{this.renderRecentSort()}
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="cards">
						{this.renderRecentList()}
					</div>
				</div>
			</div>
		);
	}

	renderRecentOrNot() {
		if(this.state.showRecent === true) {
			return(
				<div id="wrapper">
					<div id="left">
						{this.renderCards()}
					</div>
					<div className="divider"></div>
					<div id="right">
						{this.renderRecentlyAired()}
					</div>
					<div className="divider"></div>
				</div>
			);
		} 
		
		else {
			return(
				<div>
					{this.renderCards()}
				</div>
			);
		}
	}

	render() {
		return(
			<div>
				<div className="center">
					Currently Airing Anime
				</div>
				{
					(this.props.animeList.anime === null)
						? <div className="center">Loading...</div>
						: <div>
								<div className="groupDrop">
									<div id="dropdown1">
										{this.renderSeason()}
										{this.renderStartDate()}
									</div>
									<div id="dropdown2">
										{this.renderFormatSelect()}
										{this.renderSort()}
										{this.renderOrder()}
									</div>
								</div>
								<div>
									<div className="center2">
										<div className="groupDrop">
											<div id="dropdown1">
												<RenderedListSearch />
											</div>
											  <div id="dropdown2">
											  		{
											  			(this.state.current)
											  			? <RaisedButton 
											            label="See Continuing Series" 
											            style={{marginTop: 5.5, marginRight: 5}}
											            onClick={() => this.setState({ current: false })} 
											          />
											        : <RaisedButton 
											            label="See New Series" 
											            style={{marginTop: 5.5, marginRight: 5}}
											            onClick={() => this.setState({ current: true })} 
											          />
											  		}
											  		{
											  			(this.state.showRecent)
											  			? <RaisedButton 
											            label="Hide Recently Aired" 
											            style={{marginTop: 5.5, marginRight: 5}}
											            onClick={() => this.setState({ showRecent: false })} 
											          />
											        : <RaisedButton 
											            label="Show Recently Aired" 
											            style={{marginTop: 5.5, marginRight: 5}}
											            onClick={() => this.setState({ showRecent: true })} 
											          />
											  		}
											  </div>
										</div>
									</div>
									<div>
									  {this.renderRecentOrNot()}
									</div>
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