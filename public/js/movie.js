(function() {
	var movie = angular.module('Movie',[])
	movie.service('MovieService', function($http) {
		this.getMovie = function(id,callback) {
			$http(
			{
				url: '/movie',
				method: 'GET', 
				params: {m_id: id}
			}).success(function(data) {
				callback(data)
			})
		}
		this.getReviews = function(id,callback) {
			$http(
			{
				url: '/reviews',
				method: 'GET', 
				params: {m_id: id}
			}).success(function(data) {
				callback(data)
			})
		}
		this.getUserReview = function(m_id,u_id,callback) {
			$http(
			{
				url: '/user-review',
				method: 'GET', 
				params: {m_id: m_id,u_id: u_id}
			}).success(function(data) {
				callback(data)
			})
		}
		this.addReview = function(review) {
			$http(
			{
				url: '/post-review',
				method: 'POST',
				data: review,
				headers: {'Content-Type': 'application/json'}
			}).success(function (data, status, headers, config) {

			}).error(function (data, status, headers, config) {
					
			})
		}
	})
	movie.controller('MovieCtrl', function($scope,$routeParams,$rootScope,MovieService) {
		$scope.movieId = $routeParams.movieId
		MovieService.getMovie($scope.movieId,function(data) {
			$scope.movie = data
		})
		MovieService.getReviews($scope.movieId,function(data) {
			$scope.reviews = data
		})
		if($rootScope.globals.currentUser) {
			user_id = $rootScope.globals.currentUser.id
			MovieService.getUserReview($scope.movieId,user_id,function(data) {
				$scope.user_review = data
			})
		}
		$scope.submit = function() {
			if ($scope.review_post) {
				if($rootScope.globals.currentUser) {
					$scope.error = ""
					user_id = $rootScope.globals.currentUser.id
					var review = {
						m_id : $scope.movieId,
						u_id : user_id,
						is_critic : true,
						review : $scope.review_post,
						up_votes : 0,
						down_votes : 0
					}
					$scope.user_review = review
					MovieService.addReview(review)
				}
				else
					$scope.error = "please login to post a review"
				$scope.review_post=""
			}
			else
				$scope.error = "Review shouldn't be empty"
		}
	})
})()