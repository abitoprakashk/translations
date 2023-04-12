import classNames from 'classnames'
import React from 'react'
import ClassHeirarchy from '../../ClassHeirarchy/ClassHeirarchy'
import styles from '../FilterModal.module.css'
import AttendanceFilterUI from './AttendanceFilterUI'
import FilterMarked from './FilterMarked'

function FilterDetail({
  filterList,
  heirarchy,
  handleSelection,
  handleClear,
  markFilter,
  setmarkFilter,
  setAttendance,
  setAttendanceFilter,
  attendanceFilter,
}) {
  return (
    <div
      className={classNames({
        [styles.filterDetailsWrapper]: true,
        [styles.noPadding]: filterList?.['CLASS_N_SECTION']?.isSelected,
        'show-scrollbar': true,
        'show-scrollbar-small': true,
      })}
    >
      <div className={styles.filterDetail}>
        {filterList?.['CLASS_N_SECTION']?.isSelected ? (
          <div>
            <ClassHeirarchy
              classes={{
                wrapper: styles.heirarchyWrapper,
                accordionHeader: styles.accordionHeader,
                accordionWrapper: styles.accordionWrapper,
                accordionBody: styles.accordionBody,
              }}
              heirarchy={heirarchy}
              onClear={handleClear}
              handleSelection={handleSelection}
            />
          </div>
        ) : setAttendance ? (
          <AttendanceFilterUI
            setAttendanceFilter={setAttendanceFilter}
            attendanceFilter={attendanceFilter}
          />
        ) : (
          <FilterMarked markFilter={markFilter} setmarkFilter={setmarkFilter} />
        )}
      </div>
    </div>
  )
}

export default FilterDetail
