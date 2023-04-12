import React, {useMemo, useState} from 'react'
import styles from './CreateCompanyModal.module.css'
import {Input, Modal, MODAL_CONSTANTS} from '@teachmint/krayon'
import {t} from 'i18next'
import {
  CREATE_COMPANY_DEFAULT_FIELDS_DATA,
  CREATE_COMPANY_FIELDS_NAME,
  INPUT_LIMITS,
} from '../companyAccConstants'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import {events} from '../../../../../utils/EventsConstants'

export default function CreateCompanyModal({
  isOpen = false,
  onClose = () => {},
}) {
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const eventManager = useSelector((state) => state.eventManager)
  const isInstituteInIndia =
    instituteInfo?.address?.country?.toLowerCase() === 'india'

  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    ...CREATE_COMPANY_DEFAULT_FIELDS_DATA,
  })

  const [formError, setFormError] = useState('')

  const handleOnChange = ({fieldName, value}) => {
    setFormData({...formData, [fieldName]: value})
  }

  const handleCreateCompanyBtnClick = () => {
    eventManager.send_event(events.FEE_CREATE_COMPANY_CLICKED_TFI, {
      action: 'confirm',
    })
    setFormError('')
    if (!formData[CREATE_COMPANY_FIELDS_NAME.companyName]) {
      return
    }

    function failureAction(err) {
      setFormError(err)
    }

    function successAction() {
      eventManager.send_event(events.FEE_COMPANY_ADDED_TFI, {})
      onClose()
    }

    let data = {}
    data.name = formData[CREATE_COMPANY_FIELDS_NAME.companyName]
    data.address = formData[CREATE_COMPANY_FIELDS_NAME.companyAddress]
    data.company_details = {}
    if (isInstituteInIndia) {
      data.company_details.cin = formData[CREATE_COMPANY_FIELDS_NAME.cinNo]
    }

    dispatch(
      globalActions.createNewCompanyCA.request(
        data,
        successAction,
        failureAction
      )
    )
  }

  const formFields = useMemo(() => {
    return [
      {
        isRequired: true,
        fieldName: CREATE_COMPANY_FIELDS_NAME.companyName,
        onChange: (obj) => handleOnChange(obj),
        placeholder: t('companyPlaceholder'),
        title: t('Company name'),
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
              body: t('create'),
              onClick: handleCreateCompanyBtnClick,
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
          header={t('createCompanyModalHeader')}
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
