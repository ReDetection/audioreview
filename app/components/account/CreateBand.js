import React, {
  Component,
} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
  Share,
} from 'react-native';
import UUID from 'uuid/v4';
import BackButton from '../general/BackButton';
import RoundedButton from '../general/RoundedButton';
import NativeMenu from '../account/NativeMenu';


class CreateBand extends Component {

    constructor(props) {
      super(props);
      this.state = {title: "Bulbulator"};
    }

    render() {
      return <NativeMenu options={this.props.menuOptions} ref="nativeMenu">
        <View style={ styles.header }>
          <Text style={ styles.headerText }>
            Join team
          </Text>
        </View>
        { this.renderTopLeftButton() }
        { this.renderInputInterface() }
      </NativeMenu>;
    }

    openMenu() {
      this.refs.nativeMenu.present();
    }

    createBand() {
      let band = this.props.model.createBand(this.state.title, UUID());
      this.props.callback(band.realmUrl);
    }

    renderTopLeftButton() {
      if (this.props.shouldShowMenu) {
        return <View style={ styles.headerClose }>
          <Text onPress={ this.openMenu.bind(this) } size={14} style={{color: "#fff"}}>Account</Text>
        </View>
      } else {
        return <BackButton />;
      }
    }
    
    renderInputInterface() {
      return <View>
        <Text style={styles.text}>Enter band title:</Text>
        <TextInput style={[styles.text, styles.textField]}
                   editable={true} 
                   onChangeText={(text) => this.setState({title: text})}
                   value={this.state.title}
        />
        <View style={styles.row}>
          <RoundedButton innerText="Create" onPress={this.createBand.bind(this)} />
        </View>
      </View>;
    } 

}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    margin: 4
  },
  background: {
    backgroundColor: "#000",
    flex: 1,
    alignContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textField: {
    height: 40,
    borderColor: 'white', 
    borderWidth: 1,
    margin: 4,
  },
  header: {
    paddingTop: 10,
    marginTop: 17,
    marginBottom: 17,
    width: window.width,
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: 'center',
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
});


export default CreateBand;
