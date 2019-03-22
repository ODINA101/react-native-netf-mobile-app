import React, { Component, PropTypes } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles/Drawer';

class Drawer extends Component {
	constructor(props) {
		super(props);

		this._goToMovies = this._goToMovies.bind(this);
		this._goToFavorites = this._goToFavorites.bind(this);
		this._openSearch = this._openSearch.bind(this);
		this._goToSeries = this._goToSeries.bind(this);
	}

	_openSearch() {
		this._toggleDrawer();
		this.props.navigator.showModal({
			screen: 'movieapp.Search',
			title: 'ძიება'
		});
	}

	_goToMovies() {
		this._toggleDrawer();
		this.props.navigator.popToRoot({
			screen: 'movieapp.Movies'
		});
	}


	_goToSeries() {
		this._toggleDrawer();
		this.props.navigator.showModal({
			screen: 'movieapp.MoviesList',
			title:'სერიალები',
			passProps: {
				type:"სერიალები ქართულად"
			}
		});
	}


	_goToFavorites() {
		this._toggleDrawer();
		this.props.navigator.showModal({
			screen: 'movieapp.Favorites',
			title:'Favorites'
		});
	}

	_toggleDrawer() {
		this.props.navigator.toggleDrawer({
			to: 'closed',
			side: 'left',
			animated: true
		});
	}

	render() {
		const iconSearch = (<Icon name="md-search" size={26} color="#9F9F9F" style={[styles.drawerListIcon, { paddingLeft: 2 }]} />);
		const iconMovies = (<Icon name="md-film" size={26} color="#9F9F9F" style={[styles.drawerListIcon, { paddingLeft: 3 }]} />);
		const iconFav = (<Icon name="md-heart" size={26} color="#9F9F9F" style={[styles.drawerListIcon, { paddingLeft: 3 }]} />);
		const iconTV = (<Icon name="ios-desktop" size={26} color="#9F9F9F" style={styles.drawerListIcon} />);
		return (
			<LinearGradient colors={['rgba(0, 0, 0, 0.7)', 'rgba(0,0,0, 0.9)', 'rgba(0,0,0, 1)']} style={styles.linearGradient}>
				<View style={styles.container}>
					<View style={styles.drawerList}>
						<TouchableOpacity onPress={this._openSearch}>
							<View style={styles.drawerListItem}>
								{iconSearch}
								<Text style={styles.drawerListItemText}>
									ძიება
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={this._goToMovies}>
							<View style={styles.drawerListItem}>
								{iconMovies}
								<Text style={styles.drawerListItemText}>
									ფილმები
								</Text>
							</View>
						</TouchableOpacity>


						<TouchableOpacity onPress={this._goToSeries}>
				<View style={styles.drawerListItem}>
		 			{iconTV}
					<Text style={styles.drawerListItemText}>
						სერიალები
					</Text>
				</View>
			</TouchableOpacity>

						<TouchableOpacity onPress={this._goToFavorites}>
							<View style={styles.drawerListItem}>
								{iconFav}
								<Text style={styles.drawerListItemText}>
									ფავორიტი
								</Text>
							</View>
						</TouchableOpacity>

					</View>
					<Text style={styles._version}>
						{/* 'v1.0.0' */}
					</Text>
				</View>
			</LinearGradient>
		);
	}
}

export default Drawer;
