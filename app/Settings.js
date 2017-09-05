import {
  Settings,
} from 'react-native';

const ActiveRealmKey = "ActiveRealmKey";

class AppSettings {

  static realmURL() {
    return Settings.get(ActiveRealmKey);
  }

  static setRealmURL(url) {
    let obj = {};
    obj[ActiveRealmKey]=url;
    return Settings.set(obj);
  }

}

export default AppSettings;
