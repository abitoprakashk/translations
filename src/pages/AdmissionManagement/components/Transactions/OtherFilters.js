import {Checkbox, Para, PARA_CONSTANTS} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {feeTypes, paymentMode, paymentStatus} from '../../utils/constants'
import styles from './OtherFilters.module.css'

const OtherFilters = ({filterData, setFilterData}) => {
  const {t} = useTranslation()
  const otherFilterData = {
    feeTypes: {label: t('tableFieldsFeeType'), modeTypes: feeTypes},
    paymentStatus: {
      label: t('admissionCrmPaymentStatus'),
      modeTypes: paymentStatus,
    },
    paymentModes: {label: t('paymentMode'), modeTypes: paymentMode},
  }

  const handleChange = (filter, fieldName, isChecked) => {
    let fieldValue
    if (isChecked) {
      fieldValue = [...filterData[filter]]
      fieldValue.push(fieldName)
    } else {
      fieldValue = [...filterData[filter]].filter((v) => v !== fieldName)
    }
    setFilterData({...filterData, [filter]: fieldValue})
  }

  return Object.keys(otherFilterData).map((filter) => {
    return (
      <>
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          children={otherFilterData[filter].label}
          className={styles.paraStyles}
        />
        <div className={styles.testValue}>
          {Object.keys(otherFilterData[filter].modeTypes).map((subFilter) => {
            return (
              <>
                <div className={styles.otherfilterWrapper}>
                  <Checkbox
                    isSelected={filterData[filter]?.includes(subFilter)}
                    fieldName={subFilter}
                    label={otherFilterData[filter].modeTypes[subFilter]}
                    handleChange={(e) =>
                      handleChange(filter, e.fieldName, e.value)
                    }
                  />
                </div>
              </>
            )
          })}
        </div>
      </>
    )
  })
}

export default OtherFilters
