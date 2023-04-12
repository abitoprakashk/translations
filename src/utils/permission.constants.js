export const PERMISSION_CONSTANTS = {
  // pendingRequests
  instituteClassController_approveRequest_update:
    'InstituteClassController:approve_request:update',
  instituteClassController_approveDeleteRequest_update:
    'InstituteClassController:approve_delete_request:update',
  instituteClassController_rejectPendingDeleteRequest_update:
    'InstituteClassController:reject_pending_delete_request:update',
  instituteClassController_rejectPendingRequest_update:
    'InstituteClassController:reject_pending_request:update',
  //setup
  //school setup
  instituteController_editStructure_update:
    'InstituteController:edit_structure:update',
  instituteClass_addSection_create:
    'InstituteClassController:add_section:create',
  //EDIT_CLASS_NAME: 'edit_name',
  instituteClass_deleteSection_delete:
    'InstituteClassController:delete_section:delete',
  //PROGRESS_BAR_ACTION: 'action',
  instituteClassController_assignClassTeacher_update:
    'InstituteClassController:assign_class_teacher:update',
  instituteClassController_removeClassTeacher_update:
    'InstituteClassController:remove_class_teacher:update',
  instituteClassController_assignSubjectTeacher_update:
    'InstituteClassController:assign_subject_teacher:update',
  instituteClassController_removeSubjectTeacher_update:
    'InstituteClassController:remove_subject_teacher:update',
  instituteClassController_removeCoTeacher_update:
    'InstituteClassController:remove_coteacher:update',
  instituteClassController_updateEntityName_update:
    'InstituteClassController:update_entity_name:update',
  instituteClassController_updateEntityMeta_update:
    'InstituteClassController:update_entity_meta:update',
  instituteClassController_createSubject_create:
    'InstituteClassController:create_subject:create',
  instituteClassController_deleteSubject_delete:
    'InstituteClassController:delete_subject:delete',
  instituteClassController_assignSectionStudent_update:
    'InstituteClassController:assign_section_student:update',
  instituteClassController_createUncategorizedClassroom_create:
    'InstituteClassController:create_uncategorized_classroom:create',
  instituteController_uncategorizedUsers_update:
    'InstituteController:uncategorized_users:update',
  instituteClassController_updateOptionalClassStudents_update:
    'InstituteClassController:update_optional_class_students:update',
  //MANAGE_ATTENDANCE: 'manage_attendance',

  //school directory
  instituteController_uploadLogo_update:
    'InstituteController:upload_logo:update',
  //teacher student
  ipsController_addUsers_create: 'IpsController:add_users:create',
  ipsController_updateUsers_update: 'IpsController:update_users:update',
  ipsController_deleteUser_delete: 'IpsController:delete_user:delete',
  instituteUserController_deleteUser_delete:
    'InstituteUserController:delete_user:delete',
  instituteClassController_moveStudentSection_update:
    'InstituteClassController:move_student_section:update',
  instituteClassController_assignStudents_update:
    'InstituteClassController:assign_students:update',
  instituteController_updateSession_update:
    'InstituteController:update_session:update',
  instituteController_createSession_create:
    'InstituteController:create_session:create',
  instituteController_updateRoute_update:
    'InstituteController:update_route:update',
  instituteController_uploadMemberImg_update:
    'InstituteController:upload_member_img:update',
  //admin
  instituteAdminController_createRoute_create:
    'InstituteAdminController:create_route:create',
  instituteAdminController_updateRoute_update:
    'InstituteAdminController:update_route:update',
  instituteAdminController_deleteRoute_delete:
    'InstituteAdminController:delete_route:delete',

  //communication
  communicationController_announcementRemove_delete:
    'CommunicationController:announcement_remove:delete',
  communicationController_announcement_create:
    'CommunicationController:announcement:create',
  announcementsController_sendReminder_create:
    'AnnouncementsController:send_reminder:create',
  announcementsController_edit_update: 'AnnouncementsController:edit:update',
  announcementsController_disablePost_update:
    'AnnouncementsController:disable_post:update',

  //fee_management
  feeModuleController_feeStructure_create:
    'FeeModuleController:fee_structure:create',
  feeModuleController_deleteFeeStructure_delete:
    'FeeModuleController:delete_fee_structure:delete',
  feeModuleController_createFeeFineRules_create:
    'FeeModuleController:create_fee_fine_rules:create',
  feeModuleController_deleteFineRule_delete:
    'FeeModuleController:delete_fine_rule:delete',
  feeModuleController_addFeeDiscount_create:
    'FeeModuleController:add_fee_discount:create',
  feeModuleController_deleteDiscount_delete:
    'FeeModuleController:delete_discount:delete',
  feeModuleController_sendFeeReminder_create:
    'FeeModuleController:send_fee_reminder:create',
  feeModuleController_feeStudentPayment_create:
    'FeeModuleController:fee_student_payment:create',
  feeModuleController_reportDownloadRequest_read:
    'FeeModuleController:report_download_request:read',
  feeModuleController_updateFeeSettings_update:
    'FeeModuleController:update_fee_settings:update',
  feeModuleController_getDemandLetterDownload_read:
    'FeeModuleController:get_demand_letter_download:read',
  feeModuleController_updateFeeDiscount_update:
    'FeeModuleController:update_fee_discount:update',
  feeModuleController_getFeeDiscounts_read:
    'FeeModuleController:get_fee_discounts:read',
  feeModuleController_revokeTransactions_delete:
    'FeeModuleController:revoke_transactions:delete',
  feeModuleController_getReceiptDownload_read:
    'FeeModuleController:get_receipt_download:read',
  feeModuleController_refreshStudentTransactions_update:
    'FeeModuleController:refresh_student_transactions:update',
  feeModuleController_updateCategoryAmount_update:
    'FeeModuleController:update_category_amount:update',
  feeModuleController_pgCreate_create: 'FeeModuleController:pg_create:create',
  feeModuleController_getStudentFeeDetails_read:
    'FeeModuleController:get_student_fee_details:read',
  feeModuleController_collectBulkPayment_create:
    'FeeModuleController:collect_bulk_payment:create',
  feeModuleController_importPreviousSessionDue_create:
    'FeeModuleController:import_previous_session_due:create',

  // Multi-Bank Account
  companyController_createRoute_create: 'CompanyController:create_route:create',
  companyController_updateRoute_update: 'CompanyController:update_route:update',
  accountController_createRoute_create: 'AccountController:create_route:create',
  accountController_updateRoute_update: 'AccountController:update_route:update',
  accountController_change_update: 'AccountController:change:update',
  accountMappingController_upsert_update:
    'AccountMappingController:upsert:update',
  accountController_passbook_read: 'AccountController:passbook:read',

  //contingent
  contingentTransactionsController_getTransactionTimeline_read:
    'ContingentTransactionsController:get_transaction_timeline:read',
  contingentTransactionsController_updateTransactionStatus_update:
    'ContingentTransactionsController:update_transaction_status:update',

  //attendance
  staffAttendanceController_getReport_read:
    'StaffAttendanceController:get_report:read',
  staffAttendanceController_markAttendance_create:
    'StaffAttendanceController:markattendance:create',
  staffAttendanceController_edit_attendance_update:
    'StaffAttendanceController:edit_attendance:update',
  staffAttendanceController_get_monthly_summary_read:
    'StaffAttendanceController:get_monthly_summary:read',
  staffAttendanceController_get_download_qr_read:
    'StaffAttendanceController:get_download_qr:read',
  staffAttendanceController_get_read: 'StaffAttendanceController:get:read',

  //leave
  adminLeaveController_getUserList_read:
    'AdminLeaveController:get_user_list:read',
  adminLeaveController_createRoute_create:
    'AdminLeaveController:create_route:create',
  adminLeaveController_setSessionBalance_update:
    'AdminLeaveController:set_session_balance:update',
  adminLeaveController_updateStatus_update:
    'AdminLeaveController:update_status:update',
  adminLeaveController_getReport_read: 'AdminLeaveController:get_report:read',
  adminLeaveController_updateRoute_update:
    'AdminLeaveController:update_route:update',
  leaveController_updateRoute_update: 'LeaveController:update_route:update',
  leaveController_cancel_update: 'LeaveController:cancel:update',

  //administration
  certificateController_createRoute_create:
    'CertificateController:create_route:create',
  idCardController_generate_read: 'IdCardController:generate:read',
  idCardController_upsertTemplate_create:
    'IdCardController:upsert_template:create',
  documentTemplateController_createRoute_create:
    'CertificateTemplateController:create_route:create',
  documentTemplateController_updateRoute_update:
    'CertificateTemplateController:update_route:update',
  documentController_generateSingle_create:
    'CertificateDocumentController:generate_single:create',
  documentController_generateBulk_create:
    'CertificateDocumentController:generate_bulk:create',
  //website //admissions
  websiteBuilderController_getTokenUrl_create:
    'WebsiteBuilderController:get_token_url:create',
  admissionController_getQueryTokenUrl_create:
    'AdmissionController:get_query_token_url:create',
  //Library
  bookController_createRoute_create: 'BookController:create_route:create',
  bookController_associate_update: 'BookController:associate:update',
  bookController_deleteRoute_delete: 'BookController:delete_route:delete',
  bookController_updateRoute_update: 'BookController:update_route:update',

  //hostel
  hostelController_createRoute_create: 'HostelController:create_route:create',
  hostelController_deleteRoute_delete: 'HostelController:delete_route:delete',
  hostelController_associate_update: 'HostelController:associate:update',
  hostelRoomController_createRoute_create:
    'HostelRoomController:create_route:create',
  hostelRoomController_deleteRoute_delete:
    'HostelRoomController:delete_route:delete',
  hostelRoomController_associate_update:
    'HostelRoomController:associate:update',

  //inventory
  inventoryItemController_allocateManual_update:
    'InventoryItemController:allocate_manual:update',
  inventoryItemController_allocateAutomatic_update:
    'InventoryItemController:allocate_automatic:update',
  inventoryItemCategoryController_getList_read:
    'InventoryItemCategoryController:get_list:read',
  inventoryItemUnitController_updateCondition_update:
    'InventoryItemUnitController:update_condition:update',
  inventoryItemCategoryController_edit_update:
    'InventoryItemCategoryController:edit:update',
  inventoryPurchaseOrderController_add_create:
    'InventoryPurchaseOrderController:add:create',
  inventoryPurchaseOrderController_edit_update:
    'InventoryPurchaseOrderController:edit:update',
  inventoryPurchaseOrderController_deleteRoute_delete:
    'InventoryPurchaseOrderController:delete_route:delete',
  inventoryItemStoreController_add_create:
    'InventoryItemStoreController:add:create',
  inventoryItemController_add_create: 'InventoryItemController:add:create',
  inventoryItemController_deleteRoute_delete:
    'InventoryItemController:delete_route:delete',
  inventoryItemCategoryController_deleteRoute_delete:
    'InventoryItemCategoryController:delete_route:delete',
  inventoryItemStoreController_deleteRoute_delete:
    'InventoryItemStoreController:delete_route:delete',
  inventoryItemStoreController_edit_update:
    'InventoryItemStoreController:edit:update',

  //attendance summary
  manualAttendanceController_getWebSectionAttendanceSummary_read:
    'ManualAttendanceController:get_web_section_attendance_summary:read',
  manualAttendanceController_mark_attendance_update:
    'ManualAttendanceController:mark_attendance:update',

  // setting > role management
  InstituteRoleController_assignUsers_update:
    'InstituteRoleController:assign_users:update',
  InstituteRoleController_importRole_read:
    'InstituteRoleController:import_role:read',
  InstituteRoleController_createRoute_create:
    'InstituteRoleController:create_route:create',
  InstituteRoleController_updateRoute_update:
    'InstituteRoleController:update_route:update',
  InstituteRoleController_deleteRoute_delete:
    'InstituteRoleController:delete_route:delete',

  // permissions ID to check before API call
  InstituteRoleController_getList_read: 'InstituteRoleController:get_list:read',
  InstituteAdminController_get_read: 'InstituteAdminController:get:read',
  IpsController_directoryList_read: 'IpsController:directory_list:read',

  //acads
  academicPlannerController_upsert_create:
    'AcademicPlannerController:upsert:create',
  academicPlannerController_deleteRoute_delete:
    'AcademicPlannerController:delete_route:delete',
  examController_updateSubjectsDetails_update:
    'ExamController:update_subjects_details:update',
  examStructureController_upsertClassStructure_update:
    'ExamStructureController:upsert_class_structure:update',
  examStructureController_copy_update: 'ExamStructureController:copy:update',

  //reportCard
  reportCardWebController_upsertTemplate_update:
    'ReportCardWebController:upsert_template:update',
  reportCardWebController_generateReportCard_create:
    'ReportCardWebController:generate_report_card:create',
  reportCardWebController_copy_update: 'ReportCardWebController:copy:update',
  reportCardWebController_getTemplate_read:
    'ReportCardWebController:get_template:read',
  reportCardWebController_template_update:
    'ReportCardWebController:template:update',

  reportCardEvaluationController_sectionUpdateTotalMarks_update:
    'ReportCardEvaluationController:section_update_total_marks:update',
  reportCardEvaluationController_sectionUpdateAttendanceTotalDays_update:
    'ReportCardEvaluationController:section_update_attendance_total_days:update',
  reportCardEvaluationController_sectionScholasticUpsertDetails_update:
    'ReportCardEvaluationController:section_scholastic_upsert_details:update',
  reportCardEvaluationController_sectionOthersUpsertDetails_update:
    'ReportCardEvaluationController:section_others_upsert_details:update',
  reportCardEvaluationController_sendScholasticSingleNotification_update:
    'ReportCardEvaluationController:send_scholastic_single_notification:update',
  reportCardEvaluationController_sendOtherSingleNotification_update:
    'ReportCardEvaluationController:send_other_single_notification:update',

  InstituteClassController_getPendingRequest_read:
    'InstituteClassController:get_pending_request:read',
  InstituteClassController_getDeleteRequest_read:
    'InstituteClassController:get_delete_request:read',
  InstituteController_getStatsDaily_read:
    'InstituteController:get_stats_daily:read',
  InstituteController_getTodaySchedule_read:
    'InstituteController:get_today_schedule:read',
  InstituteClassController_getInstituteHierarchy_read:
    'InstituteClassController:get_institute_hierarchy:read',
  InstituteUserController_getStudentDirectory_read:
    'InstituteUserController:get_student_directory:read',
  InstituteUserController_getTeacherDirectory_read:
    'InstituteUserController:get_teacher_directory:read',
  InstituteClassController_getUncategorizedClassroom_read:
    'InstituteClassController:get_uncategorized_classroom:read',
  InstituteController_getStats_read: 'InstituteController:get_stats:read',
  InstituteController_getTeacherStats_read:
    'InstituteController:get_teacher_stats:read',
  FeeModuleController_reportDownloadRequest_read:
    'FeeModuleController:report_download_request:read',
  //reportCard --- bulk upload permissions
  BulkCsvController_getDownloadCsv_read:
    'BulkCsvController:get_download_csv:read',
  BulkCsvController_validateCsv_read: 'BulkCsvController:validate_csv:read',
  BulkCsvController_downloadedErrorList_read:
    'BulkCsvController:downloaded_error_list:read',
  BulkCsvController_uploadCsv_update: 'BulkCsvController:upload_csv:update',

  //transport
  transportSettingsController_updateSchoolAddress_update:
    'TransportSettingsController:update__school__address:update',
  transportPickupPointController_updateRoute_update:
    'TransportPickupPointController:update_route:update',
  transportVehicleController_updateRoute_update:
    'TransportVehicleController:update_route:update',
  transportStaffController_updateRoute_update:
    'TransportStaffController:update_route:update',
  transportRouteController_updateRoute_update:
    'TransportRouteController:update_route:update',
  transportPickupPointController_deleteRoute_delete:
    'TransportPickupPointController:delete_route:delete',
  transportPassengersController_deleteRoute_delete:
    'TransportPassengersController:delete_route:delete',
  transportVehicleController_deleteRoute_delete:
    'TransportVehicleController:delete_route:delete',
  transportStaffController_deleteRoute_delete:
    'TransportStaffController:delete_route:delete',
  transportRouteController_deleteRoute_delete:
    'TransportRouteController:delete_route:delete',

  //setting
  classroomSettingController_updateGlobalclassroomsettings_update:
    'ClassroomSettingController:update_globalclassroomsettings:update',

  //yearly_calendar
  academicPlannerController_getEvents_read:
    'AcademicPlannerController:get_events:read',
  //studetn_attendance
  attendanceReportController_report_read:
    'AttendanceReportController:report:read',

  // SIS Profile Settings
  profileSettingsController_addCategory_create:
    'ProfileSettingsController:add_category:create',

  profileSettingsController_updateCategory_update:
    'ProfileSettingsController:update_category:update',
  profileSettingsController_updateField_update:
    'ProfileSettingsController:update_field:update',
  profileSettingsController_addField_create:
    'ProfileSettingsController:add_field:create',

  //documents_profiles
  userDocumentController_updateDocument_update:
    'UserDocumentController:update_document:update',

  // biometric
  BiometricAttendanceController_list_read:
    'BiometricAttendanceController:list:read',
  BiometricMachineController_get_list_read:
    'BiometricMachineController:get_list:read',
  BiometricOverviewController_get_aggregates_read:
    'BiometricOverviewController:get_aggregates:read',
  BiometricSettingsController_get_settings_read:
    'BiometricSettingsController:get_settings:read',
  BiometricUserMappingController_get_list_read:
    'BiometricUserMappingController:get_list:read',
  BiometricMachineController_update_route_update:
    'BiometricMachineController:update_route:update',
  BiometricSettingsController_request__biometric_update:
    'BiometricSettingsController:request__biometric:update',
  BiometricUserMappingController_update_route_update:
    'BiometricUserMappingController:update_route:update',
  BiometricMachineController_delete_route_delete:
    'BiometricMachineController:delete_route:delete',
  BiometricUserMappingController_delete_route_delete:
    'BiometricUserMappingController:delete_route:delete',
  // admit card
  admitCardController_generate_create: 'AdmitCardController:generate:create',

  //comms scheduler controller
  triggerController_view_automated__messages_read:
    'TriggerController:view_automated__messages:read',
  triggerController_update__rule_update:
    'TriggerController:update__rule:update',
  triggerController_toggle__rule__active__status_update:
    'TriggerController:toggle__rule__active__status:update',
  triggerController_toggle__instance__status_update:
    'TriggerController:toggle__instance__status:update',
  triggerController_list__rules_read: 'TriggerController:list__rules:read',
  triggerController_list__instances_read:
    'TriggerController:list__instances:read',
  triggerController_get_trigger__settings_read:
    'TriggerController:get_trigger__settings:read',
  triggerController_delete__rule_delete:
    'TriggerController:delete__rule:delete',

  //sms
  SmsController_send_create: 'SmsController:send:create',
  SmsController_create_recharge_order_create:
    'SmsController:create_recharge_order:create',

  // Custom ID Card
  IdCardDocumentController_generate_single_create:
    'IdCardDocumentController:generate_single:create',
  IdCardImageController_get_signedUrl_create:
    'IdCardImageController:get_signedUrl:create',
  IdCardImageController_save_create: 'IdCardImageController:save:create',
  IdCardTemplateController_create_route_create:
    'IdCardTemplateController:create_route:create',
  IdCardDocumentController_details_read:
    'IdCardDocumentController:details:read',
  IdCardDocumentController_get_list_read:
    'IdCardDocumentController:get_list:read',
  IdCardFieldController_get_list_read: 'IdCardFieldController:get_list:read',
  IdCardFieldController_values_read: 'IdCardFieldController:values:read',
  IdCardImageController_get_list_read: 'IdCardImageController:get_list:read',
  IdCardTemplateController_get_details_read:
    'IdCardTemplateController:get_details:read',
  IdCardTemplateController_get_list_read:
    'IdCardTemplateController:get_list:read',
  IdCardTemplateController_preview_read:
    'IdCardTemplateController:preview:read',
  IdCardTemplateController_preview_default_read:
    'IdCardTemplateController:preview_default:read',
  InstituteAdminController_get_staff_read:
    'InstituteAdminController:get_staff:read',
  IpsController_directory_list_read: 'IpsController:directory_list:read',
  IdCardTemplateController_select_update:
    'IdCardTemplateController:select:update',
  IdCardTemplateController_update_route_update:
    'IdCardTemplateController:update_route:update',
  IdCardImageController_delete_route_delete:
    'IdCardImageController:delete_route:delete',
  IdCardOrderController_checkout_create:
    'IdCardOrderController:checkout:create',
  //Attendance Shifts
  InstituteShiftController_get_staff_list_read:
    'InstituteShiftController:get_staff_list:read',
  InstituteShiftController_remove_delete:
    'InstituteShiftController:remove:delete',
  InstituteShiftController_get_list_read:
    'InstituteShiftController:get_list:read',
  InstituteShiftController_update_route_create:
    'InstituteShiftController:update_route:create',
  InstituteShiftController_get_read: 'InstituteShiftController:get:read',
  geofenceStaffAttendanceController_requests_approve_update:
    'GeofenceStaffAttendanceController:requests_approve:update',
  geofenceStaffAttendanceController_get_requests_read:
    'GeofenceStaffAttendanceController:get_requests:read',
}
