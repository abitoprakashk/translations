import React, {useEffect} from 'react'
import styles from './SubjectPage.module.css'
import contentStles from '../../Content.module.css'
import ContentInfoCard from '../contentInfoCard/ContentInfoCard'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {
  COLOR_PALLET_COUNT,
  NOT_FOUND_TEXT,
  PAGES,
  PAGE_PATH,
  PAYLOAD_FIELDS,
  SUBJECT_COLOR_CLASSES,
} from '../../constants'
import {
  fetchClassTaxonomyAction,
  fetchSubjectTaxonomyAction,
  setClassAction,
  setCourseAction,
  setLanguageAction,
  setPageAction,
  setSubjectAction,
  setTopicAction,
} from '../../redux/actions/contentActions'
import {useHistory, useParams} from 'react-router-dom'
import NotFoundCard from '../notFoundCard/NotFoundCard'
import {events} from '../../../../utils/EventsConstants'
import {ErrorBoundary} from '@teachmint/common'
import {useContent} from '../../redux/contentSelectors'
import {getUrlWithParams} from '../../commonFunctions'

export default function SubjectPage() {
  const {
    class: selectedClass,
    subject: selectedSubject,
    subjectList,
    taxonomyLoader,
    currentLanguage,
    selectedCourse,
    classList,
    courses,
  } = useContent()

  const eventManager = useSelector((state) => state.eventManager)
  const history = useHistory()
  const dispatch = useDispatch()
  const urlParams = useParams()

  useEffect(() => {
    if (currentLanguage && selectedClass) {
      dispatch(
        fetchSubjectTaxonomyAction({
          field: PAYLOAD_FIELDS.subjectName,
          language: currentLanguage,
          classId: selectedClass,
        })
      )
    }

    if (!Object.keys(classList).length) {
      const {children_type} =
        courses?.find((course) => course._id === selectedCourse) || {}

      if (children_type) {
        dispatch(
          fetchClassTaxonomyAction({
            field: PAYLOAD_FIELDS.className,
            parent_id: selectedCourse,
            language: currentLanguage,
            children_type,
          })
        )
      }
    }
  }, [currentLanguage, selectedClass])

  useEffect(() => {
    if (urlParams.class !== selectedClass) {
      dispatch(setClassAction(urlParams?.class))
    }

    if (!urlParams.subject && selectedSubject) {
      dispatch(setSubjectAction(null))
      dispatch(setTopicAction(null))
    }

    if (urlParams.course && urlParams.course !== selectedCourse) {
      dispatch(setCourseAction(urlParams.course))
    }

    if (urlParams.language && urlParams.language !== currentLanguage) {
      dispatch(setLanguageAction(urlParams.language))
    }

    dispatch(setPageAction(PAGES.subjectPage))
  }, [])

  const handleCardClick = (selectedSubject) => {
    dispatch(setPageAction(PAGES.topicPage))
    dispatch(setSubjectAction(selectedSubject))
    eventManager.send_event(events.PC_SUBJECT_SELECTED, {
      pc_subject_name: selectedSubject,
    })

    history.push(
      getUrlWithParams(PAGE_PATH.topicPage, {
        course: selectedCourse,
        language: currentLanguage,
        class: selectedClass,
        subject: selectedSubject,
      })
    )
  }

  const subjectsCount = Object.keys(subjectList || {}).length

  if (taxonomyLoader) {
    return <div className="loader" />
  }

  if (!subjectsCount) {
    return (
      <ErrorBoundary>
        <NotFoundCard text={NOT_FOUND_TEXT.subject} />
      </ErrorBoundary>
    )
  }

  const SubjectName = ({subjectName, chapter, colorClass}) => {
    return (
      <div className={styles.subjectNameSection}>
        <div
          className={classNames(
            styles.subjectNameColorSection,
            styles[SUBJECT_COLOR_CLASSES[colorClass]]
          )}
        >
          <div className={styles.subjectShortFom}>
            {subjectName.substring(0, 2)}
          </div>
        </div>
        <div className={styles.subjectNameAndChapterSection}>
          <div
            className={classNames(
              styles.subjectNameText,
              contentStles.ellipsisAfterTwoLines
            )}
          >
            {subjectName}
          </div>
          <div className={styles.chaptersCount}> {chapter}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageSection}>
      <ErrorBoundary>
        {subjectsCount &&
          Object.entries(subjectList).map(([subjectId, subject], idx) => {
            return (
              <ContentInfoCard
                handleCardClick={() => handleCardClick(subjectId)}
                key={subjectId}
                className={styles.cardHover}
                topSectionInfo={
                  <SubjectName
                    subjectName={subject.name}
                    colorClass={
                      ((idx % subjectsCount) + subjectsCount) %
                      COLOR_PALLET_COUNT
                    }
                  />
                }
                contentCounts={subject}
              />
            )
          })}
      </ErrorBoundary>
    </div>
  )
}
