import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {Input} from '@teachmint/common'
import styles from './EmployeeBasicInfo.module.css'
import commonStyles from './../../../UserProfileComponent.module.css'
import {BLOOD_GROUPS, GENDERS, PERMANENT_IS_SAME} from '../../../constants'
import DuplicateUserCard from '../../../../../components/SchoolSystem/StudentDirectory/DuplicateUserCard'
import UserFullName from '../UserFullName/UserFullName'
import Address from '../Address/Address'
import {events} from '../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'
import {getActiveTeachers} from '../../../../../redux/reducers/CommonSelectors'

const EmployeeBasicInfo = ({
  userType,
  dataModel,
  basicInfo,
  setBasicInfo,
  handleError,
  setHasEdited,
  isAdd,
  instituteId,
  gotoUpdate,
  setIsSameAddress,
  isSameAddress,
  dob,
  setDob,
  addEvent,
  showOptional,
  setShowOptional,
  disableInputs,
}) => {
  const {t} = useTranslation()
  const [showAddNewProfileView, setShowAddNewProfileView] = useState(false)
  const [duplicateUsers, setDuplicateUsers] = useState([])
  const [aadharErrorMsg, setAadharErrorMsg] = useState('')
  const [pancardErrorMsg, setPancardErrorMsg] = useState('')
  const instituteTeacherList = getActiveTeachers(true)
  const allRoleList = useSelector((state) => [
    ...(state?.globalData?.getAllRoles?.data?.custom || []),
    ...(state?.globalData?.getAllRoles?.data?.default || []),
  ])

  const openViewProfile = (_id) => {
    setShowAddNewProfileView(false)
    setShowOptional(true)
    gotoUpdate(_id)
  }

  const handleChange = ({fieldName, value}) => {
    if (fieldName === 'countryCode')
      setBasicInfo({...basicInfo, [fieldName]: value, phoneNumber: ''})
    else setBasicInfo({...basicInfo, [fieldName]: value})
    setHasEdited(basicInfo[fieldName] === value ? false : true)
  }

  const handleNameChange = (obj) => {
    setHasEdited(true)
    setBasicInfo({...basicInfo, ...obj})
  }

  const handleMobileChange = (obj) => {
    handleChange(obj)
    if (obj.value.length === 10) {
      const duplicates = instituteTeacherList.filter((item) => {
        return (
          // item.phone_number == obj.value ||
          item.phone_number == basicInfo.countryCode + '-' + obj.value
        )
      })
      if (duplicates.length > 0) {
        setDuplicateUsers(duplicates)
        setShowAddNewProfileView(true)
      }
    } else setShowAddNewProfileView(false)
  }

  const handleAddressChange = (key, address) => {
    setHasEdited(true)
    setBasicInfo({...basicInfo, [key]: {...address}})
  }

  const handleAadharBlur = (e) => {
    setAadharErrorMsg('')
    if (e.target.value.length !== 12 && e.target.value.length > 0) {
      setAadharErrorMsg(t('invalidAadharNumber'))
    } else {
      let regex = /^$|^[2-9]{1}[0-9]{11}$/g
      let match = regex.test(e.target.value)
      if (!match) {
        setAadharErrorMsg(t('invalidAadharNumber'))
      } else {
        setAadharErrorMsg('')
      }
    }
  }

  const handlePancardBlur = (e) => {
    setPancardErrorMsg('')
    if (e.target.value.length !== 10 && e.target.value.length > 0) {
      setPancardErrorMsg(t('invalidPanNumber'))
    } else {
      let regex = /^$|^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/g
      let match = regex.test(e.target.value)
      if (!match) {
        setPancardErrorMsg(t('invalidPanNumber'))
      } else {
        setPancardErrorMsg('')
      }
    }
  }
  const showContactFieldErrorBorder =
    isAdd && !basicInfo.phoneNumber && !basicInfo.email.trim()

  return (
    <>
      {isAdd && (
        <div className={styles.sliderFormCueText}>
          {t('inviteUserFormHeadsUp')}
        </div>
      )}
      <div className={styles.mobileEmail}>
        <div className={styles.phoneWrapper}>
          <Input
            errorBorder={showContactFieldErrorBorder}
            type={'phoneNumber'}
            title={t('mobileNumber')}
            fieldName="phoneNumber"
            value={basicInfo.phoneNumber}
            countryCodeItem={basicInfo.countryCode}
            disabled={!isAdd && dataModel.basicInfo.phoneNumber}
            className={
              !isAdd && dataModel.basicInfo.phoneNumber ? styles.noBorder : ''
            }
            setShowError={(val) => handleError(val, 'phone')}
            onChange={handleMobileChange}
            classes={{title: 'tm-para'}}
            // onCountryCodeChange={({value}) => alert(value)}
          />
          {showAddNewProfileView && (
            <DuplicateUserCard
              items={duplicateUsers}
              handleUpdateProfile={openViewProfile}
              handleCreateNewProfile={() => {
                setShowAddNewProfileView(false)
                setShowOptional(true)
              }}
              userType={userType.toLowerCase()}
            />
          )}
        </div>
        <Input
          errorBorder={showContactFieldErrorBorder}
          type={isAdd || !dataModel.basicInfo.email ? 'email' : 'readonly'}
          title={t('emailAddress')}
          fieldName="email"
          value={basicInfo.email}
          disabled={(!isAdd && dataModel.basicInfo.email) || disableInputs}
          setShowError={(val) => handleError(val, 'email')}
          onChange={handleChange}
          classes={{title: 'tm-para'}}
        />
        <Input
          // isRequired
          type={
            isAdd || !dataModel.basicInfo.employeeId.length
              ? 'enrollmentId'
              : 'readonly'
          }
          title={t('employeeIdSm')}
          fieldName="employeeId"
          value={basicInfo.employeeId}
          // isRequired={isAdd || !dataModel.basicInfo.employeeId.length}
          setShowError={(val) => handleError(val, 'employeeId')}
          instituteId={instituteId}
          onChange={handleChange}
          maxLength="20"
          classes={{title: 'tm-para'}}
          className={styles.enrollmentIdWrapper}
          // onBlur={handleEmployementBlur}
          // showError={uniqueErrorMsg.length}
          // errorMsg={uniqueErrorMsg}
        />
      </div>
      <UserFullName
        nameObj={{
          name: basicInfo.name,
          middleName: basicInfo.middleName,
          lastName: basicInfo.lastName,
        }}
        setShowError={handleError}
        setNameObj={handleNameChange}
        disableInputs={disableInputs}
      />
      {userType.toLowerCase() === 'admin' ? (
        <div className={styles.userRole}>
          <Input
            type="select"
            title="User Role"
            fieldName="roles"
            options={allRoleList?.map((role) => ({
              value: role?._id,
              label: role?.name,
            }))}
            isRequired={true}
            disabled={!isAdd}
            value={basicInfo?.roles?.[0]}
            setShowError={(val) => handleError(val, 'userRole')}
            onChange={(obj) => {
              obj.value = [obj.value]
              handleChange(obj)
            }}
            classes={{title: 'tm-para', wrapper: styles.userRoleInput}}
          />
        </div>
      ) : null}
      {!showOptional ? (
        <div
          className={styles.showOptional}
          onClick={() => {
            if (addEvent) addEvent(events.OPTIONAL_DETAILS_CLICKED_TFI)
            setShowOptional(true)
          }}
        >
          {t('addOptionalDetails')}
        </div>
      ) : (
        <>
          <div className={styles.bloodGroup}>
            <Input
              type="select"
              title={t('bloodGroup')}
              fieldName="bloodGroup"
              options={BLOOD_GROUPS}
              value={basicInfo.bloodGroup}
              onChange={handleChange}
              disabled={disableInputs}
              classes={{title: 'tm-para'}}
            />
            <Input
              type={
                dataModel.basicInfo.aadharNumber.length ? 'readonly' : 'number'
              }
              title={t('aadhaarNumber')}
              fieldName="aadharNumber"
              maxLength="12"
              value={basicInfo.aadharNumber}
              setShowError={(val) => handleError(val, 'aadhar')}
              onChange={handleChange}
              onBlur={handleAadharBlur}
              showError={aadharErrorMsg.length}
              errorMsg={aadharErrorMsg}
              disabled={disableInputs}
              classes={{title: 'tm-para'}}
            />
            <Input
              type="text"
              title={t('panDetails')}
              fieldName="panNumber"
              maxLength="10"
              value={basicInfo.panNumber}
              setShowError={(val) => handleError(val, 'pan')}
              onChange={handleChange}
              onBlur={handlePancardBlur}
              showError={pancardErrorMsg.length}
              errorMsg={pancardErrorMsg}
              disabled={disableInputs}
              classes={{title: 'tm-para'}}
            />
          </div>
          <div className={styles.dob}>
            <Input
              type="date"
              title={t('dateOfBirth')}
              fieldName="dateOfBirth"
              value={dob}
              maxDate={new Date()}
              onChange={(obj) => {
                setDob(obj.value)
                setHasEdited(true)
              }}
              disabled={disableInputs}
              classes={{title: 'tm-para'}}
            />
            <Input
              type="radio"
              title={t('gender')}
              fieldName="gender"
              value={basicInfo.gender}
              options={GENDERS}
              onChange={handleChange}
              disabled={disableInputs}
              classes={{title: 'tm-para'}}
            />
          </div>
          <div className={commonStyles.division} />
          <div className={commonStyles.addressHeading}>
            {t('currentAddress')}
          </div>
          <Address
            addressObj={basicInfo.currentAddress}
            setShowError={handleError}
            setAddressObj={(updatedAddress) =>
              handleAddressChange('currentAddress', updatedAddress)
            }
            disableInputs={disableInputs}
          />
          <Input
            type="checkbox"
            isChecked={isSameAddress}
            fieldName="permanent"
            onChange={(obj) => setIsSameAddress(obj.checked)}
            labelTxt={PERMANENT_IS_SAME}
            disabled={disableInputs}
          />
          {!isSameAddress && (
            <>
              <div className={commonStyles.addressHeading}>
                {t('permanentAddress')}
              </div>
              <Address
                addressObj={basicInfo.permanentAddress}
                setShowError={handleError}
                setAddressObj={(updatedAddress) =>
                  handleAddressChange('permanentAddress', updatedAddress)
                }
                disableInputs={disableInputs}
              />
            </>
          )}
        </>
      )}
    </>
  )
}

export default EmployeeBasicInfo
