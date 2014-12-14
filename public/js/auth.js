(function() {
	var auth = angular.module('Auth',['ui.bootstrap'])
	auth.service('AuthService', function($http,$rootScope,localStorageService) {
		this.login = function(user,callback) {
			$http({
				url: '/login',
				method: 'POST',
				data: user,
				headers: {'Content-Type': 'application/json'}
			}).success(function (data, status, headers, config) {
				response = { success : data._id}
				callback(response)
			}).error(function (data, status, headers, config) {
				response = { error : "username or password is incorrect"}
				callback(response)
			})	
		}
		this.logout = function(callback) {
			$http(
			{
				url: '/logout',
				method: 'GET'
			}).success(function(data) {
				response = { success : "Successfully logged out"}
				callback(response)
			})
		}
		this.setCredentials = function (user) {
			$rootScope.globals = {
                currentUser: {
                    email: user.email,
                    id: user.id
                }
            }
            localStorageService.set('fuck', $rootScope.globals)
        }
        this.clearCredentials = function () {
			$rootScope.globals = {}
            localStorageService.remove('fuck')
        }
	})
	auth.controller('AuthCtrl',function ($rootScope,$scope,$modal,AuthService) {
		$scope.open = function (size) {
			var modalInstance = $modal.open({
			  templateUrl: 'partials/login-modal.html',
			  controller: ModalInstanceCtrl,
			  size: size
			})
		}
		$scope.logout = function() {
			AuthService.logout(function(response) {
				if(response.success) {
					AuthService.clearCredentials()
				}
			})
		}
	});
	var ModalInstanceCtrl = function ($scope,$modalInstance,AuthService) {
		$scope.user = {}
		$scope.close = function() {
        	$modalInstance.close()
    	};
    	$scope.login = function() {
        	AuthService.login($scope.user,function(response) {
        		if(response.success) {
        			$scope.user.id = response.success
        			AuthService.setCredentials($scope.user)
        			$modalInstance.close();
        		}
        		else
        			$scope.error = response.error
        	})
    	}
	}
})()