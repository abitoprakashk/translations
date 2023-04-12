import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  BUTTON_CONSTANTS,
  Checkbox,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import styles from './passengersFilterModal.module.css'
import {PASSENGER_FILTER_IDS, PASSENGER_FILTER_OPTIONS} from '../../constants'

export default function PassengersFilterModal({
  showModal,
  setShowModal,
  appliedFilters,
  handleFiltersChange,
}) {
  const [filters, setFilters] = useState({})
  const [selectedFilterTab, setSelectedFilterTab] = useState(
    PASSENGER_FILTER_IDS.STOPS
  )

  const {t} = useTranslation()

  // const eventManager = useSelector((state) => state?.eventManager)

  const transportStopsData = useSelector(
    (state) => state?.globalData?.transportStops?.data
  )
  const transportRoutesData = useSelector(
    (state) => state?.globalData?.transportRoutes?.data
  )

  const handleFilterChange = (filterTabID, value, isSelected) => {
    let newFilter = {...filters}
    if (isSelected) {
      newFilter[filterTabID].add(value)
    } else {
      newFilter[filterTabID].delete(value)
    }
    setFilters(newFilter)
  }

  const filterIdContentMap = {
    [PASSENGER_FILTER_IDS.STOPS]: transportStopsData,
    [PASSENGER_FILTER_IDS.ROUTES]: transportRoutesData,
  }
  const onApplyFilters = () => {
    handleFiltersChange({
      pickup_point_ids: [...filters[PASSENGER_FILTER_IDS.STOPS]],
      route_ids: [...filters[PASSENGER_FILTER_IDS.ROUTES]],
    })
    setShowModal(false)
  }

  const onClearAll = () => {
    setFilters({
      [PASSENGER_FILTER_IDS.STOPS]: new Set(),
      [PASSENGER_FILTER_IDS.ROUTES]: new Set(),
    })
    handleFiltersChange({})
    setShowModal(false)
  }

  const onModalClose = () => {
    setShowModal(false)
  }

  const getFilterTabContent = (filterTabID) => {
    let data = filterIdContentMap[filterTabID]
    return (
      <div className={styles.filterOptions}>
        {data?.map((obj) => {
          return (
            <div key={obj._id}>
              <Checkbox
                fieldName={obj._id}
                handleChange={(e) =>
                  handleFilterChange(filterTabID, e.fieldName, e.value)
                }
                isSelected={filters?.[filterTabID]?.has(obj._id)}
                label={
                  <Para
                    type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                    weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                  >
                    {obj.name}
                  </Para>
                }
              />
            </div>
          )
        })}
      </div>
    )
  }

  useEffect(() => {
    let initialFilters = {
      [PASSENGER_FILTER_IDS.STOPS]: new Set(
        appliedFilters?.pickup_point_ids || []
      ),
      [PASSENGER_FILTER_IDS.ROUTES]: new Set(appliedFilters?.route_ids || []),
    }
    setFilters(initialFilters)
  }, [])

  return (
    <Modal
      isOpen={showModal}
      header={t('filters')}
      size={MODAL_CONSTANTS.SIZE.MEDIUM}
      onClose={onModalClose}
      classes={{content: styles.modalContent}}
      actionButtons={[
        {
          onClick: onClearAll,
          body: t('clearAll'),
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
        },
        {
          onClick: onApplyFilters,
          body: t('applyFilter'),
        },
      ]}
    >
      <div className={styles.filterTabsWrapper}>
        {PASSENGER_FILTER_OPTIONS?.map((filter) => {
          return (
            <div
              key={filter.id}
              className={styles.filterTab}
              onClick={() => setSelectedFilterTab(filter.id)}
            >
              <Para
                weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                type={
                  selectedFilterTab === filter.id
                    ? PARA_CONSTANTS.TYPE.PRIMARY
                    : PARA_CONSTANTS.TYPE.TEXT_SECONDARY
                }
              >
                {filter.label}
              </Para>
              <Icon
                name="chevronRight"
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                type={
                  selectedFilterTab === filter.id
                    ? ICON_CONSTANTS.TYPES.PRIMARY
                    : ICON_CONSTANTS.TYPES.SECONDARY
                }
              />
            </div>
          )
        })}
      </div>
      <div className={styles.filterOptionsWrapper}>
        {getFilterTabContent(selectedFilterTab)}
      </div>
    </Modal>
  )
}
