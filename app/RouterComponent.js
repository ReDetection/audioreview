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
import BandList from './components/account/BandList';
import Model from './Model';
import Cache from './Cache';
import {realmServer, authURL, uploadBaseURL, uploadedTracksBaseUrl} from '../config.js';

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
        this.logout();
      }}
    };
    this.fullMenu = {
      "Invite": {handler: ()=>{
        this.invitePeople();
      }},
      "Switch band": {handler: ()=>{
        Actions.bands();
      }},
      "Join": {handler: ()=>{
        Actions.join();
      }},
      "Create band": {handler: ()=>{
        this.createBand();
      }},
      "Logout": {destructive: true, handler: ()=>{
        this.logout();
      }}
    };
  }

  logout() {
    this.state.model.logout();
    let newModel = new Model(realmServer, this.state.nickname);
    this.setState({model: newModel}, ()=>{
      Actions.login();
    });
  }

  invitePeople() {
    let url = this.state.model.connectedUrl();
    if (!url.startsWith('~')) {
      Actions.invite({realmUrl: url});      
    }
  }

  createBand() {
    Actions.createBand({type: ActionConst.PUSH});
  }

  refreshModel() {
    let newState = {model: new Model(realmServer, this.state.nickname)};
    this.setState(newState, ()=>{
      Actions.root();
    });
  }

  render() {
    var loginState = 'loggedOut';
    if (Model.loggedIn) {
      var hasBands = this.state.model.bands().length > 0;
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
        {this.renderBandsScene({shouldShowMenu: loginState === 'loggedIn'})}
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
      Actions.join({type: ActionConst.RESET});
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
        type={ActionConst.RESET}
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
        type={ActionConst.RESET}
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
        callback={(url)=>{
          this.state.model.registerBand('joined', url);
          this.refreshModel();
        }}
      />
    );
  }
  renderBandsScene(additional) {
    return (
      <Scene
        key='bands'
        component={BandList}
        model={this.state.model}
        menuOptions={this.logoutMenu}
        {...additional}
        callbackBand={(band)=>{
          this.state.model.reconnectToRealm(band);
          Actions.root({model: this.state.model});
        }}
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
        callback={this.refreshModel.bind(this)}
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

