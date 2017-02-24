  'use strict';
import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import RealmListView from '../general/RealmListView';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import AlbumItem from './AlbumItem';


class AlbumList extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Albums
        </Text>
        <RealmListView collection={this.props.model.repetitions}
          renderRow={ ( album ) => <AlbumItem repetition={ album } /> }/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#111',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    paddingTop: 10,
    color: '#fff',
  },
  instructions: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 5,
  },
});

module.exports = AlbumList;
