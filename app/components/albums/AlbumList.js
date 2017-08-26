  'use strict';
import React, {
  Component,
} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  Linking,
  View
} from 'react-native';
import RealmListView from '../general/RealmListView';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import AlbumItem from './AlbumItem';
import AlbumItemRaw from './AlbumItemRaw';
import NativeMenu from '../account/NativeMenu';


class AlbumList extends Component {
  
  constructor(props) {
    super(props);
    this.menuOptions = {
      "Invite": {handler: ()=>{
        Actions.invite();
      }},
      "Switch band": {handler: ()=>{
        Actions.join();
      }},
      "Logout": {destructive: true, handler: ()=>{
        this.props.model.logout();
        Actions.login({});
      }},
    };
  }

  componentDidMount() {
    var url = Linking.getInitialURL().then((url) => {
      this.handleOpenURL(url);
    }).catch(err => console.error('An error occurred', err));
    Linking.addEventListener('url', this.handleOpenURLEvent.bind(this));
  }
  
  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURLEvent.bind(this));
  }

  handleOpenURLEvent(event) {
    this.handleOpenURL(event.url);
  }

  handleOpenURL(url) {
    if (url) {
      Actions.upload({url: url});
    }
  }

  openMenu() {
    this.refs.nativeMenu.present();
  }

  renderAddAlbum() {
    return <TouchableHighlight style={styles.addAlbum} onPress={ ()=>Actions.createAlbum() } >
      <Image source={require('./empty.png')} style={{flex:1, flexShrink: 1, height: 141}} resizeMode='contain'/>
    </TouchableHighlight>;
  }

  render() {
    return (
      <NativeMenu options={this.menuOptions} ref="nativeMenu">
        <Text style={styles.welcome}>
          Albums
        </Text>
        <View style={ styles.headerClose }>
          <Text onPress={ this.openMenu.bind(this) } size={14} style={{color: "#fff"}}>Account</Text>
        </View>
        <View style={ styles.headerRight }>
          <Text onPress={ () => { Actions.mentions({collection: this.props.model.comments, title: "Comments Feed" }) }} 
            onLongPress={ () => { Actions.mentions({collection: this.props.model.mentions, title: "Mentions" }) }}
            size={14} style={{color: "#fff"}}>
              Comments
          </Text>
        </View>
        <RealmListView collection={this.props.model.repetitions}
          renderFooter={ this.renderAddAlbum.bind(this) }
          renderRow={ ( album ) => <AlbumItem repetition={ album } onPress={ () => Actions.albumShow({ repetition: album }) }/> }/>
      </NativeMenu>
    );
  }
}

const styles = StyleSheet.create({
  addAlbum: {
    height: 141,
    flex: 1,
    width: '100%',
    flexDirection: 'row',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    paddingTop: 10,
    color: '#fff',
  },
  headerClose: {
    position: 'absolute',
    top: 16,
    left: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 20,
  },
  headerRight: {
    position: 'absolute',
    top: 16,
    right: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 5,
  },
});

module.exports = AlbumList;
