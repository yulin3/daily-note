// 基础域名
var baseDomain = '';

require('./resource/css/bootstrap.css');
require('./resource/css/main.css');
require('./resource/css/common.css');
define([
    './component/directives/namespace',
    './component/services/namespace',
    './component/filters/filters'
], function() {
    'use strict';
    return angular.module('app', ['ui.router', 'app.directives', 'app.services', 'app.filters'])
        .run([function() {

        }])
       .config(function($stateProvider, $urlRouterProvider,$httpProvider) {
            $urlRouterProvider.otherwise('/login');
            $stateProvider
            
            .state('login', {
                url: '/login',
                title: '登录',
                templateUrl: 'login.html',
                controller:'Login'
            })
            .state('main', {
                url: '/main',
                templateUrl: 'main.html' + '?datestamp=' + (new Date()).getTime(),
                controller: 'mainCtrl'
            })

            })
            // 设置后请求带cookies
            $httpProvider.defaults.withCredentials = true;
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
            $httpProvider.defaults.transformRequest = [function(data) {
                /**
                 * The workhorse; converts an object to x-www-form-urlencoded serialization.
                 * @param {Object} obj
                 * @return {String}
                 */
                var param = function(obj) {
                    var query = '';
                    var name, value, fullSubName, subName, subValue, innerObj, i;
                    for (name in obj) {
                        value = obj[name];
                        if (value instanceof Array) {
                            for (i = 0; i < value.length; ++i) {
                                subValue = value[i];
                                fullSubName = name + '[' + i + ']';
                                innerObj = {};
                                innerObj[fullSubName] = subValue;
                                query += param(innerObj) + '&';
                            }
                        } else if (value instanceof Object) {
                            for (subName in value) {
                                subValue = value[subName];
                                if (subValue != null) {
                                    // fullSubName = name + '[' + subName + ']';
                                    //user.userName = hmm & user.userPassword = 111
                                    fullSubName = name + '.' + subName;
                                    // fullSubName =  subName;
                                    innerObj = {};
                                    innerObj[fullSubName] = subValue;
                                    query += param(innerObj) + '&';
                                }
                            }
                        } else if (value !== undefined) //&& value !== null
                        {
                            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                        }
                    }
                    return query.length ? query.substr(0, query.length - 1) : query;
                };
                return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
            }]
            $httpProvider.defaults.useXDomain = true;
        })


    .controller('mainCtrl', ['$scope', '$state', 'httpService', '$timeout', 'ENV', function($scope, $state, httpService, $timeout, ENV) {

         

        }])
        .controller('Login', ['$scope', '$state', 'httpService', '$timeout', 'ENV', function($scope, $state, httpService, $timeout, ENV) {



        }])
        .constant("ENV", {
          
         })

});