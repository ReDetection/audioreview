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


class JoinGroup extends Component {

    constructor(props) {
      super(props);      
      this.managementRealm = this.props.model.managementRealm;
      this.state = {
        response: null,
        token: "",
        message: null,
      };
    }

    componentWillUnmount() {
      if (this.notificationCollection != null) {
        this.notificationCollection.removeAllListeners();
      }
    }

    render() {
      return <View style={styles.background}>
        <View style={ styles.header }>
          <Text style={ styles.headerText }>
            Join team
          </Text>
        </View>
        <BackButton />
        { this.renderInputInterface() }
        { this.renderContent() }
      </View>;
    }

    renderContent() {
      if (this.response == null) {
        return this.renderButtonAndOptionalMessage();

      } else if (this.state.response.statusCode > 0) {
        return this.renderMessage(this.state.response.statusMessage, 'red');
        
      } else if (this.state.response.realmUrl == null) {
        return this.renderMessage('Downloading token', 'white');

      } else if (this.state.response.realmUrl.length > 0) {
        return this.renderMessage('Connecting...', 'white');
      }
    }

    renderInputInterface() {
      return <View>
        <Text style={styles.text}>Enter token received from team creator:</Text>
        <TextInput style={[styles.text, styles.textField]}
                   editable={true} 
                   onChangeText={(text) => this.setState({token: text})}
                   value={this.state.text}
        />
      </View>;
    } 

    renderButtonAndOptionalMessage() {
      return <View style={styles.row}>
        <RoundedButton innerText="Redeem" onPress={this.redeem.bind(this)} />
        { this.state.message == null ? null : this.renderMessage(this.state.message, 'red') }
      </View>;
    }

    renderLoading() {
      return <View>
        <ActivityIndicator color="white"/>
        { this.renderMessage('Downloading token', 'white') }
      </View>;
    }

    renderMessage(message, color) {
      return <View>
        <Text style={{'color': color}}>{message}</Text>
      </View>;
    }

    redeem() {
      let offerResponse;
      this.managementRealm.write(() => {
        offerResponse = this.managementRealm.create('PermissionOfferResponse', {
          id: UUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          token: this.state.token,
        });
      });
      this.setState({response: offerResponse});
      this.subscribeToUpdates(offerResponse.id);
    }

    subscribeToUpdates(id) {
      this.notificationCollection = this.managementRealm.objects('PermissionOfferResponse').filtered('id = $0', id);
      this.notificationCollection.addListener((rows, changes) => {
         if (this.state.response.realmUrl != null) {
           this.connectToRealm(this.state.response.realmUrl);
         } else {
           this.forceUpdate();
         }
      });
    }

    connectToRealm(realmPath) {
      this.props.callback(realmPath);
    }

};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    margin: 4,
    marginLeft: 16,
    marginRight: 16,
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
});

export default JoinGroup;
