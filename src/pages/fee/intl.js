import {t} from 'i18next'

export const FEE_STRUCTURE = {
  btnTextNext: 'Next',
  btnTextContinue: 'Continue',
  btnTextContinueEditing: 'No, Continue Editing',
  btnTextConfirm: 'Confirm',
  btnTextCancel: 'Cancel',
  btnTextDelete: 'Delete',
  btnTextPublish: 'Publish',
  btnTextModify: 'Update',
  btnTextExit: 'Exit',
  btnTextYesExit: 'Yes, Exit',
  newStructureBtnText: t('createStructure'),
  createNewStructureBtnText: 'Create Fee Structure',
  createNewStructure: 'Create New Structure',
  selectOneToProceed: 'Select one to proceed',
  deleteConfirmModalTitle: 'Are your sure you want to delete fee structure?',
  deleteConfirmModalDesc:
    'Deleting will remove the fee structure. Structure will not be applied to selected fee types and students anymore',
  showClassView: 'Show class view',
  noFeeStructureText:
    'Checkout this video and get started by create your own structure.',
  failedToLoadConfigurations: 'Failed to load fee configurations',
  failedToSaveConfigurations: 'Failed to save fee configurations',
  publishConfirmModalTitle: 'Are your sure you want to Publish Fee Structure?',
  publishConfirmModalDesc:
    'Once published, students will be able to see the fee and make the payment if any amount is due.',
  customInstallmentModalTitle: 'Are you sure want to update the fee structure?',
  customInstallmentModalDesc:
    'Some fee type(s) contain custom installment amounts. This action would lead to reset all the custom installments amount.',
  modifyFeeCategoryTitle: 'Are you sure you want to modify the installments?',
  modifyFeeCategoryDesc: '',
  classesTabDesc: 'Select department, classes for the fee structure',
  exitConfirmModalTitle: 'Exit without completing fee structure?',
  exitConfirmModalDesc:
    "On exiting all data added till now will be lost and can't be recovered later",
  totalAnnualFeeWithTax: 'Total annual fee (with tax)',
  accordianBasicDetails: {
    classes: 'Classes',
    profiles: 'Created For',
    receiptSeries: 'Receipt Series',
    monthFeeApplicableOn: 'Applicable for (month)',
    monthlyDueDate: 'Installment Due Date',
    dueDate: 'Due Date',
    totalAnnualFee: 'Total Annual Fee',
    tax: 'Tax',
  },
  feeInstallmentModified: 'Installments modified successfully',
  feeStructureCreated: 'Fee structure created successfully',
  feeStructureUpdated: 'Fee structure updated successfully',
  feeStructureDeleted: 'Fee structure deleted successfully',
  previousSessionDuesDeleted: 'Previous session dues deleted successfully',
  previousYearDuesCreated: 'Previous session dues created successfully',
  previousYearDuesModified: 'Previous session dues modified successfully',
  RECURRING: {
    TITLE: 'Recurring Fee',
    DESC: 'Create fee category, add fee type and assign it to a department or class',
    TYPE: {
      ADD_MORE: '+ Add more fee type',
      FEE_TYPE: 'Fee type',
      AMOUNT: 'Amount',
      TAX: 'Tax %',
    },
  },
  TRANSPORT: {
    TITLE: 'Transport Fee',
    DESC: 'Create distance wise fee and assign to students',
    SUB_DESC: '(*will be applicable on the whole school)',
    TYPE: {
      ADD_MORE: '+ Add Distance',
      DISTANCE: 'Distance (km)',
      PICKUP: 'Pickup or Drop point',
      AMOUNT: 'Amount',
    },
    OPTIONAL: '(Optional)',
    ADD_MORE_FOR_PICKUP_POINT: '+ Add Pickup point',
  },
  FORM: {
    FEE_STRUCTURE_NAME: {
      LABEL: 'Fee Structure Name*',
      PLACEHOLDER: 'Term Fee',
    },
    TRANSPORT_STRUCTURE_NAME: {
      LABEL: 'Transport Structure Name*',
      PLACEHOLDER: 'Transport Fee',
    },
    RECEIPT_PREFIX: {
      LABEL: 'Receipt Prefix*',
      PLACEHOLDER: 'DPS',
    },
    RECEIPT_STARTING_NO: {
      LABEL: 'Receipt Starting Number*',
      PLACEHOLDER: '100',
    },
    DUE_DATE: {
      LABEL: 'Due Date',
      PLACEHOLDER: 'Select Date',
    },
    INSTALLMENT_DUE_DATE: {
      LABEL: 'Installment Due Date',
      PLACEHOLDER: 'Select Date',
    },
    APPLICABLE_MONTHS: {
      LABEL: 'Select fee installments will be applicable on',
      PLACEHOLDER: 'Select Installments',
    },
    TAX: {
      LABEL: 'Tax %',
      PLACEHOLDER: '12',
    },
    APPLICABLE_FOR: {
      LABEL: 'Applicable for how many months',
      PLACEHOLDER: 'Select Month(s)',
    },
  },
}

export const FEES = {
  CSV_REPORT_EXPORTED_MESSAGE: 'Your report is downloaded successfully',
}

export const RECURRING_FEE_STRUCTURE = {
  TOTAL_ANNUAL_FEE: 'Total Annual Fee',
  DELETE_MODAL: {
    TITLE: 'Are your sure you want to delete fee type?',
    DESCRIPTION:
      'Deleting fee type will result in removal of the fee type from structure & will not be visible to students',
    PRIMARY_BTN_TEXT: 'Cancel',
    SECONDARY_BTN_TEXT: 'Delete',
  },
}

export const TRANSPORT_FEE_STRUCTURE = {
  DELETE_MODAL: {
    TITLE: 'Are your sure you want to delete the distance range?',
    DESCRIPTION:
      'Deleting distance range will remove it from the fee structure. Range will not be visible to students.',
    PRIMARY_BTN_TEXT: 'Cancel',
    SECONDARY_BTN_TEXT: 'Delete',
    PICKUP_TITLE: 'Are your sure you want to delete the pickup point?',
    PICKUP_DESCRIPTION:
      'Pickup point will be removed from the fee structure. Fees for this pickup point will not be visible to students',
  },
}

export const DISCOUNT = {
  btnTextCancel: 'Cancel',
  btnTextNext: 'Next',
  btnTextApplyDiscount: 'Apply Discount',
  btnTextAddFilters: 'Add Filters',
  btnTextApplyFilter: 'Apply Filter',
  sliderTitleAddNew: 'Add New',
  sliderTitleEdit: 'Edit',
  addNewDiscount: 'Create Discount',
  noDiscountFound: 'No student found',
  createDiscountLabel: 'Add below details to create a discount',
  editDiscountLabel: 'Add below details to update a discount',
  studentProfileLabelPrefix: 'Select User profiles for the ',
  studentProfileLabelSuffix: ' discount',
  noDiscountText: 'Create and apply customized discounts for the students.',
  studentProfileTabHeaderText:
    'Students who has below fee types will be shown here',
  searchPlaceholder: 'Search by student name, phone number',
  discountTabFooterText:
    'The discount will be applicable on the students who has all the above fee types in their fee.',
  exitConfirmModalTitle: 'Exit without completing discount?',
  exitConfirmModalDesc:
    "On exiting all data added till now will be lost and can't be recovered later",
  deleteConfirmModalTitle: 'Delete fee discount?',
  deleteConfirmModalDesc:
    'Deleting will remove the discount from the fee structure. Discount will not be applied to selected students',
  publishConfirmModalTitle:
    'Are your sure you want to apply discount for selected students?',
  publishConfirmModalDesc:
    'Once you confirm discount will be applied on student profile automatically. You can always make changes in discount or student profiles.',
  discountCreatedMessage: 'Discount created successfully',
  discountUpdatedMessage: 'Discount updated successfully',
  discountdeletedMessage: 'Discount deleted successfully',
  tableFields: {
    discountName: 'Discount Name',
    amount: 'Discount (Amount or %)',
    feeTypes: 'Fee Type',
    profiles: 'Profiles',
  },
  form: {
    nameLabel: 'Discount Name',
    namePlaceholder: 'Single Girl Child',
    absoluteLabel: 'Discount type (absolute value or %)',
    absolutePlaceholder: 'Select One',
    valueAmountLabel: 'Discount amount',
    valueAmountPlaceholder: '₹ 2000',
    valuePercentageLabel: 'Discount percentage',
    valuePercentagePlaceholder: '12',
    feeTypeLabel: 'Select Fee Type(s) for Discount',
    feeTypePlaceholder: 'Select fee type',
  },
}
