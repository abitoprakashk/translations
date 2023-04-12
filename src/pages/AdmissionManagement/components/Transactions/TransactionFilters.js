import {ErrorBoundary} from '@teachmint/common'
import {
  Divider,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'
import {useCrmInstituteHierarchy} from '../../redux/admissionManagement.selectors'
import InstituteHierarchy, {
  INSTITUTE_HIERARCHY_TYPES,
} from '../Common/InstituteHierarchy/InstituteHierarchy'
import OtherFilters from './OtherFilters'
import styles from './TransactionFilters.module.css'

export default function TransactionFilters({
  showOtherFilters,
  setShowOtherFilters,
  filterData,
  setFilterData,
}) {
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)
  const instituteHierarchy = useCrmInstituteHierarchy()
  const [showModal, setShowModal] = useState(showOtherFilters)
  const [selectedCard, setSelectedCard] = useState('classFilter')
  const [localFilter, setLocalFilter] = useState(filterData)

  const toggleModal = () => {
    setShowModal((show) => !show)
    setShowOtherFilters(!showOtherFilters)
  }

  const handleHierarchyChange = (selectedNodes) => {
    const selectedClasses = Object.values(selectedNodes)
      .filter((node) => node.type === INSTITUTE_HIERARCHY_TYPES.STANDARD)
      .map((standard) => standard.id)
    setLocalFilter({...filterData, classes: selectedClasses})
  }

  const filtersData = {
    classFilter: {
      id: 'classFilter',
      label: t('feesFormTableFieldClass'),
    },
    otherFilters: {
      id: 'otherFilters',
      label: t('kanbanBoardFilterTabOtherFilters'),
    },
  }

  const handleApplyFilter = () => {
    eventManager.send_event(
      events.ADMISSION_TRANSACTION_APPLY_FILTER_CLICKED_TFI,
      {
        class: localFilter.classes,
        fee_type: localFilter.feeTypes,
        payment_mode: localFilter.paymentModes,
        payment_status: localFilter.paymentStatus,
      }
    )
    setFilterData(localFilter)
    setShowOtherFilters(!showOtherFilters)
  }

  const handleClearFilter = () => {
    setFilterData({
      classes: [],
      feeTypes: [],
      paymentModes: [],
      paymentStatus: [],
    })
    setShowOtherFilters(!showOtherFilters)
  }

  return (
    <Modal
      header={t('addFilter')}
      isOpen={showModal}
      onClose={toggleModal}
      size={MODAL_CONSTANTS.SIZE.MEDIUM}
      classes={{content: styles.noPadding}}
      actionButtons={[
        {
          onClick: handleClearFilter,
          body: t('clear'),
          type: 'outline',
        },
        {
          onClick: handleApplyFilter,
          body: t('transactionFilterApply'),
        },
      ]}
    >
      <div className={styles.displayData}>
        <div className={styles.leftMenuBar}>
          {Object.values(filtersData).map((filter) => {
            return (
              <>
                <div
                  className={classNames(
                    styles.mainContainer,
                    selectedCard === filter.id ? styles.active : ''
                  )}
                  onClick={() => setSelectedCard(filter.id)}
                >
                  <span className={styles.filterFont}>{filter.label}</span>
                  <Icon
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                    name={'forwardArrow'}
                    className={styles.iconStyles}
                    type={
                      selectedCard === filter.id
                        ? ICON_CONSTANTS.TYPES.PRIMARY
                        : ICON_CONSTANTS.TYPES.SECONDARY
                    }
                  />
                </div>
              </>
            )
          })}
        </div>
        <Divider isVertical={true} classes={{wrapper: styles.dividerPadding}} />
        <div className={styles.subContainer}>
          <ErrorBoundary>
            {selectedCard === 'classFilter' && (
              <div className={styles.classFilter}>
                <InstituteHierarchy
                  instituteHierarchy={instituteHierarchy}
                  handleChange={handleHierarchyChange}
                  selectedIds={localFilter.classes}
                />
              </div>
            )}
            {selectedCard === 'otherFilters' && (
              <OtherFilters
                filterData={localFilter}
                setFilterData={setLocalFilter}
              />
            )}
          </ErrorBoundary>
        </div>
      </div>
    </Modal>
  )
}
