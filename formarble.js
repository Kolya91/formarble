"use strict";

//function objSet(obj, path, value) {
//    var segments = path.split('.'),
//        cursor = obj,
//        segment,
//        i;
//
//    for (i = 0; i < segments.length - 1; ++i) {
//        segment = segments[i];
//        cursor = cursor[segment] = cursor[segment] || {};
//    }
//
//    return cursor[segments[i]] = value;
//}
//
//function objGet(obj, path) {
//    var segments = path.split('.'),
//        cursor = obj,
//        len = segments.length,
//        i;
//
//    for (i = 0; i < len; i++) {
//        cursor = cursor[segments[i]];
//
//        if (undefined === cursor) {
//            return;
//        }
//    }
//
//    return cursor;
//}

angular.module('formarble', [])
    .service('fm', function ($templateCache) {
        function parseDisplay(display) {
            if (angular.isString(display)) {
                var parts = display.split(':', 2);
                return {
                    name: parts[0],
                    type: parts[1]
                }
            }

            if (angular.isObject(display) && display.name) {
                return display;
            }

            return false;
        }

        function getTemplateId(display, fallback) {
            display = parseDisplay(display);
            if (display) {
                return display.name + ((!fallback && display.type) ? ':' + display.type : '');
            }
            return false;
        }

        return {
            getTemplate: function (theme, display) {
                var tid, template;
                if (tid = getTemplateId(display)) {
                    template = $templateCache.get(theme + '/' + tid);
                    if (!template) {
                        if (tid = getTemplateId(display, true)) {
                            template = $templateCache.get(theme + '/' + tid);
                        }
                    }
                }
                return template;
            }
        }
    })
    .directive('fmForm', function (fm, $compile) {
        return {
            restrict: 'EA',
            require: 'fmForm',

            scope: {
                $control: '=fmForm',
                $model: '=ngModel'
            },

            terminal: true,

            controller: function ($scope, $attrs) {
                var theme = $attrs.fmTheme || 'formarble';
//                this.set = function (path, value) {
//                    objSet($scope.$model, path, value);
//                }
//
//                this.get = function (path) {
//                    return objGet($scope.$model, path);
//                }

                this.getTemplate = function(display) {
                    return fm.getTemplate(theme, display);
                }

                this.getControlModel = function (control) {
                    return ['$model', control.path].join('.')
                }

                this.getControlId = function (control){
                    return control.path && control.path.split('.').join('-');
                }

                this.getProperties = function(control) {
                    if (angular.isObject(control.properties)) {
                        return Object.keys(control.properties).map(function (key) {
                            return control.properties[key];
                        }).sort(function (a, b) {
                            return a.order - b.order;
                        })
                    }
                }
            },
            link: function (scope, elem) {
                if(!elem.find('[fm-control]').length){
                    elem.append('<div fm-control></div>');
                }

                $compile(elem.contents())(scope)
            }
        }
    })
    .directive('fmControl', function ($compile) {
        return {
            require: '^fmForm',
            restrict: 'EA',
            scope: true,
            link: function (scope, elem, attrs, ctrl) {
                var control = scope.$eval(attrs.fmControl || '$control');

                control.$id = ctrl.getControlId(control);
                control.$model = ctrl.getControlModel(control);

                scope.$control = control;
                scope.$subControls = ctrl.getProperties(control);

                var template = ctrl.getTemplate(control.display);
                if (template) {
                    elem.html(template);
                    $compile(elem.contents())(scope);
                } else {
                    console.warn('fmControl: No template', template);
                }
            }

        }
    })
    .directive('fmLabel', function () {
        return function (scope, elem, attr) {
            var control = scope.$eval(attr.fmLabel || '$control');
            elem.attr({
                for: control.$id
            })
        }
    })
    .directive('fmInput', function ($compile) {
        var ngInputPlugins = ['pattern', 'minlength', 'maxlength', 'required'];
        var htmlInputPlugins = ['min', 'max', 'step'];

        function toNgName(name) {
            return 'ng' + name.charAt(0).toUpperCase() + name.slice(1);
        }

        return {
            require: '^fmForm',
            priority: 200,
            terminal: true,
            compile: function (tElem, tAttrs) {
                var tag = tElem.prop('tagName');
                var isSelect = 'SELECT' === tag;
                var isInput = 'INPUT' === tag || 'TEXTAREA' === tag;

                var controlModelName = tAttrs.fmInput || '$control';

                tAttrs.$set('fmInput', null);

                return function (scope, elem, attr, ctrl) {
                    var control = scope.$eval(controlModelName);

                    attr.$set('ngModel', control.$model);
                    attr.$set('id', control.$id);

                    if (isInput) {
                        if(!attr.type){
                            attr.$set('type', control.display.type)
                        }

                        ngInputPlugins.forEach(function (name) {
                            var value = control.display[name];
                            if (angular.isDefined(value)) {
                                attr.$set(toNgName(name), value);
                            }
                        })

                        htmlInputPlugins.forEach(function (name) {
                            var value = control.display[name];
                            if (angular.isDefined(value)) {
                                attr.$set(name, value);
                            }
                        })
                    }

                    if (isSelect) {
                        attr.$set('ngOptions', 'o.id as o.title for o in ' + controlModelName + '.display.options');
                    }

                    $compile(elem)(scope);

                    scope.$input = elem.controller('ngModel');
                }
            }}
    })
    .directive('fmReset', function () {
        return {
            require: '^form',
            link: function (scope, elem, attrs, ctrl) {
                function onClick(e) {
                    if(!attrs.ngClick){
                        e.preventDefault();
                    }

                    ctrl.$setPristine();
                }

                elem.bind('click', onClick);
                scope.$on('destroy', function () {
                    elem.unbind('click', onClick);
                })
            }
        }
    })