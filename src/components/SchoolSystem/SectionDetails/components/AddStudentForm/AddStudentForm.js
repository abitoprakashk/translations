import {Input} from '@teachmint/common'
import styles from './AddStudentForm.module.css'
import {studentFields} from '../../../../../utils/InputfieldsData'
// import {useEffect, useState} from 'react'

const AddStudentForm = ({handleInputChange, data, setHasError, children}) => {
  const {
    phone_number,
    enrollment_number,
    standard,
    section,
    name,
    middleName,
    lastName,
  } = studentFields

  return (
    <div className={styles.wrapper}>
      <div className={styles.firstRow}>
        <div className={styles.phoneWrapper}>
          <Input
            type={phone_number.fieldType}
            title={phone_number.title}
            fieldName={phone_number.fieldName}
            value={data[phone_number.fieldName]}
            onChange={handleInputChange}
            isRequired={phone_number.isRequired}
            setShowError={setHasError}
          />
          {children}
        </div>
        <Input
          type={enrollment_number.fieldType}
          title={enrollment_number.title}
          fieldName={enrollment_number.fieldName}
          value={data[enrollment_number.fieldName]}
          onChange={handleInputChange}
          isRequired={enrollment_number.isRequired}
          setShowError={setHasError}
        />
      </div>
      <div className={styles.nameRow}>
        <Input
          type={name.fieldType}
          title={name.title}
          fieldName={name.fieldName}
          value={data[name.fieldName]}
          onChange={handleInputChange}
          isRequired={name.isRequired}
          setShowError={setHasError}
        />
        <div className={styles.middleLast}>
          <Input
            type={middleName.fieldType}
            title={middleName.title}
            fieldName={middleName.fieldName}
            value={data[middleName.fieldName]}
            onChange={handleInputChange}
          />
          <Input
            type={lastName.fieldType}
            title={lastName.title}
            fieldName={lastName.fieldName}
            value={data[lastName.fieldName]}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className={styles.classSection}>
        <Input
          type={standard.fieldType}
          title={standard.title}
          fieldName={standard.fieldName}
          value={data[standard.fieldName]}
          onChange={handleInputChange}
        />
        <Input
          type={section.fieldType}
          title={section.title}
          fieldName={section.fieldName}
          value={data[section.fieldName]}
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}

export default AddStudentForm
