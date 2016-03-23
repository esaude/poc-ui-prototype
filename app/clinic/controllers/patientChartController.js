'use strict';

angular.module('clinic')
        .controller('PatientChartController', ["$scope", "$filter", "$location", "$stateParams", 
                        "encounterService", "observationsService", "patientService", "openmrsPatientMapper",
                    function ($scope, $filter, $location, $stateParams, encounterService, 
                    observationsService, patientService, patientMapper) {
        var patientUuid;

        (function () {
            patientUuid = $stateParams.patientUuid;
            
            patientService.get(patientUuid).success(function (data) {
                $scope.patient = patientMapper.map(data);
            });

        })();
        
        $scope.initCd4Chart = function () {
            var labEncounterUuid = "e2790f68-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            var concepts = ["e1e68f26-1d5f-11e0-b929-000c29ad1d07", "e1d48fba-1d5f-11e0-b929-000c29ad1d07"];
            var series = ["CD4 Count", "CD4%"];
            var name = "cd4";
            
            encounterService.getEncountersForEncounterType(patientUuid, labEncounterUuid)
                    .success(function (data) {
                filterObs(data, concepts, series, name);
            });
        };
        
        $scope.initImc = function () {
            var concepts = ["e1e2e826-1d5f-11e0-b929-000c29ad1d07", 
                "e1e2e934-1d5f-11e0-b929-000c29ad1d07",
                "e1da52ba-1d5f-11e0-b929-000c29ad1d07"
            ];
            var series = ["Weight (cm)", "Height (kg)", "BMI"];
            var name = "bmi";
            
            var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            
            encounterService.getEncountersForEncounterType(patientUuid, 
            ($scope.patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid)
                    .success(function (data) {
                filterObs(data, concepts, series, name);
            });
        };
        
        var filterObs = function (data, concepts, series, name) {
            var nonRetired = encounterService.filterRetiredEncoounters(data.results);
            var sliced = _.slice(nonRetired, 0, 9);
            _.forEach(sliced, function (encounter) {
                encounter.obs = observationsService.filterByList(encounter.obs, concepts);
            });
            var filtered = _.filter(sliced, function (encounter) {
                return !_.isEmpty(encounter.obs);
            });
            createChartData(filtered, concepts, series, name);
        };
        
        var createChartData = function (encounters, concepts, series, chartName) {
            $scope[chartName + "labels"] = [];
            $scope[chartName + "series"] = series;
            var data  = [];
            
            _.forEach(encounters, function (encounter) {
                $scope[chartName + "labels"].push($filter('date')(encounter.encounterDatetime, "MMM d, y"));
                _.forEach(concepts, function (concept, key) {
                    var found = _.find(encounter.obs, function (obs) {
                        return obs.concept.uuid === concept;
                    });
                    if (typeof data[key] === 'undefined') data[key] = [];
                    data[key].push((found) ? found.value : null);
                });
            });
            $scope[chartName + "data"] = data;
        };
        
        $scope.isObject = function (value) {
            return _.isObject(value);
        };
    }]);