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


class Model {
    constructor(realmURL) {
      this.realmURL = realmURL;
      let user = Realm.Sync.User.current;
      if (user) {
        this.connectWithUser(user);
      }
    }

    connectWithUser(user) {
      this.realm = new Realm({
        sync: {
          user: user,
          url: this.realmURL,
        },
        schema: [RepetitionSchema, TrackSchema, CommentSchema],
        schemaVersion: 1,
      })
    }

    get databaseRunning() {
      return this.realm != undefined
    }

    get repetitions() {
        return this.realm.objects('Repetition');
    }

    createComment(text, song, second, author) {
        this.realm.write(()=>{
          song.comments.push({text: text, author: author, second: second, date: new Date()});
        });
    }

};


module.exports = Model;
