import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import styles from './ReportCard.module.css'
import Breadcrumb from './components/Breadcrum/Breadcrum'
import NoReportCard from './components/NoReportCard/NoReportCard'
import ClassList from './components/ClassList/ClassList'
import EditTemplate from './components/EditTemplate/EditTemplate'
// import StudentList from './components/SectionView/components/StudentList/StudentList'
import {SCREENS} from './constants'
import {getClassTemplateListAction} from './redux/actions'

export default function ReportCard() {
  const {reportCard} = useSelector((state) => state)
  const [currentStep, setCurrentStep] = useState(0)
  const [classDetails, setClassDetails] = useState(null)
  const STEPS = Object.keys(SCREENS)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getClassTemplateListAction())
  }, [])

  useEffect(() => {
    if (!reportCard.isReportCardTemplateAvalible) {
      setCurrentStep(0)
      return
    }
    setCurrentStep(1)
  }, [reportCard.isReportCardTemplateAvalible])

  const renderContentArea = (step) => {
    switch (step) {
      case 'noExamStructure':
        return (
          <div className={styles.noReportCardWrapper}>
            <NoReportCard />
          </div>
        )
      case 'classList':
        return (
          <ClassList
            data={reportCard?.standardList || {}}
            selectedStandard={classDetails}
            editTemplate={handleCurrentStep}
            openClass={handleCurrentStep}
          />
        )
      case 'editTemplate':
        return (
          <EditTemplate
            classDetail={classDetails}
            goToPage={(index) => handleCurrentStep(index)}
          />
        )
      // case 'studentList':
      //   return <StudentList classDetails={classDetails} />
      default:
        return null
    }
  }

  const handleCurrentStep = (index, data) => {
    if (data) {
      setClassDetails(data)
    }
    setCurrentStep(index)
  }

  const handleBreadcrumClick = () => {
    setCurrentStep(1)
    setClassDetails(null)
  }

  return (
    <div className={styles.wrapper}>
      {SCREENS[STEPS[currentStep]].hasBreadcrum && (
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb
            path={[
              {label: 'Report Card', onClick: handleBreadcrumClick},
              {label: classDetails.name},
            ]}
          />
        </div>
      )}

      {classDetails && currentStep !== 1 && (
        <div className="tm-hdg tm-hdg-24">{`Class ${classDetails.name}`}</div>
      )}

      {renderContentArea(STEPS[currentStep])}
    </div>
  )
}
