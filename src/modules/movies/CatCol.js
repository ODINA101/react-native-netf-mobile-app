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
import CardFour from './components/CardFour';
import ProgressBar from '../_global/ProgressBar';
import styles from './styles/MoviesList';
import { iconsMap } from '../../utils/AppIcons';

class CatCol extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			isRefreshing: false,
			currentPage: 1,
			list:[]
		};

		this._onRefresh = this._onRefresh.bind(this);
    this._viewCat = this._viewCat.bind(this)
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this._retrieveMoviesList(true);
	}


  	_viewCat(id,title,isCollection) {

  		if(isCollection) {

  		this.props.navigator.showModal({
  			title,
  			screen: 'movieapp.ColMoviesList',
  			passProps: {
  				title,
  				id
  			},
  		 	backButtonHidden:false,
  		});
  		}else{
  			this.props.navigator.showModal({
  			title,
  			screen: 'movieapp.CatMoviesList',
  			passProps: {
  				title,
  				id
  			},
  		 	backButtonHidden:false,
  		});

  		}


  	}
	_retrieveMoviesList(isRefreshed) {

    axios.get("http://adjaranet.com/req/jsondata/req.php?reqId=getCollections")
      .then(res => {
        res = res.data;
        var FinalData = [];

         Object.values(res).forEach((item,i) => {
               FinalData.push({
                   name:item.name,
                   id:Object.keys(res)[i]
               })
           })

                let data = FinalData;
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(data);
        this.setState({
          dataSource,
          isLoading: false
        },()=>{
        });
        //  alert(data)



      }).catch(err => {
        console.log('next page', err); // eslint-disable-line
      });
		if (isRefreshed && this.setState({ isRefreshing: false }));


	}
  _retrieveNextPage(type) {


    axios.get("http://adjaranet.com/req/jsondata/req.php?reqId=getCollections")
      .then(res => {
        res = res.data;
        var FinalData = [];

         Object.values(res).forEach((item,i) => {
               FinalData.push({
                   name:item.name,
                   id:Object.keys(res)[i]
               })
           })

                let data = FinalData;
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(data);
        this.setState({
          dataSource,
          isLoading: false
        },()=>{
        });
        //  alert(data)



      }).catch(err => {
        console.log('next page', err); // eslint-disable-line
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
			this.state.isLoading ? <View style={styles.progressBar}></View> :
			<ListView
        contentContainerStyle={styles.list}
        onEndReached={type => this._retrieveNextPage(this.props.type)}
				onEndReachedThreshold={2000}
				style={styles.container}
				dataSource={this.state.dataSource}
				renderRow={rowData => <CardFour collections={true} info={rowData} viewMovie={() => {this._viewCat(rowData.id,rowData)}} />}
				renderFooter={() => <View style={{ height: 50 }}></View>}
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

CatCol.navigatorStyle = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CatCol);
