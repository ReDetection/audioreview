# Audioreview

I had two reasons to build this:
1) I wanted to learn React Native
2) I participate in music band and we used to record our repetitions and comment them on soundcloud. Unfortunately, soundcloud does not offer enough features for us and also have some limits so we wanted some better solution for our needs.

# Requirements

I used [realm](https://realm.io/) as a realtime database, which keeps everyone in sync. So in order to try the app you need to have [realm object server](https://realm.io/products/realm-mobile-platform/) (they have easy to install linux or macOS packages) and write paths to it in [config.js](config.js). 

At the moment you can't add tracks from the app, you can only register and comment. You need to use [Realm Browser](https://github.com/realm/realm-browser-osx) to push tracks and repetitions. 

### User

Once you have your server running, you need to have some user. You can either do it in the web interface of the server or right in the app. In the app enter login and password, tap register and wait some time, it will change screen on success.

### Content

You also need to have some public direct link to audiotracks and images, I used nginx static website. Easiest way is to create repetitions via [Realm Browser](https://github.com/realm/realm-browser-osx). Other way to create some tracks is to pause JS in the [Model.js](app/Model.js) after `this.realm` was set, and execute this in console: 
```
this.realm.write(()=>{
  let album = this.realm.create('Repetition', {
    title: 'Example album/repetition',
    date: new Date(),
    imageURL: 'http://example.com/image.jpg', //optional, but nice to have
  });
  album.tracks.push(this.realm.create('Track', {
    title: 'Our new song',
    duration: 244, //in seconds. currently unused, so you can define anything
    trackURL: 'http://example.com/song.mp3',
  }));
});
```

## How to comment

When playing track, tap button in top right to open compose comment interface. Comment will be bond to a particular second on the track. You can tap on the comment to start playing track from the second bond to it. You can long tap on the comment to reply.

# Credits:

This project is based on the [react native music player](https://github.com/ReDetection/react-native-music-player) which I used to bootstrap and dive into React Native. See [contribution graph](https://github.com/ReDetection/audioreview/graphs/contributors) for more details.
