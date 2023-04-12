export const CONFIGURE_FEE_RULES_SLIDER_HEADING = 'createFineRules'
export const FEE_TYPE_LABEL = 'selectFeeTypeYouWantToCreateFineFor'
export const CREATE_FINE_RULEs_LABEL = 'createFineRulesAs'
export const GRACE_PERIOD_TEXT = 'gracePeriod'
// 'gracePeriodDaysPostDueDateAfterWhichTheFineWillStartApplying'
export const GRACE_PERIOD_SUB_TEXT =
  'daysAfterWhichTheFineWillBeApplicablePostDueDate'
export const CREATE_SLOT_LABEL = 'createSlotsAndAddAmount'
export const CREATE_NEW_RULE_BTN_LBL = 'createNewRule'
export const FINE_RULES_LBL = 'fineRules'
export const EMPTY_FINE_LIST_LBL = 'allFinesAppliedViaAboveRuleWillAppearHere'
export const CONFIRM_DELETE_SLOT_WISE_ROW_LBL =
  'areYourSureYouWantToDeleteTheSlot'
export const CONFIRM_DELETE_SLOT_WISE_ROW_ACTION_BTN_LBL = 'delete'
export const APPLIED_FROM_START_DATE_LBL = 'applyFromSessionStartDate'
export const DAYS_POST_DUE_DATE_AFTER_WHICH_THE_FINE_WILL_START_APPLYING =
  'daysPostDueDateAfterWhichTheFineWillStartApplying'

export const FEE_FINE_EMPTY_SCREEN = {
  title: 'createYourFineRules',
  desc: 'AllFinesWillBeVisibleHereCreateRulesToDefineFineAmountFeeTypeAndTimeOfFinePayment',
  btnText: 'createRulesForFine',
}

export const RULES_OPTION_VALUE = {
  perDay: 'PER_DAY',
  slotWise: 'SLOT_WISE',
}

export const RULES_OPTIONS = [
  {value: RULES_OPTION_VALUE.perDay, label: 'Per day'},
  // {value: RULES_OPTION_VALUE.slotWise, label: 'Slot wise'},
]

export const FIELDS = {
  feeType: 'feeType',
  rules: 'rules',
  gracePeriod: 'gracePeriod',
  perDayFineAmount: 'perDayFineAmount',
  selectDays: 'selectDays',
  from: 'from',
  to: 'to',
  amount: 'amount',
  appliedFromStartDate: 'appliedFromStartDate',
}

export const PLACEHOLDER = {
  feeType: 'Academic Fee',
  daySelect: '10',
  amount: '100',
  perDayAmount: '300',
}

export const FINED_USER_LIST_TABLE_COLS = [
  {key: 'studentDetails', label: 'student details'},
  {key: 'class', label: 'class'},
  {key: 'applied', label: 'applied'},
  {key: 'paid', label: 'paid'},
  {key: 'due', label: 'due'},
  // {key: 'action', label: 'action'},
]

export const CONFIGURE_RULE_SLIDER_CLOSE_POPUP = {
  title: 'exitWithoutCreatingFineRules',
  desc: 'byExitingYouWillLoseAllDataYouHaveAddedTillNow',
  primaryBtnText: 'noContinueEditing',
  secondaryBtnText: 'yesExit',
}

export const DELETE_RULE_CONFIRMATION_POPUP = {
  title: 'deleteFineConfirmModalTitle',
  desc: 'theSelectedFineRuleWillBeDeletedAndCantBeRecoveredLater',
  primaryBtnText: 'cancel',
  secondaryBtnText: 'delete',
}
