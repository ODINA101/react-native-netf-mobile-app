import React, { PropTypes,Component } from 'react';
import {
	Text,
	View
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';

import styles from './styles/Info';

export default class Info extends Component {
	constructor(props) {
		super(props)

		//alert(JSON.stringify(props.item))
	}
  render() {

				return (
					<View style={styles.container}>
						<View style={styles.overview}>
							<Text style={styles.label}>
								აღწერა
							</Text>
							<Text style={styles.overviewText}>
							{this.props.description}
							</Text>
						</View>

						<View style={styles.labelRow}>
							<Text style={styles.label}>გამოშვების წელი</Text>
							<Text style={styles.value}>{this.props.item.release_date}</Text>
						</View>
						<View style={styles.labelRow}>
							<Text style={styles.label}>რეჟისორი</Text>
							<Text style={styles.value}>{this.props.director}</Text>
						</View>

					</View>
				);
  }
}
