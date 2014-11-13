(function() {
	var app = angular.module('Movies',['autocomplete']);
	var movieId = "54478615c970c14cf9d75da5";
	app.factory('MovieRetriever', function($http, $q, $timeout){
		var MovieRetriever = new Object();
		MovieRetriever.getmovies = function(typedString) {
			var movieData = $q.defer();
			var moviesRetrieved;
			$http({url: 'http://localhost:2008/retrieve-movies',method: 'GET', params: {s: typedString}}).success(function(data) {
				moviesRetrieved=data;
			});
			$timeout(function(){
				movieData.resolve(moviesRetrieved);
			},1000);
			return movieData.promise
		}
		return MovieRetriever;
	});
	app.controller('MovieController', function($scope,$http,MovieRetriever) {
		var This = this;
		function updateMovieInfo() {
			$http({url: 'http://localhost:2008/movie',method: 'GET', params: {m_id: movieId}}).success(function(data) {
				This.movies = data;
				console.log(data);
			});
			$http({url: 'http://localhost:2008/reviews',method: 'GET', params: {m_id: movieId}}).success(function(data) {
				This.reviews = data;
			});
		}
		updateMovieInfo();
		$scope.submit = function() {
			if ($scope.user_review) {
				console.log($scope.user_review);
				postReview($http,$scope.user_review);
				$scope.user_review="";	
			}
		};
		function postReview($http,user_review) {
			var review = {
				m_id : movieId,
				u_id : "54478767c970c14cf9d75da6",
				is_critic : true,
				review : user_review,
				up_votes : 0,
				down_votes : 0
			};
			This.reviews.push(review);
			console.log(review);
			$http({
				url: 'http://localhost:2008/post-review',
				method: 'POST',
				data: review,
				headers: {'Content-Type': 'application/json'}
			}).success(function (data, status, headers, config) {
				console.log(status);
			}).error(function (data, status, headers, config) {
				$scope.status = status + ' ' + headers;
				console.log($scope.status);
			});
		}
		$scope.movies = MovieRetriever.getmovies("");
		$scope.movies.then(function(data){
			$scope.movies = data;
		});
		$scope.getmovies = function(){
			return $scope.movies;
		}
		$scope.suggestMovies = function(typedString){
			console.log("Do something like reload data with this: " + typedString );
			$scope.newmovies = MovieRetriever.getmovies(typedString);
			$scope.newmovies.then(function(data){
				$scope.movies = data;
			});
		}
		$scope.selectMovie = function(suggestion){
			movieId = suggestion._id;
			updateMovieInfo();
			console.log("Suggestion selected: " + suggestion );
		}
	}); 
})();