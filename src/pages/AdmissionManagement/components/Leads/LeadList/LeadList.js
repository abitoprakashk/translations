import {useMemo, useState} from 'react'
import {useSelector} from 'react-redux'
import {t} from 'i18next'
import {
  Button,
  BUTTON_CONSTANTS,
  Chips,
  Para,
  SearchBar,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import KanbanFilters from './KanbanFilters'
import KanbanBoard from './KanbanBoard'
import styles from './LeadList.module.css'
import {
  useAdmissionCrmSettings,
  useCrmInstituteHierarchy,
  useLeadList,
} from '../../../redux/admissionManagement.selectors'
import {
  defaultKanbanBoardFilters,
  kanbanBoardFilterChipsLabel,
  kanbanBoardOtherFilterOptionlabels,
  kanbanBoardOtherFilterOptionValues,
} from '../../../utils/constants'
import DateDropdownFilter from '../../Common/DateDropdownFilter/DateDropdownFilter'
import AddLeadDropdown from '../AddLeadDropdown'
import DownloadReportButton from './DownloadReportButton'
import {events} from '../../../../../utils/EventsConstants'

export default function LeadList() {
  const leadList = useLeadList()
  const admissionCrmSettings = useAdmissionCrmSettings()
  const instituteHierarchy = useCrmInstituteHierarchy()
  const [searchText, setSearchText] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filters, setFilters] = useState(defaultKanbanBoardFilters)
  const eventManager = useSelector((state) => state.eventManager)

  const classes = useMemo(() => {
    let classes = {}
    instituteHierarchy?.children.forEach((department) => {
      department?.children.forEach((standard) => {
        classes[standard.id] = `${t('class')} ${standard.name}`
      })
    })
    return classes
  }, [])

  const isFilterApplied =
    filters.classes.length > 0 ||
    filters.enquiryType.length > 0 ||
    filters.admissionFormStatus.length > 0 ||
    filters.formFee.length > 0 ||
    filters.admissionFee.length > 0

  const filteredLeadList = useMemo(() => {
    // Default filter leads based on date range
    let filteredLeadList = leadList?.data?.filter(
      (lead) =>
        lead.c >= filters.dateRange.startDate &&
        lead.c <= filters.dateRange.endDate
    )
    if (searchText) {
      const search = searchText.toLowerCase()
      filteredLeadList = filteredLeadList.filter(
        (lead) =>
          lead?.ext_lead_id?.toLowerCase().includes(search) ||
          lead?.phone_number?.toLowerCase().includes(search) ||
          lead?.profile_data?.name?.toLowerCase().includes(search) ||
          lead?.profile_data?.last_name?.toLowerCase().includes(search)
      )
    }
    if (isFilterApplied) {
      if (filters.classes.length > 0) {
        filteredLeadList = filteredLeadList.filter((lead) =>
          filters.classes.includes(lead.class_id)
        )
      }
      if (filters.enquiryType.length > 0) {
        filteredLeadList = filteredLeadList.filter((lead) =>
          filters.enquiryType.includes(lead.lead_from)
        )
      }
      if (filters.admissionFormStatus.length > 0) {
        filteredLeadList = filteredLeadList.filter((lead) =>
          filters.admissionFormStatus.includes(lead.status_adm_form)
        )
      }
      if (filters.formFee.length > 0) {
        filteredLeadList = filteredLeadList.filter((lead) =>
          filters.formFee.includes(
            lead.status_form_fee === 'PENDING'
              ? kanbanBoardOtherFilterOptionValues.NOT_PAID
              : lead.status_form_fee
          )
        )
      }
      if (filters.admissionFee.length > 0) {
        filteredLeadList = filteredLeadList.filter((lead) =>
          filters.admissionFee.includes(
            lead.status_adm_fee === 'PENDING'
              ? kanbanBoardOtherFilterOptionValues.NOT_PAID
              : lead.status_adm_fee
          )
        )
      }
    }
    return filteredLeadList
  }, [filters, searchText, leadList?.data])

  const renderFilterChip = (filterKey, chipList) => {
    return (
      <Chips
        className={styles.chipUnsetMargin}
        onChange={(id) =>
          setFilters({
            ...filters,
            [filterKey]: filters[filterKey].filter((item) => item !== id),
          })
        }
        chipList={chipList.map((chip) => {
          return {
            id: chip,
            label:
              filterKey === 'classes'
                ? classes[chip]
                : kanbanBoardOtherFilterOptionlabels[chip],
          }
        })}
      />
    )
  }

  const renderChips = () => (
    <div className={styles.filteredChips}>
      {Object.keys(filters).map((filter) => {
        if (
          Array.isArray(filters[filter])
            ? filters[filter].length > 0
            : filters[filter]
        ) {
          return (
            <>
              {filter !== 'dateRange' && (
                <div key={filter} className={styles.filterItem}>
                  <Para>{kanbanBoardFilterChipsLabel[filter]}</Para>
                  <div>{renderFilterChip(filter, filters[filter])}</div>
                </div>
              )}
            </>
          )
        }
      })}
      <Button
        children={t('clearAll')}
        type={BUTTON_CONSTANTS.TYPE.TEXT}
        category={BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE}
        classes={{button: styles.btnClass}}
        onClick={() => setFilters(defaultKanbanBoardFilters)}
      />
    </div>
  )

  const handleFilterClick = () => {
    setShowFilterModal(true)
    eventManager.send_event(events.ADMISSION_LEAD_LIST_FILTER_CLICKED_TFI)
  }

  return (
    <div>
      {showFilterModal && (
        <KanbanFilters
          filters={filters}
          setFilters={setFilters}
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
        />
      )}
      <div className={styles.kanbanSearchFilterSection}>
        <SearchBar
          value={searchText}
          showSuggestion={false}
          classes={{wrapper: styles.searchBar}}
          handleChange={({value}) => setSearchText(value)}
          placeholder={t('leadListSearchPlaceholderText')}
        />
        <div className={styles.kanbanFilterSection}>
          <div
            onClick={() => {
              eventManager.send_event(
                events.ADMISSION_SORT_FILTER_CLICKED_TFI,
                {
                  screen_name: 'lead_list',
                }
              )
            }}
          >
            <DateDropdownFilter
              handleChange={(value) => {
                eventManager.send_event(
                  events.ADMISSION_SORT_FILTER_SELECTED_TFI,
                  {value: value, screen_name: 'lead_list'}
                )
                setFilters({
                  ...filters,
                  dateRange: value,
                })
              }}
            />
          </div>
          <Button
            onClick={handleFilterClick}
            prefixIcon="filter"
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
          >
            {t('leadListFiltersPlaceholderText')}
          </Button>
          <DownloadReportButton filteredLeadList={filteredLeadList} />
          <AddLeadDropdown />
        </div>
      </div>
      {isFilterApplied && (
        <div className={styles.filterChipsSection}>{renderChips()}</div>
      )}
      <ErrorBoundary>
        <KanbanBoard
          stages={Object.values(admissionCrmSettings?.data?.lead_stages)}
          filteredLeads={filteredLeadList}
        />
      </ErrorBoundary>
    </div>
  )
}
