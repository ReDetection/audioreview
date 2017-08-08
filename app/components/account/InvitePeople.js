import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Share,
} from 'react-native';
import UUID from 'uuid/v4';
import BackButton from '../general/BackButton';
import RoundedButton from '../general/RoundedButton';


class InvitePeople extends Component {

    constructor(props) {
      super(props);      
      this.managementRealm = this.props.model.managementRealm;
      this.state = {offer: this.obtainOffer()};
    }

    obtainOffer() {
      let offer;
      let expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1); // Expires in a day.
      this.managementRealm.write(() => {
        offer = this.managementRealm.create('PermissionOffer', {
          id: UUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: '*',
          realmUrl: this.props.realmUrl,
          mayRead: true,
          mayWrite: true,
          mayManage: false,
          expiresAt: expirationDate,
        });
      });
      return offer;
    }

    componentDidMount() {
      this.notificationCollection = this.managementRealm.objects('PermissionOffer').filtered('id = $0', this.state.offer.id);
      this.notificationCollection.addListener((rows, changes) => {
         if (this.state.offer.token != null && this.state.shareShown != true) {
           this.presentShareUI();
         } else {
           this.forceUpdate();
         }
      });
    }

    presentShareUI() {
      this.setState({shareShown: true});
      Share.share({message: this.state.offer.token});
    }

    componentWillUnmount() {
      this.notificationCollection.removeAllListeners();
    }

    renderMessage(message, color) {
      return <View>
        <Text style={{'color': color}}>{message}</Text>
      </View>;
    }

    renderTokenInterface(token) {
      return <View>
        <Text style={styles.text}>Share this string to other people:</Text>
        <TextInput style={[styles.text, styles.textField]}
                   editable={false}
                   value={token}
        />
        <View style={styles.row}>
          <RoundedButton innerText="Share" onPress={this.presentShareUI.bind(this)} />
        </View>
      </View>;
    } 

    render() {
      let contents;
      if (this.state.offer == null) {
        contents = this.renderMessage("Can't create offer! Are you connected?", 'red');

      } else if (this.state.offer.statusCode > 0) {
        contents = this.renderMessage(this.state.offer.statusMessage, 'red');
        
      } else if (this.state.offer.token == null) {
        contents = this.renderMessage('Downloading token', 'white');

      } else if (this.state.offer.token.length > 0) {
        contents = this.renderTokenInterface(this.state.offer.token);

      }
      return <View style={styles.background}>
        <View style={ styles.header }>
          <Text style={ styles.headerText }>
            Invite
          </Text>
        </View>
        <BackButton />
        { contents }
      </View>;
    }

};

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
});

export default InvitePeople;
