import {t} from 'i18next'

export const CONSTS_FEES = {
  // intl ( admin/src/pages/fee/intl.js )
  totalAnnualFee: t('totalAnnualFee'),
  academicFeeStructureDeleteModalTitle: t(
    'academicFeeStructureDeleteModalTitle'
  ),
  academicFeeStructureDeleteModalDesc: t('academicFeeStructureDeleteModalDesc'),
  cancel: t('cancel'),
  delete: t('delete'),
  next: t('next'),

  transportFeeStructureDeleteModalTitle: t(
    'transportFeeStructureDeleteModalTitle'
  ),
  transportFeeStructureDeleteModalDesc: t(
    'transportFeeStructureDeleteModalDesc'
  ),
  applyDiscount: t('applyDiscount'),
  addFilters: t('addFilters'),
  applyFilter: t('applyFilter'),
  addNew: t('addNew'),
  addNewDiscount: '+ Add New discount',
  noStudentFound: t('noStudentFound'),
  createDiscountLabel: t('createDiscountLabel'),
  editDiscountLabel: t('editDiscountLabel'),
  studentProfileLabelPrefix: t('studentProfileLabelPrefix'),
  studentProfileLabelSuffix: t('studentProfileLabelSuffix'),
  noDiscountText: t('noDiscountText'),
  studentProfileTabHeaderText: t('studentProfileTabHeaderText'),
  searchPlaceholder: t('searchPlaceholder'),
  discountTabFooterText: t('discountTabFooterText'),
  exitConfirmModalTitle: t('exitConfirmModalTitle'),
  exitConfirmModalDesc: t('exitConfirmModalDesc'),
  deleteConfirmModalTitle: t('deleteConfirmModalTitle'),
  deleteConfirmModalDesc: t('deleteConfirmModalDesc'),
  publishConfirmModalTitle: t('publishConfirmModalTitle'),
  publishConfirmModalDesc: t('publishConfirmModalDesc'),
  discountCreatedMessage: t('discountCreatedMessage'),
  discountUpdatedMessage: t('discountUpdatedMessage'),
  discountdeletedMessage: t('discountdeletedMessage'),

  tableFieldsdiscountName: t('tableFieldsdiscountName'),
  tableFieldsAmount: t('tableFieldsAmount'),
  tableFieldsFeeTypes: t('tableFieldsFeeTypes'),
  tableFieldsProfiles: t('tableFieldsProfiles'),

  discountName: t('discountName'),
  namePlaceholder: t('namePlaceholder'),
  absoluteLabel: t('absoluteLabel'),
  absolutePlaceholder: t('absolutePlaceholder'),
  valueAmountLabel: t('valueAmountLabel'),
  valueAmountPlaceholder: t('valueAmountPlaceholder'),
  valuePercentageLabel: t('valuePercentageLabel'),
  valuePercentagePlaceholder: t('valuePercentagePlaceholder'),
  feeTypeLabel: t('feeTypeLabel'),
  feeTypePlaceholder: t('feeTypePlaceholder'),

  // Constants ( admin/src/pages/fee/fees.constants.js )
  studentProfiles: 'Student Profiles',
  structureView: t('structureView'),
  recurringFee: t('recurringFee'),
  feeStructureTypesIdsAcademicFeeDescription: t(
    'feeStructureTypesIdsAcademicFeeDescription'
  ),
  feeStructureTypesIdsAcademicFeeDescriptionTabLabel: t(
    'feeStructureTypesIdsAcademicFeeDescriptionTabLabel'
  ),
  feeStructureTypesIdsAcademicFeeDescriptionClassesTabLabel: t(
    'feeStructureTypesIdsAcademicFeeDescriptionClassesTabLabel'
  ),
  oneTimeFee: t('oneTimeFee'),
  feeStructureTypesIdsOneTimeFeeDesc: t('feeStructureTypesIdsOneTimeFeeDesc'),
  feeStructureTypesIdsOneTimeFeeTabLabel: t(
    'feeStructureTypesIdsOneTimeFeeTabLabel'
  ),
  feeStructureTypesIdsOneTimeFeeClassTabLabel: t(
    'feeStructureTypesIdsOneTimeFeeClassTabLabel'
  ),

  transportFee: t('transportFee'),
  feeStructureTypesIdsTransportFeeDesc: t(
    'feeStructureTypesIdsTransportFeeDesc'
  ),
  feeStructureTypesIdsTransportFeeTablabel: t(
    'feeStructureTypesIdsTransportFeeTablabel'
  ),
  feeStructureTypesIdsTransportFeeClassesTabLabel: t(
    'feeStructureTypesIdsTransportFeeClassesTabLabel'
  ),

  allStudents: t('allStudents'),
  onlyNewStudents: t('onlyNewStudents'),
  onlyExistingStudents: t('onlyExistingStudents'),
  onlinePaymentCollection: t('onlinePaymentCollection'),
  completeYourKYC: t('completeYourKYC'),
  mandatoryForRegulatoryCompliance: t('mandatoryForRegulatoryCompliance'),
  completeKYC: t('completeKYC'),
  verificationInProcess: t('verificationInProcess'),
  threeWorkingDays: t('threeWorkingDays'),
  needMoreInformation: t('needMoreInformation'),

  issueWithDocument: t('issueWithDocument'),
  requiresFewClarifications: t('requiresFewClarifications'),
  updateAlternatively: t('updateAlternatively'),
  razorpayDashboard: t('razorpayDashboard'),
  rememberPassword: t('rememberPassword'),
  kycComplete: t('kycComplete'),
  activePaymentGateway: t('activePaymentGateway'),
  verificationFailed: t('verificationFailed'),
  notAbleToCollectOnlinePayments: t('notAbleToCollectOnlinePayments'),
  rejectApplication: t('rejectApplication'),
  getInTouchWithRazorpay: t('getInTouchWithRazorpay'),
  moreDetails: t('moreDetails'),
  selectPaymentMethod: t('selectPaymentMethod'),

  // NotFound ( admin/src/pages/NotFound/NotFound.js )
  home: t('home'),

  // Academic FeeStructure TableRows ( admin/src/pages/fee/components/AcademicFeeStructure/AcademicFeeStructureTableRows.js )
  selectCategory: t('selectCategory'),
  installment: t('installment'),
  annualFeeIncludingTax: t('annualFeeIncludingTax'),

  // ClassFeeSummary ( admin/src/pages/fee/components/ClassFeeSummary/ClassFeeSummary.js )
  totalPaid: t('totalPaid'),
  class: t('class'),
  totalDue: t('totalDue'),

  // Collect Fees ( admin/src/pages/fee/components/CollectFees/CollectFees.js )
  feeStructure: t('feeStructure'),
  totalFees: t('totalFees'),
  discount: t('discount'),
  dueAmount: t('dueAmount'),
  amountToBePaid: t('amountToBePaid'),
  canNotBeMoreThanTotalFees: t('canNotBeMoreThanTotalFees'),
  canNotBeLessThanZero: t('canNotBeLessThanZero'),
  paymentMethodIsRequired: t('paymentMethodIsRequired'),
  payDateIsRequired: t('payDateIsRequired'),
  confirmPaymentOf: t('confirmPaymentOf'),
  viaCashBy: t('viaCashBy'),
  viaChequeBy: t('viaChequeBy'),
  viaDDBy: t('viaDDBy'),
  paymentWillBeMarkedAsCollected: t('paymentWillBeMarkedAsCollected'),
  joined: t('joined'),
  notJoined: t('notJoined'),
  classSection: t('classSection'),
  dueAmountTillDate: t('dueAmountTillDate'),
  selectMethod: t('selectMethod'),
  cash: t('cash'),
  cheque: t('cheque'),
  dd: t('dd'),
  referenceNumber: t('referenceNumber'),
  status: t('status'),
  pending: t('pending'),
  success: t('success'),
  addAdditionalNoteOptional: t('addAdditionalNoteOptional'),
  additionalNoteOptionalDataPlaceholder: t(
    'additionalNoteOptionalDataPlaceholder'
  ),
  noFeesDataFoundForThisStudent: t('noFeesDataFoundForThisStudent'),

  confirmPaymentOfCash: t('confirmPaymentOfCash'),
  confirmPaymentOfCheque: t('confirmPaymentOfCheque'),

  confirmPaymentOfDD: t('confirmPaymentOfDD'),

  paymentWillBeMarkedWith: t('paymentWillBeMarkedWith'),

  // Collect Fees Slider ( admin/src/pages/fee/components/CollectFeesSlider/CollectFeesSlider.js )
  collectingFeeCloseConfirmationPopupTitle: t(
    'collectingFeeCloseConfirmationPopupTitle'
  ),
  collectingFeeCloseConfirmationPopupDesc: t(
    'collectingFeeCloseConfirmationPopupDesc'
  ),

  // Discount Slider ( admin/src/pages/fee/components/Discounts/Slider/DiscountSlider.js )
  enrollment: t('enrollment'),
  studentDetails: t('studentDetails'),
  sliderTitleAddNew: t('sliderTitleAddNew'),
  sliderTitleEdit: t('sliderTitleEdit'),

  // Discount ( admin/src/pages/fee/components/Discounts/SliderTabs/Discount.js )
  discountFormErrors: t('discountFormErrors'),

  // Fee History ( admin/src/pages/fee/components/FeeHistory/FeeHistory.js )
  fee: t('fee'),
  paymentDetails: t('paymentDetails'),
  date: t('date'),
  receipt: t('receipt'),
  noDataFound: t('noDataFound'),
  due: t('due'),
  paid: t('paid'),

  // HistorySection ( admin/src/pages/fee/components/FeeHistory/HistorySection.js )
  historySectionFeeDetailsAmount: t('historySectionFeeDetailsAmount'),
  historySectionFeeDetailsLabel: t('historySectionFeeDetailsLabel'),

  // Fees Page ( admin/src/pages/fee/components/FeesPage/FeesPage.js )
  feeCollection: t('feeCollection'),
  transactions: t('transactions'),
  paymentGateway: t('paymentGateway'),
  offersDiscounts: t('offersDiscounts'),

  // Class Fee Structure Accordian ( admin/src/pages/fee/components/FeeStructureAccordian/ClassFeeStructureAccordian.js )
  noFeeStructureExistsForThisClass: t('noFeeStructureExistsForThisClass'),
  annualWithTax: t('annualWithTax'),
  distance: t('distance'),
  pickOrDropPoint: t('pickOrDropPoint'),
  totalFeeWithTax: t('totalFeeWithTax'),

  // Fee Structure Accordian ( admin/src/pages/fee/components/FeeStructureAccordian/FeeStructureAccordian.js )
  editStructure: t('editStructure'),
  deleteStructure: t('deleteStructure'),
  classFeeStructureAccordianName: t('classFeeStructureAccordianName'),

  // Fee Structure ( admin/src/pages/fee/components/FeeStructureAccordian/FeeStructure.js )
  xInstallments: `x{{structure.applicable_months.length}} installments`,

  // Fee Structure Slider ( admin/src/pages/fee/components/FeeStructureSlider/FeeStructureSlider.js )
  recurringFeeStructure: t('recurringFeeStructure'),

  // AdditionalInfo ( admin/src/pages/fee/components/FeeStructureSliderTabs/AdditionalInfo.js )
  selectDate: t('selectDate'),

  // FeeStructureTab ( admin/src/pages/fee/components/FeeStructureSliderTabs/FeeStructureTab.js )
  failedToCheckReceiptPrefix: t('failedToCheckReceiptPrefix'),

  // FeeStructure Validations ( admin/src/pages/fee/components/FeeStructureValidations/FeeStructureValidations.js )
  pleaseSelectAtleastOneDepartmentClass: t(
    'pleaseSelectAtleastOneDepartmentClass'
  ),
  pleaseSelectTheApplicableStudents: t('pleaseSelectTheApplicableStudents'),
  nameIsRequired: t('nameIsRequired'),
  nameMustBeMoreThan1Character: t('nameMustBeMoreThan1Character'),
  nameCannotExceedMoreThan25Characters: t(
    'nameCannotExceedMoreThan25Characters'
  ),
  preFixIsRequired: t('preFixIsRequired'),
  prefixMustBeMoreThan1Character: t('prefixMustBeMoreThan1Character'),
  prefixcannotExceedMoreThan25Characters: t(
    'prefixcannotExceedMoreThan25Characters'
  ),
  startingNumberIsRequired: t('startingNumberIsRequired'),
  startingNumberMustBeMoreThan1Character: t(
    'startingNumberMustBeMoreThan1Character'
  ),
  startingNumberCannotExceedMoreThan16Characters: t(
    'startingNumberCannotExceedMoreThan16Characters'
  ),
  dueDateIsRequired: t('dueDateIsRequired'),
  selectAtleastOneMonth: t('selectAtleastOneMonth'),
  selectDueDate: t('selectDueDate'),
  pleaseAddAtleastOneFeeType: t('pleaseAddAtleastOneFeeType'),
  selectFeeType: t('selectFeeType'),
  amountIsRequired: t('amountIsRequired'),
  amountCannotBeGreaterThan7Digits: t('amountCannotBeGreaterThan7Digits'),
  amountMustBeGreaterThan0: t('amountMustBeGreaterThan0'),
  taxMustBeGreaterThan0: t('taxMustBeGreaterThan0'),
  taxCannotExceedMoreThan100: t('taxCannotExceedMoreThan100'),
  distanceIsRequired: t('distanceIsRequired'),
  distanceCannotBeGreaterThan5Digits: t('distanceCannotBeGreaterThan5Digits'),
  distanceMustBeGreaterThan0: t('distanceMustBeGreaterThan0'),
  pickupCannotExceedMoreThan75Characters: t(
    'pickupCannotExceedMoreThan75Characters'
  ),

  // Fee Transaction ( admin/src/pages/fee/components/FeeTransaction/FeeTransaction.js )
  txnId: t('txnId'),
  amount: t('amount'),
  mode: t('mode'),
  na: t('na'),

  // Fee Transaction Constants ( admin/src/pages/fee/components/FeeTransaction/FeeTransactionConstants.js )
  online: t('online'),
  POS: t('POS'),
  updateStatus: t('updateStatus'),
  viewTxnTimeline: t('viewTxnTimeline'),
  downloadReceipt: t('downloadReceipt'),

  NoRecordsAvailable: t('NoRecordsAvailable'),
  editStatus: t('editStatus'),
  transactionTimeline: t('transactionTimeline'),
  modes: t('modes'),
  currentStatus: t('currentStatus'),
  selectOne: t('selectOne'),
  failed: t('failed'),
  settled: t('settled'),
  all: t('all'),
  paymentInProcess: t('paymentInProcess'),
  paymentSuccess: t('paymentSuccess'),
  paymentSettled: t('paymentSettled'),
  paymentFailed: t('paymentFailed'),
  successfullyCopied: t('successfullyCopied'),
  searchByStudentName: t('searchByStudentName'),
  thereAreNoTransactionsToReport: t('thereAreNoTransactionsToReport'),

  // Student Basic Info ( admin/src/pages/fee/components/StudentBasicInfo/StudentBasicInfo.js )
  studentName: t('studentName'),
  studentMobileNumber: t('studentMobileNumber'),
  gender: t('gender'),
  male: t('male'),
  female: t('female'),
  others: t('others'),
  dateOfBirth: t('dateOfBirth'),
  emailAddress: t('emailAddress'),
  enrollmentNumber: t('enrollmentNumber'),
  guardianName: t('guardianName'),
  guardianMobileNumber: t('guardianMobileNumber'),
  address: t('address'),
  pincode: t('pincode'),
  deleteAccount: t('deleteAccount'),
  thisWillDeleteWithCurrentProfile: t('thisWillDeleteWithCurrentProfile'),

  // Student Dues ( admin/src/pages/fee/components/StudentDues/StudentDues.js )
  reminderWillBeOnlySentToStudentsWhoHaveAmountDue:
    'Reminder will be only sent to students who have amount due',
  sendReminder: t('sendReminder'),
  paymentStatus: t('paymentStatus'),
  section: t('section'),

  // FeeReport ( admin/src/pages/fee/components/FeeReport.js )
  feeReport: t('feeReport'),

  // fee Collection Sagas ( admin/src/pages/fee/redux/feeCollectionSagas.js )
  paymentRecordedSuccessfullyToast: t('paymentRecordedSuccessfullyToast'),
}
