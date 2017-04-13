define(['angular'], function (angular) {
    'use strict';

    /* DEFINE GUNTT TIME AND DATE CONTROLLER MODULE */
    var gunttTimeAndDateCtrlModule = angular.module('gunttDateAndTimeCtrlModule', ['clhServices']);

    /*TIME AND DATE APP CONTROLLER **START** */
    gunttTimeAndDateCtrlModule.controller('gunttDateAndTimeCtrl',
        function ($rootScope, $scope, $interval, $log, toastr, $window, $document) {
            /*DISPLAY DATE TABLE OPERATIONS **START** */

            /*GUNTT DATE CONSTRUCTOR **START** */
            function GunttDateConstructor() {
                this.toDay = new Date();
                this.DateInputPattern = new RegExp('[0-3]{1}[0-9]{1}.[0-1]{1}[0-9]{1}.(20)[0-9]{1}[0-9]{1}');
                this.showToDay = false;
                this.goToDateChoice = null;
            }

            //save constructor
            GunttDateConstructor.prototype.constructor = GunttDateConstructor;

            //'Go Back ToDAY!' button display conditions
            GunttDateConstructor.prototype._goToDayDisplay = function () {
                var trueToDay = new Date();
                (this.toDay < trueToDay.setHours(0, 0) || this.toDay > trueToDay.setHours(23, 59))
                    ? this.showToDay = true
                    : this.showToDay = false;
            };

            //Change Date TODAY for 1 day fwd/back in DISPLAY DATE TABLE by each click "<< / >> DAY"
            GunttDateConstructor.prototype.dateChange = function (shift) {
                var dateShift = this.toDay.getDate();
                dateShift += shift;
                this.toDay.setDate(dateShift);
                //check 'toDay BTN' display status (SHOW/HIDE)
                this._goToDayDisplay();
            };

            //'Go ToDAY! button functional'
            GunttDateConstructor.prototype.goToDay = function () {
                this.toDay = new Date();
                this.showToDay = false;//Hide 'toDay BTN'
            };

            //GO TO CHOSEN DATE
            GunttDateConstructor.prototype.goToDateTrigger = function () {
                var arrayGoToDate = this.goToDateChoice.split(".");
                arrayGoToDate[1] = +arrayGoToDate[1] - 1;// because months in Date() are 0-11
                this.toDay.setFullYear(+arrayGoToDate[2], +arrayGoToDate[1], +arrayGoToDate[0]);
                //close sub-menu
                this.goToDateShow = false;
                //check 'toDay BTN' display status (SHOW/HIDE)
                this._goToDayDisplay();
            };
            /*GUNTT DATE CONSTRUCTOR **END** */

            //init GunttDate Obj.
            $scope.GunttDate = new GunttDateConstructor();

            /*DISPLAY DATE TABLE OPERATIONS **END** */
        });
    /*TIME AND DATE APP CONTROLLER **END** */

    return gunttTimeAndDateCtrlModule;
});