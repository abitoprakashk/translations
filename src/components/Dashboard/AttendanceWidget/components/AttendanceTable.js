import React, {useEffect, useMemo, useState} from 'react'
import {Modal, TabGroup} from '@teachmint/krayon'
import styles from './AttendanceGraph.module.css'
import useTeacherList from '../../../../pages/AttendanceReport/pages/Overview/hooks/useTeacherList'
import {
  ATTENDANCE_WIDGET_TABLE_OPTIONS,
  ATTENDANCE_WIDGET_TABS,
  EmptyData,
} from '../constants'
import MarkedTable from './MarkedTable'
import NotMarkedTable from './NotMarkedTable'
import {events} from '../../../../utils/EventsConstants'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {DateTime} from 'luxon'

const AttendanceTable = ({
  rowsMarked,
  rowsNotMarked,
  showTable,
  setShowTable,
  tableRowsMarked,
  tableRowsNotMarked,
  rows,
  error,
  setTableData,
  dateIndex,
  dateRangeArray,
  filledData,
  setDateIndex,
}) => {
  const [filteredListMarked, setfilteredListMarked] = useState([])
  const [pendingClassTeachersId, setPendingClassTeachersId] = useState([])
  const [filteredListNotMarked, setfilteredListNotMarked] = useState([])
  const [formattedDate, setFormattedDate] = useState('')

  const [selectedTab, setSelectedTab] = useState(
    ATTENDANCE_WIDGET_TABS.NOT_MARKED
  )
  const {sectionTeacherData} = useTeacherList()
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)

  const getPendingClassTeachersId = () => {
    let allTeachersIDAll = sectionTeacherData?.map((item) => item.teacherID)
    let allTeachersID = allTeachersIDAll?.filter((item) => item !== undefined)
    let tempArray = filterNotMarked?.map((item) => {
      if (allTeachersID.includes(item[0].teacherID)) return item[0].teacherID
    })
    let filteredTemp = tempArray?.filter((item) => item !== undefined)
    if (Array.isArray(filteredTemp)) {
      setPendingClassTeachersId([...filteredTemp])
    } else {
      return
    }
  }

  let filterMarked = tableRowsMarked?.map((id) =>
    sectionTeacherData?.filter((item) => item.id === id)
  )
  let filterNotMarked = tableRowsNotMarked?.map((id) =>
    sectionTeacherData?.filter((item) => item.id === id)
  )

  const ATTENDANCE_WIDGET_TABLE_OPTIONS_TRANSALATED = useMemo(
    () =>
      ATTENDANCE_WIDGET_TABLE_OPTIONS.map(({id, label}) => {
        return {id: id, label: t(label)}
      }),
    [ATTENDANCE_WIDGET_TABLE_OPTIONS]
  )

  const getReadableTimeFormatter = (date) => {
    const dateFormat = 'dd LLL yyyy'
    const utc = new Date(date)
    const formattedDateTemp = DateTime.fromJSDate(utc).toFormat(dateFormat)
    if (formattedDateTemp === 'Invalid DateTime') {
      setFormattedDate('')
    } else {
      setFormattedDate(formattedDateTemp)
    }
  }
  useEffect(() => {
    setfilteredListMarked(filterMarked?.map((item) => item[0]))
    setfilteredListNotMarked(filterNotMarked?.map((item) => item[0]))
    getPendingClassTeachersId()
    getReadableTimeFormatter(filledData[dateIndex]?.day)
  }, [sectionTeacherData, showTable, dateIndex])

  return (
    <Modal
      isOpen={showTable}
      onClose={() => {
        setTableData({...EmptyData})
        setPendingClassTeachersId([])
        setfilteredListMarked([])
        setfilteredListNotMarked([])
        setDateIndex(6)
        setSelectedTab(ATTENDANCE_WIDGET_TABS.NOT_MARKED)
        setShowTable(false)
      }}
      header={`${t('classAttendance')}  ${formattedDate || ''}`}
      classes={{
        header: styles.tableHeader,
        content: styles.tableContent,
        modal: styles.tableModal,
      }}
    >
      <div
        className={styles.tabGroup}
        onClick={() =>
          eventManager.send_event(
            events.STUDENT_ATTENDANCE_REPORT_STATUS_CLICKED_TFI,
            {
              type: selectedTab === 'MARKED' ? 'not_marked' : 'marked',
              screen_name: 'dashboard',
              no_of_classes_marked_attendance:
                rowsMarked || tableRowsMarked?.length || 0,
              no_of_classes_not_marked_attendance:
                rowsNotMarked || tableRowsNotMarked?.length || 0,
            }
          )
        }
      >
        <TabGroup
          onTabClick={(tab) => setSelectedTab(tab.id)}
          selectedTab={selectedTab}
          showMoreTab={false}
          tabOptions={ATTENDANCE_WIDGET_TABLE_OPTIONS_TRANSALATED}
        />
      </div>
      <div className={styles.tableContainer}>
        {selectedTab === ATTENDANCE_WIDGET_TABS.MARKED ? (
          <MarkedTable
            tableRowsMarked={filteredListMarked}
            rows={rows}
            error={error}
            dateIndex={dateIndex}
            dateRangeArray={dateRangeArray}
          />
        ) : (
          <NotMarkedTable
            tableRowsNotMarked={filteredListNotMarked}
            rows={rows}
            teachersIdNotMarkedClasses={pendingClassTeachersId}
            error={error}
            setShowTable={setShowTable}
            dateIndex={dateIndex}
            dateRangeArray={dateRangeArray}
            rowsMarked={rowsMarked}
            formattedDate={formattedDate}
          />
        )}
      </div>
    </Modal>
  )
}

export default AttendanceTable
