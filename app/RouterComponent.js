'use strict';
import React, {
  Component,
} from 'react';
import {
  AppRegistry,
  Navigator,
  Linking,
  StyleSheet,
  Text,
  StatusBar,
  View
} from 'react-native';
import {Router, Schema, Scene, ActionConst} from 'react-native-router-flux';
import Login from './components/login/Login';
import AlbumList from './components/albums/AlbumList';
import Mentions from './components/mentions/Mentions';
import UploadScreen from './components/upload/UploadScreen';
import ArtistShow from './components/tracks/ArtistShow';
import Player from './components/player/Player';
import ComposeComment from './components/comments/ComposeComment';
import Model from './Model';
import Cache from './Cache';
import {modelURL, authURL} from '../config.js';

let model = new Model(modelURL);
let cache = new Cache();

class RouterComponent extends Component {
componentDidMount() {
  var url = Linking.getInitialURL().then((url) => {
    if (url) {
      console.log('Initial url is: ' + url);
    }
  }).catch(err => console.error('An error occurred', err));
    Linking.addEventListener('url', this._handleOpenURL);
}
componentWillUnmount() {
  Linking.removeEventListener('url', this._handleOpenURL);
}

_handleOpenURL(event) {
  console.log(event.url);
}

  render() {
    return <Router style={ styles.container } hideNavBar={true}>
        <Scene key="login" component={Login} model={model} authURL={authURL} type={ActionConst.REPLACE}/>
        <Scene key="root" component={AlbumList} title="Albums" model={model} initial={model.databaseRunning} type={ActionConst.REPLACE}/>
        <Scene key="upload" component={UploadScreen} model={model} />
        <Scene key="mentions" component={Mentions} model={model}/>
        <Scene key="albumShow" component={ArtistShow} title="The Beatles" cache={cache}/>
        <Scene key="player" hideNavBar={true} component={Player} title="Come Together" cache={cache}/>
        <Scene key="compose" component={ComposeComment} model={model}/>
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

