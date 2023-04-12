import React, {useEffect} from 'react'
import contentStyles from '../../Content.module.css'
import styles from './ClassesPage.module.css'
import ContentInfoCard from '../contentInfoCard/ContentInfoCard'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory, useParams} from 'react-router-dom'
import {
  fetchClassTaxonomyAction,
  setClassAction,
  setCourseAction,
  setLanguageAction,
  setPageAction,
  setSubjectAction,
  setTopicAction,
} from '../../redux/actions/contentActions'
import {NOT_FOUND_TEXT, PAGES, PAGE_PATH, PAYLOAD_FIELDS} from '../../constants'

import {useContent} from '../../redux/contentSelectors'
import NotFoundCard from '../notFoundCard/NotFoundCard'
import {events} from '../../../../utils/EventsConstants'
import {ErrorBoundary} from '@teachmint/common'
import {getUrlWithParams} from '../../commonFunctions'

export default function ClassesPage() {
  const {
    taxonomyLoader,
    classList,
    currentLanguage,
    class: selectedClass,
    selectedCourse,
    courses,
  } = useContent()

  const eventManager = useSelector((state) => state.eventManager)
  const dispatch = useDispatch()
  const urlParams = useParams()
  const history = useHistory()

  useEffect(() => {
    if (currentLanguage && selectedCourse) {
      const {children_type} =
        courses?.find((course) => course._id === selectedCourse) || {}

      if (children_type)
        dispatch(
          fetchClassTaxonomyAction({
            field: PAYLOAD_FIELDS.className,
            parent_id: selectedCourse,
            language: currentLanguage,
            children_type,
          })
        )
    }
  }, [currentLanguage, selectedCourse])

  useEffect(() => {
    if (!urlParams.class && selectedClass) {
      dispatch(setClassAction(null))
      dispatch(setSubjectAction(null))
      dispatch(setTopicAction(null))
    }

    if (urlParams.course && urlParams.course !== selectedCourse) {
      dispatch(setCourseAction(urlParams.course))
    }

    if (urlParams.language && urlParams.language !== currentLanguage) {
      dispatch(setLanguageAction(urlParams.language))
    }

    dispatch(setPageAction(PAGES.classPage))
  }, [])

  const ClassInfo = ({classroomName}) => {
    return (
      <div className={styles.classroomNameSection}>
        <div className={styles.classText}>class</div>
        <div className={styles.classInfoTitle}>{classroomName}</div>
      </div>
    )
  }

  const handleCardClick = (classSelected) => {
    dispatch(setPageAction(PAGES.subjectPage))
    eventManager.send_event(events.PC_CLASS_SELECTED, {
      class_name: classSelected,
    })
    dispatch(setClassAction(classSelected))
    history.push(
      getUrlWithParams(PAGE_PATH.subjectPage, {
        course: selectedCourse,
        language: currentLanguage,
        class: classSelected,
      })
    )
  }

  if (taxonomyLoader) {
    return <div className="loader" />
  }

  if (!Object.keys(classList).length) {
    return (
      <ErrorBoundary>
        <NotFoundCard text={NOT_FOUND_TEXT.class} />
      </ErrorBoundary>
    )
  }

  return (
    <div className={contentStyles.pageSection}>
      <ErrorBoundary>
        {Object.entries(classList).map(([objKey, value]) => {
          return (
            <ContentInfoCard
              handleCardClick={() => handleCardClick(objKey)}
              key={objKey}
              topSectionInfo={<ClassInfo classroomName={value.name} />}
              contentCounts={value}
            />
          )
        })}
      </ErrorBoundary>
    </div>
  )
}
