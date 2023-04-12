import React, {useState, useEffect} from 'react'
import {ErrorBoundary} from '@teachmint/common'
import {
  TabGroup,
  Drawer,
  Heading,
  Accordion,
  Input,
  KebabMenu,
  Button,
} from '@teachmint/krayon'
// import classNames from 'classnames'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import styles from './StudentMarksEditor.module.css'

import Loader from '../../../../../../../../../components/Common/Loader/Loader'
import {
  getExamMarksDetails,
  resetExamMarksDetails,
  updateLocalExamMarksDetails,
} from './../../../../../../redux/actions'
import {
  ATTENDANCE,
  OTHER_TAB_NAME,
  REMARKS,
  CO_SCHOLASTIC,
} from '../../../../../../constants'

const StudentMarksEditor = ({
  studentId,
  sectionId,
  classId,
  setIsSliderOpen,
}) => {
  const dispatch = useDispatch()
  // const { eventManager } = useSelector((state) => state)
  const {structure, studentMarks} = useSelector(({reportCard}) => reportCard)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState(null)
  const [subjectList, setSubjectList] = useState(studentMarks)

  const {t} = useTranslation()
  const PRESENT = 1
  const ABSENT = 0

  useEffect(() => {
    return () => {
      dispatch(resetExamMarksDetails())
    }
  }, [])

  useEffect(() => {
    if (!structure) return
    setSelectedTab(structure.terms[0].id)
  }, [structure])

  useEffect(() => {
    setSubjectList(studentMarks)
    if (!studentMarks) return
    setIsLoading(false)
  }, [studentMarks])

  const handleMarksChange = (obj, examId) => {
    let tmp = [...subjectList[examId]]
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].name === obj.fieldName) {
        tmp[i] = {...tmp[i], evaluated_marks: obj.value}
        break
      }
    }
    setSubjectList({...subjectList, [examId]: tmp})
  }

  const handleAbsentChange = (isPresent, subjectName, examId) => {
    let tmp = [...subjectList[examId]]
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].name === subjectName) {
        tmp[i] = {...tmp[i], is_present: isPresent ? PRESENT : ABSENT}
        break
      }
    }
    setSubjectList({...subjectList, [examId]: tmp})
  }

  const renderSubjects = (examId) => {
    if (!subjectList) return
    return subjectList[examId]?.map((item, i) => (
      <div key={i} className={styles.subjectRow}>
        <div>
          <div className={styles.subjectName}>{item.name}</div>
          {item.is_present !== 1 ? (
            <div className={styles.absent}>Absent</div>
          ) : null}
        </div>
        <div className={styles.marksWrapper}>
          {item.is_present === 1 ? (
            <Input
              type="text"
              classes={{wrapper: styles.subjectInput}}
              fieldName={item.name}
              value={item.evaluated_marks || item.value}
              suffix={`/${item.total}`}
              onChange={(obj) => handleMarksChange(obj, examId)}
              infoMsg={t('marksInvalid')}
              infoType={item.evaluated_marks > item.total ? 'error' : null}
              showMsg={item.evaluated_marks > item.total}
            />
          ) : (
            <div></div>
          )}
          <KebabMenu
            isVertical={true}
            options={[
              {
                content: item.is_present ? 'Absent' : 'Mark as present',
                handleClick: () =>
                  handleAbsentChange(!item.is_present, item.name, examId),
              },
            ]}
          />
        </div>
      </div>
    ))
  }

  const renderCoScholasticSubjects = () => {
    if (!subjectList) return
    return subjectList[CO_SCHOLASTIC]?.map((item, i) => (
      <div key={i} className={styles.subjectRow}>
        <div className={styles.subjectName}>{item.name}</div>
        <div className={styles.marksWrapper}>
          <Input
            type="text"
            classes={{wrapper: styles.subjectInput}}
            fieldName={item.name}
            value={item.value}
            onChange={(obj) => handleMarksChange(obj, CO_SCHOLASTIC)}
          />
        </div>
      </div>
    ))
  }

  const renderAttendance = () => {
    if (!subjectList) return
    return subjectList[ATTENDANCE]?.map((item, i) => (
      <div key={i} className={styles.subjectRow}>
        <div className={styles.subjectName}>{item.month}</div>
        <div className={styles.marksWrapper}>
          <Input
            type="text"
            classes={{wrapper: styles.subjectInput}}
            fieldName={item.month}
            value={item.attendance}
            suffix={`/${item.total_working_days}`}
            onChange={(obj) => handleMarksChange(obj, ATTENDANCE)}
            infoMsg={t('marksInvalid')}
            infoType={
              item.attendance > item.total_working_days ? 'error' : null
            }
            showMsg={item.attendance > item.total_working_days}
          />
        </div>
      </div>
    ))
  }

  const renderRemarks = () => {
    if (!subjectList) return
    return subjectList[REMARKS]?.map((item, i) => (
      <div key={i} className={styles.subjectRow}>
        <div className={styles.subjectName}>{item.month}</div>
        <div className={styles.marksWrapper}>
          <Input
            type="text"
            classes={{wrapper: styles.subjectInput}}
            fieldName={item.month}
            value={item.attendance}
            suffix={`/${item.total_working_days}`}
            onChange={(obj) => handleMarksChange(obj, REMARKS)}
            infoMsg={t('marksInvalid')}
            infoType={
              item.attendance > item.total_working_days ? 'error' : null
            }
            showMsg={item.attendance > item.total_working_days}
          />
        </div>
      </div>
    ))
  }

  const renderChildren = (examId) => {
    switch (examId) {
      case CO_SCHOLASTIC:
        renderCoScholasticSubjects()
        break
      case ATTENDANCE:
        renderAttendance()
        break
      case REMARKS:
        renderRemarks()
    }
  }

  const handleAccordionClick = (examId) => {
    dispatch(updateLocalExamMarksDetails(subjectList))
    if (subjectList && subjectList[examId]) return
    let params = {
      iid: studentId,
      test_id: examId,
      section_id: sectionId,
      class_id: classId,
    }
    if (selectedTab === OTHER_TAB_NAME) {
      params.type = examId
      delete params.test_id
    }
    dispatch(getExamMarksDetails(params))
    setIsLoading(true)
  }

  const renderAccordions = () => {
    if (!selectedTab) return
    return structure.scholistic[selectedTab].map((item) => (
      <Accordion
        key={item._id}
        className={styles.accordion}
        classes={{
          accordionHeader: styles.accordionHeading,
          accordionBody: styles.accordionBody,
        }}
        headerContent={item.name}
        onClick={() => handleAccordionClick(item._id)}
        allowHeaderClick={true}
      >
        {item._id === OTHER_TAB_NAME
          ? renderChildren()
          : renderSubjects(item._id)}
      </Accordion>
    ))
  }

  return (
    <Drawer
      direction="right"
      open={true}
      onClose={() => setIsSliderOpen(false)}
    >
      <Drawer.Header>
        <Heading className={styles.heading} textSize="x_s" weight="bold">
          {t('reportCard')}
          <Button>Save Changes</Button>
        </Heading>
      </Drawer.Header>
      <Drawer.Content>
        <div className={styles.wrapper}>
          <ErrorBoundary>
            <TabGroup
              onTabClick={(tab) => setSelectedTab(tab?.id)}
              selectedTab={selectedTab}
              tabOptions={structure?.terms}
            />
            {renderAccordions()}
          </ErrorBoundary>
        </div>
        <Loader show={isLoading} />
      </Drawer.Content>
    </Drawer>
  )
}

export default StudentMarksEditor
