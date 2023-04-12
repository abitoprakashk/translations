import {Modal, MODAL_CONSTANTS} from '@teachmint/krayon'
import React, {useState} from 'react'
import styles from './FilterModal.module.css'
import Header from './components/Header'
import FilterList from './components/FilterList'
import FilterDetail from './components/FilterDetail'
import {useDispatch, useSelector} from 'react-redux'
import {FILTER_LIST} from '../../../classroom-reports/constant/classroomReport.constant'
import useInstituteHeirarchy from '../../pages/StudentWiseAttendance/hooks/useInstituteHeirarchy'
import {
  ATTENDANCE_FILTER,
  DEFAULT_MARKED_FILTER,
} from '../../AttendanceReport.constant'
import classNames from 'classnames'
import useSendEvent from '../../hooks/useSendEvent'
import {
  STUDENT_ATTENDANCE_ALL_FILTERS_CLEARED,
  STUDENT_ATTENDANCE_COHORT_FILTER_APPLIED,
} from '../../AttendanceReport.events.constant'

function FilterModal({
  onClose,
  isOpen,
  reducerKey,
  setFilterData,
  setAttendance,
  source,
  hidemarkFilter,
  hideClassNSection,
}) {
  const dispatch = useDispatch()
  const sendEvent = useSendEvent()
  const [filterList, setfilterList] = useState(
    hidemarkFilter
      ? {
          [Object.keys(FILTER_LIST)[0]]: Object.values(FILTER_LIST)[0],
        }
      : hideClassNSection
      ? {
          [Object.keys(FILTER_LIST)[1]]: {
            ...Object.values(FILTER_LIST)[1],
            isSelected: true,
          },
        }
      : FILTER_LIST
  )
  const {
    heirarchy: prevHeirarchy,
    markFilter: prevMarkFilter,
    attendanceFilter: prevAttendanceFilter,
    ...otherData
  } = useSelector(
    (state) => state.attendanceReportReducer[reducerKey].filterData
  )
  const {heirarchy, handleSelection, setHeirarchy} = useInstituteHeirarchy({
    allSelected: true,
    setData: prevHeirarchy,
  })
  const {heirarchy: allSelectedClass} = useInstituteHeirarchy({
    allSelected: true,
  })
  const [markFilter, setmarkFilter] = useState(prevMarkFilter)
  const [attendanceFilter, setAttendanceFilter] = useState(prevAttendanceFilter)

  const handleClear = () => {
    setHeirarchy(allSelectedClass)
    setmarkFilter(DEFAULT_MARKED_FILTER)
    setAttendanceFilter(setAttendance ? ATTENDANCE_FILTER : null)
    sendEvent(STUDENT_ATTENDANCE_ALL_FILTERS_CLEARED, {
      btn_src: source,
    })
  }

  const onApplyFilter = () => {
    dispatch(
      setFilterData({
        ...otherData,
        heirarchy,
        markFilter,
        attendanceFilter,
      })
    )
    onClose()
    sendEvent(STUDENT_ATTENDANCE_COHORT_FILTER_APPLIED, {
      btn_src: source,
      attendance: setAttendance ? attendanceFilter : markFilter,
      heirarchy: heirarchy,
    })
  }

  return (
    <div>
      <Modal
        classes={{
          modal: classNames(styles.modal, styles.interFont),
          footer: styles.modalFooter,
        }}
        isOpen={isOpen}
        onClose={onClose}
        size={MODAL_CONSTANTS.SIZE.MEDIUM}
        actionButtons={[
          // {
          //   body: 'Reset',
          //   onClick: handleClear,
          //   type: 'outline',
          // },
          {
            body: 'Apply Filters',
            onClick: onApplyFilter,
          },
        ]}
      >
        <Header onClose={onClose} />
        <div className={classNames(styles.filterWrapper)}>
          <FilterList
            reducerKey={reducerKey}
            filterList={filterList}
            setfilterList={setfilterList}
          />
          <FilterDetail
            setAttendance={setAttendance}
            markFilter={markFilter}
            setmarkFilter={setmarkFilter}
            setAttendanceFilter={setAttendanceFilter}
            attendanceFilter={attendanceFilter}
            onApplyFilter={onApplyFilter}
            heirarchy={heirarchy}
            handleSelection={handleSelection}
            handleClear={handleClear}
            filterList={filterList}
            setHeirarchy={setHeirarchy}
          />
        </div>
      </Modal>
    </div>
  )
}

export default FilterModal
