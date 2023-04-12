import {t} from 'i18next'

export const STEP_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  NOT_STARTED: 'NOT_STARTED',
  COMPLETED: 'COMPLETED',
}

export const STEPS_IDS = {
  STEP_1: 'STEP_1',
  STEP_2: 'STEP_2',
}

export const DELETE_FEE_STRUCTURE_STEP_IDS = {
  deleteReceipt: 'deleteReceipt',
  deleteFeeStructure: 'deleteFeeStructure',
}

export const DELETE_FEE_STRUCTURE_STEPS = {
  STEP_1: {
    index: 0,
    id: DELETE_FEE_STRUCTURE_STEP_IDS.deleteReceipt,
    status: STEP_STATUS.IN_PROGRESS,
    title: t('deleteReceipt'),
  },
  STEP_2: {
    index: 1,
    id: DELETE_FEE_STRUCTURE_STEP_IDS.deleteFeeStructure,
    status: STEP_STATUS.NOT_STARTED,
    title: t('deleteFeeStructureText'),
  },
}

export const DELETE_PREVIOUS_SESSION_DUES_STEPS = {
  STEP_1: {
    index: 0,
    id: DELETE_FEE_STRUCTURE_STEP_IDS.deleteReceipt,
    status: STEP_STATUS.IN_PROGRESS,
    title: t('deleteReceipt'),
  },
  STEP_2: {
    index: 1,
    id: DELETE_FEE_STRUCTURE_STEP_IDS.deleteFeeStructure,
    status: STEP_STATUS.NOT_STARTED,
    title: t('deleteTitle'),
  },
}

export const UPDATE_FEE_STRUCTURE_STEP_IDS = {
  deleteReceipt: 'deleteReceipt',
  updateFeeStructure: 'updateFeeStructure',
}

export const FEE_STRUCTURE_EDIT_DELETE_ALL_RECIEPT_STEPS = {
  [UPDATE_FEE_STRUCTURE_STEP_IDS.deleteReceipt]: {
    index: 0,
    id: UPDATE_FEE_STRUCTURE_STEP_IDS.deleteReceipt,
    status: STEP_STATUS.IN_PROGRESS,
    title: t('deleteReceipt'),
  },
  [UPDATE_FEE_STRUCTURE_STEP_IDS.updateFeeStructure]: {
    index: 1,
    id: UPDATE_FEE_STRUCTURE_STEP_IDS.updateFeeStructure,
    status: STEP_STATUS.NOT_STARTED,
    title: t('publishFeeStructureText'),
  },
}

export const FEE_STRUCTURE_EDIT_STEPS = {
  STEP_1: {
    index: 0,
    id: UPDATE_FEE_STRUCTURE_STEP_IDS.deleteReceipt,
    status: STEP_STATUS.IN_PROGRESS,
    title: t('deleteReceipt'),
  },
  STEP_2: {
    index: 1,
    id: UPDATE_FEE_STRUCTURE_STEP_IDS.updateFeeStructure,
    status: STEP_STATUS.NOT_STARTED,
    title: t('publishFeeStructureText'),
  },
}

export const DELETE_ALL_RECEIPTS_TRANSACTION_CSV_MAPPING = {
  'Transaction id': 'transaction_id',
  'Receipt no': 'receipt_no',
  'Student Name': 'student_name',
  'Enrollment ID': 'enrollment_number',
  Class: 'class_section',
  Amount: 'amount',
  Mode: 'payment_mode',
  Status: 'transaction_status',
}

export const DELETE_ALL_RECEIPTS_TRANSACTION_CSV_HEADERS = [
  'Transaction id',
  'Receipt no',
  'Student Name',
  'Enrollment ID',
  'Class',
  'Amount',
  'Mode',
  'Status',
]

export const DEPENDANCY_CASES = {
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
}

export const DELETE_RECEIPT_CLICK_EVENT = {
  TYPE: {
    EDIT: 'edit_structure',
    DELETE: 'delete_structure',
  },
  SCREEN_NAME: {
    FEE_CONFIG: 'fee_configuration',
    DELETE_POPUP: 'delete_structure_popup',
  },
  ACTION: {
    DELETE: 'DELETE',
    CANCEL: 'CANCEL',
  },
}

export const DELETE_ADD_ON_FEE_STEPS_IDS = {
  deleteReceipt: 'deleteReceipt',
  deleteAddOnFee: 'deleteAddOnFee',
}

export const DELETE_ADD_ON_FEE_STEPS = {
  STEP_1: {
    index: 0,
    id: DELETE_ADD_ON_FEE_STEPS_IDS.deleteReceipt,
    status: STEP_STATUS.IN_PROGRESS,
    title: t('deleteReceipt'),
  },
  STEP_2: {
    index: 1,
    id: DELETE_ADD_ON_FEE_STEPS_IDS.deleteAddOnFee,
    status: STEP_STATUS.NOT_STARTED,
    title: t('Delete Add-on Fee Type'),
  },
}
