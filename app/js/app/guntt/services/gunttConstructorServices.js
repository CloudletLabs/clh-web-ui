define(['angular'], function (angular) {

    "use strict";
    /* DEFINE GUNTT CONSTRUCTOR SERVICES MODULE */
    var gunttConstructorServices = angular.module('gunttConstructorServicesModule', ['clhServices']);

    gunttConstructorServices.service('GunttUserService', ['ResourceService', GunttUserService]);

    /*USER CONSTRUCTOR **START** */
    function GunttUserService(ResourceService) {
        this._ResourceService = ResourceService;
        this.initData = null;
    }

    // User constructor methods
    GunttUserService.prototype.getUserInitData = function () {
        var self = this;
        this._ResourceService.getCurrentUser().then(function (data) {
            self.initData = data;
        });
    };
    /*USER CONSTRUCTOR **END** */

    return gunttConstructorServices;
});
