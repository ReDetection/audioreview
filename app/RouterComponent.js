'use strict';
import React, {
  Component,
} from 'react';
import {
  AppRegistry,
  Navigator,
  StyleSheet,
  Text,
  StatusBar,
  View
} from 'react-native';
import {Router, Schema, Scene} from 'react-native-router-flux';
import AlbumList from './components/albums/AlbumList';
import ArtistShow from './components/tracks/ArtistShow';
import Player from './components/player/Player';
import ComposeComment from './components/comments/ComposeComment';

class RouterComponent extends Component {
  render() {
    return <Router style={ styles.container } hideNavBar={true}>
        <Scene key="root" component={AlbumList} title="Albums"/>
        <Scene key="albumShow" component={ArtistShow} title="The Beatles"/>
        <Scene key="player" hideNavBar={true} component={Player} title="Come Together"/>
        <Scene key="compose" component={ComposeComment} />
      </Router>
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  }
});

StatusBar.setBarStyle('light-content', true);
module.exports = RouterComponent;

