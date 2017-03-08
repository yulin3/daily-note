define(['../servicesModule'], function(module) {
    module.factory('httpService', function ($http, $timeout, $q,$rootScope) {
        // 默认参数
        var _httpDefaultOpts = {
            method: 'POST', // GET/DELETE/HEAD/JSONP/POST/PUT
            url: '',
            params: {}, // 拼接在url的参数
            data: {},
            cache: false, // boolean or Cache object
            limit: false, //是否节流
            timeout : "httpTimeout", // 节流变量名
            timeoutTime : 100,
            isErrMsg: true,// 错误提示
            isErrMsgFn : null,// 错误提示函数
            checkCode: false, // 是否校验code
            before: function(){
                $rootScope.loader = true
            }, // ajax 执行开始 执行函数
            end: function(){
                $rootScope.loader = false
            }, // ajax 执行结束 执行函数
            error: function(){
                $rootScope.loader = false
            }, // ajax 执行失败 执行函数
            success: function(data){
                // console.log(data.config)
                $rootScope.loader = false
            }, // ajax 执行成功 执行函数
            checkCodeError : function(code, errMsg, data){} // ajax 校验code失败 执行函数
        };

        var _httpTimeoutArray = {"httpTimeout" : null};//ajax节流使用的定时器 集合

        var isErrMsgFn = function (opts) {
            console.log(opts)
            if (angular.isFunction(opts.isErrMsgFn)) {
                opts.isErrMsgFn();
            } else {
                alert("抱歉！因为操作不能够及时响应，请稍后在试...");
            }
        };

        // http请求之前执行函数
        var _httpBefore = function (opts) {
            if (angular.isFunction(opts.before)) {
                opts.before();
            }
        };

        // http请求之后执行函数
        var _httpEnd = function (opts) {
            if (angular.isFunction(opts.end)) {
                opts.end();
            }
            if(opts.limit){
                $timeout.cancel(_httpTimeoutArray[opts.timeout]);
            }
        };

        // 响应错误判断
        var _responseError = function (data, opts) {
            // public.js
            return checkCode(data, opts);
        };

        // http 请求执行过程封装    deferred ：http 链式请求延迟对象
        var _httpMin = function (opts, deferred) {
            _httpBefore(opts);
            $http({
                method: opts.method,
                url: opts.url,
                params: opts.params,
                data: opts.data
            }).then(function(data,header,config,status){ //响应成功
                // 权限，超时等控制
                if( opts.checkCode && !_responseError(data, opts) ) {
                    return false;
                }
                // 请求成功回调函数
                if(opts.success) {
                    opts.success(data,header,config,status);
                }
                if (deferred) {
                    deferred.resolve(data,header,config,status);  //任务被成功执行
                }
                _httpEnd(opts);
            },function(data,header,config,status){ //处理响应失败
                if(opts.isErrMsg){
                    isErrMsgFn(opts);
                }
                opts.error(data,header,config,status);

                if (deferred) {
                    deferred.reject(data,header,config,status); //任务未被成功执行
                }

                _httpEnd(opts);
            })
        };

        // http请求，内含节流等控制
        var _http = function (opts, deferred) {
            opts = angular.extend({}, _httpDefaultOpts, opts);
            var result;
            if (opts.limit) {
                $timeout.cancel(_httpTimeoutArray[opts.timeout]);
                _httpTimeoutArray[opts.timeout] = $timeout(function () {
                    result = _httpMin(opts, deferred);
                }, opts.timeoutTime);
            } else {
                result = _httpMin(opts, deferred);
            }
        };

        // http 链式请求
        var _linkHttpMin = function (opts, deferred) {
            _http(opts, deferred);
        };

        return {
            /**
             * http请求
             * @param opts
             */
            http: function (opts,data) {
                if(opts.method === 'GET'){  //GET请求
                    opts.params = data
                }else {                     //post,put请求
                    opts.data = data
                }
                _http(opts);
            },
            /**
             * http链式请求
             * @param opts
             * @param deferred
             * @returns {deferred.promise|{then, catch, finally}}
             * then 成功
             * catch 失败
             */
            linkHttp : function (opts,data, deferred) {
                if(opts.method === 'GET'){  //GET请求
                    opts.params = data
                }else {                     //post,put请求
                    opts.data = data
                }
                deferred = deferred || $q.defer();
                _linkHttpMin(opts, deferred);
                return deferred.promise;
            }
        };
    })
});
