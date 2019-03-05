import React, { PropTypes } from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';

import styles from './styles/CardTwo';
import { TMDB_IMG_URL } from '../../../constants/api';
function checkTitle(data) {
		 if (data.title_ge !== "") {
				 return (data.title_ge);
		 } else {
				 return (data.title_en);
		 }
 }


const CardTwo = ({ info, viewMovie }) => (
	<TouchableOpacity activeOpacity={0.8} onPress={viewMovie.bind(this, info.id,info)}>
		<View style={styles.cardContainer}>
			<Image source={{ uri:info.poster }} style={styles.cardImage} />
			<View style={styles.cardTitleContainer}>
				<Text style={styles.cardTitle} numberOfLines={2}>
					{checkTitle(info)}
				</Text>
			</View>
		</View>
	</TouchableOpacity>
);

export default CardTwo;
