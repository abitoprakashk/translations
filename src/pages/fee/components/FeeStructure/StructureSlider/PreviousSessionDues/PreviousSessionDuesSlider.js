import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {JSObjectToCSV} from '../../../../../../utils/Helpers'
import {utilsGetUsersListDetailed} from '../../../../../../routes/dashboard'
import SliderScreen from '../../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {alphaRegex, numericRegex} from '../../../../../../utils/Validations'
import {
  Button,
  ErrorBoundary,
  Icon,
  Input,
  MultiSelectInput,
  StickyFooter,
} from '@teachmint/common'
import {
  alphaFields,
  numericFields,
} from '../../StructureValidations/FeeStructureValidations'
import {
  showErrorToast,
  showLoadingAction,
  showToast,
} from '../../../../../../redux/actions/commonAction'
import ConfirmationPopup from '../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import CSVUploadCardV1 from '../../../../../../components/Common/CSVUploadCardV1/CSVUploadCardV1'
import {
  formatStudentsList,
  validateStructureData,
  validateStudentDuesCSV,
} from './PreviousSessionDuesSliderValidation'
import FormError from '../../../tfi-common/FormError/FormError'
import styles from './PreviousSessionDuesSlider.module.css'
import {
  useFeeStructure,
  usePreviousSessionDueSettings,
} from '../../../../redux/feeStructure/feeStructureSelectors'
import feeStructureActionTypes from '../../../../redux/feeStructure/feeStructureActionTypes'

export default function PreviousSessionDuesSlider({
  setSliderScreen,
  data,
  width,
}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {
    feeTypes,
    previousYearDuesLoading,
    // previousYearDuesError,
    receiptPrefixExistsLoading,
    // receiptPrefixExistsError,
  } = useFeeStructure()
  const fee_types = feeTypes.map((type) => {
    return {
      value: type._id,
      label: type.name,
    }
  })
  const previousSessionDueSettings = usePreviousSessionDueSettings()
  let {initialValues} = JSON.parse(JSON.stringify(data))
  const [formValues, setFormValues] = useState(initialValues)
  const [formErrors, setFormErrors] = useState({})
  const [isReceiptNoDisabled, setIsReceiptNoDisabled] = useState(false)
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)

  const handleChange = (name, value) => {
    if (
      (alphaFields.includes(name) && !alphaRegex(value)) ||
      (numericFields.includes(name) && !numericRegex(value))
    ) {
      return
    }
    const formData = {...formValues}
    formData[name] = name === 'receipt_prefix' ? value.toUpperCase() : value
    setFormValues(formData)
  }

  const downloadExistingStudentCSV = () => {
    const errors = validateStructureData(formValues, t, true)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    showLoadingAction(true)
    utilsGetUsersListDetailed().then(({status, obj}) => {
      if (status) {
        const {header, list} = formatStudentsList(
          [...obj],
          feeTypes,
          formValues
        )
        let a = document.querySelector('#downloadPreviousYearDues')
        a.href =
          'data:attachment/csv,' +
          encodeURIComponent(JSObjectToCSV(header, list))
        a.click()
        showLoadingAction(false)
      }
    })
  }

  const formatSheetData = (check, processedCSVObject) => {
    if (!processedCSVObject) {
      dispatch(showToast({type: 'error', message: t('fileTypeNotSupported')}))
      return
    }

    const csvFeeCategories = processedCSVObject.headers.slice(
      processedCSVObject.headers.indexOf('Email') + 1
    )
    let validationObject = validateStudentDuesCSV(
      processedCSVObject,
      feeTypes,
      csvFeeCategories,
      t
    )
    if (!validationObject.status) {
      dispatch(showErrorToast(validationObject.msg))
      return
    }

    // Format category schema
    let feeCategories = []
    let selectedCategories = {}
    feeTypes.forEach((type) => {
      selectedCategories[type.name] = type._id
    })
    processedCSVObject.rows.forEach((row) => {
      csvFeeCategories.forEach((type) => {
        feeCategories.push({
          student_id: row['UID*'],
          master_id: selectedCategories[type],
          amount: row[type] ? parseFloat(row[type]) : 0,
          is_delete: false,
        })
      })
    })
    setFormValues({
      ...formValues,
      fee_categories: feeCategories,
    })
  }

  const checkForReceiptPrefix = () => {
    if (formValues.receipt_prefix.length > 0)
      dispatch({
        type: feeStructureActionTypes.RECEIPT_PREFIX_EXISTS_REQUESTED,
        payload: {
          prefix: formValues.receipt_prefix,
          formValues: formValues,
          setFormValues: setFormValues,
          setIsReceiptNoDisabled: setIsReceiptNoDisabled,
        },
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const errors = validateStructureData(formValues, t)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    dispatch({
      type: feeStructureActionTypes.PREVIOUS_YEAR_DUES_REQUESTED,
      payload: formValues,
    })
  }

  const isSubmitDisabled =
    !formValues.receipt_prefix ||
    !formValues.series_starting_number ||
    formValues.fee_categories.length === 0 ||
    formValues.fee_types.length === 0

  return (
    <>
      {showConfirmPopup && (
        <ConfirmationPopup
          onClose={() => setShowConfirmPopup(false)}
          onAction={() => {
            setShowConfirmPopup(false)
            setSliderScreen(null)
          }}
          icon={
            <Icon
              name="info"
              color="warning"
              className={classNames(
                styles.higherSpecificityFont,
                styles.higherSpecificitySize,
                styles.confirmIcon
              )}
            />
          }
          title={t('previousDuesExitConfirmModalTitle')}
          desc={t('previousDuesExitConfirmModalDesc')}
          primaryBtnText={t('previousDuesBtnTextContinueEditing')}
          secondaryBtnText={t('previousDuesBtnTextYesExit')}
        />
      )}
      <SliderScreen setOpen={() => setShowConfirmPopup(true)} width={width}>
        <>
          <SliderScreenHeader
            icon={<Icon name="restore" size="s" />}
            title={t('previousYearDues')}
          />
          <ErrorBoundary>
            <div
              className={classNames(
                styles.container,
                'show-scrollbar show-scrollbar-big'
              )}
            >
              {receiptPrefixExistsLoading || previousYearDuesLoading ? (
                <div className="loader"></div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <div className={styles.inputGroup}>
                      <Input
                        type="text"
                        title={t('receiptPrefixWithStar')}
                        fieldName="receipt_prefix"
                        value={formValues.receipt_prefix}
                        disabled={
                          previousSessionDueSettings.previous_due_exists.status
                        }
                        onChange={({fieldName, value}) =>
                          handleChange(fieldName, value)
                        }
                        onBlur={checkForReceiptPrefix}
                        classes={{
                          wrapper: styles.inputWrapper,
                          title: 'tm-para',
                        }}
                      />
                      <FormError errorMessage={formErrors.receipt_prefix} />
                    </div>
                    <div className={styles.inputGroup}>
                      <Input
                        type="text"
                        title={t('receiptStartingNumberWithStar')}
                        fieldName="series_starting_number"
                        disabled={
                          previousSessionDueSettings.previous_due_exists
                            .status || isReceiptNoDisabled
                        }
                        value={formValues.series_starting_number}
                        onChange={({fieldName, value}) =>
                          handleChange(fieldName, value)
                        }
                        classes={{
                          wrapper: styles.inputWrapper,
                          title: 'tm-para',
                        }}
                      />
                      <FormError
                        errorMessage={formErrors.series_starting_number}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <div className={styles.inputGroup}>
                      <div className={styles.label}>{t('feeCategories')}</div>
                      <div className={styles.chipColor}>
                        <MultiSelectInput
                          withTags={true}
                          options={fee_types}
                          showSelectAll={true}
                          onChange={(value) => handleChange('fee_types', value)}
                          selectedOptions={formValues.fee_types}
                          frozenOptions={data.initialValues.fee_types}
                          dropdownClassName={
                            'show-scrollbar show-scrollbar-small'
                          }
                        />
                        <FormError errorMessage={formErrors.fee_types} />
                      </div>
                    </div>
                  </div>
                  <div className={styles.divider} />
                  <div className={styles.heading}>{t('stepsToFollow')}</div>
                  <ol className={styles.points}>
                    <li>{t('previousDuesUploadStep1')}</li>
                    <li>{t('previousDuesUploadStep2')}</li>
                    <li>{t('previousDuesUploadStep3')}</li>
                    <li>{t('previousDuesUploadStep4')}</li>
                    <li>{t('previousDuesUploadStep5')}</li>
                  </ol>
                  <div className={styles.warningMsg}>
                    <Icon
                      name="caution"
                      type="outlined"
                      color="error"
                      size="xxs"
                    />
                    {t('DoNotAddNewStudentEntriesOrEditUniqueId')}
                  </div>
                  <div className={styles.divider} />
                  <a
                    id="downloadPreviousYearDues"
                    target="_blank"
                    download="Previous-Year-Dues.csv"
                  ></a>
                  {formValues.fee_categories.length === 0 && (
                    <div>
                      <div
                        className={styles.downloadSampleFile}
                        onClick={downloadExistingStudentCSV}
                      >
                        {t('downloadInputFile')}
                      </div>
                      <CSVUploadCardV1
                        onSheetDataLoad={formatSheetData}
                        userType={'Student'}
                      />
                      <FormError errorMessage={formErrors.fee_categories} />
                    </div>
                  )}
                  {formValues.fee_categories.length > 0 && (
                    <div className={styles.uploadedFile}>
                      <div className={styles.uploadedText}>
                        <div className={styles.note}>
                          <div>{t('previousDuesFileUploaded')}</div>
                        </div>
                        <div
                          className={styles.closeIcon}
                          onClick={() =>
                            setFormValues({
                              ...formValues,
                              fee_categories: [],
                            })
                          }
                        >
                          {/* <Icon size="xs" color="error" name="close" /> */}
                        </div>
                      </div>
                    </div>
                  )}
                  <StickyFooter forSlider={true}>
                    <Button
                      disabled={isSubmitDisabled}
                      size={'big'}
                      className={
                        isSubmitDisabled
                          ? styles.disabledBtn
                          : styles.enabledBtn
                      }
                    >
                      {t('publish')}
                    </Button>
                  </StickyFooter>
                </form>
              )}
            </div>
          </ErrorBoundary>
        </>
      </SliderScreen>
    </>
  )
}
