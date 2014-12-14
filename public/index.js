(function() {
	var MR = angular.module('MovieReview', ['ngRoute','LocalStorageModule','autocomplete','Movie','Auth','Home'])
    MR.config(function($routeProvider,$locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            // route for the home page
            .when('/', {
                templateUrl : '/partials/home.html'
            })
            // route for the movie page
            .when('/movie/:movieId', {
                templateUrl : '/partials/movie.html'
            })
    })  
    MR.run(function ($rootScope,localStorageService) {
        // keep user logged in after page refresh
        $rootScope.globals = localStorageService.get('fuck') || {};
        console.log(localStorageService.get('fuck'))
    })
    MR.service('MovieSuggest', function($http, $q, $timeout){
        this.getmovies = function(typedString) {
            var movieData = $q.defer()
            var moviesRetrieved
            $http(
            {
                url: '/retrieve-movies',
                method: 'GET', 
                params: {s: typedString}
            }).success(function(data) {
                moviesRetrieved=data;
            })
            $timeout(function(){
                movieData.resolve(moviesRetrieved);
            },1000)
            return movieData.promise
        }
    })
    MR.controller('SearchBarCtrl', function($scope,$location,MovieSuggest) {
        $scope.movies = MovieSuggest.getmovies("");
        $scope.movies.then(function(data){
            $scope.movies = data
        });
        $scope.getmovies = function(){
            return $scope.movies
        }
        $scope.suggestMovies = function(typedString){
            $scope.newmovies = MovieSuggest.getmovies(typedString);
            $scope.newmovies.then(function(data){
                $scope.movies = data
            });
        }
        $scope.selectMovie = function(suggestion){
            movieId = suggestion._id
            $location.path('/movie/'+movieId)
        }
    })
})()