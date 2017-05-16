'use strict';
import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  TouchableHighlight,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../general/BackButton';
import RealmListView from '../general/RealmListView';
import AlbumItem from '../albums/AlbumItem';

const window = Dimensions.get('window');

class UploadScreen extends Component {

  constructor(props){
    super(props);
    this.state = {phase: 'prepare'};
  }

  renderPrepare() {
    const albumSelector = (this.state.title || '').length == 0 ? null : (
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>Select album</Text>
        </View>
        <RealmListView collection={this.props.model.repetitions}
          renderRow={ ( album ) => <AlbumItem repetition={ album } /> } />
      </View>
    );
    return (
      <View>
          <TextInput
            style={ styles.input }
            placeholder="Title"
            onChangeText={(text) => this.setState({title: text})}
            value={this.state.title}
          />
          { albumSelector } 
      </View>
    );
  }

  render() {
    return (
      <View style={styles.background}>
        <View style={ styles.header }>
          <Text style={ styles.headerText }>
            Upload
          </Text>
        </View>
        <BackButton />
        { this.renderPrepare() }
      </View>
    );
  }

};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#000",
    flex: 1,
  },
  input: {
    color: "white",
    height: 40,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderColor: 'white', 
    borderWidth: 1,
    fontSize: 14,
  },
  header: {
    paddingTop: 10,
    marginTop: 17,
    marginBottom: 17,
    width: window.width,
  },
  headerSend: {
    position: 'absolute',
    top: 12,
    right: 0,
  },
  headerSendButton: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: 'center',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    // width: window.width,
    backgroundColor: 'rgba(0,0,0,.8)',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#fff',
  },
});

module.exports = UploadScreen;
