'use strict';

angular.module('bahmni.common.domain')
    .service('localeService', ['$http', function ($http) {

        this.allowedLocalesList = () => $http.get(Bahmni.Common.Constants.globalPropertyUrl, {
          method: "GET",
          params: {
            property: 'locale.allowed.list'
          },
          withCredentials: true,
          headers: {
            Accept: 'text/plain'
          }
        });

        this.defaultLocale = () => $http.get(Bahmni.Common.Constants.globalPropertyUrl, {
          method: "GET",
          params: {
            property: 'default_locale'
          },
          withCredentials: true,
          headers: {
            Accept: 'text/plain'
          }
        });
    }]);
