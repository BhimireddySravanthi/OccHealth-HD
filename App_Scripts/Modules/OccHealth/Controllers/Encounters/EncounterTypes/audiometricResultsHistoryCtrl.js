angular.module("app")

    .controller("audiometricResultsHistoryCtrl", ["$scope", "$log", "$location", "sharedservices", "$modal", "toastr", "$filter", "globalobject", "$window", "utilityservices",

         function ($scope, $log, $location, sharedservices, $modal, toastr, $filter, globalobject, translations, utilityservices) {

             $scope.changeSubView = sharedservices.changeSubView
             $scope.globalobject = globalobject;
             $scope.navBarOptions = {
                 detailsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AudiometricDetails" : 1020,
                 resultsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/AudiometricResults" : 2020,
                 hearingResultsHistoryFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/ResultsHistory" : 2024,
                 recordkeepingFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/Recordkeeping" : 2022,
                 nextStepsFormId: (globalobject.currentEncounter.FromSOAListScreen == true) ? "/NextSteps" : 2023,
                 investigationFormId: undefined
             };
             $scope.showSubNavbars = true;

             if (globalobject.currentEncounter.PersonnelTypeID == 1003) {
                 globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryForm = false;
                 globalobject.encounterTypes.encounterDetails.showRecordkeepingForm = false;
             }
             else {
                 globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryForm = true;

             }

             $scope.ResultsleftHistSettings = {
                 currentPage: 1,
                 pageSize: 5
             };
             $scope.ResultsRightHistSettings = {
                 currentPage: 1,
                 pageSize: 5
             };

             $scope.audioResultHist = {};
             $scope.AudiometricTestResultID = 0;
             $scope.updateRevisedBaseline = function (item) {
                 $scope.AudiometricTestResultID = item.ID;
                 $scope.BodyPartsSlideID = item.BodyPartSideID;
                 $scope.AppointmentDate = item.ExamDate;
                 var modalInstance = $modal.open({
                     animation: $scope.animationsEnabled,
                     templateUrl: '/OccHealth/modals/showRevisedBaseline-modal.html',
                     controller: 'showRevisedBaselineCtrl',
                     size: 'sm',
                     scope: $scope
                 });

             }
             var filteredArr = [];
             $scope.getfilteredlefteyeResultHistory = function () {
                 var start, end, cp, pgs;
                 cp = $scope.ResultsleftHistSettings.currentPage;
                 pgs = $scope.ResultsleftHistSettings.pageSize;
                 start = ((cp - 1) * pgs);
                 end = ((cp - 1) * pgs) + pgs

                 filteredArr = $filter('filter')($scope.audioResultHist, { BodyPartSideID: '1000' });
                 return filteredArr != null ? filteredArr.slice(start, end) : [];
             };
             $scope.getfilteredrighteyeResultHistory = function () {
                 var start, end, cp, pgs;
                 cp = $scope.ResultsRightHistSettings.currentPage;
                 pgs = $scope.ResultsRightHistSettings.pageSize;
                 start = ((cp - 1) * pgs);
                 end = ((cp - 1) * pgs) + pgs

                 filteredArr = $filter('filter')($scope.audioResultHist, { BodyPartSideID: '1001' });
                 return filteredArr != null ? filteredArr.slice(start, end) : [];
             };

             $scope.RevisedBaselineComments = function (comments) {
                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/AudiometricService.asmx/saveRevisedBaselinecomments",
                     data: { AudiometricTestResultID: $scope.AudiometricTestResultID, comments: comments, EmployeePK: globalobject.currentEncounter.EmployeePK, AppointmentDate: $scope.AppointmentDate, BodyPartsSlideID: $scope.BodyPartsSlideID }
                 };

                 sharedservices.xhrService(configs)
                  .success(gethistDataSuccess)
                  .error(getDetailDataError);


             }

             function gethistDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {

                     $scope.getResultsHistoryAudiometric();

                 }
             };

             globalobject.encounterTypes.encounterDetails.showHearingResultsHistoryForm = true;
             $scope.getResultsHistoryAudiometric = function () {
                 var configs = {};
                 configs = {
                     url: "/WebServices/OccupationalHealth/EncounterTypes/AudiometricService.asmx/GetAudiometricResultsHistory",
                     data: { EmployeePK: globalobject.currentEncounter.EmployeePK, AppointmentDate: globalobject.currentEncounter.EncounterDetailDate }
                 };

                 sharedservices.xhrService(configs)
                  .success(getDetailDataSuccess)
                  .error(getDetailDataError);
             };

             function getDetailDataSuccess(data, status, headers, config) {

                 if (data.d.IsOK) {
                     sharedservices.parseDates(data.d.Object);
                     // $scope.audioResultHist = data.d.Object;
                     $scope.audioResultHist = data.d.Object == null ? [] : data.d.Object;

                 }
             };
             function getDetailDataError(data, status, headers, config) {
             };


         } ]);