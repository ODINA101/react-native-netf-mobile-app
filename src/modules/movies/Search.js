import React, { PropTypes, Component } from 'react';
import {
	View,
	ListView,
	TextInput
} from 'react-native';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { TMDB_URL, TMDB_API_KEY } from '../../constants/api';
import * as moviesActions from './movies.actions';
import CardThree from './components/CardThree';
import styles from './styles/Search';
import { iconsMap } from '../../utils/AppIcons';

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			currentPage: 1,
			dataSource:new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }).cloneWithRows([]),
			searchResults: {
				results: []
			},
			query: null
		};

		this._viewMovie = this._viewMovie.bind(this);
		this._handleTextInput = this._handleTextInput.bind(this);
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
	}

	_handleTextInput(event) {
		const query = event.nativeEvent.text;
		this.setState({ query });
		if (!query) this.setState({ query: '' });
  if(query.length > 1) {
this.setState({
	dataSource:new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }).cloneWithRows([])
},()=> {

				axios.get(`http://net.adjara.com/Home/quick_search?ajax=1&search=${this.state.query}`)
					.then(res => {
						//alert(res.data)
				//		alert(`http://net.adjara.com/Home/quick_search?ajax=1&search=${this.state.query}`)
						let data = [];

					//	alert(JSON.stringify(res.data.movies.data))
										if(res.data.movies.data) {
		        //const newData = res.data.movies.data;
	         setTimeout(() => {
						let ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
						let dataSource = ds.cloneWithRows(res.data.movies.data);
						this.setState({
							dataSource
						},()=> {
	     this.setState({isLoading:false})

						});
		},10)

						}




						//alert(JSON.stringify(res.data))
					}).catch(err => {
						console.log('next page', err); // eslint-disable-line
					//	alert(err)
					});
})


	}

	}

	_retrieveNextPage() {
	}

	_viewMovie(movieId,info,des) {
		fetch(`http://net.adjara.com/req/jsondata/req.php?id=${info.id}&reqId=getInfo`)
		  .then(res => res.json())
		  .then(res => {
			if (res['1']) {
				console.log('serialia');
				this.props.navigator.showModal({
		 			screen: 'movieapp.Serie',
		 			passProps: {
		 				movieId:info.id,
		 				item:Object.assign(info,{description:des}),
						searching:true
		 			},
		 			backButtonHidden: true,
		 			navigatorButtons: {
		 				rightButtons: [
						{
							id:"love",
							icon:iconsMap['ios-heart-outline']
						},
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
		 				item:Object.assign(info,{description:des}),
						searching:true
		 			},
		 			backButtonHidden: true,
		 			navigatorButtons: {
		 				rightButtons: [
							{
							id:"love",
							icon:iconsMap['ios-heart-outline']
						  },
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


	_onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'close') {
				this.props.navigator.dismissModal();
			}
		}
	}

	_renderListView() {
		let listView;
		if (this.state.query) {
			listView = (
				<ListView
					enableEmptySections
					onEndReached={type => this._retrieveNextPage()}
					onEndReachedThreshold={1200}
					dataSource={this.state.dataSource}
					renderRow={(rowData,ind) => <CardThree searching={true} info={rowData} viewMovie={(data,des) => {this._viewMovie(data.id,data,des)}} />}
					renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
				/>
			);
		} else {
			listView = <View />;
		}

		return listView;
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.searchbox}>
					<View style={styles.searchboxBorder}>
						<TextInput
							style={styles.textInput}
							autoFocus
							returnKeyType={'search'}
							value={this.state.query}
							onChange={this._handleTextInput}
							underlineColorAndroid="transparent"
						/>
					</View>
				</View>
				{ !this.state.isLoading && this._renderListView() }
			</View>

		);
	}
}

Search.navigatorStyle = {
	statusBarColor: 'black',
	statusBarTextColorScheme: 'light',
	navBarBackgroundColor: '#0a0a0a',
	navBarTextColor: 'white',
	navBarButtonColor: 'white'
};

function mapStateToProps(state, ownProps) {
	return {
		searchResults: state.movies.searchResults
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
