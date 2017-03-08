require('./menuTrees.scss');
define(['../directivesModule'], function(module) {
    module.directive("menuTrees", [function() {
        'use strict';
        return {
            restrict: 'E',
            templateUrl: 'menuTrees.html',
            replace: true,
            scope: {
                menuList: '='
            },
            controller: function($scope, $element, $state) {

                // 控制一级菜单显示
                $scope.toggleDisplay = function(Id, $event) {
                    // 获取所有一级菜单ul
                    var eleArray = document.querySelectorAll("[id^='sMenu-']");
                    // 当前点击ul
                    var ele = document.querySelector("#sMenu-" + Id);
                    angular.forEach(eleArray, function(v, k) {
                            v.style.display = "none";
                        })
                    // 去除所有子级菜单选择样式
                    var otherEleArray = document.querySelectorAll("[id^='menu-item-']");
                    angular.forEach(otherEleArray, function(v, k) {
                        angular.element(v).removeClass("menu-active");
                    })
                    // 跳转第一个子级
                    angular.element(ele.firstChild.nextElementSibling).addClass("menu-active");
                    $state.go(angular.element(ele.firstChild.nextElementSibling).attr("ui-sref"));
                    
                    
                    ele.style.display = "block";
                }

                $scope.toggleActive = function(item, $event) {
                    if ($event.cancelBubble) {
                        $event.cancelBubble = true;
                    }
                    if ($event.stopPropagation()) {
                        $event.stopPropagation();
                    }
                    
                    // 获取点击ele
                    var id = "menu-item-" + item.sItem[3];
                    // 其余li 元素组
                    var ele = document.querySelector("#" + id);
                    var otherEleArray = document.querySelectorAll("[id^='menu-item-']");
                    angular.forEach(otherEleArray, function(v, k) {
                        angular.element(v).removeClass("menu-active");
                    })
                    angular.element(ele).addClass("menu-active");

                }

            },
            link: function(scope, ele, attrs) {
                // 模块名数组
                scope.FMenuList = [];
                // 一级菜单对象数组
                scope.SMenuList = {};
                // 一级菜单临时数组
                var SArray = [];
                // 计数器
                var counter = 0;
                var FmenuCounter = 0;
                // 遍历获取数组所需字段
                angular.forEach(scope.menuList, function(v, k) {
                    if (v.displayOrder > 0) {
                        if (FmenuCounter == 0) {
                            // 排序 菜单名 图标 url
                            scope.FMenuList[0] = [v.displayOrder, v.menuName, v.menuIcon];
                            FmenuCounter++;
                        } else {
                            // 排序 菜单名 图标 url
                            scope.FMenuList[FmenuCounter] = [v.displayOrder, v.menuName, v.menuIcon];
                            FmenuCounter++;
                        }
                        
                        if (v.childNode.length > 0) {
                            SArray = [];
                            angular.forEach(v.childNode, function(v2, k2) {
                                if (v2.displayOrder) {
                                    counter++;
                                    SArray.push([v2.displayOrder, v2.menuName, v2.routeUrl, counter]);
                                }
                            })
                        }

                        scope.SMenuList[FmenuCounter-1] = SArray;
                    }

                })
        
                // 根据displayOrder重新排序
                function sortNumber(a, b) {
                    return a[0] - b[0];
                };
                scope.FMenuList.sort(sortNumber);
                angular.forEach(scope.SMenuList, function(v, k) {
                        v.sort(sortNumber);
                })

                // console.log(scope.FMenuList);
                // console.log(scope.SMenuList);
                // 执行一次点击展开第一个模块
                setTimeout(function() {
                    var ele = document.querySelector("#menu-item-" + scope.SMenuList[0][0][4]);
                    angular.element(ele).addClass("menu-active");
                    document.getElementById("menu-1").click();
                })
            }
        };
    }])
});