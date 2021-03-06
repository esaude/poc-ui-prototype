'use strict';

Bahmni.Registration.CreatePatientRequestMapper = (function () {

    var DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

    function CreatePatientRequestMapper(currentDate) {
        this.currentDate = currentDate;
    }

    CreatePatientRequestMapper.prototype.mapFromPatient = function (patientAttributeTypes, patient) {
        var dateUtil = Bahmni.Common.Util.DateUtil;
        var constants = Bahmni.Registration.Constants;
        var openMRSPatient = {
            patient: {
                person: {
                    names: [
                        {
                            givenName: patient.givenName,
                            middleName: patient.middleName,
                            familyName: patient.familyName,
                            preferred: false
                        }
                    ],
                    addresses: [_.pick(patient.address, constants.allAddressFileds) ],
                    birthdate: this.getBirthdate(dateUtil.getDateFormatYYYYMMDD(patient.birthdate), patient.age),
                    birthdateEstimated: patient.birthdateEstimated,
                    gender: patient.gender,
                    personDateCreated: patient.registrationDate,
                    attributes: this.getMrsAttributes(patient, patientAttributeTypes),
                    dead: patient.dead,
                    causeOfDeath: (patient.dead === true) ? patient.causeOfDeath.uuid : null,
                    deathDate: (patient.dead === true) ? patient.deathDate : null
                },
                identifiers: setIdentifiers(patient)

            }
        };

        this.setImage(patient, openMRSPatient);
        openMRSPatient.relationships = patient.relationships;
        return  openMRSPatient;
    };

    CreatePatientRequestMapper.prototype.setImage = (patient, openMRSPatient) => {
        if (patient.getImageData()) {
            openMRSPatient.image = patient.getImageData();
        }
    };

    CreatePatientRequestMapper.prototype.getMrsAttributes = (patient, patientAttributeTypes) => patientAttributeTypes.map(result => {
      var attribute = {
        attributeType: {
          uuid: result.uuid
        }
      };
      setAttributeValue(result, attribute, patient[result.name]);
      return attribute;
    });

    var setIdentifiers = patient => {
        var identifiers = [];
        for (var i in patient.identifiers) {
            var patientIdentifier = patient.identifiers[i];

            identifiers.push({
                        identifier: patientIdentifier.identifier,
                        identifierType: {
                           name: patientIdentifier.identifierType.name
                        },
                        preferred: patientIdentifier.preferred,
                        location: patientIdentifier.location,
                        voided: false
                    });
        }
        return identifiers;
    };

  var setAttributeValue = (attributeType, attr, value) => {
    if (attributeType.format === "org.openmrs.Concept") {
      attr.hydratedObject = value;
    }
    else if (attributeType.format === "org.openmrs.util.AttributableDate") {
      attr.value = moment(value).format(DATETIME_FORMAT);
    } else if (value === "" || value === null || _.isUndefined(value)) {
      attr.voided = true;
    } else {
      attr.value = value.toString();
    }
  };

    CreatePatientRequestMapper.prototype.getBirthdate = (birthdate, age) => {
        var patientAge;
        if (birthdate) {
              patientAge = birthdate;
        } else if (age) {
              patientAge = age;
        }
        return patientAge.format('YYYY-MM-DD');
    };

    return CreatePatientRequestMapper;
})();
