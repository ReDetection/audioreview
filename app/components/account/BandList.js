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
import BandItem from './BandItem';
import NativeMenu from '../account/NativeMenu';


class BandList extends Component {

  openMenu() {
    this.refs.nativeMenu.present();
  }

  chooseBand(band) {
    this.props.callbackBand(band);
  }

  renderAddAlbum() {
    return <TouchableHighlight style={styles.addAlbum} onPress={ ()=>Actions.createBand() } >
      <Image source={require('../general/empty.png')} style={{flex:1, flexShrink: 1, height: 141}} resizeMode='contain'/>
    </TouchableHighlight>;
  }

  render() {
    return (
      <NativeMenu options={this.props.menuOptions} ref="nativeMenu">
        <Text style={styles.welcome}>
          Bands
        </Text>
        <View style={ styles.headerClose }>
          <Text onPress={ this.openMenu.bind(this) } size={14} style={{color: "#fff"}}>Account</Text>
        </View>
        <RealmListView collection={this.props.model.bands()}
          renderFooter={ this.renderAddAlbum.bind(this) }
          renderRow={ ( band ) => <BandItem band={ band } onPress={ () => {this.chooseBand(band)} }/> }/>
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

module.exports = BandList;
