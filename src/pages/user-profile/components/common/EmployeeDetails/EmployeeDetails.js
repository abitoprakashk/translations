import React from 'react'
import {Input} from '@teachmint/common'
import styles from './EmployeeDetails.module.css'

const EmployeeDetails = ({
  employeeDetails = {},
  setEmployeeDetails,
  reduxData,
  isTeacher,
  doj,
  setDoj,
  setHasEdited,
  disableInputs,
}) => {
  const handleChange = ({fieldName, value}) => {
    if (value.length) setHasEdited(true)
    setEmployeeDetails({...employeeDetails, [fieldName]: value})
  }

  const renderTeacher = () => {
    return (
      <>
        <div className={styles.empDetails}>
          <div className={styles.gridOfTwo}>
            <Input
              type={
                reduxData.jobProfile && reduxData.jobProfile.trim()
                  ? 'readonly'
                  : 'text'
              }
              title="Job Title"
              fieldName="jobProfile"
              value={employeeDetails.jobProfile}
              onChange={handleChange}
              maxLength="50"
              disabled={disableInputs}
              classes={{title: 'tm-para'}}
            />
            <Input
              type="text"
              title="Designation"
              fieldName="designation"
              value={employeeDetails.designation}
              onChange={handleChange}
              maxLength="50"
              disabled={disableInputs}
              classes={{title: 'tm-para'}}
            />
          </div>
          <Input
            type="text"
            title="Employee Type"
            fieldName="employmentType"
            value={employeeDetails.employmentType}
            onChange={handleChange}
            maxLength="50"
            disabled={disableInputs}
            classes={{title: 'tm-para'}}
          />
        </div>
        <div className={styles.moreDetails}>
          <Input
            type={
              reduxData.dateOfAppointment && reduxData.dateOfAppointment.length
                ? 'readonly'
                : 'date'
            }
            title="Appointment Date"
            fieldName="dateOfAppointment"
            value={doj}
            onChange={(obj) => {
              setDoj(obj.value)
              setHasEdited(true)
            }}
            maxLength="50"
            disabled={disableInputs}
            classes={{title: 'tm-para'}}
          />
          <div className={styles.gridOfTwo}>
            <Input
              type="number"
              title="Experience (in Years)"
              fieldName="experience"
              value={employeeDetails.experience}
              onChange={handleChange}
              maxLength="50"
              disabled={disableInputs}
              classes={{title: 'tm-para'}}
            />
            <Input
              type="text"
              title="Highest Qualification"
              fieldName="qualification"
              value={employeeDetails.qualification}
              onChange={handleChange}
              maxLength="50"
              disabled={disableInputs}
              classes={{title: 'tm-para'}}
            />
          </div>
        </div>
      </>
    )
  }

  const renderAdmin = () => {
    return (
      <>
        <div className={styles.empDetails}>
          <div className={styles.gridOfTwo}>
            <Input
              type="text"
              title="Designation"
              fieldName="designation"
              value={employeeDetails.designation}
              onChange={handleChange}
              maxLength="50"
              classes={{title: 'tm-para'}}
            />
            <Input
              type="text"
              title="Employee Type"
              fieldName="employmentType"
              value={employeeDetails.employmentType}
              onChange={handleChange}
              maxLength="50"
              classes={{title: 'tm-para'}}
            />
          </div>
          <Input
            type={
              reduxData.dateOfAppointment && reduxData.dateOfAppointment.length
                ? 'readonly'
                : 'date'
            }
            title="Appointment Date"
            fieldName="dateOfAppointment"
            value={doj}
            maxDate={new Date()}
            onChange={(obj) => {
              setDoj(obj.value)
              setHasEdited(true)
            }}
            classes={{title: 'tm-para'}}
          />
        </div>
        <div className={styles.moreDetails}>
          <Input
            type="number"
            title="Experience (in Years)"
            fieldName="experience"
            value={employeeDetails.experience}
            onChange={handleChange}
            maxLength="50"
            classes={{title: 'tm-para'}}
          />
        </div>
      </>
    )
  }

  return isTeacher ? renderTeacher() : renderAdmin()
}

export default EmployeeDetails
