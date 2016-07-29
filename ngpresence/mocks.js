angular.module('app.mocks', [])

  // auth mock
  .factory('auth', [function(){
    return {
      currentUser: {
        name: 'Kelly User',
        username: 'kelly',
        imageUrl: "http://api.randomuser.me/portraits/med/women/39.jpg"
      }
    };
  }])


  // presence mock. the real implementation should access the Pusher api.
  .factory('presence', ['auth', function(auth){

    var channels = {};

    var mockChannel = function(){
      return {
        callbacks: {},
        bind: function(evt, callback) {
          this.callbacks[evt] = this.callbacks[evt] || [];
          this.callbacks[evt].push(callback);
        },
        trigger: function(evt, data) {
          _.each(this.callbacks[evt], function(cb) {
            cb(data)
          });
        },
        members: []
      }
    };

    return {

      channels: channels,

      // Subscribe to the channel. Returns a channel object
      subscribe: function(channelName){
        var channel = channels[channelName];
        if(!channel){
          channel = channels[channelName] = mockChannel();
        }
        channel.members.push(auth.currentUser);
        return channel;
      },

      // Unsubscribe from the channel.
      unsubscribe: function(channelName){
        delete channels[channelName];
      },

      // Bind events on the channel. Wrapped so we can make event names pusher-friendly.
      bindChannelEvent: function(channel, evt, callback) {
        return channel.bind(evt, callback);
      },

      // Adds or removes a random user to all current channels, for testing.
      randomUpdate: function(){
        $.get('http://api.randomuser.me/', function(response) {
          var randomUser = response.results[0].user;
          var user = {
            name: s.titleize(randomUser.name.first) + ' ' + s.titleize(randomUser.name.last),
            username: randomUser.username,
            imageUrl: randomUser.picture.medium
          };

          _.each(channels, function(channel, channelName){
            if(Math.random() < 0.7){
              channel.members.push(user);
              channel.trigger('member_added');
            } else if(channel.members.length > 1){
              channel.members.pop();
              channel.trigger('member_removed');
            }
          });

        });
      }
    };
  }]);
