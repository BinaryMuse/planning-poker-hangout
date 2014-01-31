var app = angular.module('planning-poker', []);

app.run(function($log) {
  alert('testing');
  $log.debug('planning poker started');
});

var root = document.getElementById('app-root');
angular.bootstrap(root, ['planning-poker']);
console.log('app bootstrapped');
