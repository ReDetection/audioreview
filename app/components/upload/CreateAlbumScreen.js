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
import ImagePicker from 'react-native-image-picker';
import UUID from 'uuid/v4';
import moment from 'moment';
 

class CreateAlbumScreen extends Component {

  constructor(props){
    super(props);
    this.state = {
      phase: 'prepare',
      imageURL: undefined,
      title: '',
    };
  }

  upload(album) {
    this.setState({phase: 'upload'});

    const albumUUID = moment().format('YYYY-MM-DD-') + UUID(); 

    let endpoint = this.props.uploadBaseURL + '/' + this.props.model.bandUUID + '/' + albumUUID;
    let filepath = decodeURI(parse(this.state.imageURL).pathname);
    let filename = filepath.replace(/^.*[\\\/]/, '');
    let file = RNFetchBlob.wrap(filepath);
    RNFetchBlob.fetch('POST', endpoint, {
      'Content-Type' : 'multipart/form-data',
     }, [{name: 'track', filename: filename, data: file}])
      .then((res) => {
        let newURLPath = res.json().name;
        if (newURLPath) {
          this.props.model.createAlbum(this.state.title, this.props.uploadedTracksBaseUrl + newURLPath, albumUUID);
          Actions.root();
        } else { 
          this.setState({phase: 'prepare', error: {description: "wrong response"}});
        }
      })
      .catch((err) => {
        this.setState({phase: 'prepare', error: err});
      });
  }

  choosePhoto() {
    let imagePickerOptions = {
      title: 'Select Album Art',
      mediaType: 'photo',
      maxWidth: 1000,
      noData: true,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      if (response.uri != null) {
        this.setState({
          imageURL: response.uri,
        });
      }
    });
  }

  renderPrepare() {
    let imageSource = this.state.imageURL ? {uri: this.state.imageURL} : require('./dashbox.png');
    return (
      <View style={{flex: 1, alignItems: 'stretch'}}>
        <Text style={[styles.text, {marginBottom: 8}]}>Select image and type title:</Text>
        <View style={{flexDirection: 'row', marginLeft: 20, marginRight: 20}}>
          <TouchableHighlight onPress={this.choosePhoto.bind(this)}>
            <Image style={{width: 40, height: 40, marginRight: 8}} source={imageSource} />
          </TouchableHighlight>
          <TextInput
            style={ styles.input }
            placeholder="Title"
            onChangeText={(text) => this.setState({title: text})}
            value={this.state.title}
          />
        </View>

          <Text style={[styles.text, {marginBottom: 8}]}>Preview:</Text>
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
