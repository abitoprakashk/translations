import {MultiSelectInput} from '@teachmint/common'
import {t} from 'i18next'
import {Input} from '@teachmint/common'
import FormError from '../../tfi-common/FormError/FormError'
import {events} from '../../../../../utils/EventsConstants'
import {
  IS_ABSOLUTE_VALUE,
  IS_ABSOLUTE_VALUE_OPTIONS,
} from '../../../fees.constants'
import {DISCOUNT} from '../../../intl'
import {useFeeStructure} from '../../../redux/feeStructure/feeStructureSelectors'
// import MultiSelectInput from '../../tfi-common/MultiSelectInput/MultiSelectInput'
import styles from './Discount.module.css'
import classNames from 'classnames'

export default function Discount({formValues, formErrors, handleChange}) {
  const {feeTypes} = useFeeStructure()

  if (!feeTypes.length) {
    return <div className="loader"></div>
  }

  let fee_types = []
  if (formValues.is_absolute_value === IS_ABSOLUTE_VALUE.ABSOLUTE) {
    fee_types = [
      ...feeTypes.map((type) => {
        return {
          value: type._id,
          label: type.name,
        }
      }),
    ]
  } else if (formValues.is_absolute_value === IS_ABSOLUTE_VALUE.PERCENTAGE) {
    fee_types = feeTypes.map((type) => {
      return {
        value: type._id,
        label: type.name,
      }
    })
  }

  return (
    <div className="px-10 py-5">
      <label className={styles.label}>
        {!formValues._id
          ? // ? DISCOUNT.createDiscountLabel
            // : DISCOUNT.editDiscountLabel
            t('createDiscountLabel')
          : t('editDiscountLabel')}
      </label>
      <div className="pt-5 flex">
        <div className="lg:w-60 mr-20">
          <Input
            type="text"
            title={t('discountName')}
            fieldName="name"
            value={formValues.name}
            onChange={(e) => handleChange('name', e.value)}
            classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
            placeholder={t('namePlaceholder')}
            eventName={events.DISCOUNT_DETAILS_FILLED_TFI}
            eventData={{field: 'name'}}
          />
          <FormError errorMessage={formErrors.name} />
        </div>
        <div className="lg:w-70 mr-20">
          <div className={styles.chipColor}>
            <Input
              title={t('absoluteLabel')}
              type="select"
              fieldName="is_absolute_value"
              value={formValues.is_absolute_value}
              options={IS_ABSOLUTE_VALUE_OPTIONS}
              onChange={(e) => handleChange('is_absolute_value', e.value)}
              classes={{
                wrapper: styles.inputWrapper,
                title: classNames('tm-color-text-secondary'),
              }}
            />
          </div>
        </div>
        {formValues.is_absolute_value === IS_ABSOLUTE_VALUE.ABSOLUTE && (
          <div className="lg:w-60 mr-20">
            <Input
              type="text"
              title={t('valueAmountLabel')}
              placeholder={t('valueAmountPlaceholder')}
              fieldName={'value'}
              value={formValues.value}
              onChange={(e) => handleChange('value', e.value)}
              classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
            />
            <FormError errorMessage={formErrors.value} />
          </div>
        )}
        {formValues.is_absolute_value === IS_ABSOLUTE_VALUE.PERCENTAGE && (
          <div className="lg:w-60 mr-20">
            <Input
              type="text"
              title={t('valuePercentageLabel')}
              placeholder={t('valuePercentagePlaceholder')}
              fieldName={'value'}
              value={formValues.value}
              onChange={(e) => handleChange('value', e.value)}
              classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
            />
            <FormError errorMessage={formErrors.value} />
          </div>
        )}
      </div>
      <div className="pt-3 flex">
        {formValues.is_absolute_value === IS_ABSOLUTE_VALUE.ABSOLUTE && (
          <div className="lg:w-60 mr-20">
            <div className="flex mb-1 justify-between">
              <div className="tm-color-text-secondary tm-para3">
                {t('feeTypeLabel')}
              </div>
            </div>
            <div className={styles.chipColor}>
              <Input
                type="select"
                fieldName="fee_types"
                value={formValues.fee_types[0]}
                placeholder={DISCOUNT.form.feeTypePlaceholder}
                options={fee_types}
                onChange={(e) => handleChange('fee_types', e.value)}
                classes={{wrapper: styles.inputWrapper}}
                optionsBoxClassName={'show-scrollbar show-scrollbar-small'}
              />
            </div>
          </div>
        )}
        {formValues.is_absolute_value === IS_ABSOLUTE_VALUE.PERCENTAGE && (
          <div className="lg:w-60 mr-20">
            <div className="flex mb-1 justify-between">
              <div className="tm-color-text-secondary tm-para3">
                {/* {DISCOUNT.form.feeTypeLabel} */}
                {t('feeTypeLabel')}
              </div>
            </div>
            <div className={styles.chipColor}>
              <MultiSelectInput
                withTags={true}
                options={fee_types}
                showSelectAll={true}
                onChange={(value) => handleChange('fee_types', value)}
                selectedOptions={formValues.fee_types}
                dropdownClassName={'show-scrollbar show-scrollbar-small'}
              />
            </div>
            <div className="tm-para4 mt-1 h-4 tm-color-red">
              {formErrors.fee_types}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
