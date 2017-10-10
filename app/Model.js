var Realm = require('realm');

const RepetitionSchema = {
  name: 'Repetition',
  properties: {
    uuid: {type: 'string', default: ""},
    title: 'string',
    date: 'date',
    imageURL: {type: 'string', optional: true},
    tracks: {type: 'list', objectType: 'Track'},
  }
};
const TrackSchema = {
  name: 'Track',
  properties: {
    title:     'string',
    duration: {type: 'int', default: 0},
    trackURL:  'string',
    comments: {type: 'list', objectType: 'Comment'},
  }
};
const CommentSchema = {
  name: 'Comment',
  properties: {
    author:     'string',
    text:     'string',
    second: {type: 'int', default: 0},
    date: 'date',
  }
};
const NicknameSchema = {
  name: 'Nickname',
  properties: {
    identity:     'string',
    nickname:     'string',
  }
};
const ConfigSchema = {
  name: 'Config',
  primaryKey: 'key',
  properties: {
    key: 'string',
    value: 'string',
  }
};


class Model {
    constructor(realmURL, nickname) {
      this.realmURL = realmURL;
      try {
        var user = Realm.Sync.User.current;
      } catch (err) {
        this.logoutAll();
      }
      if (user) {
        this.connectWithUser(user);
        if (nickname != undefined) {
          this.registerNickname(nickname);
        }
      }
    }

    static get loggedIn() {
      return this.currentUser != null;
    }

    static get currentUser() {
      try {
        return Realm.Sync.User.current;
      } catch (err) {
        return null;
      }
    }

    connectWithUser(user) {
      this.user = user;
      this.realm = new Realm({
        sync: {
          user: user,
          url: this.realmURL,
        },
        schema: [RepetitionSchema, TrackSchema, CommentSchema, NicknameSchema, ConfigSchema],
        schemaVersion: 3,
      });
    }

    logout() {
      this.user = undefined;
      this.realm = undefined;
      Realm.Sync.User.current.logout();
    }

    logoutAll() {
      let users = Realm.Sync.User.all;
      for(const key in users) {
        const user = users[key];
        user.logout();
      }
    }

    get bandUUID() {
      let configs = this.realm.objects('Config').filtered('key == "BAND_UUID"');
      if (configs.length == 0){
        return undefined
      }
      return configs[0].value
    }

    get nicknameObject() {
      let all = this.realm.objects('Nickname').filtered('identity == $0', this.user.identity);
      if (all.length == 0) {
        return undefined;
      } 
      return all[0];
    }

    static currentUserManagementRealm() {
      return this.currentUser.openManagementRealm();
    }

    get nickname() {
      let nicknameObject = this.nicknameObject;
      if (nicknameObject == undefined) {
        return undefined;
      }
      return nicknameObject.nickname;
    }

    registerNickname(newValue) {
      let nicknameObject = this.nicknameObject;
      this.realm.write(()=>{
        if (nicknameObject) {
            nicknameObject.nickname = newValue;
        } else {
          this.realm.create('Nickname', {identity: this.user.identity, nickname: newValue});
        }
      });
    }

    findTrackWithComment(comment) {
      return this.realm.objects('Track').filtered('comments == $0', comment)[0];
    }

    get comments() {
      return this.realm.objects('Comment').sorted('date', true);
    }

    get mentions() {
      return this.realm.objects('Comment').filtered('text CONTAINS $0', '@' + this.nickname).sorted('date', true);
    }

    get databaseRunning() {
      return this.realm != undefined
    }

    get repetitions() {
        return this.realm.objects('Repetition').sorted('date', true);
    }

    createComment(text, song, second) {
        this.realm.write(()=>{
          song.comments.push({text: text, author: this.nickname, second: second, date: new Date()});
        });
    }

    createTrack(album, title, url) {
        this.realm.write(()=>{
          album.tracks.push({title: title, trackURL: url});
        });   
    }

    createAlbum(title, imageURL, uuid) {
      this.realm.write(()=>{
        this.realm.create('Repetition', {title: title, uuid: uuid, imageURL: imageURL, date: new Date()});
      });
    }

};


module.exports = Model;
