var Realm = require('realm');

const RepetitionSchema = {
  name: 'Repetition',
  properties: {
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


class Model {
    constructor(realmURL) {
      this.realmURL = realmURL;
      try {
        var user = Realm.Sync.User.current;
      } catch (err) {
        this.logoutAll();
      }
      if (user) {
        this.connectWithUser(user);
      }
    }

    connectWithUser(user) {
      this.user = user;
      this.realm = new Realm({
        sync: {
          user: user,
          url: this.realmURL,
        },
        schema: [RepetitionSchema, TrackSchema, CommentSchema, NicknameSchema],
        schemaVersion: 2,
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

    get nicknameObject() {
      let all = this.realm.objects('Nickname').filtered('identity == $0', this.user.identity);
      if (all.length == 0) {
        return undefined;
      } 
      return all[0];
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

};


module.exports = Model;
