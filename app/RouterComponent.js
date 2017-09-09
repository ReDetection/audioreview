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
import {Router, Schema, Scene, ActionConst} from 'react-native-router-flux';
import Login from './components/login/Login';
import AlbumList from './components/albums/AlbumList';
import Mentions from './components/mentions/Mentions';
import UploadScreen from './components/upload/UploadScreen';
import CreateAlbumScreen from './components/upload/CreateAlbumScreen';
import ArtistShow from './components/tracks/ArtistShow';
import Player from './components/player/Player';
import ComposeComment from './components/comments/ComposeComment';
import InvitePeople from './components/account/InvitePeople';
import JoinGroup from './components/account/JoinGroup';
import Model from './Model';
import Cache from './Cache';
import Settings from './Settings';
import {realmServer, realmURL, authURL, uploadBaseURL, uploadedTracksBaseUrl} from '../config.js';

let cache = new Cache();

class RouterComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.state.modelURL = Settings.realmURL();
    if (this.state.modelURL != null) {
      this.state.model = new Model(realmServer + this.state.modelURL);
    }
  }

  changeModelTo(modelUrl) {
    Settings.setRealmURL(modelUrl);
    let newState = {modelURL: modelUrl, model: null};
    if (newState.modelURL != null) {
      newState.model = new Model(realmServer + newState.modelURL);
    }
    this.setState(newState);
  }

  render() {
    var loginState = 'loggedOut';
    if (Model.loggedIn) {
      if (this.state.model != null && this.state.model.databaseRunning) {
        loginState = 'attached';
      } else {
        loginState = 'loggedIn';
      }
    }
    let managementRealmGetter = ()=>{Model.currentUserManagementRealm()};

    return <Router style={ styles.container } hideNavBar={true}>
        <Scene key="login" component={Login} model={this.state.model} authURL={authURL} initial={loginState === 'loggedOut'} type={ActionConst.REPLACE}/>
        <Scene key="root" component={AlbumList} title="Albums" model={this.state.model} initial={loginState === 'attached'} type={ActionConst.REPLACE}/>
        <Scene key="upload" component={UploadScreen} model={this.state.model} uploadBaseURL={uploadBaseURL} uploadedTracksBaseUrl={uploadedTracksBaseUrl} />
        <Scene key="createAlbum" component={CreateAlbumScreen} model={this.state.model} uploadBaseURL={uploadBaseURL} uploadedTracksBaseUrl={uploadedTracksBaseUrl} />
        <Scene key="invite" component={InvitePeople} managementRealmGetter={managementRealmGetter} realmUrl={realmURL} />
        <Scene key="join" component={JoinGroup} managementRealmGetter={managementRealmGetter} initial={loginState === 'loggedIn'} callback={this.changeModelTo.bind(this)}/>
        <Scene key="mentions" component={Mentions} model={this.state.model}/>
        <Scene key="albumShow" component={ArtistShow} title="The Beatles" cache={cache}/>
        <Scene key="player" hideNavBar={true} component={Player} title="Come Together" cache={cache}/>
        <Scene key="compose" component={ComposeComment} model={this.state.model}/>
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

