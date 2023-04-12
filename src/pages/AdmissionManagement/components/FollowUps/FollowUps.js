import {useState, useEffect, useMemo} from 'react'
import {useSelector} from 'react-redux'
import {useDispatch} from 'react-redux'
import {DateTime} from 'luxon'
import {Button, SearchBar, TabGroup, BUTTON_CONSTANTS} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import globalActions from '../../../../redux/actions/global.actions'
import DateDropdownFilter from '../Common/DateDropdownFilter/DateDropdownFilter'
import FollowupTable from './FollowupTable'
import {
  useFollowupList,
  useLeadList,
  useCrmInstituteHierarchy,
} from '../../redux/admissionManagement.selectors'
import {
  admissionCrmFollowupStatus,
  followUpsTabIds,
  followUpsTabs,
} from '../../utils/constants'
import styles from './FollowUps.module.css'
import {t} from 'i18next'
import {getSpecificLeadData, getClassName, isAdmin} from '../../utils/helpers'
import {createAndDownloadCSV, JSObjectToCSV} from '../../../../utils/Helpers'
import {events} from '../../../../utils/EventsConstants'

export default function FollowUps() {
  const dispatch = useDispatch()
  const leadlist = useLeadList()
  const followUpList = useFollowupList()
  const instituteHierarchy = useCrmInstituteHierarchy()
  const instituteAdminList = useSelector((state) => state.instituteAdminList)

  const [currentTab, setCurrentTab] = useState(followUpsTabIds.ALL)
  const [searchText, setSearchText] = useState('')
  const [filters, setFilters] = useState({
    startDate: DateTime.now().minus({months: 1}).toSeconds(),
    endDate: DateTime.now().endOf('month').toSeconds(),
  })

  const eventManager = useSelector((state) => state.eventManager)

  const convertDate = (timeStamp) =>
    DateTime.fromSeconds(timeStamp).toFormat('dd LLL, yyyy')

  const convertTime = (timeStamp) =>
    DateTime.fromSeconds(timeStamp).toFormat('hh:mm a')

  const filteredRows = useMemo(() => {
    let rows = []
    followUpList?.data?.forEach((followup) => {
      if (
        followup.followup_timestamp > filters.startDate &&
        followup.followup_timestamp < filters.endDate
      ) {
        rows.push(followup)
      }
    })
    return rows
  }, [filters, followUpList])

  const followUpsTabwiseCount = useMemo(() => {
    let tabwiseCount = {
      [followUpsTabIds.ALL]: 0,
      [followUpsTabIds.MISSED]: 0,
      [followUpsTabIds.PLANNED]: 0,
      [followUpsTabIds.COMPLETED]: 0,
    }
    followUpList?.data?.forEach((followup) => {
      if (
        followup.followup_timestamp > filters.startDate &&
        followup.followup_timestamp < filters.endDate
      ) {
        tabwiseCount[followUpsTabIds.ALL] += 1
        if (followup.status === admissionCrmFollowupStatus.COMPLETED) {
          tabwiseCount[followUpsTabIds.COMPLETED] += 1
        } else if (followup.followup_timestamp < DateTime.now().toSeconds()) {
          tabwiseCount[followUpsTabIds.MISSED] += 1
        } else {
          tabwiseCount[followUpsTabIds.PLANNED] += 1
        }
      }
    })
    return tabwiseCount
  }, [filters, followUpList])

  useEffect(() => {
    dispatch(globalActions.getFollowupList.request())
  }, [])

  if (followUpList?.isLoading) {
    return <div className="loader"></div>
  }

  const tabOptions = Object.values(followUpsTabs).map((tab) => {
    return {...tab, label: `${tab.label} (${followUpsTabwiseCount[tab.id]})`}
  })

  const getTableRows = () => {
    return filteredRows
      ?.filter((item) => {
        if (searchText) {
          const lead = getSpecificLeadData(leadlist?.data ?? [], item.lead_id)
          return !lead
            ? false
            : lead?.profile_data?.name
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
                lead?.profile_data?.last_name
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                lead?.phone_number?.includes(searchText) ||
                lead?.ext_lead_id
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase())
        }
        return true
      })
      ?.filter((lead) => {
        if (currentTab !== followUpsTabIds.ALL) {
          if (currentTab === followUpsTabIds.COMPLETED) {
            return lead.status === followUpsTabIds.COMPLETED
          } else if (currentTab === followUpsTabIds.MISSED) {
            return (
              lead.status !== followUpsTabIds.COMPLETED &&
              lead.followup_timestamp < DateTime.now().toSeconds()
            )
          } else {
            return (
              lead.status !== followUpsTabIds.COMPLETED &&
              lead.followup_timestamp > DateTime.now().toSeconds()
            )
          }
        }
        return true
      })
  }

  const getEventName = (id) => {
    switch (id) {
      case followUpsTabIds.ALL:
        return events.LEAD_FOLLOW_UP_ALL_VIEW_CLICKED_TFI
      case followUpsTabIds.MISSED:
        return events.LEAD_FOLLOW_UP_MISSED_VIEW_CLICKED_TFI
      case followUpsTabIds.PLANNED:
        return events.LEAD_FOLLOW_UP_PLANNED_VIEW_CLICKED_TFI
      case followUpsTabIds.COMPLETED:
        return events.LEAD_FOLLOW_UP_COMPLETED_VIEW_CLICKED_TFI
    }
  }

  const handleTabOption = (id) => {
    eventManager.send_event(getEventName(id))
    setCurrentTab(id)
  }

  const getDownloadList = () => {
    const rows = {
      lead_id: 'Lead Id',
      name: 'Student Name',
      mobile: 'Mobile',
      email: 'Email',
      class: 'Class',
      note: 'Note',
      followup_date: 'Follow-up date',
      created_by: 'Created By',
      status: 'Follow-up Status',
      time: 'Time',
    }
    let download_rows = getTableRows().map((rowData) => {
      const lead = getSpecificLeadData(leadlist?.data, rowData?.lead_id)
      const leadName = lead
        ? `${lead?.profile_data?.name ?? ''} ${
            lead?.profile_data?.last_name ?? ''
          }`
        : null
      return {
        lead_id: rowData.lead_id,
        name: leadName ?? 'Deleted User',
        mobile: lead?.phone_number,
        email: lead?.profile_data?.email,
        class: lead ? getClassName(instituteHierarchy, lead?.class_id) : 'NA',
        note: rowData.note,
        followup_date: convertDate(rowData.followup_timestamp),
        created_by:
          rowData.c_by != null
            ? isAdmin(rowData?.c_by, instituteAdminList)?.full_name
            : '',
        status:
          rowData.status == admissionCrmFollowupStatus.PENDING
            ? parseInt(rowData.followup_timestamp) <
              parseInt(DateTime.now().toSeconds())
              ? 'Missed'
              : 'Planned'
            : 'Completed',
        time: convertTime(rowData.followup_timestamp),
      }
    })
    download_rows.splice(0, 0, rows)
    return download_rows
  }

  const handleDownload = () => {
    eventManager.send_event(events.ADMISSION_REPORT_DOWNLOAD_CLICKED_TFI, {
      screen_name: 'followups',
    })
    const reportName = 'Follow-Up Report'
    createAndDownloadCSV(reportName, JSObjectToCSV([], getDownloadList()))
  }

  return (
    <ErrorBoundary>
      <div className={styles.followUpTabs}>
        <TabGroup
          tabGroupType="secondary"
          tabOptions={tabOptions}
          selectedTab={currentTab}
          onTabClick={({id}) => handleTabOption(id)}
          showMoreTab={false}
        />
        <div
          onClick={() => {
            eventManager.send_event(events.ADMISSION_SORT_FILTER_CLICKED_TFI, {
              screen_name: 'followup_screen',
            })
          }}
          className={styles.followUpTabsInner}
        >
          <DateDropdownFilter
            handleChange={(value) => {
              eventManager.send_event(
                events.ADMISSION_SORT_FILTER_SELECTED_TFI,
                {value: value, screen_name: 'followup_screen'}
              )
              setFilters(value)
            }}
          />
          <Button
            type={BUTTON_CONSTANTS.TYPE.FILLED}
            prefixIcon="download"
            children={t('downloadReportLeadListTransactionFollowup')}
            onClick={handleDownload}
            isDisabled={getTableRows().length === 0}
          />
        </div>
      </div>
      <div className={styles.searchDropdownWrapper}>
        <div className={styles.searchBarWrapper}>
          <SearchBar
            value={searchText}
            handleChange={(e) => setSearchText(e.value)}
            placeholder={t('searchPlaceholder')}
          />
        </div>
      </div>
      <div className={styles.tableStyle}>
        <FollowupTable
          currentTab={currentTab}
          tableRows={getTableRows()}
          searchText={searchText}
        />
      </div>
    </ErrorBoundary>
  )
}
