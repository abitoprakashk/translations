import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction, showToast} from '../../../redux/actions/commonAction'
import {utilsCreateStaff} from '../../../routes/staff'
import {
  defaultStaffFieldValues,
  staffFields,
} from '../../../utils/fieldsData/staffFieldsData'
// import InputField from '../../Common/InputField/InputField'
import {Input} from '@teachmint/common'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import {useCountryCode} from '../../../redux/reducers/CommonSelectors'
import classNames from 'classnames'
import style from './SliderAddStaff.module.scss'
import {events} from '../../../utils/EventsConstants'
export default function SliderAddStaff({setSliderScreen, getStaffList}) {
  const [staffMemberDetails, setStaffMemberDetails] = useState(
    defaultStaffFieldValues
  )
  const [errorObject, setErrorObject] = useState({
    name: true,
    phone_number: true,
    staff_type: true,
  })

  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)
  const instituteCountryCode = useCountryCode()

  useEffect(() => {
    setStaffMemberDetails({
      ...staffMemberDetails,
      country_code: instituteCountryCode,
    })
  }, instituteCountryCode)

  const handleInputChange = ({fieldName, value}) => {
    let teacherDetailsTemp = JSON.parse(JSON.stringify(staffMemberDetails))
    if (fieldName === 'countryCode') {
      teacherDetailsTemp.phone_number = ''
    }
    teacherDetailsTemp[
      fieldName == 'countryCode' ? 'country_code' : fieldName
    ] = value
    setStaffMemberDetails(teacherDetailsTemp)
  }

  const handleSetError = (fieldName, error) => {
    let obj = {}
    obj[fieldName] = error
    setErrorObject((errorObject) => ({...errorObject, ...obj}))
  }

  const handleFormSubmit = () => {
    setErrorObject({})
    let flag = true

    // Validate Teacher Name
    if (String(staffMemberDetails.name).length <= 0) {
      handleSetError('name', 'Required')
      flag = false
    }

    // Validate phone number and country Code
    if (
      errorObject.phone_number == true ||
      staffMemberDetails.phone_number.length < 1
    ) {
      // handleSetError('phone_number', 'Required')
      flag = false
    }

    // Validate phone number and country Code
    if (staffMemberDetails.staff_type === 'Select') {
      handleSetError('staff_type', 'Required')
      flag = false
    }

    if (flag) {
      dispatch(showLoadingAction(true))
      utilsCreateStaff(staffMemberDetails)
        .then(() => {
          eventManager.send_event(events.STAFF_ADDED_TFI, {
            staff_type: staffMemberDetails?.staff_type,
          })
          dispatch(
            showToast({
              type: 'success',
              message: `Staff member successfully added`,
            })
          )
          getStaffList()
          setSliderScreen(null)
        })
        .catch(() =>
          dispatch(
            showToast({
              type: 'error',
              message: `Unable to successfully staff member`,
            })
          )
        )
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  const setShowError = (val, fieldName) => {
    setErrorObject({...errorObject, [fieldName]: val})
  }

  const isDisabled = () => {
    if (
      staffMemberDetails.name &&
      staffMemberDetails.staff_type !== 'Select' &&
      !errorObject.phone_number
    )
      return false
    else return true
  }

  return (
    <SliderScreen setOpen={() => setSliderScreen(null)}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
          title="Staff Details"
        />

        <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
          <div className="flex flex-wrap">
            {Object.values(staffFields)
              .filter(({fieldType}) => fieldType !== 'country_code')
              .map(
                ({fieldType, title, placeholder, fieldName, dropdownItems}) => (
                  <div className="w-full mb-2" key={fieldName}>
                    <Input
                      type={fieldType}
                      title={title}
                      placeholder={placeholder}
                      value={staffMemberDetails[fieldName]}
                      onChange={handleInputChange}
                      fieldName={fieldName}
                      options={dropdownItems}
                      countryCodeItem={
                        staffMemberDetails.country_code || instituteCountryCode
                      }
                      setShowError={(val) => {
                        setShowError(val, fieldName)
                      }}
                      isRequired={true}
                      classes={{title: 'tm-para'}}
                    />
                  </div>
                )
              )}
          </div>

          <div
            className={classNames('tm-btn2-blue mt-3 submit', {
              [style.disabled]: isDisabled(),
            })}
            onClick={handleFormSubmit}
          >
            Add Staff
          </div>
        </div>
      </>
    </SliderScreen>
  )
}
