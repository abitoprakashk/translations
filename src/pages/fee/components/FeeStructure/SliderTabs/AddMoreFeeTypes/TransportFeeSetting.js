import classNames from 'classnames'
import React, {useState} from 'react'
import {
  FEE_STRUCTURE_TAB_SECTION_HEADING,
  TRANSPORT_METHODS,
} from '../../../../fees.constants'
import styles from './TransportTypeSection.module.css'
import ConfirmationPopup from '../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {Icon} from '@teachmint/common'
import {useTranslation} from 'react-i18next'

export default function TransportFeeSetting({
  formValues,
  setFormValues,
  transportMethod,
  setTranportMethod,
}) {
  const {t} = useTranslation()
  const [
    showTransportMethodChangeConfirmPopup,
    setShowTransportMethodChangeConfirmPopup,
  ] = useState(false)
  const [transportMethodChangeTo, setTransportMethodChangeTo] = useState(null)

  const checkForTransportMethodChange = () => {
    let canTransportMethodChange = true
    formValues.fee_categories.forEach((fee_category) => {
      if (!fee_category.isDelete) {
        if (transportMethod === TRANSPORT_METHODS.DISTANCE) {
          if (fee_category.amount || fee_category.distanceTo) {
            canTransportMethodChange = false
          }
        } else {
          if (fee_category.amount || fee_category.pickup) {
            canTransportMethodChange = false
          }
        }
      }
    })

    return canTransportMethodChange
  }

  const confirmTransportMethodChange = (selectedOption) => {
    setTranportMethod(selectedOption)
    let catagoriesVal = {
      distanceFrom: 0,
      distanceTo: '',
      amount: '',
      isDelete: false,
    }

    if (selectedOption === TRANSPORT_METHODS.WAYPOINT) {
      catagoriesVal = {
        pickup: '',
        amount: '',
        _id: null,
        isDelete: false,
      }
    }
    setFormValues({
      ...formValues,
      fee_categories: [catagoriesVal],
      transport_type: selectedOption,
    })

    setShowTransportMethodChangeConfirmPopup(false)
  }

  const handleTransportMethodChange = (selectedOption) => {
    if (selectedOption !== transportMethod) {
      setTransportMethodChangeTo(selectedOption)
      if (!checkForTransportMethodChange()) {
        setShowTransportMethodChangeConfirmPopup(true)
      } else {
        confirmTransportMethodChange(selectedOption)
      }
    }
  }

  return (
    <>
      {showTransportMethodChangeConfirmPopup && (
        <ConfirmationPopup
          onClose={() => setShowTransportMethodChangeConfirmPopup(false)}
          icon={
            <Icon
              name="info"
              color="warning"
              className={classNames(
                styles.higherSpecificityFontSize,
                styles.higherSpecificityIcon,
                styles.infoIcon
              )}
            />
          }
          onAction={() => confirmTransportMethodChange(transportMethodChangeTo)}
          title={t('areYouSureYouWantToChangeTransportMethod')}
          desc={t('yourDataWillBeLostWhateverYouCreatedTillNow')}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('yes')}
          secondaryBtnStyle={styles.modalWarningActionBtn}
        />
      )}

      <div className={styles.headingSection}>
        <div className={styles.w100}>
          <div>
            <div
              className={classNames(
                styles.sectionHeadingSubTitleTopMargin,
                styles.transportlabel
              )}
            >
              {FEE_STRUCTURE_TAB_SECTION_HEADING.thirdSection.subTitle}
            </div>
            <div>
              {FEE_STRUCTURE_TAB_SECTION_HEADING.thirdSection.radioOptions.map(
                (option) => {
                  return (
                    <label className={styles.radioLable} key={option.id}>
                      <input
                        type="radio"
                        checked={option.id === transportMethod ? 'checked' : ''}
                        onChange={() => handleTransportMethodChange(option.id)}
                      />
                      <span className={styles.radioLableText}>
                        {option.label}
                      </span>
                    </label>
                  )
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
