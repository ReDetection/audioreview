'use strict';
import React, {
  Component,
} from 'react';
import {
  ActivityIndicator,
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
import AlbumItemRaw from '../albums/AlbumItemRaw';
import RNFetchBlob from 'react-native-fetch-blob';
import parse from "url-parse";


class CreateAlbumScreen extends Component {

  constructor(props){
    super(props);
    this.state = {
      phase: 'prepare',
      imageURL: 'http://34.251.97.88:20080/1382DF7C-063D-4F2D-AC31-E9C90D45CECF/2017-06-28-3EB75CEF-2676-43ED-8580-8DBD28D3E107/781de919-9c90-4e87-bef9-7e8b6385bb4b.jpg',
      title: '',
    };
  }

  upload(album) {
    this.setState({phase: 'upload'});

    let endpoint = this.props.uploadBaseURL + '/' + this.props.model.bandUUID + '/' + album.uuid;
    let filepath = decodeURI(parse(this.props.url).pathname);
    let filename = filepath.replace(/^.*[\\\/]/, '');
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
    let imageSource = this.state.imageURL ? {uri: this.state.imageURL} : require('./dashbox.png');
    return (
      <View style={{flex: 1, alignItems: 'stretch'}}>
        <Text style={[styles.text, {marginBottom: 8}]}>Select image and type title:</Text>
        <View style={{flexDirection: 'row', marginLeft: 20, marginRight: 20}}>
          <Image style={{width: 40, height: 40, marginRight: 8}} source={imageSource} />
          <TextInput
            style={ styles.input }
            placeholder="Title"
            onChangeText={(text) => this.setState({title: text})}
            value={this.state.title}
          />
        </View>

          <Text style={styles.text}>Preview:</Text>
          <AlbumItemRaw title={this.state.title}
                        subtitle="X tracks"
                        imageURL={this.state.imageURL}
                        description="Y comments" /> 
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
    let rightItem = this.state.phase == 'upload' 
        ? <ActivityIndicator/>
        : this.state.title.length > 0 
          ? <Icon style={styles.rightBarButton} name="ios-checkmark" size={25} color="#fff" onPress = { this.upload.bind(this) }/>
          : null;
    return (
      <View style={styles.background}>
        <View style={ styles.header }>
          <Text style={ styles.headerText }>
            Upload
          </Text>
        </View>
        <BackButton />
        { rightItem }
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
    borderColor: 'white', 
    borderWidth: 1,
    fontSize: 14,
    flexGrow: 1,
  },
  header: {
    paddingTop: 10,
    marginTop: 17,
    marginBottom: 17,
    width: window.width,
  },
  rightBarButton: {
    position: 'absolute',
    top: 16,
    right: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
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
  text: {
    color: "#FFF",
    alignSelf: 'center',
    marginTop: 20,  
  },
});

export default CreateAlbumScreen;
