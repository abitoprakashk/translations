import {useState} from 'react'
import {DateTime} from 'luxon'
import {useDispatch} from 'react-redux'
import classNames from 'classnames'
import {FEE_STRUCTURE} from '../../../../intl'
import styles from './NormalStructure.module.css'
import InputField from '../../../../../../components/Common/InputField/InputField'
import SliderScreen from '../../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {
  Button,
  ErrorBoundary,
  ErrorOverlay,
  Icon,
  StickyFooter,
  Table,
} from '@teachmint/common'
import {numericRegex} from '../../../../../../utils/Validations'
import ConfirmationPopup from '../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import feeStructureActionTypes from '../../../../redux/feeStructure/feeStructureActionTypes'
import {useFeeStructure} from '../../../../redux/feeStructure/feeStructureSelectors'
import {GENERIC_ERROR_MESSAGE} from '../../../../../../constants/common.constants'

const NormalStructure = ({setSliderScreen, data, width}) => {
  const {feeCategoryInstallmentLoading, feeCategoryInstallmentError} =
    useFeeStructure()
  const [schedules, setSchedules] = useState(data.schedule)
  const [formErrors, setFormErrors] = useState({})
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const dispatch = useDispatch()

  const handleChange = (name, value) => {
    if (numericRegex(value)) {
      setSchedules({
        ...schedules,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let errors = {}
    Object.keys(schedules).map((amount) => {
      if (schedules[amount] === '') {
        errors[amount] = 'Amount is required'
      } else if (schedules[amount].length > 7) {
        errors[amount] = 'Amount cannot be greater than 7 digits'
        // } else if (!parseInt(schedules[amount]) > 0) {
        // errors[amount] = 'Amount must be greater than 0'
      }
    })
    setFormErrors({...errors})
    if (Object.keys(errors).length > 0) {
      return false
    }
    setShowConfirmPopup(true)
  }

  const modifyFeeCategory = () => {
    setShowConfirmPopup(false)
    dispatch({
      type: feeStructureActionTypes.MODIFY_FEE_INSTALLMENT_REQUESTED,
      payload: {
        _id: data._id,
        schedule: schedules,
      },
    })
  }

  const cols = [
    {key: 'month', label: 'Month'},
    {key: 'amount', label: 'Amount'},
  ]

  const rows = Object.keys(data.schedule).map((timestamp) => ({
    month: DateTime.fromSeconds(parseInt(timestamp)).toFormat('MMMM yyyy'),
    amount: (
      <div className={styles.inputbox}>
        <InputField
          disabled={DateTime.fromSeconds(parseInt(timestamp)) < DateTime.now()}
          fieldType={'text'}
          handleChange={handleChange}
          value={schedules[timestamp]}
          fieldName={timestamp}
          maxLength={7}
          errorText={formErrors[timestamp]}
        />
      </div>
    ),
  }))

  return (
    <>
      {showConfirmPopup && (
        <ConfirmationPopup
          onClose={() => setShowConfirmPopup(false)}
          onAction={modifyFeeCategory}
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
          title={FEE_STRUCTURE.modifyFeeCategoryTitle}
          desc={FEE_STRUCTURE.modifyFeeCategoryDesc}
          primaryBtnText={FEE_STRUCTURE.btnTextCancel}
          secondaryBtnText={FEE_STRUCTURE.btnTextModify}
        />
      )}
      <SliderScreen setOpen={() => setSliderScreen(null)} width={width}>
        <>
          <SliderScreenHeader title={<div>{data.name}</div>} />
          {feeCategoryInstallmentError && (
            <div className={styles.error}>
              <ErrorOverlay>
                <div>{GENERIC_ERROR_MESSAGE}</div>
              </ErrorOverlay>
            </div>
          )}
          <ErrorBoundary>
            {feeCategoryInstallmentLoading ? (
              <div className="loading"></div>
            ) : (
              <form className={styles.months} onSubmit={handleSubmit}>
                <Table cols={cols} rows={rows} />
                <StickyFooter forSlider={true}>
                  <div>
                    <Button size={'big'} className={'fill'}>
                      {FEE_STRUCTURE.btnTextModify}
                    </Button>
                  </div>
                </StickyFooter>
              </form>
            )}
          </ErrorBoundary>
        </>
      </SliderScreen>
    </>
  )
}

export default NormalStructure
