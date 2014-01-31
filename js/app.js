var app = angular.module('planning-poker', []);

app.run(function($log) {
  $log.debug('planning poker started');
});

var root = document.getElementById('app-root');
angular.bootstrap(root, ['planning-poker']);
