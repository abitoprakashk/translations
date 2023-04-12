import React, {useEffect} from 'react'
import styles from './Content.module.css'

import ClassesPage from './components/classesPage/ClassesPage'
import LanguageFilter from './components/languageFilter/LanguageFilter'
import SubjectPage from './components/subjectPage/SubjectPage'
import classNames from 'classnames'
import {useDispatch} from 'react-redux'
import BreadCrum from './components/breadCrum/BreadCrum'
import {PAGES, PAGE_HEADING, PAGE_PATH, URL_PATH} from './constants'
import TopicPage from './components/topicPage/TopicPage'
import {Route} from 'react-router-dom'
import {useContent} from './redux/contentSelectors'
import {
  resetStateAction,
  setContentAccessCheckPopupAction,
} from './redux/actions/contentActions'
import ContactSalesPopup from './components/contactSalesPopup/ContactSalesPopup'
import SelectCourse from './components/SelectCourse/SelectCourse'

export default function Content() {
  const {
    languageLoader,
    page: currentPage,
    class: selectedClass,
    contentAccessCheckPopup,
    contentAccessCheckRequested,
    accessAccessCheckLoader,
  } = useContent()
  const dispatch = useDispatch()

  useEffect(() => {
    if (
      !accessAccessCheckLoader &&
      !contentAccessCheckRequested &&
      !contentAccessCheckPopup
    ) {
      dispatch(setContentAccessCheckPopupAction(!contentAccessCheckRequested))
    }
    return () => {
      dispatch(resetStateAction())
    }
  }, [])

  if (!languageLoader && !contentAccessCheckRequested) {
    return (
      <ContactSalesPopup
        contentAccessCheckRequested={contentAccessCheckRequested}
        contentAccessCheckPopup={contentAccessCheckPopup}
      />
    )
  }

  if (languageLoader) {
    return <div className="loader"></div>
  }

  const renderContent = () => {
    return (
      <div className={styles.contentSection}>
        {selectedClass && <BreadCrum />}
        <div className={styles.filterSection}>
          <div
            className={classNames(
              styles.pageTitle,
              styles.ellipsisAfterTwoLines
            )}
          >
            {currentPage === PAGES.classPage && PAGE_HEADING.selectClass}
            {currentPage === PAGES.subjectPage && PAGE_HEADING.selectSubject}
            {currentPage === PAGES.contentPage && PAGE_HEADING.selectContent}
          </div>
          <div className={styles.dropdownsContainer}>
            <SelectCourse />
            <LanguageFilter />
          </div>
        </div>
        <Route path={PAGE_PATH.topicPage} exact component={TopicPage} />
        <Route path={PAGE_PATH.subjectPage} exact component={SubjectPage} />
        <Route
          path={[URL_PATH, PAGE_PATH.classPage]}
          exact
          component={ClassesPage}
        />
      </div>
    )
  }

  return contentAccessCheckRequested && !contentAccessCheckPopup
    ? renderContent()
    : null
}
