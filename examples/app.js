"use strict"

angular.module('FormarbleExample', ['formarble'])
    .run(function ($rootScope, $window) {
        $rootScope.schema = $window.schema;
        $rootScope.model = {
            image: {
                testText: 'some test text'
            }
        };

        function modelFilter(value, key) {
            if (_.isArray(value) || _.isString(value)) {
                return 0 === value.length ? undefined : value;
            }

            if (_.isObject(value)) {
                var filtred = _.mapValues(value, modelFilter);
                return angular.equals(filtred, {}) ? undefined : filtred;
            }

            if (null === value) {
                return undefined;
            }

            return value;
        }

        $rootScope.$watch('model', function (value) {
            $rootScope.modelFiltered = _.mapValues(value, modelFilter)
        }, true)
    })
    .directive('ngIndeterminate', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                scope.$watch(attrs.ngIndeterminate, function (value) {
                    console.log(value, elem.prop('indeterminate'), !!value);
                    elem.prop('indeterminate', !!value);
                });
            }
        };
    });