import {useEffect, useState} from 'react'
// import {DISCOUNT, FEE_STRUCTURE} from '../../../intl'
import styles from './DiscountSliderContent.module.css'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import Discount from '../SliderTabs/Discount'
import StudentProfile from '../SliderTabs/StudentProfile'
import {Button, StickyFooter} from '@teachmint/common'
import {
  DISCOUNT_SLIDER_TABS_IDS,
  IS_ABSOLUTE_VALUE,
} from '../../../fees.constants'
import {
  alphaNumericFields,
  floatingFields,
  numericFields,
  validate,
} from '../Validations/DiscountValidations'
import {
  alphaNumericRegex,
  floatingRegex,
  numericRegex,
} from '../../../../../utils/Validations'
import {useDispatch, useSelector} from 'react-redux'
import feeDiscountsTypes from '../../../redux/feeDiscountsActionTypes'
import {useFeeDiscount} from '../../../redux/feeDiscounts.selectors'
import classNames from 'classnames'
import {events} from '../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'

const DiscountSliderContent = (props) => {
  const {t} = useTranslation()

  const {
    formValues,
    setFormValues,
    formErrors,
    setFormErrors,
    selectedTab,
    setSelectedTab,
  } = props
  const {createDiscountLoading, updateDiscountLoading} = useFeeDiscount()
  const dispatch = useDispatch()
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const eventManager = useSelector((state) => state.eventManager)
  let isSubmitDisabled = false

  useEffect(() => {
    if (formValues.fee_types.length > 0) {
      dispatch({
        type: feeDiscountsTypes.GET_STUDENT_LIST_REQUESTED,
        payload: {
          formValues: formValues,
          feeCategories: formValues.fee_types,
        },
      })
    }
  }, [formValues.fee_types])

  const handleChange = (name, value) => {
    let newFormValues = {...formValues}
    if (
      (alphaNumericFields.includes(name) && !alphaNumericRegex(value)) ||
      (formValues.is_absolute_value === IS_ABSOLUTE_VALUE.PERCENTAGE &&
        floatingFields.includes(name) &&
        !floatingRegex(value)) ||
      (formValues.is_absolute_value === IS_ABSOLUTE_VALUE.ABSOLUTE &&
        numericFields.includes(name) &&
        !numericRegex(value))
    ) {
      return false
    }
    switch (name) {
      case 'fee_types':
        if (formValues.is_absolute_value === IS_ABSOLUTE_VALUE.ABSOLUTE)
          value = [value]
        break
      case 'is_absolute_value':
        newFormValues['value'] = ''
        if (
          formValues.fee_types.length > 1 &&
          formValues.is_absolute_value === IS_ABSOLUTE_VALUE.PERCENTAGE
        ) {
          newFormValues['fee_types'] = [formValues.fee_types[0]]
        }
        break
      default:
        break
    }
    newFormValues[name] = value
    setFormValues(newFormValues)
    setFormErrors({})
  }

  const createDiscount = () => {
    isSubmitDisabled = true
    eventManager.send_event(events.APPLY_DISCOUNT_CLICKED_TFI)
    dispatch({
      type: feeDiscountsTypes.CREATE_DISCOUNT_REQUESTED,
      payload: formValues,
    })
    setShowConfirmPopup(false)
  }

  const updateDiscount = () => {
    dispatch({
      type: feeDiscountsTypes.UPDATE_DISCOUNT_REQUESTED,
      payload: formValues,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = validate(formValues, selectedTab)
    setFormErrors(errors)
    if (Object.keys(errors).length === 0) {
      if (selectedTab === DISCOUNT_SLIDER_TABS_IDS.DISCOUNT) {
        eventManager.send_event(events.DISCOUNT_DETAILS_COMPLETED_TFI)
        setSelectedTab(DISCOUNT_SLIDER_TABS_IDS.STUDENT_PROFILES)
      } else {
        !formValues._id ? setShowConfirmPopup(true) : updateDiscount()
      }
    }
  }

  if (selectedTab === DISCOUNT_SLIDER_TABS_IDS.DISCOUNT) {
    isSubmitDisabled =
      !formValues.name ||
      !formValues.is_absolute_value ||
      !formValues.value ||
      formValues.fee_types.length === 0
  } else {
    isSubmitDisabled = formValues.students.length === 0
  }

  if (createDiscountLoading || updateDiscountLoading) {
    return <div className="loading"></div>
  }

  return (
    <>
      {showConfirmPopup && (
        <ConfirmationPopup
          onClose={() => setShowConfirmPopup(false)}
          onAction={createDiscount}
          icon={
            'https://storage.googleapis.com/tm-assets/icons/colorful/tick-bg-green.svg'
          }
          // title={DISCOUNT.publishConfirmModalTitle}
          // desc={DISCOUNT.publishConfirmModalDesc}
          // primaryBtnText={FEE_STRUCTURE.btnTextCancel}
          // secondaryBtnText={FEE_STRUCTURE.btnTextConfirm}
          title={t('publishConfirmModalTitle')}
          desc={t('publishConfirmModalDesc')}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('confirm')}
        />
      )}
      <div
        className={classNames(
          styles.mainContent,
          'show-scrollbar show-scrollbar-big'
        )}
      >
        <form onSubmit={handleSubmit}>
          <div className="w-full">
            {selectedTab === DISCOUNT_SLIDER_TABS_IDS.DISCOUNT && (
              <Discount
                formValues={formValues}
                formErrors={formErrors}
                handleChange={handleChange}
              />
            )}
            {selectedTab !== DISCOUNT_SLIDER_TABS_IDS.DISCOUNT && (
              <StudentProfile
                formValues={formValues}
                formErrors={formErrors}
                handleChange={handleChange}
              />
            )}
            <StickyFooter forSlider={true}>
              <div
                className={classNames(styles.footerContent, {
                  [styles.totalStudents]:
                    selectedTab === DISCOUNT_SLIDER_TABS_IDS.STUDENT_PROFILES,
                })}
              >
                <div>
                  {formValues.fee_types.length > 0 &&
                    selectedTab === DISCOUNT_SLIDER_TABS_IDS.DISCOUNT &&
                    // DISCOUNT.discountTabFooterText
                    t('discountTabFooterText')}
                  {formValues.students.length > 0 &&
                    selectedTab === DISCOUNT_SLIDER_TABS_IDS.STUDENT_PROFILES &&
                    // formValues.students.length + ' students selected'
                    formValues.students.length + ' ' + t('studentsSelected')}
                </div>
                <Button
                  disabled={isSubmitDisabled}
                  size={'big'}
                  className={
                    isSubmitDisabled
                      ? classNames(
                          'tm-bg-dark-gray border-none tm-color-text-secondary',
                          styles.footerBtn
                        )
                      : classNames('fill', styles.footerBtn)
                  }
                >
                  {selectedTab === DISCOUNT_SLIDER_TABS_IDS.DISCOUNT
                    ? // ? FEE_STRUCTURE.btnTextNext
                      // : DISCOUNT.btnTextApplyDiscount
                      t('next')
                    : t('applyDiscount')}
                </Button>
              </div>
            </StickyFooter>
          </div>
        </form>
      </div>
    </>
  )
}

export default DiscountSliderContent
