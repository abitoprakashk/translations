import {
  Accordion,
  ALERT_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {t} from 'i18next'
import ImportValidationAlert from '../ImportValidationAlert/ImportValidationAlert'
import styles from './ClassStructure.module.css'

const ClassStructure = ({instituteHierarchy, customClasses}) => (
  <div>
    <ImportValidationAlert
      feeValidation={{
        type: ALERT_CONSTANTS.TYPE.WARNING,
        message: t('importWarningIfConfigExists'),
      }}
    />
    <div className={styles.spaceBetween}>
      <div className={styles.contentTitle}>
        {t('confirmClassStructureLabel')}
      </div>
      <div className={styles.sessionLabel}>
        <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
          {t('importingFromLabel')}
        </Para>
        <span>{instituteHierarchy.name}</span>
      </div>
    </div>
    <div className={styles.accordions}>
      {instituteHierarchy.department?.map((department) => (
        <Department key={department.id} department={department} />
      ))}
      <CustomClasses classes={customClasses} />
    </div>
  </div>
)

const CustomClasses = ({classes}) =>
  classes?.length ? (
    <Accordion
      allowHeaderClick
      isOpen={false}
      headerContent={
        <div className={styles.accordionHeader}>{t('customClassrooms')}</div>
      }
      classes={{
        accordionBody: styles.deptAccordionBody,
      }}
    >
      <div className={styles.classContainer}>
        {classes.map((customClass) => (
          <Standard
            standard={customClass}
            key={customClass._id}
            showClassLabel={false}
          />
        ))}
      </div>
    </Accordion>
  ) : null

const Department = ({department}) => {
  const classesWithSections = department.standard?.filter(
    (standard) => standard.section?.length
  )

  return classesWithSections?.length ? (
    <Accordion
      isOpen={false}
      allowHeaderClick
      headerContent={
        <div className={styles.accordionHeader}>{department.name}</div>
      }
      classes={{
        accordionBody: styles.deptAccordionBody,
      }}
    >
      <div className={styles.classContainer}>
        {classesWithSections.map((standard) => (
          <Standard standard={standard} key={standard.id} />
        ))}
      </div>
    </Accordion>
  ) : (
    <div className={styles.emptyAccordion}>{department.name}</div>
  )
}

const Standard = ({standard, showClassLabel = true}) => (
  <div key={standard.id}>
    <div className={styles.classDetails}>
      <div className={styles.textEllipses} title={standard.name}>
        {showClassLabel
          ? t('classLabel', {section: standard.name})
          : standard.name}
      </div>
      <div className={styles.sectionContainer}>
        {standard.section?.map((section) => (
          <div key={section.id} className={styles.section}>
            {standard.name} - {section.originalName}
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default ClassStructure
