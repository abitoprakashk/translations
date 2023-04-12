import {
  ALERT_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Table,
} from '@teachmint/krayon'
import {t} from 'i18next'
import {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {
  showErrorOccuredAction,
  showErrorToast,
} from '../../../../redux/actions/commonAction'
import {getAmountFixDecimalWithCurrency} from '../../../../utils/Helpers'
import {checkNonDueTransactions} from '../../api/apiService'
import ImportValidationAlert from '../ImportValidationAlert/ImportValidationAlert'
import {TABLE_COLUMNS} from './constants'
import styles from './FeeStructure.module.css'
import {getDueDates, getHierarchyGroups, validateFeeImport} from './utils'

const FeeStructure = ({
  feeStructures,
  sourceSession,
  toggleLoader,
  instituteHierarchy,
  targetSession,
  onEditSession,
  setEnableSessionTransfer,
}) => {
  const dispatch = useDispatch()
  const [feeValidations, setFeeValidations] = useState({})

  const feeValidation = validateFeeImport(
    feeStructures,
    feeValidations,
    targetSession
  )

  useEffect(() => {
    setEnableSessionTransfer(feeValidation?.type !== ALERT_CONSTANTS.TYPE.ERROR)
  }, [feeValidation])

  useEffect(() => {
    toggleLoader()
    checkNonDueTransactions(targetSession._id)
      .then((response) => {
        if (!response.status) {
          dispatch(showErrorToast(t('genericErrorMessage')))
        }
        setFeeValidations(response.obj || {})
      })
      .catch((_err) => {
        dispatch(showErrorOccuredAction(true))
      })
      .finally(toggleLoader)
  }, [])

  return (
    <div>
      <ImportValidationAlert
        feeValidation={feeValidation}
        handleEditSession={() => onEditSession(targetSession)}
      />
      <div className={styles.spaceBetween}>
        <div className={styles.contentTitle}>
          {t('importFeeStructureTitle')}
        </div>
        <div className={styles.sessionLabel}>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {t('importingFromLabel')}
          </Para>
          <span>{sourceSession.name}</span>
        </div>
      </div>
      <div>
        <Table
          cols={TABLE_COLUMNS}
          classes={{table: styles.table}}
          rows={getTableRows(feeStructures, instituteHierarchy)}
        />
      </div>
    </div>
  )
}

const getTableRows = (feeStructures, instituteHierarchy) => {
  return feeStructures.map((structure) => ({
    name: (
      <div>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
        >
          {structure.name}
        </Para>
        <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{structure.type}</Para>
      </div>
    ),
    classes: (
      <Sections
        instituteHierarchy={instituteHierarchy}
        selectedNodeIds={structure.assigned_to}
      />
    ),
    dueDate: getDueDates(structure),
    feeAmount: getAmountFixDecimalWithCurrency(structure.amount),
  }))
}

const Sections = ({instituteHierarchy, selectedNodeIds, maxNumToShow = 2}) => {
  const sections = Object.values(
    getHierarchyGroups(instituteHierarchy, new Set(selectedNodeIds))
  )

  if (sections.length <= maxNumToShow) {
    return <div className={styles.sectionsCell}>{sections.join(', ')}</div>
  }

  const truncatedWords = sections.slice(0, maxNumToShow)
  const remainingWords = sections.slice(maxNumToShow)

  return (
    <div className={styles.sectionsCell}>
      <span>{truncatedWords.join(', ')}</span>
      <Button type={BUTTON_CONSTANTS.TYPE.TEXT} title={remainingWords}>
        +{remainingWords.length}
      </Button>
    </div>
  )
}

export default FeeStructure
