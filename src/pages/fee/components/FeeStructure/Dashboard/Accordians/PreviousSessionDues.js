import styles from './PreviousSessionDues.module.css'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {useState} from 'react'
import {DateTime} from 'luxon'
import {getAmountFixDecimalWithCurrency} from '../../../../../../utils/Helpers'
import {Icon, Table} from '@teachmint/common'
import {useDispatch, useSelector} from 'react-redux'
import feeCollectionActionTypes from '../../../../redux/feeCollectionActionTypes'
import {usePreviousSessionDueSettings} from '../../../../redux/feeStructure/feeStructureSelectors'
import SubjectTooltipOptions from '../../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {
  MANAGE_STRUCTURE_OPTIONS,
  SliderScreens,
  STUDENT_OPTIONS,
} from '../../../../fees.constants'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

export default function PreviousSessionDues({structure}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const previousSessionDueSettings = usePreviousSessionDueSettings()
  const studentsList = useSelector((state) => state.instituteStudentList)
  const {instituteInfo} = useSelector((state) => state)
  const [toggleAccordian, setToggleAccordian] = useState(true)
  const [viewMore, setViewMore] = useState(false)
  const defaultStudentsToShow = 3

  const previousYearDuesInitialValues = {
    _id: previousSessionDueSettings.previous_due_structure_id.value,
    fee_type: 'CUSTOM',
    is_previous_due: true,
    receipt_prefix:
      previousSessionDueSettings.previous_due_receipt_prefix.value ?? '',
    series_starting_number:
      previousSessionDueSettings.previous_due_starting_number.value ?? '',
    applicable_students: STUDENT_OPTIONS.NONE,
    fee_categories: [],
    fee_types: previousSessionDueSettings.previous_due_categories.value ?? [],
  }

  const structureActions = [
    {
      label: t('editStructure'),
      action: MANAGE_STRUCTURE_OPTIONS.EDIT_STRUCTURE_ACTION,
      labelStyle: '',
    },
  ]

  const handleSelectedAction = () => {
    dispatch({
      type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
      payload: {
        name: SliderScreens.PREVIOUS_YEAR_DUE_SLIDER,
        data: {
          initialValues: previousYearDuesInitialValues,
        },
      },
    })
  }

  const getStudentDetails = (studentId) => {
    return studentsList
      ? studentsList.find((student) => student._id === studentId)
      : null
  }

  const dueDetails = [
    {
      label: t('type'),
      value: t('previousDue'),
    },
    {
      label: t('totalStudents'),
      value: structure.students.length,
    },
    {
      label: t('receiptSeries'),
      value:
        structure.receipt_prefix + ' - ' + structure.series_starting_number,
    },
    {
      label: t('dueDate'),
      value: DateTime.fromSeconds(
        structure.schedule_timestamps[0]
      ).toLocaleString(DateTime.DATE_FULL),
    },
    {
      label: t('totalAmount'),
      value: getAmountFixDecimalWithCurrency(
        structure.payable_amount,
        instituteInfo.currency
      ),
    },
  ]

  const tableCols = [
    {
      key: 'student',
      label: t('studentName'),
    },
    {
      key: 'amount',
      label: t('amount'),
    },
    {key: 'modify', label: ' '},
  ]

  const tableRows = structure.students
    .slice(0, viewMore ? structure.students.length : defaultStudentsToShow)
    .map((row) => ({
      student: (
        <div className={styles.tableRow}>
          {getStudentDetails(row.student_id)?.name}
        </div>
      ),
      amount: (
        <div className={styles.tableRow}>
          {getAmountFixDecimalWithCurrency(row.amount, instituteInfo.currency)}
        </div>
      ),
      modify: (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.feeModuleController_updateCategoryAmount_update
          }
        >
          <div
            onClick={() =>
              dispatch({
                type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
                payload: {
                  name: SliderScreens.PREVIOUS_YEAR_DUE_MODIFY_SLIDER,
                  data: {
                    name: getStudentDetails(row.student_id)?.name,
                    ...row,
                  },
                },
              })
            }
            className={styles.modifyCategory}
          >
            {t('previousSessionDuesModifyButton')}
          </div>
        </Permission>
      ),
    }))

  return (
    <div
      key={structure._id}
      className={classNames(styles.accordian, {
        [styles.active]: toggleAccordian,
      })}
    >
      <div className={styles.label}>
        <div
          className={styles.name}
          onClick={() => setToggleAccordian(!toggleAccordian)}
        >
          {structure.name}
        </div>
        <div className={styles.categoryOptions}>
          <div className={styles.ellipsisIconStyle}>
            <SubjectTooltipOptions
              subjectItem={structure}
              options={structureActions}
              trigger={
                <div className={styles.ellipsisIcon}>
                  <Icon name="ellipsisVertical" color="secondary" size="l" />
                </div>
              }
              handleChange={handleSelectedAction}
            />
          </div>
          <div
            className={classNames(styles.toggleIcon, {
              [styles.headingSectionIconRight]: !toggleAccordian,
            })}
            onClick={() => setToggleAccordian(!toggleAccordian)}
          >
            <Icon name="downArrow" size="xxs" />
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.basicDetails}>
          {dueDetails.map((detail) => {
            return (
              <div key={detail.label} className={styles.detailSection}>
                <div>{detail.label}</div>
                <div>{detail.value}</div>
              </div>
            )
          })}
        </div>
        <Table className={styles.table} cols={tableCols} rows={tableRows} />
        {structure.students.length > defaultStudentsToShow && (
          <div
            onClick={() => setViewMore(!viewMore)}
            className={styles.viewMoreLess}
          >
            {viewMore ? t('viewLess') : t('viewMore')}
          </div>
        )}
      </div>
    </div>
  )
}
