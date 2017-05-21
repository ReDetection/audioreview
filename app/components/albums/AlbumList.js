  'use strict';
import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  Linking,
  View
} from 'react-native';
import RealmListView from '../general/RealmListView';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import AlbumItem from './AlbumItem';


class AlbumList extends Component {
  
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

  doLogout() {
    this.props.model.logout();
    Actions.login({});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Albums
        </Text>
        <View style={ styles.headerClose }>
          <Text onPress={ this.doLogout.bind(this) } size={14} style={{color: "#fff"}}>Logout</Text>
        </View>
        <View style={ styles.headerRight }>
          <Text onPress={ () => { Actions.mentions({collection: this.props.model.comments, title: "Comments Feed" }) }} 
            onLongPress={ () => { Actions.mentions({collection: this.props.model.mentions, title: "Mentions" }) }}
            size={14} style={{color: "#fff"}}>
              Comments
          </Text>
        </View>
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
