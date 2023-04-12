import React, {useEffect, useState} from 'react'
import styles from './ClassroomLearningPage.module.css'
import {TabGroup} from '@teachmint/krayon'
import {t} from 'i18next'
import HomeworkPage from './components/HomeworkPage/HomeworkPage'
import TestPage from './components/TestPage/TestPage'
import {useDispatch} from 'react-redux'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../../../../redux/actions/commonAction'
import {
  fetchStudentWiseHomeworkData,
  fetchStudentWiseTestData,
} from './classroomLearning.apis'

const HOMEWORK = 'homework'
const TESTS = 'tests'

export default function ClassroomLearningPage({currentStudent}) {
  const [selectedTab, setSelectedTab] = useState(HOMEWORK)
  const [homeworkData, setHomeworkData] = useState(null)
  const [testData, setTestData] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (currentStudent?._id) {
      fetchHomewordData(currentStudent._id)
      fetchTestData(currentStudent._id)
    }
  }, [currentStudent?._id])

  const fetchHomewordData = (iid) => {
    dispatch(showLoadingAction(true))
    fetchStudentWiseHomeworkData(iid)
      .then(({obj}) => setHomeworkData(obj))
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const fetchTestData = (iid) => {
    dispatch(showLoadingAction(true))
    fetchStudentWiseTestData(iid)
      .then(({obj}) => setTestData(obj))
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const tabOptions = {
    homework: {
      id: HOMEWORK,
      label: t('homework'),
      link: null,
      component: <HomeworkPage homeworkData={homeworkData} />,
    },
    tests: {
      id: TESTS,
      label: t('tests'),
      link: null,
      component: (
        <TestPage currentStudent={currentStudent} testData={testData} />
      ),
    },
  }

  return (
    <div>
      <div className={styles.tabGroupWrapper}>
        <TabGroup
          showMoreTab={false}
          tabOptions={Object.values(tabOptions)}
          selectedTab={selectedTab}
          onTabClick={({id}) => setSelectedTab(id)}
        />
      </div>

      <div className={styles.componentWrapper}>
        {tabOptions[selectedTab]?.component}
      </div>
    </div>
  )
}
