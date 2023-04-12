import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import AcknowledgementPopup from '../Common/AcknowledgementPopup/AcknowledgementPopup'
import CopyInput from '../Common/CopyInput/CopyInput'
import confirmationIcon from '../../assets/images/icons/tick-bg-green.svg'
import {validateInputs} from '../../utils/Validations'
// import InputField from '../Common/InputField/InputField'
import history from '../../history'
import {DASHBOARD} from '../../utils/SidebarItems'
import {events} from '../../utils/EventsConstants'
import inviteTeacherIcon from '../../assets/images/icons/popup/invite-teacher.png'
import ConfirmationPopup from '../Common/ConfirmationPopup/ConfirmationPopup'
import {
  getScreenWidth,
  getTeacherInviteMsg,
  sendTeacherAddedEvent,
} from '../../utils/Helpers'
import {
  defaultTeacherFieldValues,
  teacherFields,
} from '../../utils/InputfieldsData'
import {addUserProfile} from '../../pages/user-profile/apiService'
import {INSTITUTE_TYPES} from '../../constants/institute.constants'
import {Input} from '@teachmint/common'
// import classNames from 'classnames'

export default function ViewSix({setIsLoading, setErrorOccured}) {
  const [showCopiedPopup, setShowCopiedPopup] = useState(false)
  const {t} = useTranslation()
  const [teacherDetails, setTeacherDetails] = useState(
    defaultTeacherFieldValues
  )
  const [errorObject, setErrorObject] = useState({
    phone_number: true,
    teacherName: true,
  })
  const [showInviteRequestPopup, setShowInviteRequestPopup] = useState(false)
  const {adminInfo, instituteInfo, eventManager} = useSelector((state) => state)
  const [ackObject, setAckObject] = useState({title: '', desc: ''})

  const teacherFieldsFiltered = [teacherFields.name, teacherFields.phone_number]

  const handleCopy = () => {
    navigator && navigator.clipboard.writeText(getTeacherInvite())
    setAckObject({
      title: t('linkCopiedSuccessfully'),
      desc: t('AckObjectDesc'),
      btnText: t('goToDashboardBtn'),
    })
    setShowCopiedPopup(true)
    eventManager.send_event(events.INSTITUTE_LINK_COPIED, {
      screen_name: 'onboarding',
    })
  }

  const redirectToDashboard = () => history.push(DASHBOARD)

  const handleInputChange = (fieldName, value) => {
    if (fieldName === 'countryCode' || fieldName === 'phoneNumber') {
      let teacherDetailsTemp = JSON.parse(JSON.stringify(teacherDetails))
      teacherDetailsTemp[
        fieldName === 'countryCode' ? 'country_code' : 'phone_number'
      ] = value
      setTeacherDetails(teacherDetailsTemp)
    } else if (validateInputs(fieldName, value, false)) {
      let teacherDetailsTemp = JSON.parse(JSON.stringify(teacherDetails))
      teacherDetailsTemp[fieldName] = value
      setTeacherDetails(teacherDetailsTemp)
    }
  }

  const handleSetError = (fieldName, error) => {
    let obj = {}
    obj[fieldName] = error
    setErrorObject((errorObject) => ({...errorObject, ...obj}))
  }

  const handleFormSubmit = async () => {
    setErrorObject({})
    let flag = true

    // Validate Teacher Name
    if (String(teacherDetails.name).length <= 0) {
      handleSetError('name', t('required'))
      flag = false
    }

    // Validate Country Code
    if (
      String(teacherDetails.phone_number).length <= 0 ||
      String(teacherDetails.country_code).length <= 0
    ) {
      handleSetError('phone_number', t('required'))
      flag = false
    }

    if (flag && instituteInfo && instituteInfo._id) {
      setIsLoading(true)
      if (!teacherDetails.phone_number.includes('-')) {
        teacherDetails.phone_number =
          teacherDetails.country_code + '-' + teacherDetails.phone_number
      }
      addUserProfile({user_type: 2, users: [teacherDetails]})
        .then(() => {
          sendTeacherAddedEvent(
            eventManager,
            instituteInfo.institute_type,
            'onboarding'
          )
          setAckObject({
            title:
              instituteInfo.institute_type === INSTITUTE_TYPES.SCHOOL
                ? t('onboardingAckObjectTitle')
                : t('onboardingAckObjectInsTitle'),
            desc: t('onboardingAckObjectDesc'),
            btnText: t('goToDashboard'),
          })
          setShowCopiedPopup(true)
        })
        .catch(() => setErrorOccured(true))
        .finally(() => setIsLoading(false))
    }
  }

  const handleShare = () => {
    eventManager.send_event(events.SHARE_LINK_CLICKED_TFI)
    if (navigator && navigator.share)
      navigator.share({
        text: getInviteLink(),
      })
    else setShowInviteRequestPopup(true)
  }

  const getInviteLink = () => {
    if (instituteInfo && instituteInfo._id && adminInfo)
      return `https://www.teachmint.com/join/institute/${
        instituteInfo._id || ''
      }/${adminInfo._id || ''}`
  }

  const getTeacherInvite = () => {
    if (instituteInfo && instituteInfo._id && adminInfo)
      return getTeacherInviteMsg(
        adminInfo.name,
        instituteInfo._id,
        instituteInfo.name,
        adminInfo._id,
        instituteInfo.institute_type
      )
  }

  const handleAddYourselfTeacher = () => {
    if (instituteInfo && adminInfo) {
      setIsLoading(true)
      addUserProfile(
        {
          user_type: 2,
          users: [
            {
              name: adminInfo.name,
              country_code: adminInfo.phone_number?.split('-')?.[0],
              phone_number: adminInfo.phone_number,
            },
          ],
        },
        1
      )
        .then(() => {
          sendTeacherAddedEvent(
            eventManager,
            instituteInfo.institute_type,
            'onboarding'
          )

          // Redirect to homepage if mobile
          if (getScreenWidth() < 1024) {
            var link = document.createElement('a')
            link.href = `https://www.teachmint.com/join/institute/${
              instituteInfo._id || ''
            }/${adminInfo._id || ''}`
            document.body.appendChild(link)
            link.click()
          }

          setAckObject({
            title: t('teacherAddedSuccessfully'),
            desc: t('addYourselfTeacherAckObjectDesc'),
            btnText: t('gotIt'),
          })
          setShowCopiedPopup(true)
        })
        .catch(() => setErrorOccured(true))
        .finally(() => setIsLoading(false))
    }
  }
  const isDisabled = () => {
    let disabled = false
    Object.keys(errorObject).map((key) => {
      if (errorObject[key] === true) disabled = true
    })
    return disabled
  }

  return (
    <div>
      {showCopiedPopup && (
        <AcknowledgementPopup
          onAction={redirectToDashboard}
          icon={confirmationIcon}
          title={ackObject.title}
          desc={ackObject.desc}
          primaryBtnText={ackObject.btnText}
          closeActive={false}
        />
      )}

      {showInviteRequestPopup ? (
        <ConfirmationPopup
          onClose={setShowInviteRequestPopup}
          onAction={handleCopy}
          icon={inviteTeacherIcon}
          title={t('inviteTeachers')}
          desc={getInviteLink()}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('copyLink')}
        />
      ) : null}

      <div className="tm-h4">{t('addTeachersToYourInstitute')}</div>

      <div className="bg-white text-left mt-8 px-3 py-4 lg:p-0 tm-border-radius1 tm-border1 tm-remove-border">
        <div className="tm-para1 tm-color-text-primary tm-border1-light-bottom pb-3">
          {t('addYourFirstTeacherManually')}
        </div>
        <div className="tm-border1-top pt-4 tm-remove-border lg:flex">
          {Object.values(teacherFieldsFiltered).map(({fieldName}) => (
            <>
              {fieldName == 'phone_number' ? (
                <Input
                  type="phoneNumber"
                  title={t('mobileNumber')}
                  fieldName="phoneNumber"
                  value={teacherDetails[fieldName]}
                  countryCodeItem={teacherDetails?.country_code}
                  isRequired={true}
                  // setShowError={(val) => setContactPhoneNumberErr(val)}
                  setShowError={(val) => {
                    setErrorObject({...errorObject, phone_number: val})
                  }}
                  onChange={({fieldName, value}) =>
                    handleInputChange(fieldName, value)
                  }
                />
              ) : (
                <div className="mb-1 w-full lg:w-96 mr-8" key={fieldName}>
                  <Input
                    type="text"
                    title={'Teacher Name'}
                    // maxLength="10"
                    isRequired={true}
                    setShowError={(val) =>
                      setErrorObject({...errorObject, teacherName: val})
                    }
                    value={teacherDetails[fieldName]}
                    handleChange={handleInputChange}
                    fieldName={fieldName}
                    onChange={({fieldName, value}) =>
                      handleInputChange(fieldName, value)
                    }
                    classes={{title: 'tm-para'}}
                  />
                  {/* <Input
                      fieldType={fieldType}
                      title={title}
                      placeholder={placeholder}
                      value={teacherDetails[fieldName]}
                      handleChange={handleInputChange}
                      fieldName={fieldName}
                      countryCodeItem={
                        fieldName === 'phone_number'
                          ? {
                              ...teacherFields.country_code,
                              value: teacherDetails.country_code,
                            }
                          : null
                      }
                      errorText={errorObject[fieldName]}
                    /> */}
                </div>
              )}
            </>
          ))}
        </div>

        <button
          className={'mt-3 ml-4 tm-btn2-blue w-full lg:w-max'}
          onClick={handleFormSubmit}
          disabled={isDisabled()}
        >
          {t('addTeacher')}
        </button>
      </div>

      {adminInfo?.phone_number && (
        <>
          <div className="tm-border1-dark-top flex justify-center mt-8 mb-4">
            <div className="relative -top-2.5 tm-para2 tm-bg-light-blue rounded-full">
              <i>{t('OR')}</i>
            </div>
          </div>

          <div className="tm-bg-medium-blue p-4 text-center tm-border-radius1 tm-border1-dark lg:flex lg:justify-between">
            <div className="tm-h6">{t('wantToSeeHowThingsWork')}</div>
            <div
              onClick={() => {
                eventManager.send_event(
                  events.TRY_YOURSELF_AS_TEACHER,
                  {screen_name: 'onboarding'},
                  true
                )
                handleAddYourselfTeacher()
              }}
              className="tm-h6 tm-color-blue mt-4 lg:mt-0 cursor-pointer"
            >
              {t('tryyourselfAsTeacher')}
            </div>
          </div>
        </>
      )}

      <div className="tm-border1-dark-top flex justify-center mt-8 mb-4">
        <div className="relative -top-2.5 tm-para2 tm-bg-light-blue rounded-full">
          <i>{t('OR')}</i>
        </div>
      </div>

      <div className="bg-white tm-border-radius1 tm-border1 px-3 py-4 mt-4 mb-5 tm-remove-border lg:text-left lg:m-0 lg:px-0">
        <div className="tm-para1 tm-color-text-primary mb-3">
          {t('inviteTeachersByLink')}
        </div>
        <CopyInput
          copyText={getInviteLink()}
          btnText="inviteTeachers"
          handleCopy={handleCopy}
        />
        <div className="tm-btn2-blue mt-5 lg:hidden" onClick={handleShare}>
          {t('inviteTeachers')}
        </div>
      </div>
    </div>
  )
}
