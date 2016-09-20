var Bahmni = Bahmni || {};
Bahmni.Common = Bahmni.Common || {};

(function(){
    var RESTWS = "/openmrs/ws/rest";
    var RESTWS_V1 = "/openmrs/ws/rest/v1";
    var BAHMNI_CORE = RESTWS_V1 + "/bahmnicore";
    var EMRAPI = RESTWS + "/emrapi";
    var BACTERIOLOGY = RESTWS_V1;

    var serverErrorMessages = [
        {
            serverMessage: "Cannot have more than one active order for the same orderable and care setting at same time",
            clientMessage: "One or more drugs you are trying to order are already active. Please change the start date of the conflicting drug or remove them from the new prescription."
        }
    ];

    var representation = "custom:(uuid,name,names,conceptClass," +
        "setMembers:(uuid,name,names,conceptClass," +
        "setMembers:(uuid,name,names,conceptClass," +
        "setMembers:(uuid,name,names,conceptClass))))";

    var messageTypeRepresentation = {
        "feb94661-9f27-4a63-972f-39ebb63c7022": "success",
        "a1822bef-5bef-44b5-89d7-9dcf261731c1": "info",
        "5456047f-8e81-4f68-b061-5ee10a2f0a11": "warning",
        "9b9c21dc-e1fb-4cd9-a947-186e921fa78c": "error"
    };
    
    var drugPrescriptionConvSet = {
        arvDrugs: {uuid: "e1d83e4e-1d5f-11e0-b929-000c29ad1d07"},
        otherDrugs: {uuid: "e1de3092-1d5f-11e0-b929-000c29ad1d07"},
        artPlan: {uuid: "e1d9ee10-1d5f-11e0-b929-000c29ad1d07"},
        interruptedReason: {uuid: "e1d9ead2-1d5f-11e0-b929-000c29ad1d07"},
        changeReason: {uuid: "e1de8862-1d5f-11e0-b929-000c29ad1d07"},
        dosageAmount: {uuid: "e1de8966-1d5f-11e0-b929-000c29ad1d07"},
        dosingUnits: {uuid: "9d66a447-10e8-11e5-9009-0242ac110012"},
        dosgeFrequency: {uuid: "5368f4d6-10e7-11e5-9009-0242ac110012"},
        drugRoute: {uuid: "9d6a9238-10e8-11e5-9009-0242ac110012"},
        duration: {uuid: "e1de27a0-1d5f-11e0-b929-000c29ad1d07"},
        durationUnits: {uuid: "9d6f0bea-10e8-11e5-9009-0242ac110012"},
        dosingInstructions: {uuid: "9d73c2a7-10e8-11e5-9009-0242ac110012"}
    };
    
    var drugTypes = {
        art: "ART",
        nonArt: "NON_ART"
        
    };

    Bahmni.Common.Constants = {
        dateFormat: "dd/mm/yyyy",
        dateDisplayFormat: "DD-MMM-YYYY",
        timeDisplayFormat: "hh:mm",
        emrapiDiagnosisUrl : EMRAPI + "/diagnosis",
        bahmniDiagnosisUrl :BAHMNI_CORE + "/diagnosis/search",
        bahmniDeleteDiagnosisUrl :BAHMNI_CORE + "/diagnosis/delete",
        diseaseTemplateUrl :BAHMNI_CORE + "/diseaseTemplates",
        AllDiseaseTemplateUrl : BAHMNI_CORE + "/diseaseTemplate",
        emrapiConceptUrl :EMRAPI + "/concept",
        encounterConfigurationUrl: BAHMNI_CORE + "/config/bahmniencounter",
        patientConfigurationUrl:BAHMNI_CORE + "/config/patient",
        drugOrderConfigurationUrl:BAHMNI_CORE + "/config/drugOrders",
        emrEncounterUrl: EMRAPI + "/encounter",
        encounterUrl: RESTWS_V1 + "/encounter",
        locationUrl: RESTWS_V1 + "/location",
        bahmniOrderUrl: BAHMNI_CORE + "/orders",
        bahmniDrugOrderUrl: BAHMNI_CORE + "/drugOrders",
        bahmniDispositionByVisitUrl: BAHMNI_CORE + "/disposition/visit",
        bahmniDispositionByPatientUrl: BAHMNI_CORE + "/disposition/patient",
        bahmniSearchUrl:BAHMNI_CORE + "/search",
        bahmniLabOrderResultsUrl: BAHMNI_CORE + "/labOrderResults",
        bahmniEncounterUrl: BAHMNI_CORE + "/bahmniencounter",
        conceptUrl: RESTWS_V1 + "/concept",
        conceptSearchByFullNameUrl: RESTWS_V1 + "/concept?s=byFullySpecifiedName",
        visitUrl: RESTWS_V1 + "/visit",
        endVisitUrl: BAHMNI_CORE + "/visit/endVisit",
        visitTypeUrl: RESTWS_V1 + "/visittype",
        patientImageUrl: "/patient_images/",
        labResultUploadedFileNameUrl: "/uploaded_results/",
        visitSummaryUrl: BAHMNI_CORE + "/visit/summary",
        encounterModifierUrl: BAHMNI_CORE + "/bahmniencountermodifier",
        openmrsUrl: "/openmrs",
        idgenConfigurationURL: RESTWS_V1 + "/idgen/identifiersources",
        bahmniRESTBaseURL: BAHMNI_CORE + "",
        observationsUrl: BAHMNI_CORE + "/observations",
        obsRelationshipUrl: BAHMNI_CORE + "/obsrelationships",
        encounterImportUrl: BAHMNI_CORE + "/admin/upload/encounter",
        programImportUrl: BAHMNI_CORE + "/admin/upload/program",
        conceptImportUrl: BAHMNI_CORE + "/admin/upload/concept",
        conceptSetImportUrl: BAHMNI_CORE + "/admin/upload/conceptset",
        drugImportUrl: BAHMNI_CORE + "/admin/upload/drug",
        labResultsImportUrl: BAHMNI_CORE + "/admin/upload/labResults",
        referenceTermsImportUrl: BAHMNI_CORE + "/admin/upload/referenceterms",
        relationshipImportUrl: BAHMNI_CORE + "/admin/upload/relationship",
        conceptSetExportUrl: BAHMNI_CORE + "/admin/export/conceptset?conceptName=:conceptName",
        patientImportUrl: BAHMNI_CORE + "/admin/upload/patient",
        adminImportStatusUrl: BAHMNI_CORE + "/admin/upload/status",
        dhisAllTasksUrl: RESTWS_V1 + "/dhis/tasks",
        programUrl: RESTWS_V1 + "/program",
        programEnrollPatientUrl: RESTWS_V1 + "/programenrollment",
        programEnrollmentDefaultInformation: "default",
        programEnrollmentFullInformation: "full",
        dhisTaskUrl: RESTWS_V1 + "/dhis/task/",
        dhisFireQueriesUrl: RESTWS_V1 + "/dhis/fireQueries",
        relationshipTypesUrl: RESTWS_V1 + "/relationshiptype",
        personAttributeTypeUrl: RESTWS_V1 + "/personattributetype",
        diseaseSummaryPivotUrl: BAHMNI_CORE + "/diseaseSummaryData",
        allTestsAndPanelsConceptName : 'All_Tests_and_Panels',
        dosageFrequencyConceptName : 'Dosage Frequency',
        dosageInstructionConceptName : 'Dosage Instructions',
        consultationNoteConceptName : 'Consultation Note',
        diagnosisConceptSet : 'Diagnosis Concept Set',
        radiologyOrderType : 'Radiology Order',
        radiologyResultConceptName :"Radiology Result",
        investigationEncounterType:"INVESTIGATION",
        validationNotesEncounterType: "VALIDATION NOTES",
        labOrderNotesConcept: "Lab Order Notes",
        impressionConcept: "Impression",
        qualifiedByRelationshipType: "qualified-by",
        dispositionConcept : "Disposition",
        dispositionGroupConcept : "Disposition Set",
        dispositionNoteConcept : "Disposition Note",
        ruledOutDiagnosisConceptName : 'Ruled Out Diagnosis',
        emrapiConceptMappingSource :"org.openmrs.module.emrapi",
        includeAllObservations: false,
        openmrsObsUrl :RESTWS_V1 + "/obs",
        openmrsObsRepresentation :"custom:(uuid,obsDatetime,value:(uuid,name:(uuid,name)))" ,
        admissionCode: 'ADMIT',
        dischargeCode: 'DISCHARGE',
        transferCode: 'TRANSFER',
        undoDischargeCode: 'UNDO_DISCHARGE',
        vitalsConceptName: "Vitals",
        heightConceptName: "HEIGHT",
        weightConceptName: "WEIGHT",
        bmiConceptName: "BMI", // TODO : shruthi : revove this when this logic moved to server side
        bmiStatusConceptName: "BMI STATUS", // TODO : shruthi : revove this when this logic moved to server side
        abnormalObservationConceptName: "IS_ABNORMAL",
        documentsPath: '/document_images',
        documentsConceptName: 'Document',
        miscConceptClassName: 'Misc',
        abnormalConceptClassName: 'Abnormal',
        durationConceptClassName: 'Duration',
        conceptDetailsClassName: 'Concept Details',
        admissionEncounterTypeName: 'ADMISSION',
        dischargeEncounterTypeName: 'DISCHARGE',
        imageClassName: 'Image',
        locationCookieName: 'bahmni.user.location',
        retrospectiveEntryEncounterDateCookieName: 'bahmni.clinical.retrospectiveEncounterDate',
        rootScopeRetrospectiveEntry: 'retrospectiveEntry.encounterDate',
        patientFileConceptName: 'Patient file',
        serverErrorMessages: serverErrorMessages,
        currentUser:'user',
        retrospectivePrivilege:'app:clinical:retrospective',
        nutritionalConceptName:'Nutritional Values',
        messageForNoObservation: "No observations captured for this visit.",
        messageForNoDisposition: "NO_DISPOSTIONS_AVAILABLE_MESSAGE_KEY",
        messageForNoFulfillment: "No observations captured for this order.",
        reportsUrl: "/bahmnireports/report",
        uploadReportTemplateUrl: "/bahmnireports/upload",
        ruledOutdiagnosisStatus : "Ruled Out Diagnosis",
        registartionConsultationPrivilege:'app:common:registration_consultation_link',
        manageIdentifierSequencePrivilege:"Manage Identifier Sequence",
        closeVisitPrivilege:'app:common:closeVisit',
        deleteDiagnosisPrivilege:'app:clinical:deleteDiagnosis',
        viewPatientsPrivilege: 'View Patients',
        editPatientsPrivilege: 'Edit Patients',
        addVisitsPrivilege: 'Add Visits',
        deleteVisitsPrivilege: 'Delete Visits',
        grantProviderAccess: "app:clinical:grantProviderAccess",
        grantProviderAccessDataCookieName: "app:clinical:grantProviderAccessData",
        globalPropertyUrl: BAHMNI_CORE + "/sql/globalproperty",
        fulfillmentConfiguration: "fulfillment",
        fulfillmentFormSuffix:" Fulfillment Form",
        noNavigationLinksMessage: "No navigation links available.",
        conceptSetRepresentationForOrderFulfillmentConfig: representation,
        entityMappingUrl: RESTWS_V1 + "/entitymapping",
        encounterTypeUrl: RESTWS_V1+"/encountertype",
        cohortUrl: RESTWS_V1+"/reportingrest/cohort",
        defaultExtensionName: "default",
        bahmniBacteriologyResultsUrl: BACTERIOLOGY + "/specimen",
        formDataUrl: RESTWS_V1 + "/obs",
        adultFollowupEncounterUuid: "e278f956-1d5f-11e0-b929-000c29ad1d07",
        childFollowupEncounterUuid: "e278fce4-1d5f-11e0-b929-000c29ad1d07",
        pocCurrentStoryEncounterUuid: "782da6c5-3931-4ab5-8e10-2c647ee1cf9d",
        typeOfMessageConceptUuid: "fbe61748-a080-4eef-bfff-c47954794f10",
        observationStoryConceptuuid: "694d4767-d8c4-40e2-a68b-a8f3bac8524a",
        successConceptuuid: "feb94661-9f27-4a63-972f-39ebb63c7022",
        informationConceptuuid: "a1822bef-5bef-44b5-89d7-9dcf261731c1",
        warningConceptUuid: "5456047f-8e81-4f68-b061-5ee10a2f0a11",
        errorConceptUuid: "9b9c21dc-e1fb-4cd9-a947-186e921fa78c",
        messageTypeRepresentation: messageTypeRepresentation,
        cohortMarkedForConsultationUuid: "eca2b927-4ee3-47e3-9c19-a72805891d8d",
        cohortMarkedForConsultationAndCheckedInUuid: "d00c4b2e-7c13-4d05-9f87-8a9c4b07ad52",
        nextConsultationDateUuid: "e1dae630-1d5f-11e0-b929-000c29ad1d07",
        providerUrl: RESTWS_V1 + "/provider",
        drugPrescriptionConvSet: drugPrescriptionConvSet,
        prescriptionConvSetConcept: "e1de8b5a-1d5f-11e0-b929-000c29ad1d07",
        followupAdultFormUuid: "e28aa7aa-1d5f-11e0-b929-000c29ad1d07",
        followupChildFormUuid: "e28ac028-1d5f-11e0-b929-000c29ad1d07",
        artInterruptedPlanUuid: "e1d9f36a-1d5f-11e0-b929-000c29ad1d07"

    };
})();
