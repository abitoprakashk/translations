import React from 'react'
import styles from './PerDay.module.css'
import {Input} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {
  DAYS_POST_DUE_DATE_AFTER_WHICH_THE_FINE_WILL_START_APPLYING,
  FIELDS,
  GRACE_PERIOD_TEXT,
  PLACEHOLDER,
} from '../../FineConstant'

export default function PerDay({
  isGracePeriodChecked = false,
  handleChange = () => {},
  perdayFineAmountValue = '',
  gracePeriodDays = '',
}) {
  const {t} = useTranslation()
  return (
    <div>
      <div className={styles.perDayFineAmountText}>
        {t('enterFineAmountPerDay')} <span className={styles.required}>*</span>
      </div>
      <div className={styles.inputFieldSection}>
        <Input
          type="number"
          fieldName={FIELDS.perDayFineAmount}
          value={perdayFineAmountValue}
          maxLength={7}
          isRequired={true}
          onChange={(obj) => {
            handleChange(obj)
          }}
          classes={{wrapper: styles.wrapper}}
          placeholder={PLACEHOLDER.perDayAmount}
        />
      </div>

      <div className={styles.gracePeriodSection}>
        <div className={styles.checkboxDiv}>
          <Input
            type="checkbox"
            isChecked={isGracePeriodChecked}
            fieldName={FIELDS.gracePeriod}
            onChange={(obj) => handleChange(obj)}
            labelTxt={t(GRACE_PERIOD_TEXT)}
            classes={{wrapper: styles.wrapper}}
          />
        </div>

        {isGracePeriodChecked && (
          <div>
            <div className={styles.inputFieldSection}>
              {/* <Input
                type="select"
                title={t('selectDays')}
                fieldName={FIELDS.selectDays}
                value={gracePeriodDays}
                options={getNumbersOfDays(31)}
                onChange={(obj) => handleChange(obj)}
                disabled={false}
                className={styles.bgWhite}
                classes={{wrapper: styles.wrapper}}
              /> */}
              <Input
                type="number"
                title={t('selectDays')}
                fieldName={FIELDS.selectDays}
                value={gracePeriodDays}
                maxLength={3}
                //   errorClassName={Styles.errorTxt}
                onChange={(obj) => {
                  handleChange(obj)
                }}
                classes={{wrapper: styles.wrapper, title: 'tm-para'}}
                minLength="0"
              />
            </div>
            <div className={styles.gracePeriodSubText}>
              {t(DAYS_POST_DUE_DATE_AFTER_WHICH_THE_FINE_WILL_START_APPLYING)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
