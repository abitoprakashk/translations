/*
For Bonafide and Character Certificate Inputs
*/

import React, {useState} from 'react'
import {Input as InputField} from '@teachmint/common'
import s from './InputContainer.module.css'
import moment from 'moment'
import {getDateObjFromString} from '../../../../utils/Helpers'
import {isOnlyAlphabets} from '../../commonFunctions'
const CommonCertificate = ({
  profileData,
  tcAndRemarksData,
  handleInputChange,
  handleInputChangeTCAndRemark,
  certificateType,
  handleDateChange,
  date_of_birth,
  triggerEventOnBlur,
}) => {
  const [classEdited, setClassEdited] = useState(false)

  const {
    name,
    middle_name,
    last_name,
    enrollment_number,
    class_room,
    father_name,
    session_name,
  } = profileData
  const {
    remarks: {general_conduct},
  } = tcAndRemarksData

  return (
    <div className={s.container}>
      <div className={s.input_container}>
        <InputField
          type="text"
          title="First Name"
          placeholder="First Name"
          value={name}
          onChange={({fieldName, value}) => {
            if (isOnlyAlphabets(value) || value == '')
              handleInputChange(fieldName, value)
          }}
          onBlur={triggerEventOnBlur}
          fieldName="name"
          maxLength="50"
          isRequired={true}
          showError={false}
          errorMsg=""
          errorClassName={s.input_error_class}
        />
        <InputField
          type="text"
          title="Middle Name"
          placeholder="Middle Name"
          value={middle_name}
          onChange={({fieldName, value}) => {
            if (isOnlyAlphabets(value) || value == '')
              handleInputChange(fieldName, value)
          }}
          fieldName="middle_name"
          pattern="[A-Za-z]"
          maxLength="50"
          onBlur={triggerEventOnBlur}
        />
        <InputField
          type="text"
          title="Last Name"
          placeholder="Last Name"
          value={last_name}
          onChange={({fieldName, value}) => {
            if (isOnlyAlphabets(value) || value == '')
              handleInputChange(fieldName, value)
          }}
          fieldName="last_name"
          maxLength="50"
          onBlur={triggerEventOnBlur}
        />
      </div>
      <div className={s.input_container}>
        <InputField
          type="text"
          title="Enrol/Adm. No."
          placeholder="43242224"
          value={enrollment_number}
          onChange={({fieldName, value}) =>
            handleInputChange(fieldName, value.trim())
          }
          fieldName="enrollment_number"
          maxLength="20"
          isRequired={true}
          showError={false}
          errorMsg=""
          errorClassName={s.input_error_class}
          onBlur={triggerEventOnBlur}
        />
        <InputField
          type="date"
          title="Date of Birth"
          placeholder="DD/MM/YYYY"
          value={getDateObjFromString(date_of_birth ? date_of_birth : '')}
          onChange={({fieldName, value}) => {
            handleDateChange(fieldName, moment(value).format('DD/MM/YYYY'))
          }}
          fieldName="date_of_birth"
          maxDate={new Date()}
          onBlur={triggerEventOnBlur}
        />
        <InputField
          type="text"
          title="Class"
          placeholder="10-A"
          value={class_room}
          onChange={({fieldName, value}) => {
            setClassEdited(true)
            handleInputChange(fieldName, value)
          }}
          fieldName="class_room"
          disabled={!classEdited && class_room ? true : false}
          maxLength="8"
          onBlur={triggerEventOnBlur}
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="text"
          title="Father's Name"
          placeholder="Father's Name"
          value={father_name}
          onChange={({fieldName, value}) => {
            if (isOnlyAlphabets(value) || value == '')
              handleInputChange(fieldName, value)
          }}
          fieldName="father_name"
          maxLength="50"
          onBlur={triggerEventOnBlur}
        />
      </div>
      {certificateType == 2 && (
        <div className={s.inputContainerTwoDivs}>
          <InputField
            type="text"
            title="General Conduct"
            placeholder="Very Good"
            value={general_conduct}
            onChange={({fieldName, value}) =>
              handleInputChangeTCAndRemark(fieldName, value, 'remarks')
            }
            fieldName="general_conduct"
            maxLength="20"
          />
        </div>
      )}
      <div className={s.input_container}>
        <InputField
          type="text"
          title="Session"
          placeholder="Session 2022-2023"
          value={session_name}
          onChange={({fieldName, value}) => handleInputChange(fieldName, value)}
          fieldName="session_name"
          maxLength="15"
          onBlur={triggerEventOnBlur}
        />
      </div>
    </div>
  )
}

export default CommonCertificate
