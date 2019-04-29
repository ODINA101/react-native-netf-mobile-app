/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import VideoPlayer from 'react-native-true-sight'


export default class Movie extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
           <VideoPlayer source="https://somevideo.mp4" />
         </View>
    );
  }
}

 
