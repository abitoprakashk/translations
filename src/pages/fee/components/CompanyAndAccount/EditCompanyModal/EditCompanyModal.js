import React, {useMemo, useState} from 'react'
import styles from './EditCompanyModal.module.css'
import {Input, Modal, MODAL_CONSTANTS} from '@teachmint/krayon'
import {t} from 'i18next'
import {
  CREATE_COMPANY_DEFAULT_FIELDS_DATA,
  CREATE_COMPANY_FIELDS_NAME,
  INPUT_LIMITS,
} from '../companyAccConstants'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import {showSuccessToast} from '../../../../../redux/actions/commonAction'

export default function EditCompanyModal({
  isOpen = false,
  onClose = () => {},
  companyDetails = {},
}) {
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const isInstituteInIndia =
    instituteInfo?.address?.country?.toLowerCase() === 'india'

  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    ...CREATE_COMPANY_DEFAULT_FIELDS_DATA,
    ...{
      companyName: companyDetails.name,
      cinNo: companyDetails?.company_details?.cin,
      companyAddress: companyDetails.address,
    },
  })

  const [formError, setFormError] = useState('')

  const handleOnChange = ({fieldName, value}) => {
    setFormData({...formData, [fieldName]: value})
  }

  const handleUpdateCompanyBtnClick = () => {
    setFormError('')
    if (!formData[CREATE_COMPANY_FIELDS_NAME.companyName]) {
      return
    }

    function failureAction(err) {
      setFormError(err)
    }

    function successAction() {
      dispatch(showSuccessToast(t('companyUpdated')))
      onClose()
    }

    let data = {}
    data._id = companyDetails?._id
    data.name = formData[CREATE_COMPANY_FIELDS_NAME.companyName]
    data.address = formData[CREATE_COMPANY_FIELDS_NAME.companyAddress]
    data.company_details = {}
    if (isInstituteInIndia) {
      data.company_details.cin = formData[CREATE_COMPANY_FIELDS_NAME.cinNo]
    }

    dispatch(
      globalActions.updateCompanyCA.request(data, successAction, failureAction)
    )
  }

  const formFields = useMemo(() => {
    return [
      {
        isRequired: true,
        fieldName: CREATE_COMPANY_FIELDS_NAME.companyName,
        onChange: (obj) => handleOnChange(obj),
        placeholder: t('companyPlaceholder'),
        title: t('companyTitle'),
        type: 'text',
        isVisible: true,
        value: formData?.companyName,
        maxLength: INPUT_LIMITS.companyName.max,
      },
      {
        type: 'text',
        isRequired: false,
        fieldName: CREATE_COMPANY_FIELDS_NAME.cinNo,
        onChange: (obj) => handleOnChange(obj),
        placeholder: t('companyCINPlaceholder'),
        title: t('companyCINTitle'),
        isVisible: isInstituteInIndia,
        value: formData?.cinNo,
      },
      {
        type: 'text',
        isRequired: false,
        fieldName: CREATE_COMPANY_FIELDS_NAME.companyAddress,
        onChange: (obj) => handleOnChange(obj),
        placeholder: t('companyAddressPlaceholder'),
        title: t('companyAddressTitle'),
        isVisible: true,
        value: formData?.companyAddress,
      },
    ]
  }, [Object.values(formData)])
  return (
    <>
      <div>
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
              onClick: handleUpdateCompanyBtnClick,
              isDisabled:
                formData[CREATE_COMPANY_FIELDS_NAME.companyName] == '',
            },
          ]}
          footerLeftElement={
            formError ? (
              <div className={styles.footerMessage}>{formError}</div>
            ) : (
              <div></div>
            )
          }
          header={t('editCompanyModalHeader')}
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
                        maxLength={maxLength}
                      />
                    </div>
                  )
                })}
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}
