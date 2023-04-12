import {ToggleSwitch} from '@teachmint/common'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import {
  BANK_CHEQUE_STATUS,
  CHEQUE_STATUS,
  CLASSES_OF_STUDENTS_YOU_WANT_TO_BE_INCLUDED_IN_YOUR_REPORT,
  DATE_RANGE_INPUT_TYPE,
  FEE_REPORTS_TEMPLATES,
  INCLUDE_PENDING_CHEQUE_DD_DATA_IN_THE_REPORT,
  INSTITUTE_HIERARCHY_TYPES,
  INSTITUTE_TREE_TYPE,
  MULTI_SELECT_WITH_CHIPS,
  paymentStatus,
  paymentStatusLabels,
  PAYMENT_MODES,
  PLACEHOLDERS,
  SELECT_CLASSES,
  SELECT_DATE_RANGE,
  SELECT_DEPARTMENTS,
  SELECT_FEE_TYPE,
  SELECT_INSTALMENT_DATES,
  SELECT_MONTHS,
  SELECT_SECTIONS,
  SELECT_TRANSACTION_STATUS,
} from '../../../fees.constants'
import {getDepartmentsList} from '../../../helpers/helpers'
import {feeReportActionTypes} from '../../../redux/feeReports/feeReportsActiontype'

export const inputFields = (allStates = {}, allFunctions = {}, styles = {}) => {
  const {
    paymentModes,
    isPendingChequeDataIncluded,
    masterCategoryIds,
    hierarchyIds,
    months,
    selectedInstalmentTimestamp,
    chequeStatus,
    reportTemplateId,
    feeTypeList,
    instalmentTimestampList,
    instituteHierarchy,
    sessionMonths,
    categoryBreakdown,
  } = allStates

  const {
    t,
    getSelectedNodes,
    handleIsPendingChequeDataIncluded,
    setCategoryBreakdown,
  } = allFunctions

  return [
    {
      id: 1,
      numberLabel: {
        number: 1,
        label: t(PAYMENT_MODES),
      },
      inputField: {
        type: MULTI_SELECT_WITH_CHIPS,
        options: Object.values(paymentStatusLabels).map((mode) => {
          return {label: t(mode.label), value: mode.key}
        }),
        value: paymentModes,
        placeholder: PLACEHOLDERS.paymentModes,
      },
      isVisible: [
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.value,
      ].includes(reportTemplateId),

      dispatchType: feeReportActionTypes.SET_PAYMENT_MODES,
      subSection: [
        {
          id: 1,
          isVisible: paymentModes.some((mode) => {
            return [paymentStatus.CHEQUE, paymentStatus.DD].includes(mode)
          }),
          html: (
            <div className={styles.isPendingChequeIncludedSection}>
              <span>
                <span className={styles.isPendingChequeIncludedText}>
                  {t(INCLUDE_PENDING_CHEQUE_DD_DATA_IN_THE_REPORT)}
                </span>
                <ToggleSwitch
                  id="id"
                  checked={isPendingChequeDataIncluded}
                  onChange={(checked) =>
                    handleIsPendingChequeDataIncluded(checked)
                  }
                  className={classNames({
                    [styles.disabled]: !isPendingChequeDataIncluded,
                    [styles.enabled]: isPendingChequeDataIncluded,
                  })}
                />
              </span>
            </div>
          ),
        },
      ],
    },
    {
      id: 2,
      numberLabel: {
        number: 1,
        label: t(SELECT_FEE_TYPE),
      },
      inputField: {
        type: MULTI_SELECT_WITH_CHIPS,
        options: feeTypeList.map((type) => {
          return {
            label: type.name,
            value: type._id,
          }
        }),
        value: masterCategoryIds,
        placeholder: PLACEHOLDERS.feeType,
      },
      isVisible: ![
        FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.value,
        FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.value,
      ].includes(reportTemplateId),
      dispatchType: feeReportActionTypes.SET_MASTER_CATEGORY_IDS,
      isBreakUpVisible: ![
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.value,
        FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.value,
      ].includes(reportTemplateId),
      subSection: [
        {
          id: 1,
          isVisible: ![
            FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.value,
            FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.value,
          ].includes(reportTemplateId),
          html: (
            <div className={styles.isPendingChequeIncludedSection}>
              <span>
                <span className={styles.isPendingChequeIncludedText}>
                  {t('feeTypeBreakupCheck')}
                </span>
                <ToggleSwitch
                  id="id2"
                  checked={categoryBreakdown}
                  onChange={(checked) => setCategoryBreakdown(checked)}
                  className={classNames({
                    [styles.disabled]: !categoryBreakdown,
                    [styles.enabled]: categoryBreakdown,
                  })}
                />
              </span>
            </div>
          ),
        },
      ],
    },
    {
      id: 3,
      numberLabel: {
        number: 2,
        label: t(CLASSES_OF_STUDENTS_YOU_WANT_TO_BE_INCLUDED_IN_YOUR_REPORT),
      },
      inputField: {
        type: INSTITUTE_TREE_TYPE,
        value: hierarchyIds,
        hierarchyTypes: [
          INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
          INSTITUTE_HIERARCHY_TYPES.STANDARD,
          INSTITUTE_HIERARCHY_TYPES.SECTION,
        ],
        expandChildNodesDefault: false,
        expandTill: INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
        onChange: (nodes) => {
          getSelectedNodes(
            nodes,
            INSTITUTE_HIERARCHY_TYPES.SECTION,
            feeReportActionTypes.SET_HIERARCHY_IDS
          )
        },
      },
      isVisible: [
        FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.value,
      ].includes(reportTemplateId),
      dispatchType: feeReportActionTypes.SET_HIERARCHY_IDS,
    },
    {
      id: 4,
      numberLabel: {
        number: 2,
        label: t(SELECT_CLASSES),
      },
      inputField: {
        type: INSTITUTE_TREE_TYPE,
        value: hierarchyIds,
        hierarchyTypes: [
          INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
          INSTITUTE_HIERARCHY_TYPES.STANDARD,
        ],
        expandChildNodesDefault: false,
        expandTill: INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
        onChange: (nodes) => {
          getSelectedNodes(
            nodes,
            INSTITUTE_HIERARCHY_TYPES.STANDARD,
            feeReportActionTypes.SET_HIERARCHY_IDS
          )
        },
      },
      isVisible: [
        FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.value,
      ].includes(reportTemplateId),
      dispatchType: feeReportActionTypes.SET_HIERARCHY_IDS,
    },
    {
      id: 5,
      numberLabel: {
        number: 2,
        label: t(SELECT_DEPARTMENTS),
      },
      inputField: {
        type: MULTI_SELECT_WITH_CHIPS,
        options: getDepartmentsList(instituteHierarchy),
        value: hierarchyIds,
        placeholder: PLACEHOLDERS.department,
      },
      isVisible: [
        FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_DEPARTMENTWIS.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.value,
      ].includes(reportTemplateId),
      dispatchType: feeReportActionTypes.SET_HIERARCHY_IDS,
    },
    {
      id: 6,
      numberLabel: {
        number: 2,
        label: t(SELECT_MONTHS),
      },
      inputField: {
        type: MULTI_SELECT_WITH_CHIPS,
        options: sessionMonths,
        value: months,
        placeholder: PLACEHOLDERS.months,
      },
      isVisible: [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.value].includes(
        reportTemplateId
      ),
      dispatchType: feeReportActionTypes.SET_FEE_REPORTS_MONTHS,
    },
    {
      id: 7,
      numberLabel: {
        number: 2,
        label: t(SELECT_DATE_RANGE),
      },
      inputField: {
        type: DATE_RANGE_INPUT_TYPE,
        options: sessionMonths,
        value: months,
        placeholder: PLACEHOLDERS.paymentModes,
      },
      isVisible:
        [
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.value,
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.value,
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.value,
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.value,
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.value,
          FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.value,
          FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.value,
        ].includes(reportTemplateId) &&
        reportTemplateId !== FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.value,
      dispatchType: feeReportActionTypes.SET_DATE_RANGE,
    },
    {
      id: 8,
      numberLabel: {
        number: 2,
        label: t(SELECT_SECTIONS),
      },
      inputField: {
        type: INSTITUTE_TREE_TYPE,
        value: hierarchyIds,
        hierarchyTypes: [
          INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
          INSTITUTE_HIERARCHY_TYPES.STANDARD,
          INSTITUTE_HIERARCHY_TYPES.SECTION,
        ],
        expandChildNodesDefault: false,
        expandTill: INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
        onChange: (nodes) => {
          getSelectedNodes(
            nodes,
            INSTITUTE_HIERARCHY_TYPES.SECTION,
            feeReportActionTypes.SET_HIERARCHY_IDS
          )
        },
      },
      isVisible: [
        FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.value,
      ].includes(reportTemplateId),
      dispatchType: feeReportActionTypes.SET_HIERARCHY_IDS,
    },
    {
      id: 9,
      numberLabel: {
        number: 2,
        label: t(SELECT_INSTALMENT_DATES),
      },
      inputField: {
        type: MULTI_SELECT_WITH_CHIPS,
        options: instalmentTimestampList.map((timestamp) => {
          return {
            label: DateTime.fromSeconds(timestamp).toFormat('dd MMM yyyy'),
            value: timestamp,
          }
        }),
        value: selectedInstalmentTimestamp,
        placeholder: PLACEHOLDERS.instalment,
      },
      isVisible: [
        FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.value,
      ].includes(reportTemplateId),
      dispatchType: feeReportActionTypes.SET_INSTALMENT_TIMESTAMP,
    },
    {
      id: 10,
      numberLabel: {
        number: 2,
        label: t(SELECT_TRANSACTION_STATUS),
      },
      inputField: {
        type: MULTI_SELECT_WITH_CHIPS,
        options:
          reportTemplateId ===
          FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.value
            ? BANK_CHEQUE_STATUS.map((status) => {
                return {
                  label: status.key,
                  value: status.key,
                }
              })
            : CHEQUE_STATUS.map((status) => {
                return {
                  label: t(status.label),
                  value: status.value,
                }
              }),
        value: chequeStatus,
      },
      isVisible: [
        FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.value,
        FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.value,
      ].includes(reportTemplateId),
      dispatchType: feeReportActionTypes.SET_CHEQUE_STATUS,
    },
  ]
}
