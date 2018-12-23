import React, { PropTypes,Component} from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles/CardOne';
import { TMDB_IMG_URL } from '../../../constants/api';

const iconStar = (<Icon name="md-star" size={16} color="#F5B642" />);
function checkTitle(data) {
		 if (data.title_ge !== "") {
				 return (data.title_ge);
		 } else {
				 return (data.title_en);
		 }
 }

export default class CardOne extends Component {
  render() {
		const { info, viewMovie } = this.props;

    return (
	<View>
		<Image blurRadius={1} source={{ uri: info.poster }} style={styles.imageBackdrop} />
		<LinearGradient colors={['rgba(0, 0, 0, 0.5)', 'rgba(0,0,0, 0.7)', 'rgba(0,0,0, 0.8)']} style={styles.linearGradient} />
		<View style={styles.cardContainer}>
			<Image source={{ uri: info.poster}} style={styles.cardImage} />
			<View style={styles.cardDetails}>
				<Text style={styles.cardTitle} numberOfLines={2}>
					{checkTitle(info)}
				</Text>
				<View style={styles.cardNumbers}>
					<View style={styles.cardStar}>
						{iconStar}
						<Text style={styles.cardStarRatings}>{info.imdb}</Text>
					</View>
					<Text style={styles.cardRunningHours} />
				</View>
				<Text style={styles.cardDescription} numberOfLines={3}>
					{info.description}
				</Text>
				<TouchableOpacity activeOpacity={0.9} onPress={() => { viewMovie(info) }}>
					<View style={styles.viewButton}>
						<Text style={styles.viewButtonText}>ნახვა</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	</View>
    );
  }
}
