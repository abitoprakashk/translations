import {useState} from 'react'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {Icon, Table} from '@teachmint/common'
import {Trans, useTranslation} from 'react-i18next'
import {FEE_STRUCTURE} from '../../../../intl'
import styles from './StructureView.module.css'
import {getAmountFixDecimalWithCurrency} from '../../../../../../utils/Helpers'
import {
  FEE_STRUCTURE_TYPES_IDS,
  MANAGE_STRUCTURE_OPTIONS,
  SliderScreens,
  TRANSPORT_METHODS,
} from '../../../../fees.constants'
import StructureOverview from './StructureOverview'
import feeCollectionActionTypes from '../../../../redux/feeCollectionActionTypes'
import SubjectTooltipOptions from '../../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import Permission from '../../../../../../components/Common/Permission/Permission'
// import Permission from '../../../../../../components/Common/Permission/Permission'
// import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

export default function StructureView({
  isClassView = true,
  structure,
  getClassNames,
  handleEditClick,
  handleDeleteClick,
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const [toggleAccordian, setToggleAccordian] = useState(true)
  const dispatch = useDispatch()

  const structureActions = [
    {
      label: t('editStructure'),
      action: MANAGE_STRUCTURE_OPTIONS.EDIT_STRUCTURE_ACTION,
      labelStyle: '',
      permissionId:
        PERMISSION_CONSTANTS.feeModuleController_feeStructure_create,
    },
    {
      label: t('deleteStructure'),
      action: MANAGE_STRUCTURE_OPTIONS.DELETE_STRUCTURE_ACTION,
      labelStyle: 'tm-cr-rd-1',
      permissionId:
        PERMISSION_CONSTANTS.feeModuleController_deleteFeeStructure_delete,
    },
  ]

  const handleSelectedAction = (action, structure) => {
    switch (action) {
      case MANAGE_STRUCTURE_OPTIONS.EDIT_STRUCTURE_ACTION: {
        handleEditClick(structure)
        break
      }
      case MANAGE_STRUCTURE_OPTIONS.DELETE_STRUCTURE_ACTION: {
        handleDeleteClick(structure)
        break
      }
      default:
        break
    }
  }

  const allEqual = (schedules) => {
    const amounts = Object.values(schedules)
    return amounts.every((amount) => amount === amounts[0])
  }

  const handleClick = (feeCategory) => {
    dispatch({
      type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
      payload: {
        name: SliderScreens.FEE_CATEGORY_MODIFY_SLIDER,
        data: feeCategory,
      },
    })
  }

  let tableCols = []
  let tableRows = []
  if (structure.fee_type !== FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE) {
    tableCols = [
      {
        key: 'feeType',
        label: t('feeType'),
      },
      {
        key: 'amount',
        label: t('amount'),
      },
      {
        key: 'tax',
        label: t('academicFeeStructureTaxLableWIthPercentage'),
      },
      {
        key: 'annualFee',
        label: t('totalFeeWithTax'),
      },
      {key: 'modify', label: ' '},
    ]

    tableRows = structure.fee_categories.map((row) => ({
      feeType: <div className={styles.tableRow}>{row.name}</div>,
      amount: (
        <div className={classNames(styles.tableRow, styles.flexAlignItems)}>
          {allEqual(row.schedule)
            ? getAmountFixDecimalWithCurrency(
                Object.values(row.schedule).length > 0
                  ? Object.values(row.schedule)[0]
                  : 0,
                instituteInfo.currency
              )
            : t('custom')}
          {structure.fee_type === FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE && (
            <div className={styles.tableSublabel}>
              {allEqual(row.schedule) ? (
                <Trans i18nKey={'xInstallments'}>
                  x{`${structure.applicable_months.length}`} installments
                </Trans>
              ) : (
                t('installments')
              )}
            </div>
          )}
        </div>
      ),
      tax: <div className={styles.tableRow}>{row.tax ?? ' - '}</div>,
      annualFee: (
        <div className={styles.annualFee}>
          {getAmountFixDecimalWithCurrency(
            row.total_amount,
            instituteInfo.currency
          )}
        </div>
      ),
      modify: structure.fee_type === FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE && (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.feeModuleController_updateCategoryAmount_update
          }
        >
          <div
            onClick={() => handleClick(row)}
            className={styles.modifyStructure}
          >
            {FEE_STRUCTURE.btnTextModify}
          </div>
        </Permission>
      ),
    }))
    tableRows.push({
      feeType: <div className={styles.tableRow}>{t('totalFee')}</div>,
      annualFee: (
        <div className={classNames(styles.annualFee, styles.flexAlignItems)}>
          {getAmountFixDecimalWithCurrency(
            structure.payable_amount,
            instituteInfo.currency
          )}
          <div className={styles.tableSublabel}>{t('annualWithTax')}</div>
        </div>
      ),
    })
  } else {
    tableCols = [
      {
        key: 'amount',
        label: t('amount'),
      },
      {
        key: 'annualFee',
        label: t('totalFeeWithTax'),
      },
      {key: 'modify', label: ' '},
    ]

    tableCols.unshift(
      structure.transport_type !== TRANSPORT_METHODS.WAYPOINT
        ? {key: 'distance', label: t('distance')}
        : {key: 'pickup', label: t('pickOrDropPoint')}
    )

    tableRows = structure.fee_categories.map((row) => {
      let returnObj = {
        amount: (
          <div className={classNames(styles.tableRow, styles.flexAlignItems)}>
            {allEqual(row.schedule)
              ? getAmountFixDecimalWithCurrency(
                  row.amount,
                  instituteInfo.currency
                )
              : t('custom')}
            <div className={styles.tableSublabel}>
              {allEqual(row.schedule) ? (
                <Trans i18nKey={'xInstallments'}>
                  x{`${structure.applicable_months.length}`} installments
                </Trans>
              ) : (
                t('installments')
              )}
            </div>
          </div>
        ),
        annualFee: (
          <div className={styles.annualFee}>
            {getAmountFixDecimalWithCurrency(
              row.total_amount,
              instituteInfo.currency
            )}
          </div>
        ),
        modify: (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.feeModuleController_updateCategoryAmount_update
            }
          >
            <div
              onClick={() => handleClick(row)}
              className={styles.modifyStructure}
            >
              {FEE_STRUCTURE.btnTextModify}
            </div>
          </Permission>
        ),
      }

      if (structure.transport_type === TRANSPORT_METHODS.WAYPOINT) {
        returnObj.pickup = <div className={styles.tableRow}>{row.name}</div>
      } else {
        returnObj.distance = (
          <div className={styles.tableRow}>{row.distance.join(' - ')}</div>
        )
      }
      return returnObj
    })
  }

  return (
    <div
      className={classNames(
        styles.accordian,
        isClassView ? styles.classAccordian : styles.structureAccordian,
        {[styles.active]: toggleAccordian}
      )}
    >
      <div className={styles.label}>
        <div
          className={styles.name}
          onClick={() => setToggleAccordian(!toggleAccordian)}
        >
          {structure.name}
        </div>
        <div className={styles.categoryOptions}>
          {!isClassView && (
            <div className={styles.ellipsisIconStyle}>
              <SubjectTooltipOptions
                subjectItem={structure}
                options={structureActions}
                trigger={
                  <div className={styles.ellipsisIcon}>
                    <Icon name="ellipsisVertical" color="secondary" size="m" />
                  </div>
                }
                handleChange={handleSelectedAction}
              />
            </div>
          )}
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
        <StructureOverview
          isClassView={isClassView}
          structure={structure}
          getClassNames={getClassNames}
        />
        <Table
          className={classNames(styles.table, {
            [styles.recurringStructure]:
              structure.fee_type !== FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE,
          })}
          cols={tableCols}
          rows={tableRows}
        />
      </div>
    </div>
  )
}
