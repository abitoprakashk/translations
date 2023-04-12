// Reducer with initial state
import {createTransducer} from '../../../../redux/helpers'
import {TRANSPORT_METHODS} from '../../fees.constants'
import feeStructureActionTypes from './feeStructureActionTypes'

const INITIAL_STATE = {
  failedSessionTrasnferTask: [],
  importedSessionDueData: {},
  feeTypesLoading: false,
  deletePreviousSessionDuesLoading: false,
  feeTypes: [],
  feeCategoryInstallmentLoading: false,
  feeCategoryInstallmentError: false,
  feeStructuresLoading: false,
  feeStructuresError: false,
  structureSliderLoading: false,
  structureSliderError: false,
  feeStructures: {
    structureView: {},
    classView: [],
  },
  previousSessionDues: {},
  previousYearDuesLoading: false,
  previousYearDuesError: false,
  modifyPreviousYearDuesLoading: false,
  modifyPreviousYearDuesError: false,
  receiptPrefixExistsLoading: false,
  receiptPrefixExistsError: false,
  customCategoryState: {
    showAddCustomCategoryPopup: false,
    indexOfcustomCategorySelect: null,
    customCategoryName: '',
  },
  feeSettings: {},
  pickupPoints: [],
  transportStructureType: TRANSPORT_METHODS.NONE,
  webinarStatus: {
    isSuccess: false,
    status: null,
  },
}

const fetchFeeStructuresRequestedReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: true,
    feeStructuresError: false,
  }
}

const fetchFeeStructuresSuccessReducer = (state, action) => {
  return {
    ...state,
    feeStructuresLoading: false,
    feeStructuresError: false,
    feeStructures: {
      ...state.feeStructures,
      structureView: action.payload.structure_view,
      classView: action.payload.class_view,
    },
  }
}

const fetchFeeStructuresErrorReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: false,
    feeStructuresError: true,
  }
}

const fetchPreviousSessionDuesReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: true,
    feeStructuresError: false,
  }
}

const fetchPreviousSessionDuesSuccessReducer = (state, action) => {
  return {
    ...state,
    feeStructuresLoading: false,
    feeStructuresError: false,
    previousSessionDues: action.payload,
  }
}

const editFeeStructureRequestedReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: true,
    feeStructuresError: false,
  }
}

const editFeeStructureSuccessReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: false,
    feeStructuresError: false,
  }
}

const editFeeStructureErrorReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: false,
    feeStructuresError: true,
  }
}

const deleteFeeStructureRequestedReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: false,
    feeStructuresError: false,
    deletingFeeStructure: true,
  }
}

const deleteFeeStructureSuccessReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: false,
    feeStructuresError: false,
    deletingFeeStructure: false,
  }
}

const deleteFeeStructureErrorReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: false,
    feeStructuresError: true,
  }
}

const structureSliderRequestedReducer = (state) => {
  return {
    ...state,
    structureSliderLoading: true,
    structureSliderError: false,
  }
}

const structureSliderSuccessReducer = (state) => {
  return {
    ...state,
    structureSliderLoading: false,
    structureSliderError: false,
  }
}

const structureSliderErrorReducer = (state) => {
  return {
    ...state,
    structureSliderLoading: false,
    structureSliderError: true,
  }
}

const fetchFeeCategoriesRequestedReducer = (state) => {
  return {
    ...state,
    feeTypesLoading: true,
  }
}

const fetchFeeCategoriesSuccessReducer = (state, action) => {
  return {
    ...state,
    feeTypesLoading: false,
    feeTypes: action.payload,
  }
}

const fetchFeeCategoriesErrorReducer = (state) => {
  return {
    ...state,
    feeTypesLoading: false,
  }
}

const fetchUsedFeeCategoriesRequestedReducer = (state) => {
  return {
    ...state,
    feeTypesLoading: true,
  }
}

const fetchUsedFeeCategoriesSuccessReducer = (state, action) => {
  return {
    ...state,
    feeTypesLoading: false,
    usedFeeTypes: action.payload,
  }
}

const fetchUsedFeeCategoriesErrorReducer = (state) => {
  return {
    ...state,
    feeTypesLoading: false,
  }
}

const setFeeCategoryInstallmentRequestedReducer = (state) => {
  return {
    ...state,
    feeCategoryInstallmentLoading: true,
    feeCategoryInstallmentError: false,
  }
}

const setFeeCategoryInstallmentSuccessReducer = (state) => {
  return {
    ...state,
    feeCategoryInstallmentLoading: false,
    feeCategoryInstallmentError: false,
  }
}

const setFeeCategoryInstallmentErrorReducer = (state) => {
  return {
    ...state,
    feeCategoryInstallmentLoading: false,
    feeCategoryInstallmentError: true,
  }
}

const setCustomCategoryStateActionReducer = (state, {payload}) => {
  return {
    ...state,
    customCategoryState: {...state.customCategoryState, ...payload},
  }
}

const setFeeSettingsReducer = (state, action) => {
  return {
    ...state,
    feeSettings: action.payload,
  }
}

const setPickupPointsReducer = (state, action) => {
  return {
    ...state,
    pickupPoints: action.payload,
  }
}

const setTransportStructureTypeReducer = (state, {payload}) => {
  return {
    ...state,
    transportStructureType: payload,
  }
}

const downloadFeeStructureCsvRequestedReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: true,
    feeStructuresError: false,
  }
}

const downloadFeeStructureCsvSuccessReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: false,
    feeStructuresError: false,
  }
}

const downloadFeeStructureCsvErrorReducer = (state) => {
  return {
    ...state,
    feeStructuresLoading: false,
    feeStructuresError: true,
  }
}

const receiptPrefixExistsRequestedReducer = (state) => {
  return {
    ...state,
    receiptPrefixExistsLoading: true,
    receiptPrefixExistsError: false,
  }
}

const receiptPrefixExistsSuccessReducer = (state) => {
  return {
    ...state,
    receiptPrefixExistsLoading: false,
    receiptPrefixExistsError: false,
  }
}

const receiptPrefixExistsErrorReducer = (state) => {
  return {
    ...state,
    receiptPrefixExistsLoading: false,
    receiptPrefixExistsError: true,
  }
}

const previousYearDuesRequestedReducer = (state) => {
  return {
    ...state,
    previousYearDuesLoading: true,
    previousYearDuesError: false,
  }
}

const previousYearDuesSuccessReducer = (state) => {
  return {
    ...state,
    previousYearDuesLoading: false,
    previousYearDuesError: false,
  }
}

const previousYearDuesErrorReducer = (state) => {
  return {
    ...state,
    previousYearDuesLoading: false,
    previousYearDuesError: true,
  }
}

const modifyPreviousYearDuesRequestedReducer = (state) => {
  return {
    ...state,
    modifyPreviousYearDuesLoading: true,
    modifyPreviousYearDuesError: false,
  }
}

const modifyPreviousYearDuesSuccessReducer = (state) => {
  return {
    ...state,
    modifyPreviousYearDuesLoading: false,
    modifyPreviousYearDuesError: false,
  }
}

const modifyPreviousYearDuesErrorReducer = (state) => {
  return {
    ...state,
    modifyPreviousYearDuesLoading: false,
    modifyPreviousYearDuesError: true,
  }
}

const fetchFeeWebinarStatusSuccessReducer = (state, {payload}) => {
  return {
    ...state,
    webinarStatus: {
      ...state.webinarStatus,
      ...payload,
    },
  }
}

const fetchFeeWebinarStatusFailedReducer = (state) => {
  return {
    ...state,
    webinarStatus: {
      isSuccess: false,
      status: null,
    },
  }
}

const importPreviousSessionDuesRequestedReducer = (state) => {
  return {
    ...state,
    previousYearDuesLoading: true,
    previousYearDuesError: false,
  }
}

const deleteStudentPreviousSessionDuesReducer = (state) => {
  return {
    ...state,
    deletePreviousSessionDuesLoading: true,
  }
}

const deleteStudentPreviousSessionDuesSuccessReducer = (state) => {
  return {
    ...state,
    deletePreviousSessionDuesLoading: false,
  }
}

const fetchImportedSessionDueDataReducer = (state) => {
  return {
    ...state,
  }
}

const fetchImportedSessionDueDataSucceededReducer = (state, action) => {
  return {
    ...state,
    importedSessionDueData: action.payload,
  }
}

const fetchFailedSessionTransferTaskReducer = (state) => {
  return {
    ...state,
  }
}

const fetchFailedSessionTransferTaskSucceededReducer = (state, action) => {
  return {
    ...state,
    failedSessionTrasnferTask: action.payload,
  }
}

const acknowledgeFailedTaskReducer = (state) => {
  return {
    ...state,
  }
}

const feeStructureReducer = {
  [feeStructureActionTypes.FETCH_FEE_CATEGORIES_REQUESTED]:
    fetchFeeCategoriesRequestedReducer,
  [feeStructureActionTypes.FETCH_FEE_CATEGORIES_SUCCEEDED]:
    fetchFeeCategoriesSuccessReducer,
  [feeStructureActionTypes.FETCH_FEE_CATEGORIES_FAILED]:
    fetchFeeCategoriesErrorReducer,
  [feeStructureActionTypes.FETCH_USED_FEE_CATEGORIES_REQUESTED]:
    fetchUsedFeeCategoriesRequestedReducer,
  [feeStructureActionTypes.FETCH_USED_FEE_CATEGORIES_SUCCEEDED]:
    fetchUsedFeeCategoriesSuccessReducer,
  [feeStructureActionTypes.FETCH_USED_FEE_CATEGORIES_FAILED]:
    fetchUsedFeeCategoriesErrorReducer,
  [feeStructureActionTypes.FETCH_FEE_STRUCTURES_REQUESTED]:
    fetchFeeStructuresRequestedReducer,
  [feeStructureActionTypes.FETCH_FEE_STRUCTURES_SUCCEEDED]:
    fetchFeeStructuresSuccessReducer,
  [feeStructureActionTypes.FETCH_FEE_STRUCTURES_FAILED]:
    fetchFeeStructuresErrorReducer,
  [feeStructureActionTypes.FETCH_PREVIOUS_SESSION_DUES]:
    fetchPreviousSessionDuesReducer,
  [feeStructureActionTypes.FETCH_PREVIOUS_SESSION_DUES_SUCCESS]:
    fetchPreviousSessionDuesSuccessReducer,
  [feeStructureActionTypes.CREATE_FEE_STRUCTURE_REQUESTED]:
    structureSliderRequestedReducer,
  [feeStructureActionTypes.CREATE_FEE_STRUCTURE_SUCCEEDED]:
    structureSliderSuccessReducer,
  [feeStructureActionTypes.CREATE_FEE_STRUCTURE_FAILED]:
    structureSliderErrorReducer,
  [feeStructureActionTypes.EDIT_FEE_STRUCTURE_REQUESTED]:
    editFeeStructureRequestedReducer,
  [feeStructureActionTypes.EDIT_FEE_STRUCTURE_SUCCEEDED]:
    editFeeStructureSuccessReducer,
  [feeStructureActionTypes.EDIT_FEE_STRUCTURE_FAILED]:
    editFeeStructureErrorReducer,
  [feeStructureActionTypes.UPDATE_FEE_STRUCTURE_REQUESTED]:
    structureSliderRequestedReducer,
  [feeStructureActionTypes.UPDATE_FEE_STRUCTURE_SUCCEEDED]:
    structureSliderSuccessReducer,
  [feeStructureActionTypes.UPDATE_FEE_STRUCTURE_FAILED]:
    structureSliderErrorReducer,
  [feeStructureActionTypes.DELETE_FEE_STRUCTURE_REQUESTED]:
    deleteFeeStructureRequestedReducer,
  [feeStructureActionTypes.DELETE_FEE_STRUCTURE_SUCCEEDED]:
    deleteFeeStructureSuccessReducer,
  [feeStructureActionTypes.DELETE_FEE_STRUCTURE_FAILED]:
    deleteFeeStructureErrorReducer,
  [feeStructureActionTypes.MODIFY_FEE_INSTALLMENT_REQUESTED]:
    setFeeCategoryInstallmentRequestedReducer,
  [feeStructureActionTypes.MODIFY_FEE_INSTALLMENT_SUCCEEDED]:
    setFeeCategoryInstallmentSuccessReducer,
  [feeStructureActionTypes.MODIFY_FEE_INSTALLMENT_FAILED]:
    setFeeCategoryInstallmentErrorReducer,
  [feeStructureActionTypes.SET_CUSTOM_CATEGORY_STATE]:
    setCustomCategoryStateActionReducer,
  [feeStructureActionTypes.FETCH_FEE_SETTING_SUCCEEDED]: setFeeSettingsReducer,
  [feeStructureActionTypes.FETCH_TRANSPORT_PICKUP_POINTS_SUCCEEDED]:
    setPickupPointsReducer,
  [feeStructureActionTypes.SET_TRANSPORT_STRUCTURE_TYPE]:
    setTransportStructureTypeReducer,
  [feeStructureActionTypes.DOWNLOAD_FEE_STRUCTURE_REQUESTED]:
    downloadFeeStructureCsvRequestedReducer,
  [feeStructureActionTypes.DOWNLOAD_FEE_STRUCTURE_SUCCEEDED]:
    downloadFeeStructureCsvSuccessReducer,
  [feeStructureActionTypes.DOWNLOAD_FEE_STRUCTURE_FAILED]:
    downloadFeeStructureCsvErrorReducer,
  [feeStructureActionTypes.RECEIPT_PREFIX_EXISTS_REQUESTED]:
    receiptPrefixExistsRequestedReducer,
  [feeStructureActionTypes.RECEIPT_PREFIX_EXISTS_SUCCEEDED]:
    receiptPrefixExistsSuccessReducer,
  [feeStructureActionTypes.RECEIPT_PREFIX_EXISTS_FAILED]:
    receiptPrefixExistsErrorReducer,
  [feeStructureActionTypes.PREVIOUS_YEAR_DUES_REQUESTED]:
    previousYearDuesRequestedReducer,
  [feeStructureActionTypes.PREVIOUS_YEAR_DUES_SUCCEEDED]:
    previousYearDuesSuccessReducer,
  [feeStructureActionTypes.PREVIOUS_YEAR_DUES_FAILED]:
    previousYearDuesErrorReducer,
  [feeStructureActionTypes.MODIFY_PREVIOUS_YEAR_DUES_REQUESTED]:
    modifyPreviousYearDuesRequestedReducer,
  [feeStructureActionTypes.MODIFY_PREVIOUS_YEAR_DUES_SUCCEEDED]:
    modifyPreviousYearDuesSuccessReducer,
  [feeStructureActionTypes.MODIFY_PREVIOUS_YEAR_DUES_FAILED]:
    modifyPreviousYearDuesErrorReducer,
  [feeStructureActionTypes.FETCH_FEE_WEBINAR_STATUS_SUCCESS]:
    fetchFeeWebinarStatusSuccessReducer,
  [feeStructureActionTypes.FETCH_FEE_WEBINAR_STATUS_FAIL]:
    fetchFeeWebinarStatusFailedReducer,
  [feeStructureActionTypes.IMPORT_PREVIOUS_SESSION_DUES_REQUESTED]:
    importPreviousSessionDuesRequestedReducer,
  [feeStructureActionTypes.DELETE_STUDENT_PREVIOUS_SESSION_DUES]:
    deleteStudentPreviousSessionDuesReducer,
  [feeStructureActionTypes.DELETE_STUDENT_PREVIOUS_SESSION_DUES_SUCCESS]:
    deleteStudentPreviousSessionDuesSuccessReducer,
  [feeStructureActionTypes.FETCH_IMPORTED_SESSION_DUE_DATA]:
    fetchImportedSessionDueDataReducer,
  [feeStructureActionTypes.FETCH_IMPORTED_SESSION_DUE_DATA_SUCCEEDED]:
    fetchImportedSessionDueDataSucceededReducer,
  [feeStructureActionTypes.FETCH_FAILED_SESSION_TRANSFER_TASK]:
    fetchFailedSessionTransferTaskReducer,
  [feeStructureActionTypes.FETCH_FAILED_SESSION_TRANSFER_TASK_SUCCEEDED]:
    fetchFailedSessionTransferTaskSucceededReducer,
  [feeStructureActionTypes.ACKNOWLEDGE_FAILED_TASK]:
    acknowledgeFailedTaskReducer,
}

export default createTransducer(feeStructureReducer, INITIAL_STATE)
