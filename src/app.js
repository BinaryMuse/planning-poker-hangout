var app = angular.module('planning-poker', ['ngSanitize']);

app.factory('poker', function() {
  return {
    participants: [],
    availablePoints: [0, 1, 2, 3, 5, 8, 13],
    moderator: { id: null },
    description: { text: null },
    votesRevealed: { value: false },
    votes: {}
  };
});

app.run(function($log, $rootScope, poker) {
  $log.debug('planning poker started');

  $rootScope.$apply(function() {
    poker.participants = gapi.hangout.getParticipants();
    poker.me = gapi.hangout.getLocalParticipant();
  });

  var updateState = function() {
    $rootScope.$apply(function() {
      var state = gapi.hangout.data.getState();
      for (key in state) {
        poker[key] = angular.fromJson(state[key]);
      }
      $log.debug('State updated to:');
      $log.debug(poker);
      $rootScope.$broadcast('stateChanged', poker);
    });
  };

  gapi.hangout.data.onStateChanged.add(function(event) {
    updateState();
  });

  gapi.hangout.onParticipantsChanged.add(function(event) {
    $rootScope.$apply(function() {
      poker.participants = event.participants;
    });
  });

  setTimeout(updateState);
});

app.controller('DebugController', function($scope, poker) {
  $scope.poker = poker;
});

app.controller('ModeratorController', function($scope, poker) {
  $scope.poker = angular.copy(poker);
  $scope.$on('stateChanged', function(evt, newPoker) {
    $scope.poker = angular.copy(newPoker);
  });

  $scope.update = function() {
    gapi.hangout.data.submitDelta({
      availablePoints: angular.toJson($scope.poker.availablePoints),
      description: angular.toJson($scope.poker.description),
      votesRevealed: angular.toJson($scope.poker.votesRevealed)
    });
  };

  $scope.becomeModerator = function() {
    $scope.poker.moderator.id = poker.me.id;
    gapi.hangout.data.setValue('moderator', angular.toJson($scope.poker.moderator));
  };
});

app.controller('VoteController', function($scope, poker) {
  $scope.poker = poker;

  $scope.vote = function(points) {
    votes = angular.copy(poker.votes);
    votes[poker.me.id] = points;
    gapi.hangout.data.setValue('votes', angular.toJson(votes));
  };
});

app.controller('ParticipantsController', function($scope, poker) {
  $scope.poker = poker;
});

function initApp() {
  var root = document.getElementById('app-root');
  angular.bootstrap(root, ['planning-poker']);
}

gapi.hangout.onApiReady.add(initApp);
