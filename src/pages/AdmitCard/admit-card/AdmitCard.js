import React, {useState} from 'react'
import {t} from 'i18next'
import Breadcrumb from './components/Breadcrum/Breadcrum'
import styles from './AdmitCard.module.css'
import InstituteInfoIncompleteNotice from '../../../components/InstituteInfoIncompleteNotice/InstituteInfoIncompleteNotice'
import ClassList from './components/ClassList/ClassList'
import StudentList from './components/StudentList/StudentList'
import PreviewStaticImage from './components/PreviewStaticImage/PreviewStaticImage'
import admit_card_front from '../assets/admit_card_front.svg'
import {SCREENS} from './constants'

export default function AdmitCard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [classDetails, setClassDetails] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const STEPS = Object.keys(SCREENS)

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

  const renderContentArea = (step) => {
    switch (step) {
      case 'classList':
        return (
          <ClassList
            selectedStandard={classDetails}
            openClass={handleCurrentStep}
          />
        )
      case 'studentList':
        return <StudentList classDetails={classDetails} />
      default:
        return null
    }
  }

  return (
    <div className={styles.container}>
      {showPreview && (
        <PreviewStaticImage
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      )}
      <h1 className="tm-hdg tm-hdg-24">{t('admitCardHeading')}</h1>
      <div className={styles.instituteInfo}>
        <InstituteInfoIncompleteNotice type="Admit Cards" />
      </div>
      <div className={styles.first_div}>
        <div className={styles.template_info}>
          <div className={styles.image_wrapper}>
            <img src={admit_card_front} alt="" />
          </div>
          <div className={styles.template_change}>
            <p>
              <span>{t('admitCardTemplateType')}:</span>
              {t('landscapeTemplateType')}
            </p>

            <span
              className={styles.link}
              onClick={() => {
                setShowPreview(!showPreview)
              }}
            >
              {t('admitCardPreviewTemplate')}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.wrapper}>
        {SCREENS[STEPS[currentStep]].hasBreadcrum && (
          <div className={styles.breadcrumbWrapper}>
            <Breadcrumb
              path={[
                {label: t('admitCardHeading'), onClick: handleBreadcrumClick},
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
    </div>
  )
}
