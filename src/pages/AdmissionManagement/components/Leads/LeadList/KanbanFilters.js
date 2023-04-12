import {useState} from 'react'
import {useSelector} from 'react-redux'
import {t} from 'i18next'
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
import styles from './KanbanFilters.module.css'
import {
  defaultKanbanBoardFilters,
  kanbanBoardFilterTabIds,
  kanbanBoardFilterTabs,
  kanbanBoardOtherFilterOptionValues,
} from '../../../utils/constants'
import InstituteHierarchy, {
  INSTITUTE_HIERARCHY_TYPES,
} from '../../Common/InstituteHierarchy/InstituteHierarchy'
import {events} from '../../../../../utils/EventsConstants'
import {useCrmInstituteHierarchy} from '../../../redux/admissionManagement.selectors'

export default function KanbanFilters({
  filters,
  setFilters,
  showFilterModal,
  setShowFilterModal,
}) {
  const instituteHierarchy = useCrmInstituteHierarchy()
  const [localFilters, setLocalFilters] = useState(filters)
  const [currentFilterTab, setCurrentFilterTab] = useState(
    kanbanBoardFilterTabIds.CLASSES
  )
  const eventManager = useSelector((state) => state.eventManager)

  const kanbanBoardOtherFilterOptions = [
    {
      label: t('kanbanBoardOtherFilterOptionEnquiryType'),
      filterKey: 'enquiryType',
      options: [
        {
          label: t('kanbanBoardOtherFilterOptionEnquiryTypeOnline'),
          value: kanbanBoardOtherFilterOptionValues.ONLINE,
        },
        {
          label: t('kanbanBoardOtherFilterOptionEnquiryTypeOffline'),
          value: kanbanBoardOtherFilterOptionValues.OFFLINE,
        },
      ],
    },
    {
      label: t('kanbanBoardOtherFilterOptionAdmissionFormStatus'),
      filterKey: 'admissionFormStatus',
      options: [
        {
          label: t('kanbanBoardOtherFilterOptionAdmissionFormStatusIncomplete'),
          value: kanbanBoardOtherFilterOptionValues.INCOMPLETE,
        },
        {
          label: t('kanbanBoardOtherFilterOptionAdmissionFormStatusComplete'),
          value: kanbanBoardOtherFilterOptionValues.COMPLETED,
        },
      ],
    },
    {
      label: t('kanbanBoardOtherFilterOptionFormFee'),
      filterKey: 'formFee',
      options: [
        {
          label: t('kanbanBoardOtherFilterOptionFormFeePaid'),
          value: kanbanBoardOtherFilterOptionValues.PAID,
        },
        {
          label: t('kanbanBoardOtherFilterOptionFormFeeNotPaid'),
          value: kanbanBoardOtherFilterOptionValues.NOT_PAID,
        },
      ],
    },
    {
      label: t('kanbanBoardOtherFilterOptionAdmissionFee'),
      filterKey: 'admissionFee',
      options: [
        {
          label: t('kanbanBoardOtherFilterOptionAdmissionFeePaid'),
          value: kanbanBoardOtherFilterOptionValues.PAID,
        },
        {
          label: t('kanbanBoardOtherFilterOptionAdmissionFeeNotPaid'),
          value: kanbanBoardOtherFilterOptionValues.NOT_PAID,
        },
      ],
    },
  ]

  const handleAddFilter = () => {
    eventManager.send_event(events.ADMISSION_LEAD_APPLY_FILTER_CLICKED_TFI, {
      filterData: localFilters,
    })
    setFilters(localFilters)
    setShowFilterModal(false)
  }

  const handleClearFilter = () => {
    setShowFilterModal(false)
    setFilters(defaultKanbanBoardFilters)
  }

  const handleFilterChange = (filterKey, value, isChecked) => {
    let fieldValue
    if (isChecked) {
      fieldValue = [...localFilters[filterKey]]
      fieldValue.push(value)
    } else {
      fieldValue = [...localFilters[filterKey]].filter((v) => v !== value)
    }
    setLocalFilters({...localFilters, [filterKey]: fieldValue})
  }

  const handleHierarchyChange = (selectedNodes) => {
    const selectedClasses = Object.values(selectedNodes)
      .filter((node) => node.type === INSTITUTE_HIERARCHY_TYPES.STANDARD)
      .map((standard) => standard.id)
    setLocalFilters({...localFilters, classes: selectedClasses})
  }

  return (
    <Modal
      isOpen={showFilterModal}
      header={t('addFilter')}
      size={MODAL_CONSTANTS.SIZE.MEDIUM}
      onClose={() => setShowFilterModal(false)}
      classes={{content: styles.noPadding}}
      actionButtons={[
        {
          onClick: handleClearFilter,
          body: t('clearAll'),
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
        },
        {
          onClick: handleAddFilter,
          body: t('applyFilter'),
        },
      ]}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalSidebar}>
          {Object.values(kanbanBoardFilterTabs).map((filter) => {
            return (
              <div
                key={filter.id}
                className={styles.sidebarOption}
                onClick={() => setCurrentFilterTab(filter.id)}
              >
                <Para
                  weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                  type={
                    currentFilterTab === filter.id
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
                    currentFilterTab === filter.id
                      ? ICON_CONSTANTS.TYPES.PRIMARY
                      : ICON_CONSTANTS.TYPES.SECONDARY
                  }
                />
              </div>
            )
          })}
        </div>
        <div className={styles.modalSidebarContent}>
          {currentFilterTab === kanbanBoardFilterTabIds.CLASSES &&
            showFilterModal && (
              <InstituteHierarchy
                instituteHierarchy={instituteHierarchy}
                selectedIds={localFilters.classes}
                handleChange={handleHierarchyChange}
              />
            )}
          {currentFilterTab === kanbanBoardFilterTabIds.OTHER_FILTERS && (
            <div>
              {kanbanBoardOtherFilterOptions.map((filter) => {
                return (
                  <div key={filter.value} className={styles.filterOption}>
                    <Para
                      type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                      weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                    >
                      {filter.label}
                    </Para>
                    <div className={styles.filterOptionValues}>
                      {filter.options.map((filterOption) => {
                        return (
                          <div key={filterOption.value}>
                            <Checkbox
                              fieldName={filterOption.value}
                              handleChange={(e) =>
                                handleFilterChange(
                                  filter.filterKey,
                                  e.fieldName,
                                  e.value
                                )
                              }
                              isSelected={localFilters[
                                filter.filterKey
                              ].includes(filterOption.value)}
                              label={
                                <Para
                                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                                  weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                                >
                                  {filterOption.label}
                                </Para>
                              }
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
