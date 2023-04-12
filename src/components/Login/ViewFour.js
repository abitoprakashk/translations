import React, {useState, useEffect, useCallback} from 'react'
import {useSelector} from 'react-redux'
import {
  utilsCreateInstitute,
  utilsGetCountryInfo,
  utilsGetUserLocation,
} from '../../routes/login'
import {Trans, useTranslation} from 'react-i18next'
import {events} from '../../utils/EventsConstants'
import {getInstituteType, CURRENCIES_LIST} from '../../utils/Helpers'
import {
  affiliatedBoardOptions,
  departmentOptions,
  classOptions,
} from '../../utils/SampleCSVRows'
import {validateInputs} from '../../utils/Validations'
import InputField from '../Common/InputField/InputField'
import MultipleCheckbox from '../Common/MultipleCheckbox/MultipleCheckbox'
import {INSTITUTE_TYPES} from '../../constants/institute.constants'
import styles from './ViewFour.module.css'
import {Icon} from '@teachmint/common'
import classNames from 'classnames'
import {Input} from '@teachmint/common'
import {LOADER} from '../../constants/loader.constant'

export default function ViewFour({
  instituteType,
  whatsappOptIn,
  setIsGridLoading,
  setErrorOccured,
  getAdminAndInstituteInfo,
  instituteNameTemp,
  setFirstLoginState,
}) {
  const {t} = useTranslation()
  const [instituteName, setInstituteName] = useState(instituteNameTemp || '')
  const [affiliatedBoard, setAffiliatedBoard] = useState(t('select'))
  const [departmentItems, setDepartmentItems] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [fromClass, setFromClass] = useState()
  const [fromClassWeight, setFromClassWeight] = useState(-5)
  const [toClassWeight, setToClassWeight] = useState(15)
  const [toClass, setToClass] = useState()
  const [selectedLanguage, setSelectedLanguage] = useState('en-US')
  const [boardName, setBoardName] = useState('')

  const [academicYearStart, setAcademicYearStart] = useState(null)
  const [academicYearEnd, setAcademicYearEnd] = useState(null)

  const [instituteNameErr, setInstituteNameErr] = useState('')
  const [affiliatedBoardErr, setAffiliatedBoardErr] = useState('')
  const [boardNameErr, setBoardNameErr] = useState('')
  const [classNameErr, setClassNameErr] = useState('')
  const [checkboxItemsErr, setCheckboxItemsErr] = useState('')
  const [academicSessionDateRangeError, setAcademicSessionDateRangeError] =
    useState('')

  const [contectCountryCode, setIsdCode] = useState('')
  const [contactPhoneNumber, setContactPhoneNumber] = useState('')
  const [contactPhoneNumberErr, setContactPhoneNumberErr] = useState(true)
  const [countryData, setCountryData] = useState([])

  const {adminInfo, eventManager} = useSelector((state) => state)
  let instituteTypeTitle = getInstituteType(instituteType)

  useEffect(() => {
    getCountryData()
    getUserLocationData()
    if (instituteType === INSTITUTE_TYPES.TUITION) {
      setAffiliatedBoard('Coaching')
    }
  }, [])

  const validateSignUpFields = (isFinal = false) => {
    let flag = true
    let instituteNameTemp = instituteName?.trim()

    if (
      instituteNameTemp === '' ||
      !validateInputs('instituteName', instituteNameTemp, true)
    ) {
      if (isFinal) setInstituteNameErr(t('required'))
      flag = false
    } else if (instituteNameTemp.length < 3) {
      if (isFinal) setInstituteNameErr(t('enterAtleast3Letters'))
      flag = false
    } else if (isFinal) setInstituteNameErr('')

    if (
      (instituteType === INSTITUTE_TYPES.SCHOOL ||
        instituteType === INSTITUTE_TYPES.TUITION) &&
      affiliatedBoard === 'Select'
    ) {
      if (isFinal) setAffiliatedBoardErr(t('required'))
      flag = false
    } else if (isFinal) setAffiliatedBoardErr('')

    if (
      instituteType === INSTITUTE_TYPES.SCHOOL &&
      affiliatedBoard === 'Others' &&
      boardName.length === 0
    ) {
      if (isFinal) setBoardNameErr('Required')
      flag = false
    } else if (isFinal) setBoardNameErr('')

    if (
      (instituteType === INSTITUTE_TYPES.SCHOOL &&
        departmentItems.filter(({checked}) => checked).length === 0 &&
        (fromClass === null || fromClass === 'Select')) ||
      toClass === null ||
      toClass === 'Select'
    ) {
      if (isFinal) setCheckboxItemsErr(t('required'))
      flag = false
    } else if (isFinal) setCheckboxItemsErr('')

    if (
      adminInfo?.email &&
      (contactPhoneNumber === '' || contactPhoneNumberErr)
    ) {
      if (isFinal) setContactPhoneNumberErr(t('required'))
      flag = false
    } else if (isFinal) setContactPhoneNumberErr('')

    if (
      // instituteType === INSTITUTE_TYPES.SCHOOL &&
      !academicYearStart ||
      !academicYearEnd
    ) {
      if (isFinal) setAcademicSessionDateRangeError(t('required'))
      flag = false
    } else if (academicYearStart > academicYearEnd) {
      if (isFinal)
        setAcademicSessionDateRangeError(
          t('EndDateShouldBeGreaterThanOrEqualToStartDate')
        )
      flag = false
    } else if (isFinal) setAcademicSessionDateRangeError('')

    if (
      instituteType === INSTITUTE_TYPES.SCHOOL &&
      selectedCountry !== 'India' &&
      (!fromClass || !toClass)
    ) {
      if (isFinal) setClassNameErr('Required')
      flag = false
    } else if (isFinal) setClassNameErr('')

    return flag
  }

  const getCountryData = () => {
    utilsGetCountryInfo().then(({status, obj}) => {
      if (status) {
        setCountryData(obj)
      }
    })
  }

  const getUserLocationData = async () => {
    let res = await utilsGetUserLocation()
    if (res.status) {
      setSelectedCountry(res.obj.name)
      if (instituteType === INSTITUTE_TYPES.SCHOOL) {
        if (res.obj.name === 'India') {
          setAffiliatedBoard(t('select'))
        } else {
          setAffiliatedBoard('Others')
        }
      }
    }
  }

  const countryObj = []
  countryData &&
    countryData.forEach((item) => {
      countryObj.push({key: item.country, value: item.country})
    })

  //const languageItems = languageOptions.filter((item) => item.key !== 'Select')

  const addAdminAndInstituteInfo = async () => {
    if (validateSignUpFields(true)) {
      setIsGridLoading({
        [LOADER.addAdminAndInstituteInfo]: true,
      })
      const search = location.search
      const utmSource = new URLSearchParams(search).get('utm_source')
      const utmMedium = new URLSearchParams(search).get('utm_medium')
      const utmCampaign = new URLSearchParams(search).get('utm_campaign')
      const utmContent = new URLSearchParams(search).get('utm_content')
      const utmKeyword = new URLSearchParams(search).get('utm_keyword')

      const lsParams = {}
      if (utmSource) lsParams.utm_source = utmSource
      if (utmMedium) lsParams.utm_medium = utmMedium
      if (utmCampaign) lsParams.utm_campaign = utmCampaign
      if (utmContent) lsParams.utm_content = utmContent
      if (utmKeyword) lsParams.utm_keyword = utmKeyword
      lsParams.source_url = window.location.href

      utilsCreateInstitute(
        instituteName,
        instituteType,
        whatsappOptIn,
        affiliatedBoard !== 'Others' ? affiliatedBoard : boardName,
        selectedCountry === 'India'
          ? departmentItems.filter((item) => item.checked).map(({code}) => code)
          : ['ALL'],
        academicYearStart,
        academicYearEnd,
        adminInfo?.email
          ? [`${contectCountryCode}-${contactPhoneNumber}`]
          : [adminInfo?.phone_number],
        selectedLanguage,
        selectedCountry,
        selectedCurrency,
        fromClass,
        toClass,
        lsParams
      )
        .then(({instituteIdTemp}) => {
          eventManager.send_event(
            events.SIGNUP_SUCCESSFUL,
            {insti_id: instituteIdTemp, insti_type: instituteType},
            true
          )
          eventManager.add_unique_user(adminInfo)
          setFirstLoginState(true)
          getAdminAndInstituteInfo(instituteIdTemp)
        })
        .catch(() => setErrorOccured(true))
        .finally(() => {
          setIsGridLoading({
            [LOADER.addAdminAndInstituteInfo]: false,
          })
        })
    }
  }

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'affiliatedBoard': {
        eventManager.send_event(events.ADMIN_BOARD_NAME_SELECTED_TFI, {
          board: value,
          insti_type: instituteType,
        })
        setAffiliatedBoard(value)
        break
      }
      case 'instituteName': {
        if (validateInputs(fieldName, value, false)) setInstituteName(value)
        break
      }
      case 'phoneNumber': {
        // if (validateInputs('phone_number', value, false))
        setContactPhoneNumber(value)
        break
      }
      case 'countryCode': {
        setIsdCode(value)
        break
      }
      case 'country': {
        eventManager.send_event(events.INSTITUTE_COUNTRY_SELECTED_TFI, {
          country: value,
          insti_type: instituteType,
        })
        value !== 'India'
          ? setAffiliatedBoard('Others')
          : setAffiliatedBoard(t('select'))
        setSelectedCountry(value)
        // console.log(countryData.filter((item) => item.country === value))
        break
      }
      case 'currency': {
        eventManager.send_event(events.INSTITUTE_CURRENCY_SELECTED_TFI, {
          currency: value,
          insti_type: instituteType,
        })
        setSelectedCurrency(value)
        break
      }

      case 'fromClass': {
        setFromClass(value)
        setFromClassWeight(
          classOptions.filter((item) => item.value === value)[0].weight
        )
        break
      }

      case 'toClass': {
        setToClass(value)
        setToClassWeight(
          classOptions.filter((item) => item.value === value)[0].weight
        )
        break
      }

      case 'language': {
        setSelectedLanguage(value)
        break
      }

      case 'boardName': {
        setBoardName(value)
        break
      }
    }
  }

  const onDateChange = useCallback((dateType, value) => {
    const dateSetters = {
      start: setAcademicYearStart,
      end: setAcademicYearEnd,
    }
    dateSetters[dateType](value)
  }, [])

  const handleDepartmentItemsChange = (num, value) => {
    let items = [...departmentItems]
    for (let i = num; i < items.length; i++) {
      items[i].checked = i === num ? value : value ? value : items[i].checked
    }
    setDepartmentItems(items)
    eventManager.send_event(events.ADMIN_DEPARTMENT_SELECTED_TFI, {
      insti_type: instituteType,
      department_count: items.filter((item) => item.checked).length,
    })
  }

  useEffect(() => {
    setDepartmentItems(JSON.parse(JSON.stringify(departmentOptions)))
  }, [])

  useEffect(() => {
    if (selectedCountry && countryData.length) {
      setSelectedCurrency(
        countryData.filter((item) => item.country === selectedCountry)[0]
          ?.currency || 'INR'
      )
      setIsdCode(
        countryData.filter((item) => item.country === selectedCountry)[0]
          ?.isd_code || '91'
      )
    }
  }, [selectedCountry, countryData])

  useEffect(() => {
    if (
      countryData.length &&
      !countryData.find((item) => item.country === selectedCountry)
    ) {
      setSelectedCountry('India')
    }
  }, [countryData])

  useEffect(() => {
    const isLoading = !(selectedCurrency && selectedCountry && countryData)
    setIsGridLoading({
      [LOADER.createInstituteFormLoading]: isLoading,
    })
  }, [selectedCurrency, selectedCountry, countryData])

  return (
    <div>
      <div className="tm-h4">
        <Trans i18nKey="enterDetailsToCreateInstTitle">
          Enter details to create your{' '}
          {{instituteTypeTitle: t(instituteTypeTitle)}}
        </Trans>
      </div>
      <div className="tm-para2 mt-2">
        <Trans i18nKey="tellUsAboutYouAndYour">
          Tell us about you and your {String(instituteTypeTitle).toLowerCase()}
        </Trans>
      </div>

      <div className="mt-4 lg:w-96">
        <InputField
          fieldType="countryName"
          title={t('selectCountry')}
          placeholder="Austraila"
          value={selectedCountry}
          handleChange={handleInputChange}
          fieldName="country"
          dropdownItems={countryData}
          errorText={''}
          searchBar={true}
        />
      </div>
      {instituteType === INSTITUTE_TYPES.SCHOOL && (
        <div className="mt-4 lg:w-96">
          <InputField
            fieldType="currency"
            title={t('selectCurrency')}
            placeholder="Indian Rupee"
            value={selectedCurrency}
            handleChange={handleInputChange}
            fieldName="currency"
            dropdownItems={CURRENCIES_LIST}
            errorText={''}
            searchBar={true}
          />
          <div className={styles.infoBox}>
            <Icon name="info" type="outlined" color="warning" size="xxs" />
            <div className={classNames(styles.infoText, 'tm-para3')}>
              {t('currencyCanNotBeChanged')}
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 lg:w-96">
        {instituteType === INSTITUTE_TYPES.SCHOOL &&
          selectedCountry === 'India' && (
            <InputField
              fieldType="dropdown"
              title={t('affiliatedBoard')}
              placeholder={t('affiliatedBoarPlaceholder')}
              value={affiliatedBoard}
              handleChange={handleInputChange}
              fieldName="affiliatedBoard"
              dropdownItems={affiliatedBoardOptions}
              errorText={affiliatedBoardErr}
              onClick={() => {
                eventManager.send_event(events.ADMIN_BOARD_NAMES_LIST_OPEN_TFI)
              }}
            />
          )}

        {instituteType === INSTITUTE_TYPES.SCHOOL &&
          affiliatedBoard == 'Others' && (
            <div>
              <InputField
                title={t('enterAffiliatedBoard')}
                fieldType="text"
                placeholder={
                  selectedCountry === 'India' ? 'CBSE, ICSE' : 'IB, DepEd, UBEC'
                }
                value={boardName}
                handleChange={handleInputChange}
                fieldName="boardName"
                errorText={boardNameErr}
              />
            </div>
          )}
        {instituteType === INSTITUTE_TYPES.SCHOOL && (
          <div className={styles.infoBox}>
            <Icon name="info" type="outlined" color="warning" size="xxs" />
            <div className={classNames(styles.infoText, 'tm-para3')}>
              {t('boardCannotBeChanged')}
            </div>
          </div>
        )}

        {/* <div className="mt-4 lg:w-96">
          <InputField
            fieldType="dropdown"
            title="Select Language"
            placeholder="English"
            value={selectedLanguage}
            handleChange={handleInputChange}
            fieldName="language"
            dropdownItems={languageItems}
            errorText={''}
          />
        </div> */}

        {selectedCountry !== 'India' &&
          instituteType === INSTITUTE_TYPES.SCHOOL && (
            <>
              <div className="tm-hdg-14 tm-color-text-secondary mb-1 mt-4">
                Select classes
              </div>
              <div className={classNames(styles.selectClassWrapper, 'mb-4')}>
                <Input
                  type="select"
                  placeholder="From Class"
                  fieldName="fromClass"
                  value={fromClass}
                  options={classOptions.filter(
                    (item) => item.weight < toClassWeight
                  )}
                  onChange={(e) => handleInputChange('fromClass', e.value)}
                  classes={{wrapper: styles.inputWrapper}}
                  optionsBoxClassName={'show-scrollbar show-scrollbar-small'}
                  errorMsg={classNameErr}
                  showError={classNameErr.length && !fromClass}
                />
                <Input
                  type="select"
                  placeholder="To Class"
                  fieldName="toClass"
                  value={toClass}
                  options={classOptions.filter(
                    (item) => item.weight > fromClassWeight
                  )}
                  onChange={(e) => handleInputChange('toClass', e.value)}
                  classes={{wrapper: styles.inputWrapper}}
                  optionsBoxClassName={'show-scrollbar show-scrollbar-small'}
                  errorMsg={classNameErr}
                  showError={classNameErr.length && !toClass}
                />
              </div>
            </>
          )}

        {instituteType === INSTITUTE_TYPES.SCHOOL &&
          selectedCountry === 'India' && (
            <>
              <div className="tm-hdg-14 tm-color-text-secondary mb-1">
                {t('selectDepartmentsInYourSchool')}
              </div>
              <MultipleCheckbox
                items={departmentItems}
                handleChange={handleDepartmentItemsChange}
              />
              <div className="tm-para4 mt-1 h-4 tm-color-red">
                {checkboxItemsErr}
              </div>
            </>
          )}

        <div className="tm-hdg-14 tm-color-text-secondary mb-1">
          {t('currentAcademicYear')}
        </div>
        <div className={styles.datePickersWrapper}>
          <InputField
            startDate={academicYearStart}
            endDate={academicYearEnd}
            fieldType="dateRange"
            handleChange={onDateChange}
            fieldName="academicSessionDateRange"
            errorText={academicSessionDateRangeError}
          />
        </div>

        <InputField
          fieldType="text"
          // title={`Enter your ${instituteTypeTitle} name`}
          title={
            <Trans i18nKey="enterYourInstituteTypeName">
              Enter your {{instituteTypeTitle: t(instituteTypeTitle)}} name
            </Trans>
          }
          placeholder={t('instituteNamePlaceholder')}
          value={instituteName}
          handleChange={handleInputChange}
          fieldName="instituteName"
          errorText={instituteNameErr}
          eventName={events.ADMIN_INSTITUTE_NAME_FILLED_TFI}
        />

        {adminInfo?.email && (
          <Input
            // fieldType="phoneNumber"
            // title={t('contactNumber')}
            // placeholder={t('contactNumberPlaceholder')}
            // value={contactPhoneNumber}
            // handleChange={handleInputChange}
            // fieldName="phoneNumber"
            // countryCodeItem={{
            //   value: contectCountryCode,
            //   placeholder: '91',
            //   fieldName: 'countryCode',
            // }}
            // errorText={contactPhoneNumberErr}
            type="phoneNumber"
            title={t('mobileNumber')}
            fieldName="phoneNumber"
            value={contactPhoneNumber}
            countryCodeItem={contectCountryCode}
            isRequired={false}
            setShowError={(val) => setContactPhoneNumberErr(val)}
            onChange={({fieldName, value}) =>
              handleInputChange(fieldName, value)
            }
            classes={{title: 'tm-para'}}
          />
        )}

        <div
          className={`mt-4 lg:mt-8 ${
            validateSignUpFields() ? 'tm-btn1-blue' : 'tm-btn1-gray'
          }`}
          onClick={() => addAdminAndInstituteInfo()}
        >
          <Trans i18nKey="createInstituteTypeTitle">
            Create {{instituteTypeTitle: t(instituteTypeTitle)}}
          </Trans>
        </div>
      </div>
    </div>
  )
}
