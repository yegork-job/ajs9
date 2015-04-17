'use strict';

angular.module('myTabs', [])

  .directive('myTabs', function ($compile) {
    return {
      restrict: 'A',
      template: '<div>' +
                '<a ng-repeat="tab in tabs" style="margin-left: 20px" ng-click="clickTab(tab.id)" href="#">' +
                '{{tab.name}}' +
                '</a>' +
                '</div>',
      transclude: true,
      scope: {},
      controller: function ($scope, $element) {
        $scope.tabs = [];
        var tabElement = {};

        this.addTab = function (newTab) {
          if (!$scope.tabs.length) {
            showTab(newTab);
          }
          $scope.tabs.push(newTab);
        };

        var hideActiveTab = function () {
          tabElement.elem.remove();
          tabElement.id = -1;
        };

        var showTab = function (tab) {
          tabElement.id = tab.id;
          tabElement.elem = $compile(tab.elem)($scope);
          $element.append(tabElement.elem);
        };

        $scope.clickTab = function (id) {
          if (tabElement.id !== id) {
            hideActiveTab();
            showTab(_.find($scope.tabs, {id: id}));
          }
        };
      },
      link: function($scope, $elem, $attr, controller, transcludeFunc) {
        transcludeFunc(function (clone) {
          var findTabs = function (node) {
            return _.findIndex(node.attributes, function (attr) {
              return attr.name === 'my-tab';
            });
          };
          angular.forEach(clone, function (node) {
            var index = findTabs(node);
            if (index !== -1) {
              controller.addTab({
                id: Math.random(),
                name: node.attributes[index].value,
                elem: node
              });
            }
          });
        });
      }
    };
  })

  .directive('myTab', function () {
    return {
      restrict: 'A',
      scope: {
        myTab: '@'
      },
      require: '^^?myTabs'
    };
  })
;
