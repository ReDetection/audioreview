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
import RNFetchBlob from 'react-native-fetch-blob';
import parse from "url-parse";

const window = Dimensions.get('window');

class UploadScreen extends Component {

  constructor(props){
    super(props);
    let title = undefined;
    if (props.url != undefined) {
      let filename = this.filename(this.filepath(props.url));
      title = filename.match(/^(.*)\..*?$/)[1];
    }
    this.state = {phase: 'prepare', title: title};
  }

  filepath(url) {
    return decodeURI(parse(url).pathname);
  }

  filename(filepath) {
    return filepath.replace(/^.*[\\\/]/, '');
  }

  upload(album) {
    this.setState({phase: 'upload'});

    let endpoint = this.props.uploadBaseURL + '/' + this.props.model.bandUUID + '/' + album.uuid;
    let filepath = this.filepath(this.props.url);
    let filename = this.filename(filepath);
    let file = RNFetchBlob.wrap(filepath);
    RNFetchBlob.fetch('POST', endpoint, {
      'Content-Type' : 'multipart/form-data',
     }, [{name: 'track', filename: filename, data: file}])
      .then((res) => {
        let newURLPath = res.json().name;
        if (newURLPath) {
          this.props.model.createTrack(album, this.state.title, this.props.uploadedTracksBaseUrl + newURLPath);
          Actions.root();
        } else { 
          this.setState({phase: 'prepare', error: {description: "wrong response"}});
        }
      })
      .catch((err) => {
        this.setState({phase: 'prepare', error: err});
      });
  }

  renderPrepare() {
    const albumSelector = (this.state.title || '').length == 0 ? null : (
      <View style={styles.albums}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Select album</Text>
        </View>
        <RealmListView collection={this.props.model.repetitions}
          renderRow={ ( album ) => <AlbumItem repetition={ album } onPress={ () => {this.upload(album);}} /> } />
      </View>
    );
    return (
      <View style={{flex: 1}}>
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

  renderUpload() {
    return (
      <View>
        <Text style={styles.headerText}>Uploading...</Text>
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
        { this.state.phase == 'prepare' ? this.renderPrepare() : this.renderUpload() }
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
    backgroundColor: 'rgba(0,0,0,.8)',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#fff',
  },
  albums: {
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
});

module.exports = UploadScreen;
