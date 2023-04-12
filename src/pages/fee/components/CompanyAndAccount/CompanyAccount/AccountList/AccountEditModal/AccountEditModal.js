import React, {useMemo, useState} from 'react'
import styles from './AccountEditModal.module.css'
import {Input, Modal, MODAL_CONSTANTS} from '@teachmint/krayon'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../../redux/actions/global.actions'
import {
  CREATE_ACCOUNT_DEFAULT_FIELDS_DATA,
  CREATE_ACCOUNT_FIELDS_NAME,
  IFSC_CODE_STATUS,
  IFSC_CODE_STATUS_MESSAGE,
  IFSC_CODE_STATUS_STYLES,
  INPUT_LIMITS,
} from '../../../companyAccConstants'
import {t} from 'i18next'
import {showSuccessToast} from '../../../../../../../redux/actions/commonAction'

export default function AccountEditModal({
  isOpen = false,
  onClose = () => {},
  company_id = '',
  accountDetails = {},
}) {
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const isInstituteInIndia =
    instituteInfo?.address?.country?.toLowerCase() === 'india'

  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    ...CREATE_ACCOUNT_DEFAULT_FIELDS_DATA,
    ...{
      accountNumber: accountDetails?.account_number,
      confirmAccountNumber: accountDetails?.account_number,
      accountName: accountDetails?.account_name,
      ifscCode: accountDetails?.ifsc,
      beneficiaryName: accountDetails?.beneficiary_name,
    },
  })

  const [formError, setFormError] = useState('')
  const [ifscStatus, setIfscStatus] = useState(IFSC_CODE_STATUS.VALID)
  const [branchName, setBranchName] = useState(
    `${accountDetails?.bank_details?.BANK}, ${accountDetails?.bank_details?.CITY}, ${accountDetails?.bank_details?.STATE}`
  )

  const handleOnChange = ({fieldName, value}) => {
    if (fieldName === CREATE_ACCOUNT_FIELDS_NAME.ifscCode)
      setIfscStatus(IFSC_CODE_STATUS.INITIAL)

    setFormData({...formData, [fieldName]: value})
  }

  const handleUpdateBtnClick = () => {
    setFormError('')
    if (!formData[CREATE_ACCOUNT_FIELDS_NAME.accountName]) {
      return
    }
    if (ifscStatus != IFSC_CODE_STATUS.VALID) {
      setFormError(t('Please verify IFSC code'))
      return
    }
    if (
      formData[CREATE_ACCOUNT_FIELDS_NAME.accountNumber] !=
      formData[CREATE_ACCOUNT_FIELDS_NAME.confirmAccountNumber]
    ) {
      setFormError(t('mismatchAccountNumberError'))
      return
    }
    if (
      formData[CREATE_ACCOUNT_FIELDS_NAME.accountNumber].length > 0 &&
      formData[CREATE_ACCOUNT_FIELDS_NAME.accountNumber].length < 8
    ) {
      setFormError(t('acocuntNumberTooShort'))
      return
    }

    function failureAction(err) {
      setFormError(err)
    }

    function successAction() {
      dispatch(showSuccessToast(t('accountUpdated')))
      onClose()
    }

    let data = {}
    data._id = accountDetails?._id
    data.account_name = formData[CREATE_ACCOUNT_FIELDS_NAME.accountName]
    data.master_company_id = company_id
    if (isInstituteInIndia) {
      data.ifsc = formData[CREATE_ACCOUNT_FIELDS_NAME.ifscCode]
    }
    data.account_number = formData[CREATE_ACCOUNT_FIELDS_NAME.accountNumber]
    data.beneficiary_name = formData[CREATE_ACCOUNT_FIELDS_NAME.beneficiaryName]

    dispatch(
      globalActions.updateAccountCA.request(data, successAction, failureAction)
    )
  }

  const verifyIFSC = () => {
    if (ifscStatus != IFSC_CODE_STATUS.INITIAL) return false

    function failureAction() {
      setIfscStatus(IFSC_CODE_STATUS.INVALID)
    }

    function successAction(response) {
      setBranchName(`${response?.BANK}, ${response?.CITY}, ${response?.STATE}`)
      setIfscStatus(IFSC_CODE_STATUS.VALID)
    }

    setIfscStatus(IFSC_CODE_STATUS.VALIDATING)

    let data = {}
    data.ifsc = formData[CREATE_ACCOUNT_FIELDS_NAME.ifscCode]
    dispatch(
      globalActions.verifyIFSCCA.request(data, successAction, failureAction)
    )
  }

  const formFields = useMemo(() => {
    return [
      {
        isRequired: true,
        fieldName: CREATE_ACCOUNT_FIELDS_NAME.accountName,
        onChange: (obj) => handleOnChange(obj),
        placeholder: t('accountNamePlaceholder'),
        title: t('accountNameTitle'),
        type: 'text',
        isVisible: true,
        value: formData?.accountName,
        maxLength: INPUT_LIMITS.accountName.max,
      },
      {
        type: 'text',
        isRequired: true,
        fieldName: CREATE_ACCOUNT_FIELDS_NAME.beneficiaryName,
        onChange: (obj) => handleOnChange(obj),
        placeholder: t('beneficiaryNamePlaceholder'),
        title: t('beneficiaryNameTitle'),
        isVisible: isInstituteInIndia,
        value: formData?.beneficiaryName,
      },
      {
        type: 'text',
        isRequired: true,
        fieldName: CREATE_ACCOUNT_FIELDS_NAME.accountNumber,
        onChange: (obj) => handleOnChange(obj),
        placeholder: t('accountNumberPlaceholder'),
        title: t('accountNumberTitle'),
        isVisible: true,
        value: formData?.accountNumber,
        autoComplete: 'off',
        classes: {
          input: styles.maskedAccountNumber,
        },
        maxLength: INPUT_LIMITS.accountNumber.max,
      },
      {
        type: 'text',
        isRequired: true,
        fieldName: CREATE_ACCOUNT_FIELDS_NAME.confirmAccountNumber,
        onChange: (obj) => handleOnChange(obj),
        placeholder: t('accountNumberPlaceholder'),
        title: t('accountNumberConfirmTitle'),
        isVisible: true,
        value: formData?.confirmAccountNumber,
        onPaste: (e) => {
          e.preventDefault()
          return false
        },
      },
      {
        type: 'text',
        isRequired: true,
        fieldName: CREATE_ACCOUNT_FIELDS_NAME.ifscCode,
        onChange: (obj) => handleOnChange(obj),
        placeholder: t('ifscPlaceholder'),
        title: t('ifscTitle'),
        isVisible: isInstituteInIndia,
        value: formData?.ifscCode,
        suffix: formData?.ifscCode ? (
          <span
            className={styles[IFSC_CODE_STATUS_STYLES[ifscStatus]]}
            onClick={() => verifyIFSC()}
          >
            {IFSC_CODE_STATUS_MESSAGE[ifscStatus]}
          </span>
        ) : (
          ''
        ),
      },
    ]
  }, [Object.values(formData)])
  return (
    <>
      <Modal
        shouldCloseOnOverlayClick={false}
        classes={{modal: styles.modal}}
        isOpen={isOpen}
        actionButtons={[
          {
            body: t('cancel'),
            onClick: onClose,
            type: 'outline',
          },
          {
            body: t('update'),
            onClick: handleUpdateBtnClick,
            isDisabled:
              !formData[CREATE_ACCOUNT_FIELDS_NAME.accountName] ||
              !formData[CREATE_ACCOUNT_FIELDS_NAME.beneficiaryName] ||
              !formData[CREATE_ACCOUNT_FIELDS_NAME.accountNumber] ||
              (isInstituteInIndia &&
                !formData[CREATE_ACCOUNT_FIELDS_NAME.ifscCode]),
          },
        ]}
        footerLeftElement={
          formError ? (
            <div className={styles.footerMessage}>{formError}</div>
          ) : (
            <div></div>
          )
        }
        header={t('editAccountHeader')}
        onClose={onClose}
        size={MODAL_CONSTANTS.SIZE.SMALL}
      >
        <div className={styles.contentSection}>
          <div className={styles.fieldsSection}>
            {formFields
              .filter((field) => field.isVisible)
              .map((field) => {
                const {
                  type,
                  isRequired,
                  fieldName,
                  onChange,
                  placeholder,
                  title,
                  value,
                  showMsg,
                  onBlur,
                  suffix,
                  autoComplete,
                  onPaste,
                  classes,
                  maxLength,
                } = field
                return (
                  <div key={field.title}>
                    <Input
                      type={type}
                      isRequired={isRequired}
                      fieldName={fieldName}
                      onChange={onChange}
                      placeholder={placeholder}
                      title={title}
                      value={value}
                      showMsg={showMsg}
                      onBlur={onBlur}
                      suffix={suffix}
                      autoComplete={autoComplete}
                      onPaste={onPaste}
                      classes={classes}
                      maxLength={maxLength}
                    />
                    {branchName &&
                    fieldName == CREATE_ACCOUNT_FIELDS_NAME.ifscCode &&
                    ifscStatus == IFSC_CODE_STATUS.VALID ? (
                      <span className={styles.branchName}>{branchName}</span>
                    ) : (
                      ''
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      </Modal>
    </>
  )
}
