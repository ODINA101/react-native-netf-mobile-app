/*  eslint-disable new-cap */
import React, { PropTypes, Component } from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { TMDB_IMG_URL } from '../../../constants/api';
import styles from './styles/CardThree';

const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;

class CardThree extends Component {

	constructor(props) {
		super(props);
		//alert(this.props.info.id)
		this.state = {
			genres:"",
			des:""
		}

fetch("http://net.adjara.com/req/jsondata/req.php?id=" + this.props.info.id + "&reqId=getInfo")
      .then(res => res.json())
              .then(res => {
             let genres = Object.keys(res.genres).map(i => res.genres[i])
             let director = Object.keys(res.director).map(i => res.director[i]);
						 	this.setState({genres})
            this.setState({des: res.desc[0]})



   })

	}
 checkTitle(data) {
		 if (data.title_ge !== "") {
				 return (data.title_ge);
		 } else {
				 return (data.title_en);
		 }
 }
 checkImdb(data) {
			 if ((parseFloat(data).toFixed(1)) !== parseFloat(0.0).toFixed(1)) {
					 return (parseFloat(data).toFixed(1));
			 } else {
					 return (null);
			 }
	 }

	render() {
		const { info, viewMovie,searching } = this.props;
		return (
			<View style={styles.cardContainer}>
				<TouchableOpacity activeOpacity={0.9} onPress={() => {viewMovie(info,this.state.des,this.state.genres) }}>
					<View style={styles.card}>
						<Image source={{ uri: searching?("http://staticnet.adjara.com/moviecontent/" + info.id + "/covers/214x321-" + info.id + ".jpg"):(info.poster) }} style={styles.cardImage} />
						<View style={styles.cardDetails}>
							<Text
								style={styles.cardTitle}
								numberOfLines={3}>
								{this.checkTitle(info)}
							</Text>
							<View style={styles.cardGenre}>
								<Text style={styles.cardGenreItem}>{info.year}</Text>
							</View>
							<View style={styles.cardNumbers}>
							{
								searching?(
							<View />

								):(
            <View style={styles.cardStar}>
	          {iconStar}
	              <Text style={styles.cardStarRatings}>{ this.checkImdb(info.imdb)!=="NaN"?(this.checkImdb(info.imdb)):("")   }</Text>
            </View>

								)
							}
							</View>
							<Text style={styles.cardDescription} numberOfLines={3}>
								{this.state.des}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		moviesGenres: state.movies.genres
	};
}

export default connect(mapStateToProps, null)(CardThree);
