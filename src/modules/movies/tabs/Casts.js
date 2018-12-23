import React, { Component } from 'react';

import {
	Text,
	View,
	Image
} from 'react-native';

import styles from './styles/Casts';
import { TMDB_IMG_URL } from '../../../constants/api';

export default class Casts extends Component {
  render() {
		let computedHeight = (80 + 15) * this.props.actors.length; // (castImage.height + castContainer.marginBottom)
		computedHeight += 447 + 40; // Header height + container ((20 paddingVertical) = 40)
		return (
			<View style={styles.container} onLayout={this.props.getTabHeight.bind(this, 'casts', computedHeight)}>
				{
				this.props.actors.map(item => (
						<View key={item.id} style={styles.castContainer}>
							<Image ref={item.id} style={styles.castImage} source={{uri:"http://staticnet.adjara.com/cast/" + item.id + ".jpg"}}
							onError={(e) => this.refs[item.id].setNativeProps({src: [{uri: "http://staticnet.adjara.com/imagesNew/noThumbnail.png"}]})}
					    />
							<View style={styles.characterContainer}>
								<Text style={styles.characterName}>
									{item.name}
								</Text>

							</View>
						</View>
					))
				}
			</View>
		);
  }
}
