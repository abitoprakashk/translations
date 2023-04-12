import React from 'react'
import {Input} from '@teachmint/common'
import styles from './AcademicInfo.module.css'

const AcademicInfo = ({
  academicInfo = {},
  setAcademicInfo,
  setHasEdited,
  instituteType,
  disableInputs,
}) => {
  const handleChange = ({fieldName, value}) => {
    setAcademicInfo({...academicInfo, [fieldName]: value})
    setHasEdited(true)
  }

  const renderSchoolAcademics = () => {
    return (
      <>
        {/*<div className={styles.heading}>Current School</div>
       <div className={styles.container}>
        <div className={styles.gridOfTwo}>
          <Input
            type="text"
            title="Enrollment Number"
            fieldName="enrollmentNumber"
            value={academicInfo.enrollmentNumber}
            onChange={handleChange}
          />
          <Input
            type={
              reduxData.admissionDate && reduxData.admissionDate.trim()
                ? 'readonly'
                : 'text'
            }
            title="Admission Date"
            fieldName="admissionDate"
            value={academicInfo.admissionDate}
            onChange={handleChange}
          />
        </div>
        <Input
          type="text"
          title="House"
          fieldName="house"
          value={academicInfo.house}
          onChange={handleChange}
        />
      </div>
      <div className={styles.divider} /> */}
        <div className={styles.heading}>Previous School</div>
        <div className={styles.container}>
          <div className={styles.gridOfTwo}>
            <Input
              type="text"
              title="Last School Attended"
              fieldName="lastSchoolAttended"
              value={academicInfo.lastSchoolAttended}
              onChange={handleChange}
              disabled={disableInputs}
              classes={{title: 'tm-para'}}
            />
            <Input
              type="text"
              title="Last School Affiliated to"
              fieldName="lastSchoolAffiliation"
              value={academicInfo.lastSchoolAffiliation}
              onChange={handleChange}
              disabled={disableInputs}
              classes={{title: 'tm-para'}}
            />
          </div>
          <Input
            type="text"
            title="Last Class Passed"
            fieldName="lastClassPassed"
            value={academicInfo.lastClassPassed}
            onChange={handleChange}
            disabled={disableInputs}
            classes={{title: 'tm-para'}}
          />
        </div>
      </>
    )
  }

  const renderCollegeAcademics = () => (
    <>
      <div className={styles.heading}>Program Details</div>
      <div className={styles.container}>
        <div className={styles.gridOfTwo}>
          <Input
            type="text"
            title="Program"
            fieldName="program"
            value={academicInfo.program}
            onChange={handleChange}
            disabled={disableInputs}
            classes={{title: 'tm-para'}}
          />
          <Input
            type="text"
            title="Stream"
            fieldName="stream"
            value={academicInfo.stream}
            onChange={handleChange}
            disabled={disableInputs}
            classes={{title: 'tm-para'}}
          />
        </div>
        <Input
          type="text"
          title="Year"
          fieldName="year"
          value={academicInfo.year}
          onChange={handleChange}
          disabled={disableInputs}
          classes={{title: 'tm-para'}}
        />
      </div>
    </>
  )

  const renderCoachingAcademics = () => (
    <>
      <div className={styles.heading}>Program Details</div>
      <div className={styles.container}>
        <div className={styles.gridOfTwo}>
          <Input
            type="text"
            title="Program"
            fieldName="program"
            value={academicInfo.program}
            onChange={handleChange}
            disabled={disableInputs}
            classes={{title: 'tm-para'}}
          />
          <Input
            type="text"
            title="Courses"
            fieldName="courses"
            value={academicInfo.courses}
            onChange={handleChange}
            disabled={disableInputs}
            classes={{title: 'tm-para'}}
          />
        </div>
        <Input
          type="text"
          title="Batch"
          fieldName="batch"
          value={academicInfo.batch}
          onChange={handleChange}
          disabled={disableInputs}
          classes={{title: 'tm-para'}}
        />
      </div>
    </>
  )

  const academicsDetailsContent = () => {
    switch (instituteType) {
      case 'SCHOOL':
        return renderSchoolAcademics()
      case 'COLLEGE':
        return renderCollegeAcademics()
      case 'TUITION':
        return renderCoachingAcademics()
      default:
        return renderSchoolAcademics()
    }
  }

  return academicsDetailsContent()
}

export default AcademicInfo
