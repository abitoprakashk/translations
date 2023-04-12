import React from 'react'
import styles from './TodaysAttendanceSection.module.css'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
import {useMemo} from 'react'
import {t} from 'i18next'

function TodaysAttendanceSection({
  isAttendanceAvailable,
  attendanceData,
  selectedSlot,
}) {
  const instituteHierarchy = useSelector((state) => state.instituteHierarchy)

  const inactiveClasses = useMemo(() => {
    const classes = []
    instituteHierarchy?.children
      .filter((ele) => ele.type === 'DEPARTMENT')
      .forEach(({children}) =>
        children.forEach(({name, status}) => {
          if (status === 2) classes.push(name)
        })
      )
    return classes
  }, [instituteHierarchy])

  const insightItems = []

  let greaterThan75 = 0,
    notMarked = 0,
    lessThan75 = 0,
    totalStudents = 0,
    totalPresent = 0,
    totalAbsent = 0

  attendanceData?.[selectedSlot]?.sectionEntries?.forEach(
    ({present_students, absent_students, no_of_students, section_info}) => {
      if (inactiveClasses.includes(section_info.class_name)) return

      if (no_of_students > 0) {
        if ((present_students || 0) / Math.max(no_of_students, 1) >= 0.75)
          greaterThan75 += 1
        else lessThan75 += 1

        totalStudents += no_of_students
        totalAbsent += absent_students || 0
        totalPresent += present_students || 0
        notMarked += present_students || absent_students ? 0 : 1
      }
    }
  )

  const attendanceStats = [
    {
      title: t('totalStudents'),
      value: totalStudents,
      styleClass: '',
    },
    {
      title: t('totalPresent'),
      value: isAttendanceAvailable ? totalPresent : '-',
      styleClass: 'tm-cr-gr-1',
    },
    {
      title: t('totalAbsent'),
      value: isAttendanceAvailable ? totalAbsent : '-',
      styleClass: 'tm-cr-rd-1',
    },
    {
      title: t('notMarked'),
      value: Math.max(totalStudents - totalPresent - totalAbsent, 0),
      styleClass: '',
    },
  ]

  // Insight calculation
  if (greaterThan75 > 0)
    insightItems.push({
      icon: '🤩',
      desc: `${greaterThan75} ${
        greaterThan75 === 1 ? 'class has' : 'classes have'
      } more than 75% attendance`,
      success: true,
    })

  if (notMarked > 0)
    insightItems.push({
      icon: '🚫',
      desc: `Attendance is not marked for ${notMarked} class${
        notMarked === 1 ? '' : 'es'
      } yet`,
      success: false,
    })

  if (lessThan75 > 0)
    insightItems.push({
      icon: '👎🏼',
      desc: `${lessThan75} ${
        lessThan75 === 1 ? 'class has' : 'classes have'
      } less than 75% attendance`,
      success: false,
    })

  return (
    <div className={styles.wrapper}>
      <div className="tm-h7">{t('attendanceOverview')}</div>

      <div className={styles.overviewWrapper}>
        <div className={styles.statsCon}>
          {attendanceStats.map(({title, value, styleClass}, index) => (
            <div key={index} className={styles.statsItem}>
              <div className="tm-para tm-para-14">{title}</div>
              <div
                className={classNames(
                  'tm-hdg-24',
                  styleClass,
                  styles.statsItemValue
                )}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.insightsCon}>
          <div className="tm-h7 mb-2">{t('insights')}</div>
          {insightItems?.length > 0 ? (
            insightItems?.map(({icon, desc, success}, i) => (
              <div
                key={i}
                className={classNames(
                  styles.insightsItem,
                  success ? 'tm-bgcr-gr-2' : 'tm-bgcr-rd-2'
                )}
              >
                <div className={styles.insightsItemIcon}>{icon}</div>
                <div className="tm-hdg tm-hdg-16">{desc}</div>
              </div>
            ))
          ) : (
            <div className="tm-para tm-para-16">
              {t('requestTeachersToMarkAttendance')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(TodaysAttendanceSection)
