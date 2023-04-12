export const initialState = {
  selectedStaff: [],
  selectedStudents: [],
  nextButtonDisabled: true,
  backButtonDisabled: false,
  showFooterCheckBox: false,
  footerCheckboxSelected: false,
  idCardConfig: {},
  deliveryAddress: {},
  billingAddress: {},
  isFinalStep: false,
  makePayment: false,
}

export const IDCheckoutActions = {
  UPDATE_STUDENT_LIST: 'UPDATE_STUDENT_LIST',
  UPDATE_STAFF_LIST: 'UPDATE_STAFF_LIST',
  TOGGLE_NEXT_BUTTON_DISABILITY: 'TOGGLE_NEXT_BUTTON_DISABILITY',
  TOGGLE_BACK_BUTTON_DISABILITY: 'TOGGLE_BACK_BUTTON_DISABILITY',
  SHOW_FOOTER_CHECKBOX: 'SHOW_FOOTER_CHECKBOX',
  TOGGLE_FOOTER_CHECKBOX: 'TOGGLE_FOOTER_CHECKBOX',
  SET_ID_CARD_CONFIG: 'SET_ID_CARD_CONFIG',
  SET_ID_CARD_DELIVERY_ADDRESS: 'SET_ID_CARD_DELIVERY_ADDRESS',
  SET_ID_CARD_BILLING_ADDRESS: 'SET_ID_CARD_BILLING_ADDRESS',
  SET_IS_FINAL_STEP: 'SET_IS_FINAL_STEP',
  MAKE_PAYMENT_ACTION: 'MAKE_PAYMENT_ACTION',
}

export const idCardCheckoutReducer = (state, action) => {
  const {type, data} = action
  switch (type) {
    case IDCheckoutActions.UPDATE_STUDENT_LIST:
      return {...state, selectedStudents: data}
    case IDCheckoutActions.UPDATE_STAFF_LIST:
      return {...state, selectedStaff: data}
    case IDCheckoutActions.TOGGLE_NEXT_BUTTON_DISABILITY:
      return {...state, nextButtonDisabled: data}
    case IDCheckoutActions.TOGGLE_BACK_BUTTON_DISABILITY:
      return {...state, backButtonDisabled: data}
    case IDCheckoutActions.SHOW_FOOTER_CHECKBOX:
      return {...state, showFooterCheckBox: data}
    case IDCheckoutActions.TOGGLE_FOOTER_CHECKBOX:
      return {...state, footerCheckboxSelected: data}
    case IDCheckoutActions.SET_ID_CARD_CONFIG:
      return {...state, idCardConfig: data}
    case IDCheckoutActions.SET_ID_CARD_DELIVERY_ADDRESS:
      return {...state, deliveryAddress: data}
    case IDCheckoutActions.SET_ID_CARD_BILLING_ADDRESS:
      return {...state, billingAddress: data}
    case IDCheckoutActions.SET_IS_FINAL_STEP:
      return {...state, isFinalStep: data}
    case IDCheckoutActions.MAKE_PAYMENT_ACTION:
      return {...state, makePayment: data}
    case 'reset':
      return initialState
    default:
      return state
  }
}
