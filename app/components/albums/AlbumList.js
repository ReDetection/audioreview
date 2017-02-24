  'use strict';
import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { ListView } from 'realm/react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import { model } from '../../Model';
import AlbumItem from './AlbumItem';


class AlbumList extends Component {
  constructor(props){
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true });
    let reps = model.repetitions;
    reps.addListener((rows, changes) => {
      this.setState({dataSource: ds.cloneWithRows(reps)});
    });
    this.state = {
      dataSource: ds.cloneWithRows( reps ),
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Albums
        </Text>
        <ListView
          dataSource={this.state.dataSource}
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
