define([], function () {
    'use strict';
     angular.module('app.filters', [])
    	.filter('percentage', [function() {
		return function(input) {
			var result = (input * 100).toFixed(2) + "%";
			return result;
		}
	}])

});
