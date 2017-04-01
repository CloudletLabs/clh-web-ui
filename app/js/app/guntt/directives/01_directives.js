define(['angular'], function (angular) {

    var directivesModule = angular.module('gunttDirectivesModule', []);

    directivesModule.directive('directiveDatepicker', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                jQuery(element).datepicker
                (
                    {
                        changeYear: true,
                        changeMonth: true,
                        dateFormat: 'dd.mm.yy',
                        yearRange: '2000:2020',

                        onSelect: function (dateText, inst) {
                            ngModelCtrl.$setViewValue(dateText);
                            scope.$apply();
                        }
                    }
                );
            }
        }
    });
    directivesModule.directive('directiveResizable', function () {
        return {

            link: function (scope, element, attrs) {
                jQuery(element).resizable();

            }
        }
    });

    //SLIDE OPEN for EDIT sub-menu's in MAIN MENU
    directivesModule.directive('directiveSlideShow', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(jQuery('.slide-menu')).show('slide', 500);
                });
            }
        }
    });
    //SLIDE CLOSE for EDIT sub-menu's in MAIN MENU
    directivesModule.directive('directiveSlideHide', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(jQuery('.slide-menu')).hide('slide', 500);
                });
            }
        }
    });

    ///////////////////////////////////////////SUB-MENU's in MENU/////////////////////////////////////////

    //BLIND OPEN/CLOSE for RENAME sub-menu's in EDIT MENU
    directivesModule.directive('directiveBlindShow', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(document.querySelector('.blind-show')).toggle('blind', 150);
                });
            },
            scope: true
        }
    });

    //BLIND OPEN/CLOSE for TYPES sub-menu's in EDIT MENU
    directivesModule.directive('directiveBlindTypesShow', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(document.querySelector('.blind-show-types')).toggle('blind', 150);
                });
            },
            scope: true
        }
    });

    //BLIND OPEN/CLOSE for GROUPS sub-menu's in EDIT MENU
    directivesModule.directive('directiveBlindGroupsShow', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(document.querySelector('.blind-show-groups')).toggle('blind', 150);
                });
            }
        }
    });

    //BLIND OPEN/CLOSE for ORGS sub-menu's in EDIT MENU
    directivesModule.directive('directiveBlindOrgsShow', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(document.querySelector('.blind-show-orgs')).toggle('blind', 150);
                });
            }
        }
    });

    // ============== CLOSE ALL for CLOSE MENU's BTN's =================
    directivesModule.directive('directiveBlindClose', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(jQuery('.blind-show, .blind-show-types, .blind-show-groups, .blind-show-orgs'))
                        .hide('blind', 150);
                });
            }
        }
    });

    ///////////////////////////////////////////HEADER DROPDOWN MENU's/////////////////////////////////////////

    //BLIND OPEN/CLOSE for header DISPLAY FILTERS DROPDOWN MENU
    directivesModule.directive('directiveBlindDropdownShow', function () {
        return {
            link: function (scope, element, attrs) {
                var menu;

                element.on('click', function () {
                    menu = angular.element(document.querySelector('.header-dropdown-blind'));

                    menu.toggle('blind', 150);

                    menu.on('mouseleave', function () {
                        menu.hide('blind', 200);
                    });
                });
            }
        }
    });

    //SLIDE OPEN for EDIT sub-menu's in MAIN MENU
    directivesModule.directive('directiveSlideShowGr', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(jQuery('.slide-menu-gr')).show('slide', 500);
                });
            }
        }
    });
    //SLIDE CLOSE for EDIT sub-menu's in MAIN MENU
    directivesModule.directive('directiveSlideHideGr', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(jQuery('.slide-menu-gr')).hide('slide', 500);
                });
            }
        }
    });

    ///////////////////////////////////////////SUB-MENU's in MENU/////////////////////////////////////////

    //BLIND OPEN/CLOSE for RENAME sub-menu's in EDIT MENU
    directivesModule.directive('directiveBlindShowGr', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(document.querySelector('.blind-show-gr')).toggle('blind', 150);
                });
            },
            scope: true
        }
    });

    //BLIND OPEN/CLOSE for TYPES sub-menu's in EDIT MENU
    directivesModule.directive('directiveBlindColorShow', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(document.querySelector('.blind-show-color')).toggle('blind', 150);
                });
            },
            scope: true
        }
    });
    // ============== CLOSE ALL for GROUP CLOSE MENU's BTN's =================
    directivesModule.directive('directiveBlindCloseGr', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(jQuery('.slide-menu-gr, .blind-show-gr, .blind-show-color'))
                        .hide('blind', 150);
                });
            }
        }
    });
    //SLIDE OPEN for EDIT sub-menu's in MAIN MENU
    directivesModule.directive('directiveSlideShowOrg', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(jQuery('.slide-menu-org')).show('slide', 500);
                });
            }
        }
    });
    //SLIDE CLOSE for EDIT sub-menu's in MAIN MENU
    directivesModule.directive('directiveSlideHideOrg', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(jQuery('.slide-menu-org')).hide('slide', 500);
                });
            }
        }
    });

    ///////////////////////////////////////////SUB-MENU's in MENU/////////////////////////////////////////


    //BLIND OPEN/CLOSE for RENAME sub-menu's in EDIT MENU
    directivesModule.directive('directiveBlindShowOrg', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(document.querySelector('.blind-show-org')).toggle('blind', 150);
                });
            }
        }
    });

    //BLIND OPEN/CLOSE for MEMBERSHIP sub-menu's in EDIT MENU
    directivesModule.directive('directiveBlindMemShow', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(document.querySelector('.blind-show-mem')).toggle('blind', 150);
                });
            }
        }
    });

    // ============== CLOSE ALL for CLOSE MENU's BTN's =================
    directivesModule.directive('directiveBlindCloseOrg', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    angular.element(jQuery('.slide-menu-org, .blind-show-org, .blind-show-mem'))
                        .hide('blind', 150);
                });
            }
        }
    });

    return directivesModule;
});
  
