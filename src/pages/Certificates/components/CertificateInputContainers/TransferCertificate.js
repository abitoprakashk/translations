import React from 'react'
import {Input as InputField} from '@teachmint/common'
import s from './InputContainer.module.css'
import {useState} from 'react'
import {ToggleSwitch} from '@teachmint/common'
import {getDateObjFromString} from '../../../../utils/Helpers'
import moment from 'moment'
import {isOnlyAlphabets} from '../../commonFunctions'

const TransferCertificate = ({
  profileData,
  tcAndRemarks,
  handleInputChange,
  handleInputChangeTCAndRemark,
  handleDateChange,
  date_of_birth,
  date_of_admission,
  date_of_issue,
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
    nationality,
    mother_name,
    admission_class,
  } = profileData

  const {
    tc: {
      dob_in_word,
      ref_no,
      sl_no,
      last_studied_class,
      last_class_percent,
      whether_failed,
      achievement,
      leaving_reason,
      extra_curricular_activity,
      ncc_or_scout,
      promoted_to_class,
      promoted_to_class_in_words,
      month_due_fees,
      fee_concession,
      total_working_days,
      total_day_present,
      promoted_to_higher_class,
      subject,
      caste,
    },
    remarks: {general_conduct, remark},
  } = tcAndRemarks

  return (
    <div className={s.container}>
      <div className={s.input_container}>
        <InputField
          type="number"
          title="SL. NO."
          placeholder="129"
          value={sl_no}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="sl_no"
          maxLength="15"
        />
        <InputField
          type="text"
          title="Enrol/Adm. No."
          placeholder="1241233"
          value={enrollment_number}
          onChange={({fieldName, value}) =>
            handleInputChange(fieldName, value.trim())
          }
          fieldName="enrollment_number"
          maxLength="15"
          isRequired={true}
          errorClassName={s.input_error_class}
        />
        <InputField
          type="number"
          title="Reference Number"
          placeholder="4242123445"
          value={ref_no}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="ref_no"
          maxLength="15"
        />
      </div>
      <div className={s.input_container}>
        <InputField
          type="text"
          title="First Name"
          placeholder=""
          value={name}
          onChange={({fieldName, value}) => {
            if (isOnlyAlphabets(value) || value == '')
              handleInputChange(fieldName, value)
          }}
          fieldName="name"
          maxLength="50"
          isRequired={true}
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
          maxLength="50"
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
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="text"
          title="Mother's Name"
          placeholder="Mother's Name"
          value={mother_name}
          onChange={({fieldName, value}) => {
            if (isOnlyAlphabets(value) || value == '')
              handleInputChange(fieldName, value)
          }}
          fieldName="mother_name"
          maxLength="50"
        />
      </div>
      <div className={s.input_container}>
        <InputField
          type="text"
          title="Nationality"
          placeholder="Indian"
          value={nationality}
          onChange={({fieldName, value}) => {
            if (isOnlyAlphabets(value) || value == '')
              handleInputChange(fieldName, value)
          }}
          fieldName="nationality"
          maxLength="56"
        />
        <InputField
          type="text"
          title="Class"
          placeholder="10-E"
          value={class_room}
          onChange={({fieldName, value}) => {
            setClassEdited(true)
            handleInputChange(fieldName, value)
          }}
          fieldName="class_room"
          disabled={!classEdited && class_room ? true : false}
          maxLength="8"
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
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="text"
          title="Date of Birth in words"
          placeholder="Fifteen August Nineteen Forty Seven"
          value={dob_in_word}
          onChange={({fieldName, value}) => {
            if (isOnlyAlphabets(value) || value == '')
              handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }}
          fieldName="dob_in_word"
          maxLength="60"
        />
        <InputField
          type="text"
          title="Admission Class"
          placeholder="4-A"
          value={admission_class}
          onChange={({fieldName, value}) => handleInputChange(fieldName, value)}
          fieldName="admission_class"
          maxLength="8"
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="date"
          title="Date of Admission"
          placeholder="DD/MM/YYYY"
          value={getDateObjFromString(
            date_of_admission ? date_of_admission : ''
          )}
          onChange={({fieldName, value}) => {
            handleDateChange(fieldName, moment(value).format('DD/MM/YYYY'))
          }}
          fieldName="date_of_admission"
          maxDate={new Date()}
          isRequired={true}
          errorClassName={s.input_error_class}
        />

        <InputField
          type="text"
          title="Last Class Studied"
          placeholder="10"
          value={last_studied_class}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="last_studied_class"
          maxLength="30"
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="number"
          title="Last Class Percentage"
          placeholder="85"
          value={last_class_percent}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="last_class_percent"
          maxLength="3"
        />
        <InputField
          type="text"
          title="Whether Failed"
          placeholder="Yes/No"
          value={whether_failed}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="whether_failed"
          maxLength="3"
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="date"
          title="Date of Issue"
          placeholder="DD/MM/YYYY"
          value={getDateObjFromString(date_of_issue ? date_of_issue : '')}
          onChange={({fieldName, value}) => {
            handleDateChange(fieldName, moment(value).format('DD/MM/YYYY'))
          }}
          fieldName="date_of_issue"
        />
        <InputField
          type="text"
          title="Remark"
          placeholder="Remark"
          value={remark}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'remarks')
          }
          fieldName="remark"
          maxLength="50"
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="text"
          title="Category"
          placeholder="General / OBC / SC / ST"
          value={caste}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="caste"
          maxLength="15"
        />

        <InputField
          type="text"
          title="Achievement"
          placeholder="Gold Medalist"
          value={achievement}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="achievement"
          maxLength="50"
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="text"
          title="Subjects (comma separated)"
          placeholder="English, Maths"
          value={subject}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="subject"
          maxLength="150"
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="text"
          title="Extra Curricular Activity"
          placeholder="Group Song"
          value={extra_curricular_activity}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="extra_curricular_activity"
          maxLength="50"
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="text"
          title="Reason for leaving"
          placeholder="Reason"
          value={leaving_reason}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="leaving_reason"
          maxLength="50"
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="text"
          title="NCC or Scout?"
          placeholder="No/NCC/Scout"
          value={ncc_or_scout}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="ncc_or_scout"
          maxLength="10"
        />
        <InputField
          type="text"
          title="General Conduct"
          placeholder="Very Good"
          value={general_conduct}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'remarks')
          }
          fieldName="general_conduct"
          maxLength="50"
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <div>
          <ToggleSwitch
            id="promoted_to_higher_class"
            onChange={(value) => {
              handleInputChangeTCAndRemark(
                'promoted_to_higher_class',
                value,
                'tc'
              )
            }}
            optionLabels={['Yes', 'No']}
            checked={promoted_to_higher_class}
            small={true}
            name="promoted_to_higher_class"
          />
          <label className="tm-para2 " htmlFor="promoted_to_higher_class">
            Promoted:
          </label>
          <spam>{promoted_to_higher_class ? ' Yes' : ' No'}</spam>
        </div>
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="text"
          title="Promoted To Class"
          placeholder="10"
          value={promoted_to_class}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="promoted_to_class"
          disabled={!promoted_to_higher_class}
        />
        <InputField
          type="text"
          title="Promoted To Class (Words)"
          placeholder="Ten"
          value={promoted_to_class_in_words}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="promoted_to_class_in_words"
          maxLength="50"
          disabled={!promoted_to_higher_class}
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="text"
          title="Fees Due"
          placeholder="Yes/No"
          value={month_due_fees}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="month_due_fees"
          maxLength="7"
        />
        <InputField
          type="text"
          title="Fee Concession"
          placeholder="Yes, Single Girl Child"
          value={fee_concession}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="fee_concession"
          maxLength="50"
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="number"
          title="Total Working Days"
          placeholder="300"
          value={total_working_days}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="total_working_days"
          maxLength="5"
        />
        <InputField
          type="number"
          title="Total Day Present"
          placeholder="250"
          value={total_day_present}
          onChange={({fieldName, value}) =>
            handleInputChangeTCAndRemark(fieldName, value, 'tc')
          }
          fieldName="total_day_present"
          maxLength="5"
        />
      </div>
      <div className={s.inputContainerTwoDivs}>
        <InputField
          type="text"
          title="Session"
          placeholder="Session 2022-2023"
          value={session_name}
          onChange={({fieldName, value}) => handleInputChange(fieldName, value)}
          fieldName="session_name"
          maxLength="15"
        />
      </div>
    </div>
  )
}

export default TransferCertificate
