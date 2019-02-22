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
import {Actions, Router, Schema, Scene, ActionConst} from 'react-native-router-flux';
import Login from './components/login/Login';
import AlbumList from './components/albums/AlbumList';
import Mentions from './components/mentions/Mentions';
import UploadScreen from './components/upload/UploadScreen';
import CreateAlbumScreen from './components/upload/CreateAlbumScreen';
import ArtistShow from './components/tracks/ArtistShow';
import Player from './components/player/Player';
import ComposeComment from './components/comments/ComposeComment';
import InvitePeople from './components/account/InvitePeople';
import CreateBand from './components/account/CreateBand';
import JoinGroup from './components/account/JoinGroup';
import Model from './Model';
import Cache from './Cache';
import {realmServer, realmURL, authURL, uploadBaseURL, uploadedTracksBaseUrl} from '../config.js';

let cache = new Cache();

class RouterComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.state.model = new Model(realmServer, this.state.nickname);
    this.createMenu();
  }

  createMenu() {
    this.logoutMenu = {
      "Create band": {handler: ()=>{
        this.createBand();
      }},
      "Logout": {destructive: true, handler: ()=>{
        Model.currentUser.logout();
        Actions.login({});
      }}
    };
    this.fullMenu = {
      "Invite": {handler: ()=>{
        Actions.invite();
      }},
      "Switch band": {handler: ()=>{
        Actions.join();
      }},
      "Create band": {handler: ()=>{
        this.createBand();
      }},
      "Logout": {destructive: true, handler: ()=>{
        Model.currentUser.logout();
        Actions.login({});
      }}
    };
  }

  createBand() {
    Actions.createBand({type: ActionConst.PUSH});
  }

  changeModelTo(modelUrl) {
    let newState = {modelURL: modelUrl, model: null};
    if (newState.modelURL != null) {
      newState.model = new Model(realmServer, this.state.nickname);
    }
    this.setState(newState);
    Actions.root();
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

    return (
      <Router style={styles.container} hideNavBar={true}>
        {this.renderLoginScene({initial: loginState === 'loggedOut'})}
        {this.renderRootScene({initial: loginState === 'attached'})}
        {this.renderUploadScene()}
        {this.renderCreateAlbumScene()}
        {this.renderInviteScene()}
        {this.renderJoinScene({initial: loginState === 'loggedIn', shouldShowMenu: loginState === 'loggedIn'})}
        {this.renderCreateBandScene({shouldShowMenu: loginState === 'loggedIn'})}
        {this.renderMentionsScene()}
        {this.renderTracksScene()}
        {this.renderPlayerScene()}
        {this.renderComposeCommentScene()}
      </Router>
    );
  }

  didLogin(user, nickname) {
    let newModel = new Model(realmServer, nickname);
    newModel.connectWithUser(user);
    this.setState({'nickname': nickname, model: newModel}, ()=>{
      Actions.join({type: ActionConst.REPLACE});      
    });
  }

  renderLoginScene(additional) {
    return (
      <Scene
        key='login'
        component={Login}
        model={this.state.model}
        authURL={authURL}
        loginCallback={this.didLogin.bind(this)}
        {...additional}
        type={ActionConst.REPLACE}
      />
    );
  }
  renderRootScene(additional) {
    return (
      <Scene
        key='root'
        component={AlbumList}
        title='Albums'
        model={this.state.model}
        menuOptions={this.fullMenu}
        {...additional}
        type={ActionConst.REPLACE}
      />
    );
  }
  renderUploadScene() {
    return (
      <Scene
        key='upload'
        component={UploadScreen}
        model={this.state.model}
        uploadBaseURL={uploadBaseURL}
        uploadedTracksBaseUrl={uploadedTracksBaseUrl}
      />
    );
  }
  renderCreateAlbumScene() {
    return (
      <Scene
        key='createAlbum'
        component={CreateAlbumScreen}
        model={this.state.model}
        uploadBaseURL={uploadBaseURL}
        uploadedTracksBaseUrl={uploadedTracksBaseUrl}
      />
    );
  }
  renderInviteScene() {
    return (
      <Scene
        key='invite'
        component={InvitePeople}
        managementRealmGetter={() => {
          return Model.currentUserManagementRealm();
        }}
        realmUrl={realmURL}
      />
    );
  }
  renderJoinScene(additional) {
    return (
      <Scene
        key='join'
        component={JoinGroup}
        managementRealmGetter={() => {
          return Model.currentUserManagementRealm();
        }}
        menuOptions={this.logoutMenu}
        {...additional}
        callback={this.changeModelTo.bind(this)}
      />
    );
  }
  renderCreateBandScene(additional) {
    return (
      <Scene
        key='createBand'
        component={CreateBand}
        model={this.state.model}
        menuOptions={this.logoutMenu}
        {...additional}
        callback={this.changeModelTo.bind(this)}
      />
    );
  }
  renderMentionsScene() {
    return (
      <Scene key='mentions' component={Mentions} model={this.state.model} />
    );
  }
  renderTracksScene() {
    return (
      <Scene
        key='albumShow'
        component={ArtistShow}
        cache={cache}
      />
    );
  }
  renderPlayerScene() {
    return (
      <Scene
        key='player'
        hideNavBar={true}
        component={Player}
        cache={cache}
      />
    );
  }
  renderComposeCommentScene() {
    return (
      <Scene
        key='compose'
        component={ComposeComment}
        model={this.state.model}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  }
});

StatusBar.setBarStyle('light-content', true);
module.exports = RouterComponent;

