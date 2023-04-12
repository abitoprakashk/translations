import classNames from 'classnames'
import React from 'react'
import {useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import {t} from 'i18next'
import {useContent} from '../../redux/contentSelectors'
import {
  SELECT_CONTENT_TEXT,
  SELECT_SUBJECT_TEXT,
  URL_PATH,
} from '../../constants'
import {
  setClassAction,
  setSubjectAction,
  setTopicAction,
} from '../../redux/actions/contentActions'
import styles from './BreadCrum.module.css'

export default function BreadCrum() {
  const dispatch = useDispatch()

  const {
    currentLanguage,
    topic: selectedTopic,
    subject: selectedSubject,
    class: selectedClass,
    classList,
    selectedCourse,
    subjectList,
    topicList,
  } = useContent()

  const classForUrl = selectedClass ?? ''
  const subjectForUrl = selectedSubject ?? ''
  const topicForUrl = selectedTopic ? encodeURIComponent(selectedTopic) : ''

  const handleBreadCrumbClick = (pathFor) => {
    switch (pathFor) {
      case 'class':
        dispatch(setClassAction(null))
        dispatch(setSubjectAction(null))
        break
      case 'subject':
        dispatch(setSubjectAction(null))
        break

      default:
        null
        break
    }
    dispatch(setTopicAction(null))
  }

  const breadCumbRoutes = [
    {
      to: `${URL_PATH}/${selectedCourse}${
        currentLanguage ? `/${currentLanguage}` : ''
      }`,
      text: t('examPlannerClassName', {name: classList[selectedClass]?.name}),
      isShown: selectedClass ? true : false,
      isArrowShown: true,
      arrow:
        'https://storage.googleapis.com/tm-assets/icons/secondary/right-arrow-secondary.svg',
      click: () => handleBreadCrumbClick('class'),
      className: styles.underline,
    },
    {
      to: `${URL_PATH}/${selectedCourse}/${currentLanguage}/${classForUrl}`,
      text: subjectList?.[selectedSubject]
        ? subjectList[selectedSubject].name
        : SELECT_SUBJECT_TEXT,
      isShown: true,
      isArrowShown: selectedSubject && selectedTopic,
      arrow:
        'https://storage.googleapis.com/tm-assets/icons/secondary/right-arrow-secondary.svg',
      click: () => handleBreadCrumbClick('subject'),
      className: classNames({[styles.underline]: selectedSubject}),
    },
    {
      to: `${URL_PATH}/${selectedCourse}/${currentLanguage}/${classForUrl}/${subjectForUrl}${
        selectedTopic ? `/${topicForUrl}` : ''
      }`,
      text: topicList[selectedTopic]
        ? topicList[selectedTopic].name
        : SELECT_CONTENT_TEXT,
      isShown: selectedTopic ? true : false,
      isArrowShown: false,
      arrow:
        'https://storage.googleapis.com/tm-assets/icons/secondary/right-arrow-secondary.svg',
      click: null,
    },
  ]

  return (
    <>
      <div className={styles.section}>
        {breadCumbRoutes.map((route, idx) => {
          return (
            route.isShown && (
              <span key={`${route.text}-${idx}`}>
                {route.click !== null ? (
                  <span className={styles.linkSection}>
                    <Link
                      to={route.to}
                      onClick={route.click}
                      className={route.className}
                    >
                      {route.text}
                    </Link>
                    {route.isArrowShown && (
                      <span>
                        <img
                          className={styles.leftArrow}
                          src="https://storage.googleapis.com/tm-assets/icons/secondary/right-arrow-secondary.svg"
                          alt="left arrow icon"
                        />
                      </span>
                    )}
                  </span>
                ) : (
                  <span>{route.text}</span>
                )}
              </span>
            )
          )
        })}
      </div>
    </>
  )
}
