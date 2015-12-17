angular.module('app.directives', [])

  // presence directive
  .directive('ngPresence', ['presence', 'auth', '$sce', function(presence, auth, $sce){

    // When list of users exceeds this number, hide excess user names behind tooltip
    var MAX_USERS_TO_RENDER = 3;

    return {

      restrict: "EA",
      templateUrl: "ng-presence.html",

      scope: {
        presenceChannelName: "@"
      },

      link: function(scope, el, attrs) {

        scope.maxUsersToRender = attrs.maxUsersToRender || MAX_USERS_TO_RENDER;
        scope.users = [];

        var channel = presence.subscribe(scope.presenceChannelName);

        var updateUsers = function() {

          // filter out current user
          scope.users = _.filter(channel.members, function(user) {
            return user.username != auth.currentUser.username;
          });

          // assign each a "full" name
          _.each(scope.users, function(user) {
            user.fullName = user.name + ' (' + user.username + ')';
          });

          // hide excessUsers behind a single tooltip
          scope.excessUsers = _.rest(scope.users, scope.maxUsersToRender);
          scope.excessUsersTooltip = $sce.trustAsHtml(_.pluck(scope.excessUsers, 'fullName').join('<br>'));

          // update DOM
          scope.$digest();
        };

        presence.bindChannelEvent(channel, 'member_added', updateUsers);
        presence.bindChannelEvent(channel, 'member_removed', updateUsers);

        scope.$on("$destroy", function() {
          presence.unsubscribe(scope.presenceChannelName);
        });

      }
    };
  }]);