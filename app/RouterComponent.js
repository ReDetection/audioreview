'use strict';
import React, {
  Component,
} from 'react';
import {
  AppRegistry,
  Navigator,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {Router, Schema, Scene} from 'react-native-router-flux';
import ArtistList from './components/artists/ArtistList';
import ArtistShow from './components/artists/ArtistShow';
import Player from './components/player/Player';
import { Artists } from './mockData';

class RouterComponent extends Component {
  render() {
    return <Router style={ styles.container } hideNavBar={true}>
        <Scene key="root" component={ArtistList} title="Artists"/>
        <Scene key="artistShow" component={ArtistShow} title="The Beatles"/>
        <Scene key="player" hideNavBar={true} component={Player} title="Come Together"/>
      </Router>
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  }
});

module.exports = RouterComponent;

