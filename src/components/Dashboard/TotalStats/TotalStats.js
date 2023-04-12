import React from 'react'
import teachersIcon from '../../../assets/images/dashboard/total-stats/teachers.svg'
import studentsIcon from '../../../assets/images/dashboard/total-stats/students.svg'
import classroomsIcon from '../../../assets/images/dashboard/total-stats/classrooms.svg'
import {useSelector, useDispatch} from 'react-redux'
import {sidebarData} from '../../../utils/SidebarItems'
import history from '../../../history'
import {schoolSystemScreenSelectedAction} from '../../../redux/actions/schoolSystemAction'
import {instituteHierarchyAction} from '../../../redux/actions/instituteInfoActions'
import {
  getNodesListOfSimilarType,
  handleHierarchyOpenClose,
  isHierarchyAvailable,
} from '../../../utils/HierarchyHelpers'
import * as SHC from '../../../utils/SchoolSetupConstants'
import classNames from 'classnames'
import styles from './TotalStats.module.css'
import {t} from 'i18next'
import {
  getActiveStudents,
  getActiveTeachers,
} from '../../../redux/reducers/CommonSelectors'
import {events} from '../../../utils/EventsConstants'

export default function TotalStats() {
  const {instituteAllClasses, instituteHierarchy, sidebar} = useSelector(
    (state) => state
  )
  const eventManager = useSelector((state) => state.eventManager)
  const instituteStudentList = getActiveStudents(true)
  const instituteTeacherList = getActiveTeachers(true)
  const dispatch = useDispatch()

  const totalStatsItems = [
    {
      num: 1,
      title: t('teachers'),
      value: instituteTeacherList && instituteTeacherList.length,
      imgSrc: teachersIcon,
      isVisible: sidebar?.allowedMenus?.has(sidebarData.TEACHER_DIRECTORY.id),
      onClick: () => {
        history.push(sidebarData.TEACHER_DIRECTORY.route)
        dispatch(schoolSystemScreenSelectedAction(SHC.SCN_TEACHER_DIRECTORY))
        eventManager.send_event(events.TEACHERS_CLICKED_TFI, {
          screen_name: 'DASHBOARD',
        })
        if (isHierarchyAvailable(instituteHierarchy))
          dispatch(
            instituteHierarchyAction(
              handleHierarchyOpenClose(
                instituteHierarchy,
                SHC.NODE_SCHOOL_SYSTEM_OVERVIEW
              )
            )
          )
      },
    },
    {
      num: 2,
      title: t('classrooms'),
      value: isHierarchyAvailable(instituteHierarchy)
        ? getNodesListOfSimilarType(instituteHierarchy, SHC.NODE_SECTION)
            ?.length
        : instituteAllClasses?.length,
      imgSrc: classroomsIcon,
      isVisible: sidebar?.allowedMenus?.has('SCHOOL_SETUP'),
      onClick: () => {
        history.push(sidebarData.SCHOOL_SETUP.route)
        if (isHierarchyAvailable(instituteHierarchy)) {
          dispatch(
            instituteHierarchyAction(
              handleHierarchyOpenClose(
                instituteHierarchy,
                SHC.NODE_SCHOOL_SYSTEM_OVERVIEW
              )
            )
          )
          dispatch(schoolSystemScreenSelectedAction(SHC.SCN_SCHOOL_SETUP))
        } else
          dispatch(schoolSystemScreenSelectedAction(SHC.SCN_CLASSROOM_PAGE))
      },
    },
    {
      num: 3,
      title: t('students'),
      value: instituteStudentList && instituteStudentList.length,
      imgSrc: studentsIcon,
      isVisible: sidebar?.allowedMenus?.has(sidebarData.STUDENT_DIRECTORY.id),
      onClick: () => {
        dispatch(schoolSystemScreenSelectedAction(SHC.SCN_STUDENT_DIRECTORY))
        history.push(sidebarData.STUDENT_DIRECTORY.route)
        eventManager.send_event(events.STUDENTS_CLICKED_TFI, {
          screen_name: 'DASHBOARD',
        })
        if (isHierarchyAvailable(instituteHierarchy))
          dispatch(
            instituteHierarchyAction(
              handleHierarchyOpenClose(
                instituteHierarchy,
                SHC.NODE_SCHOOL_SYSTEM_OVERVIEW
              )
            )
          )
      },
    },
  ]

  return (
    <div className="w-full justify-between px-4 py-3 lg:px-0">
      <div className="w-full flex flex-row justify-between items-end">
        <div className="flex items-center">
          <div className="tm-h7 flex justify-start">{t('overview')}</div>
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-4 pt-4 lg:flex">
        {totalStatsItems.map(
          ({num, title, value, imgSrc, isVisible, onClick}) =>
            isVisible && (
              <div
                key={title}
                className={classNames(
                  'w-full bg-white p-4 relative tm-border-radius1 tm-box-shadow1 cursor-pointer',
                  {[styles.newFeature]: num === 4}
                )}
                onClick={onClick}
              >
                <div className="tm-h4">{value || 0}</div>
                <div className="tm-para3">{title}</div>
                <img
                  src={imgSrc}
                  className="absolute bottom-0 right-0 w-12 h-12 lg:w-14 lg:h-14"
                  alt={title}
                />
                {num === 5 ? (
                  <div className="tm-para2 tm-color-blue absolute top-0.5 lg:top-1 right-2" />
                ) : null}
              </div>
            )
        )}
      </div>
    </div>
  )
}
