(() => {
  'use strict';

  angular
    .module('vitals')
    .run(runLab);

  runLab.$inject = ['$transitions'];

  /* @ngInject */
  function runLab ($transitions) {
    $transitions.onBefore({to: 'dashboard'}, transition => transition.router.stateService.target('dashboard.clinicalservices', {patientUuid: transition.params().patientUuid}));
  }

})();
