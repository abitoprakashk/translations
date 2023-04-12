import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import history from '../../../../history'
import {ErrorBoundary, Input, FlatAccordion} from '@teachmint/common'
import commonStyles from './../../UserProfileComponent.module.css'
import styles from './Institute.module.css'
import classNames from 'classnames'

import Header from './components/Header/Header'
import Address from '../common/Address/Address'
import Footer from '../common/Footer/Footer'
import {updateProfileAction} from './../../redux/actions/instituteActions'
import {BASIC_INFO, INSTITUTE_HEADER_DESCRIPTION} from '../../constants'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {events} from '../../../../utils/EventsConstants'
import ConfirmationPopup from '../../../../components/Common/ConfirmationPopup/ConfirmationPopup'

const Institute = ({setSliderScreen}) => {
  const {instituteInfo: institute} = useSelector((state) => state)
  const eventManager = useSelector((state) => state.eventManager)
  const dispatch = useDispatch()

  const [instituteLogo, setInstituteLogo] = useState(null)
  const [name, setName] = useState(institute.name || '')
  const [phoneNumber, setPhoneNumber] = useState(institute.phone_numbers)
  const [affiliationNumber, setAffiliationNumber] = useState(
    institute.affiliation_number || ''
  )
  const [affiliatedBy, setAffiliatedBy] = useState(
    institute.affiliated_by || ''
  )
  const [schoolCode, setSchoolCode] = useState(institute.school_code || '')
  const [email, setEmail] = useState(institute.email || '')
  const [website, setWebsite] = useState(institute.website || '')
  const [hasError, setHasError] = useState([])
  // const [phoneErrorMsg, setPhoneErrorMsg] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  const initAddress = {
    country: 'India',
    line1: '',
    line2: '',
    pin: '',
    state: '',
    city: '',
  }
  const setAddressObj = (address) => {
    if (!address) return initAddress
    return {
      line1: address.line1 || initAddress.line1,
      line2: address.line2 || initAddress.line2,
      country: address.country || initAddress.country,
      pin: address.pin || initAddress.pin,
      state: address.state || initAddress.state,
      city: address.city || initAddress.city,
    }
  }
  const [address, setAddress] = useState(setAddressObj(institute.address))

  const checkValidations = () => {
    if (hasError.length) return true
    return (
      !name.trim() ||
      !address.state.trim() ||
      !address.line1.trim() ||
      !address.pin.trim() ||
      !address.city.trim()
    )
  }

  const handleError = (val, fieldName) => {
    if (val) {
      if (!hasError.includes(fieldName)) setHasError([...hasError, fieldName])
    } else {
      let index = hasError.indexOf(fieldName)
      if (index !== -1) {
        let tmp = [...hasError]
        tmp.splice(index, 1)
        setHasError(tmp)
      }
    }
  }

  const handleUpdateProfile = () => {
    let data = {
      name,
      email,
      website,
      phone_numbers:
        typeof phoneNumber === 'object' ? phoneNumber : [phoneNumber],
      affiliation_number: affiliationNumber,
      affiliated_by: affiliatedBy,
      school_code: schoolCode,
      address,
    }
    eventManager.send_event(
      events.REPORT_CARD_SCHOOL_DETAILS_UPDATE_CLICKED_TFI,
      data
    )
    dispatch(updateProfileAction({instituteId: institute._id, data}))
    if (setSliderScreen) {
      eventManager.send_event(
        events.REPORT_CARD_SCHOOL_DETAILS_UPDATED_TFI,
        data
      )
      setSliderScreen(false)
    } else {
      history.goBack()
    }
  }

  // const handlePhoneBlur = (e) => {
  //   let val = e.target.value.toString()
  //   if (val.length > 0) {
  //     let regex = /^[0-9-]{7,13}$/g
  //     let match = regex.test(val)
  //     if (!match) {
  //       setPhoneErrorMsg('Invalid Phone number')
  //       // e.target.focus()
  //     } else {
  //       setPhoneErrorMsg('')
  //     }
  //   }
  // }

  const renderInstituteProfile = () => {
    return (
      <>
        <div className={styles.instiNameNumber}>
          <div>
            <Input
              type="text"
              title="Name"
              fieldName="name"
              value={name}
              isRequired={true}
              maxLength="50"
              setShowError={(val) => handleError(val, 'name')}
              onChange={(obj) => setName(obj.value)}
              classes={{title: 'tm-para'}}
            />
            <div className={styles.textLength}>{name.length}/50</div>
          </div>
          <Input
            type="text"
            title="Institute Contact Number"
            fieldName="phoneNumber"
            value={phoneNumber}
            setShowError={(val) => handleError(val, 'phone')}
            onChange={(obj) => {
              var numPattern = /^[0-9-]{0,20}$/
              if (obj.value === '' || numPattern.test(obj.value))
                setPhoneNumber(obj.value)
            }}
            // onBlur={handlePhoneBlur}
            // showError={phoneErrorMsg.length}
            // errorMsg={phoneErrorMsg}
            maxLength="20"
            classes={{title: 'tm-para'}}
          />
        </div>
        {institute.institute_type === 'SCHOOL' && (
          <div className={styles.instiAffiliation}>
            <Input
              type="text"
              title="Affiliation Number"
              maxLength="50"
              fieldName="affiliationNumber"
              value={affiliationNumber}
              onChange={(obj) => setAffiliationNumber(obj.value)}
              classes={{title: 'tm-para'}}
            />
            <Input
              type={!institute.affiliated_by ? 'text' : 'readonly'}
              title="Affiliated Board"
              value={affiliatedBy}
              onChange={(obj) => setAffiliatedBy(obj.value)}
              classes={{title: 'tm-para'}}
            />
            <Input
              type="text"
              maxLength="50"
              title="School Code"
              fieldName="schoolCode"
              value={schoolCode}
              onChange={(obj) => setSchoolCode(obj.value)}
              classes={{title: 'tm-para'}}
            />
          </div>
        )}
        <div className={styles.instiEmail}>
          <Input
            type="email"
            title="Email ID"
            fieldName="email"
            value={email}
            setShowError={(val) => handleError(val, 'email')}
            onChange={(obj) => setEmail(obj.value)}
            classes={{title: 'tm-para'}}
          />

          <Input
            type="text"
            title="Website URL"
            fieldName="websiteUrl"
            value={website}
            setShowError={(val) => handleError(val, 'url')}
            onChange={(obj) => setWebsite(obj.value)}
            classes={{title: 'tm-para'}}
          />
        </div>
        <div className={commonStyles.division} />
        <div className={commonStyles.addressHeading}>Institute Address</div>
        <Address
          addressObj={address}
          setAddressObj={setAddress}
          setShowError={handleError}
          isMandatory={true}
        />
      </>
    )
  }

  const getLogo = () => {
    if (instituteLogo) {
      if (instituteLogo === '0') return null
      return URL.createObjectURL(instituteLogo)
    }
    return institute.ins_logo
  }

  const sliderContent = () => {
    return (
      <ErrorBoundary>
        <div
          className={classNames(commonStyles.wrapper, commonStyles.footerGrid)}
        >
          <div className={commonStyles.formContainer}>
            <Header
              logo={getLogo()}
              setLogo={setInstituteLogo}
              descriptionObj={{
                ...INSTITUTE_HEADER_DESCRIPTION,
                id: institute._id,
              }}
              isInstitute={true}
            />
            <FlatAccordion title={BASIC_INFO} isOpen={true}>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.instituteController_updateRoute_update
                }
                showOpacity={false}
              >
                <div className={commonStyles.accordionDiv}>
                  {renderInstituteProfile()}
                </div>
              </Permission>
            </FlatAccordion>
          </div>
          <Footer
            isDisabled={checkValidations()}
            handleUpdateProfile={() => setShowConfirmation(true)}
            permissionId={
              PERMISSION_CONSTANTS.instituteController_updateRoute_update
            }
          />
          {showConfirmation && (
            <ConfirmationPopup
              title={'Update institute details?'}
              desc={
                'Updated details will reflect in newly created Report Cards, Certificates and ID Cards'
              }
              onAction={handleUpdateProfile}
              onClose={() => setShowConfirmation(false)}
              primaryBtnText={'Cancel'}
              secondaryBtnText={'Update'}
            />
          )}
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <>
      <ErrorBoundary>
        <div className={styles.container}>{sliderContent()}</div>
      </ErrorBoundary>
    </>
  )
}

export default Institute
