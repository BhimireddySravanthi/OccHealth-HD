
// put paths in alphabetical order
angular.module("app")
    .config(
    function ($routeProvider) {
        $routeProvider

        /*.when("/", {
        templateUrl: "/OccHealth/occupational-health-base.html",
        controller: "occHealthBase"
        })*/

            .when("/appointmentcentral", {
                templateUrl: "/OccHealth/appointment-central.html",
                controller: "ohAppointmentCentral"
            })

            .when("/encounterdetails", {
                templateUrl: "/OccHealth/Encounters/encounter-details.html",
                controller: "ohEncounterDetails"
            })

            .when("/add", {
                templateUrl: "/OccHealth/add-wizard.html",
                controller: "ohAddWizard"
            })

            .when("/add/:step", {
                templateUrl: "/OccHealth/add-wizard.html",
                controller: "ohAddWizard"
            })

            .when("/employeemedicalprofile", {
                templateUrl: "/OccHealth/Medical-Profile/employee-medical-profile.html",
                controller: "ohEmpMedicalProfile"
            })

            .when("/employeedetails", {
                templateUrl: "/OccHealth/employee-details.html",
                controller: "ohEmployeeDetails"
            })

            .when("/employeeinformation", {
                templateUrl: "/OccHealth/employee-information.html",
                controller: "ohEmployeeInformationCtrl"
            })

            .when("/ULLDetails", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/urine-lead-details.html",
                controller: "ULLCtrl"
            })

            .when("/ULLResults", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/urine-lead-result.html",
                controller: "ULLCtrl"
            })

             .when("/BLLDetails", {
                 templateUrl: "/OccHealth/Encounters/EncounterTypes/blood-lead-details.html",
                 controller: "BLLCtrl"
             })

            .when("/BLLResults", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/blood-lead-result.html",
                controller: "BLLCtrl"
            })

            .when("/BLLInvestigation", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/blood-lead-investigation.html",
                controller: "bloodLeadInvestigationCtrl"
            })

            .when("/AudiometricDetails", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/audiometric-testing-details.html",
                controller: "audiometricTestingCtrl"
            })

            .when("/AudiometricResults", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/audiometric-testing-results.html",
                controller: "audiometricTestingCtrl"
            })

             .when("/Medication", {
                 templateUrl: "/OccHealth/Inventory/inventory-details.html",
                 controller: "medicationCtrl"
             })
             .when("/Vaccine", {
                 templateUrl: "/OccHealth/Inventory/inventory-details.html",
                 controller: "medicationCtrl"
             })
             .when("/Supply", {
                 templateUrl: "/OccHealth/Inventory/inventory-details.html",
                 controller: "medicationCtrl"
             })
             .when("/Equipment", {
                 templateUrl: "/OccHealth/Inventory/Inventory-equipment-details.html",
                 controller: "equipmentCtrl"
             })

            .when("/login", {
                templateUrl: "login.html",
                controller: "loginCtrl"
            })
             .when("/restrictionDetails", {
                 templateUrl: "/OccHealth/Ristrictions/RestrictionDetails.html",
                 controller: "ohRistrictionDetailsCtrl"
             })
            .when("/POPDetails", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/post-offer-physical.html",
                controller: "postOfferPhysicalCtrl"
            })
            .when("/DATDetails", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/drug-alcohol-testing.html",
                controller: "drugAlcoholCtrl"
            })

            .when("/spirometryDetails", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/spirometry.html",
                controller: "spirometryCtrl"
            })
             .when("/AIDetails", {
                 templateUrl: "/OccHealth/Encounters/EncounterTypes/administer-immunization.html",
                 controller: "administerImmunizationCtrl"
             })
            .when("/AMDetails", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/administer-medication-details.html",
                controller: "administerMedicationDetailsCtrl"
            })
             .when("/CommonEncounterTypes", {
                 templateUrl: "/OccHealth/Encounters/EncounterTypes/CommonEncounterTypes.html",
                 controller: "CommonEncounterTypesCtrl"
             })
             .when("/VitalDetails", {
                 templateUrl: "/OccHealth/Encounters/EncounterTypes/vitals.html",
                 controller: "vitalsCtrl"
             })

            .when("/FitTestDetails", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/fit-testing.html",
                controller: "fitTestingCtrl"
            })
              .when("/LeaveDetails", {
                  templateUrl: "/OccHealth/LeaveMgmt/LeaveDetails.html",
                  controller: "LeaveDetailsCtrl"
              })
              .when("/HealthAnalysisDetails", {
                  templateUrl: "/OccHealth/Encounters/EncounterTypes/health-analysis.html",
                  controller: "healthAnalysisCtrl"
              })
               .when("/RestrictionDetails", {
                   templateUrl: "/OccHealth/Ristrictions/RestrictionDetails.html",
                   controller: "RestrictionDetailsCtrl"
               })
                .when("/BIODetails", {
                    templateUrl: "/OccHealth/Encounters/EncounterTypes/biometrics.html",
                    controller: "biometricsCtrl"
                })

                .when("/EquipmentCategory", {
                    templateUrl: "/OccHealth/LookUps/EquipmentCategory.html",
                    controller: "EquipmentCategoryCtrl"
                })

                .when("/EquipmentModel", {
                    templateUrl: "/OccHealth/LookUps/EquipmentModel.html",
                    controller: "EquipmentModelCtrl"
                })

                .when("/EquipmentType", {
                    templateUrl: "/OccHealth/LookUps/EquipmentType.html",
                    controller: "EquipmentTypeCtrl"
                })

                .when("/SupplierDetail", {
                    templateUrl: "/OccHealth/LookUps/SupplierDetail.html",
                    controller: "SupplierDetailsCtrl"
                })
                 .when("/BrandName", {
                     templateUrl: "/OccHealth/LookUps/BrandNameLookup.html",
                     controller: "BrandNameCtrl"
                 })
                   .when("/DrugName", {
                       templateUrl: "/OccHealth/LookUps/DrugNameLookup.html",
                       controller: "DrugDetailCtrl"

                   })
                    .when("/VaccineType", {
                        templateUrl: "/OccHealth/LookUps/ImmunizationTypeLookup.html",
                        controller: "ImmunizationTypeCtrl"

                    })
                     .when("/Manufacturer", {
                         templateUrl: "/OccHealth/LookUps/ManufacturerLookup.html",
                         controller: "ManufacturerDetailCtrl"

                     })

                     .when("/ItemName", {
                         templateUrl: "/OccHealth/LookUps/SupplyItemsLookup.html",
                         controller: "SupplyItemCtrl"


                     })

                        .when("/ResultsHistory", {
                            templateUrl: "/OccHealth/Encounters/EncounterTypes/audiometric-testing-HearingResultsHistory.html",
                            controller: "audiometricResultsHistoryCtrl"
                        })
              .when("/Recordkeeping", {
                  templateUrl: "/OccHealth/Encounters/EncounterTypes/audiometric-testing-Recordkeeping.html",
                  controller: "audiometricSTSCtrl"
              })

            .when("/editemployeeinformation", {
                templateUrl: "/OccHealth/Medical-Profile/editEmployeeInformation.html",
                controller: "ohEditEmployeeInformationCtrl"
            })


            .when("/NextSteps", {
                templateUrl: "/OccHealth/Encounters/EncounterTypes/audiometric-testing-NextSteps.html",
                controller: "audiometricTestingCtrl"
            })
             .when("/MedicalForms", {
                 templateUrl: "/OccHealth/MedicalForms/ERTForm.html",
                 controller: "MedicalFormsCtrl"
             })
              .when("/EmergencyMedicalForms", {
                  templateUrl: "/OccHealth/MedicalForms/EmergencyMedicalTransportForm.html",
                  controller: "EmergencyMedicalFormsCtrl"
              })

              .when("/EMRDetails", {
                  templateUrl: "/OccHealth/Encounters/EncounterTypes/external-medical-records.html",
                  controller: "medicalRecordsCtrl"
              })

             .when("/TitersDetails", {
                 templateUrl: "/OccHealth/Encounters/EncounterTypes/titers.html",
                 controller: "titersCtrl"
             })


              .when("/WSDetails", {
                  templateUrl: "/OccHealth/Encounters/EncounterTypes/work-simulation.html",
                  controller: "workSimulationCtrl"
              })

        // .otherwise({ redirectTo: "/appointmentcentral" })/// <reference path="../../OccHealth/LookUps/BrandNameLookup.html" />

    }
);
