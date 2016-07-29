angular.module('app.controllers', [])

  .controller('AvailabilityCtrl', ['$scope', 'presence', function($scope, presence){

    $scope.availability = {
      id: 1,
      date: "Saturday, September 26th 2015 @ 5pm - 7pm",
      item: {
        name: "Sunset Cruise",
      },
    };

    $scope.presenseChannelName = "Availability:" + $scope.availability.id;

    $scope.booking = {
      availabilityId: $scope.availability.id,
      numSeats: 0
    };

    // for testing...
    window.updatePresence = $scope.updatePresence = function(){
      presence.randomUpdate();
    }
  }]);
