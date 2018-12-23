import React, { PropTypes, Component } from 'react';
import {
	Platform,
	View,
	ListView,
	RefreshControl
} from 'react-native';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { TMDB_URL, TMDB_API_KEY } from '../../constants/api';
import * as moviesActions from './movies.actions';
import CardThree from './components/CardThree';
import ProgressBar from '../_global/ProgressBar';
import styles from './styles/MoviesList';
import { iconsMap } from '../../utils/AppIcons';

class MoviesList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			isRefreshing: false,
			currentPage: 1,
			list:[]
		};

		this._viewMovie = this._viewMovie.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this._retrieveMoviesList();
	}

	_retrieveMoviesList(isRefreshed) {
		this.props.actions.retrieveNowPlayingMovies(this.props.type, this.state.currentPage)
			.then(() => {
				const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
				const dataSource = ds.cloneWithRows(this.props.list);
				this.setState({
					list: this.props.list,
					dataSource,
					isLoading: false
				});
			});
		if (isRefreshed && this.setState({ isRefreshing: false }));
	}

	_retrieveNextPage(type) {
//		if (this.state.currentPage !== this.props.list.len) {
			this.setState({
				currentPage: this.state.currentPage + 15
			});

			let page;
			if (this.state.currentPage === 0) {
				page = 15;
				this.setState({ currentPage: 15 });
			} else {
				page = this.state.currentPage + 15;
			}

			axios.get("http://net.adjara.com/Search/SearchResults?ajax=1&display=15&startYear=1900&endYear=2018&offset=" + page + "&isnew=0&needtags=0&orderBy=date&order%5Border%5D=desc&order%5Bdata%5D=published&language=georgian&country=false&game=0&softs=0&videos=0&xvideos=0&vvideos=0&dvideos=0&xphotos=0&vphotos=0&dphotos=0&trailers=0&episode=0&tvshow=0&flashgames=0")
				.then(res => {
					const data = this.state.list;
					const newData = res.data.data;

					newData.map((item, index) => data.push(item));

					this.setState({
						dataSource: this.state.dataSource.cloneWithRows(this.state.list)
					});
				}).catch(err => {
					console.log('next page', err); // eslint-disable-line
				});
	//	}
	}

	_viewMovie(movieId,info) {
		fetch(`http://net.adjara.com/req/jsondata/req.php?id=${info.id}&reqId=getInfo`)
		  .then(res => res.json())
		  .then(res => {
			if (res['1']) {
				console.log('serialia');
				this.props.navigator.showModal({
		 			screen: 'movieapp.Serie',
		 			passProps: {
		 				movieId,
		 				item:info
		 			},
		 			backButtonHidden: true,
		 			navigatorButtons: {
		 				rightButtons: [
		 					{
		 						id: 'close',
		 						icon: iconsMap['ios-arrow-round-down']
		 					}
		 				]
		 			}
		 		});
			} else {
				console.log('filmia');
				this.props.navigator.showModal({
		 			screen: 'movieapp.Movie',
		 			passProps: {
		 				movieId,
		 				item:info
		 			},
		 			backButtonHidden: true,
		 			navigatorButtons: {
		 				rightButtons: [
		 					{
		 						id: 'close',
		 						icon: iconsMap['ios-arrow-round-down']
		 					}
		 				]
		 			}
		 		});
			}
		});

	}

	_onRefresh() {
		this.setState({ isRefreshing: true });
		this._retrieveMoviesList('isRefreshed');
	}

	_onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'close') {
				this.props.navigator.dismissModal();
			}
		}
	}

	render() {
		return (
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
			<ListView
				style={styles.container}
				enableEmptySections
				onEndReached={type => this._retrieveNextPage(this.props.type)}
				onEndReachedThreshold={1200}
				dataSource={this.state.dataSource}
				renderRow={rowData => <CardThree info={rowData} viewMovie={() => {this._viewMovie(rowData.id,rowData)}} />}
				renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
				renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
				refreshControl={
					<RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this._onRefresh}
						colors={['#EA0000']}
						tintColor="white"
						title="loading..."
						titleColor="white"
						progressBackgroundColor="white"
					/>
				}
			/>
		);
	}
}

let navigatorStyle = {};

if (Platform.OS === 'ios') {
	navigatorStyle = {
		navBarTranslucent: true,
		drawUnderNavBar: true
	};
} else {
	navigatorStyle = {
		navBarBackgroundColor: '#0a0a0a'
	};
}

MoviesList.navigatorStyle = {
	...navigatorStyle,
	statusBarColor: 'black',
	statusBarTextColorScheme: 'light',
	navBarTextColor: 'white',
	navBarButtonColor: 'white'
};

function mapStateToProps(state, ownProps) {
	return {
		list: state.movies.nowPlayingMovies
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesList);
