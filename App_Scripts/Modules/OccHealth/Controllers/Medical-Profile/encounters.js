angular.module("app")
    .controller("MedicalProfileEncountersCtrl", ["$scope",
        "$filter",
        "$location",
        "$modal",
        "$log",
        "sharedservices",
        "utilityservices",
        "toastr",
        "$http",
        "globalobject",
    	function ($scope, $filter, $location, $modal, $log, sharedservices, utilityservices, toastr, $http, globalobject) {

    	    // ENCOUNTER LIST
    	    $scope.loadEncounterList = function () {
    	        $scope.DisplayList = [];
    	        $scope.$parent.EncounterList;

    	        $scope.DisplayList = (globalobject.EncounterTypeID == 0) ? $scope.$parent.EncounterList : _.where($scope.$parent.EncounterList, { EncounterTypeID: globalobject.EncounterTypeID });

    	    };

    	    $scope.goToEncounterTypeDetails = function (item) {

    	        globalobject.currentEncounter.ExposureEncounterSummaryID = item.ExposureEncounterSummaryID;
    	        globalobject.currentEncounter.EncounterTypeID = item.EncounterTypeID;
    	        globalobject.currentEncounter.SelectedEncounterTypeID = item.EncounterTypeID;
    	        globalobject.currentEncounter.EncounterDetailID = item.EncounterDetailID;
    	        globalobject.currentEncounter.AppointmentDetailID = item.AppointmentDetailID;
    	        globalobject.currentEncounter.SelectedEncounterTypeID = item.EncounterTypeID;
    	        globalobject.currentEncounter.AppointmentEncounterTypeID = item.AppointmentEncounterTypeID;
    	        globalobject.currentEncounter.screenType = 'EmployeeMedicalProfile';

    	        $location.path("/encounterdetails");
    	        globalobject.encounterTypes.encounterDetails.showDetailsForm = true;
    	        globalobject.encounterTypes.encounterDetails.showInvestigationForm = false;
    	        globalobject.encounterTypes.encounterDetails.showResultsForm = false;
    	        if (globalobject.currentEncounter.EncounterTypeID == 1000) {
    	            $scope.changeSubView(1000);
    	        }
    	        if (globalobject.currentEncounter.EncounterTypeID == 1001) {
    	            $scope.changeSubView(1001);
    	        }
    	    }

    	    $scope.goToEncounterTypeResult = function (item) {

    	        globalobject.currentEncounter.ExposureEncounterSummaryID = item.ExposureEncounterSummaryID;
    	        globalobject.currentEncounter.EncounterTypeID = item.EncounterTypeID;
    	        globalobject.currentEncounter.SelectedEncounterTypeID = item.EncounterTypeID;
    	        globalobject.currentEncounter.EncounterDetailID = item.EncounterDetailID;
    	        globalobject.currentEncounter.AppointmentDetailID = item.AppointmentDetailID;
    	        globalobject.currentEncounter.AppointmentEncounterTypeID = item.AppointmentEncounterTypeID;
    	        globalobject.currentEncounter.screenType = 'EmployeeMedicalProfileResult';
    	        $location.path("/encounterdetails");
    	        globalobject.encounterTypes.encounterDetails.showDetailsForm = false;
    	        globalobject.encounterTypes.encounterDetails.showInvestigationForm = false;
    	        globalobject.encounterTypes.encounterDetails.showResultsForm = true;

    	        if (globalobject.currentEncounter.EncounterTypeID == 1000) {
    	            $scope.changeSubView(2004);
    	            globalobject.encounterTypes.encounterDetails.showRecordkeepingForm = false;
    	            globalobject.encounterTypes.encounterDetails.showNextStepsForm = false;
    	            globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;
    	            globalobject.encounterTypes.encounterDetails.showNextStepsButton = false;
    	            globalobject.encounterTypes.encounterDetails.showRecordkeepingButton = false;
    	            globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryForm = false;


    	        }
    	        if (globalobject.currentEncounter.EncounterTypeID == 1001) {
    	            $scope.changeSubView(2006);


    	            globalobject.encounterTypes.encounterDetails.showRecordkeepingForm = false;
    	            globalobject.encounterTypes.encounterDetails.showNextStepsForm = false;
    	            globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;
    	            globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryForm = false;
    	            globalobject.encounterTypes.encounterDetails.showNextStepsButton = false;
    	            globalobject.encounterTypes.encounterDetails.showRecordkeepingButton = false;


    	        }
    	        if (globalobject.currentEncounter.EncounterTypeID == 1020) {
    	            $scope.changeSubView(2020);
    	            //    	            globalobject.encounterTypes.encounterDetails.showRecordkeepingForm = false;
    	            //    	            globalobject.encounterTypes.encounterDetails.showNextStepsForm = false;
    	            //    	            globalobject.encounterTypes.encounterDetails.showResultsHistoryForm = false;

    	        }
    	    }
    	    $scope.goToEncounterTypeInvestigate = function (item) {

    	        globalobject.currentEncounter.ExposureEncounterSummaryID = item.ExposureEncounterSummaryID;
    	        globalobject.currentEncounter.EncounterTypeID = item.EncounterTypeID;
    	        globalobject.currentEncounter.SelectedEncounterTypeID = item.EncounterTypeID;
    	        globalobject.currentEncounter.EncounterDetailID = item.EncounterDetailID;
    	        globalobject.currentEncounter.AppointmentDetailID = item.AppointmentDetailID;
    	        globalobject.currentEncounter.screenType = 'EmployeeMedicalProfileInvestigation';

    	        $location.path("/encounterdetails");

    	        globalobject.encounterTypes.encounterDetails.showDetailsForm = false;
    	        globalobject.encounterTypes.encounterDetails.showInvestigationForm = true;
    	        globalobject.encounterTypes.encounterDetails.showResultsForm = false;
    	        if (globalobject.currentEncounter.EncounterTypeID == 1000) {
    	            $scope.changeSubView(2005);
    	        }
    	    }

    	    $scope.currentListIndex = null;
    	    $scope.updateListIndex = function (index) {
    	        $scope.currentListIndex = index;
    	    };

    	} ]
	);
