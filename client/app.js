(function() {

  var app = angular.module('FreedomSpoke', ['ui.router', 'Search', 'Results', 'User']);

  app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$httpProvider',
  function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
      // .state('home', {
      //   url: '/home',
      //   views: {
      //     // main template is placed here (relatively named)
      //     '': { templateUrl: './views/home.html'},
      //     // child views defined here (absolutely named)
      //     'search@home': {
      //       templateUrl: './views/search.html',
      //       // controller: 'SearchController',
      //       data: { publicallyAccessible: true }
      //     },
      //     'results@home': {
      //       templateUrl: './views/results.html',
      //       // controller: 'ResultsController',
      //       data: { publicallyAccessible: true }
      //     }
      //   }
      // })


// app.config(['$stateProvider', '$urlRouterProvider',
//   function ($stateProvider, $urlRouterProvider) {

//     $urlRouterProvider.otherwise('/papers');
//     // States
//     $stateProvider
//     .state( 'papers',  {
//         url: "/papers",
//         templateUrl: 'papers.html'
//     }) // nested paper state + views
//     .state( 'papers.views', {
//         views: {
//           '@papers': {
//             templateUrl: 'papers.home.html'
//           },
//           'paper1@papers': {
//             templateUrl: 'papers.paper1.html'
//           },
//           'paper2@papers': {
//             templateUrl: 'papers.paper2.html'
//           }
//         }
//     })
//   }
// ])

      .state('home', {
        abstract: true,
        url: '/home',
        templateUrl: 'views/home.html'
      })
        // data: { publicallyAccessible: true }
        // views: {
        //   'search': {
        //     templateUrl: 'views/search.html',
        //     data: { publicallyAccessible: true }
        //   },
        //   'results': {
        //     templateUrl: 'views/results.html',
        //     data: { publicallyAccessible: true }
        //   }
        // }
      
      // nested home state and views
      .state('home.views', {
        url: '',
        views: {
          'search@home': {
            templateUrl: 'views/home.search.html'
          },
          'results@home': {
            templateUrl: 'views/home.results.html'
          }
        }
      })





      // .state('home.search', {
      //   url: '',
      //   // loaded into ui-view of parent's template
      //   templateUrl: 'views/home.search.html'
      // })

      // .state('home.results', {
      //   url: '',
      //   // loaded into ui-view of parent's template
      //   templateUrl: 'views/home.results.html'
      // })

      // .state('home', {
      //   url: '/home',
      //   templateUrl: 'views/home.html',
      //   data: { publicallyAccessible: true }
      // })
      // .state('results', {
      //   // url: '/home',
      //   templateUrl: 'views/results.html',
      //   data: { publicallyAccessible: true }
      // })

      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        data: { publicallyAccessible: true }
      })

      .state('signin', {
        url: '/signin',
        templateUrl: 'views/signin.html',
        data: { publicallyAccessible: true }
      });

    $urlRouterProvider.otherwise('home');
    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');
  }]);

  app.factory('AttachTokens', function($window) {
    // this is an $httpInterceptor
    // its job is to stop all outgoing requests to look in local storage and find the user's token
    // then it add the token to the header so the server can validate the request
    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('com.FreedomSpoke');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })

  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready.
  // however, we want to make sure the user is authorized.
  // we listen for when angular is trying to change routes.
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's invalid, we'll redirect back to signin/signup
  /*
  .run(function ($rootScope, $state, UserFactory) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      if (!next.data.publicallyAccessible && !UserFactory.isAuth()) {
        event.preventDefault();
        $state.go('signin');
      }
    });
  });
  */
  .run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
  }])

})();