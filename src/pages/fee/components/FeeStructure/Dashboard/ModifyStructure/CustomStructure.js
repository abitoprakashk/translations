import {useState} from 'react'
import {DateTime} from 'luxon'
import {useDispatch, useSelector} from 'react-redux'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import {FEE_STRUCTURE} from '../../../../intl'
import styles from './CustomStructure.module.css'
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
import userProfileImg from '../../../../../../assets/images/icons/user-profile.svg'

const CustomStructure = ({setSliderScreen, data, width}) => {
  const {t} = useTranslation()
  const instituteStudentList = useSelector(
    (state) => state.instituteStudentList
  )
  const studentDetails = instituteStudentList.find(
    (item) => item._id == data.student_id
  )
  const amounts = {}
  data.timestamps.forEach((timestamp) => {
    timestamp.categories.forEach((category) => {
      amounts[category._id] = category.amount
    })
  })
  const {feeTypes, modifyPreviousYearDuesLoading, modifyPreviousYearDuesError} =
    useFeeStructure()
  const [categories, setCategories] = useState(amounts)
  const [formErrors, setFormErrors] = useState({})
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const dispatch = useDispatch()
  let feeCategories = {}
  feeTypes.forEach((type) => {
    feeCategories[type._id] = type.name
  })

  const handleChange = (name, value) => {
    if (numericRegex(value)) {
      setCategories({
        ...categories,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let errors = {}
    Object.keys(categories).map((amount) => {
      if (categories[amount] === '') {
        errors[amount] = t('amountIsRequired')
      } else if (categories[amount].length > 7) {
        errors[amount] = t('amountCannotBeGreaterThan7Digits')
      }
    })
    setFormErrors({...errors})
    if (Object.keys(errors).length > 0) {
      return false
    }
    setShowConfirmPopup(true)
  }

  const modifyStudentFeeCategories = () => {
    setShowConfirmPopup(false)
    dispatch({
      type: feeStructureActionTypes.MODIFY_PREVIOUS_YEAR_DUES_REQUESTED,
      payload: {
        student_id: data.student_id,
        categories: categories,
      },
    })
  }

  const cols = [
    {key: 'category', label: t('category')},
    {key: 'amount', label: t('amount')},
  ]

  const getCategoryRows = (allCategories) => {
    return allCategories.map((category) => {
      return {
        category: feeCategories[category.master_id],
        amount: (
          <div className={styles.inputbox}>
            <InputField
              fieldType={'text'}
              handleChange={handleChange}
              value={
                categories[category._id]
                  ? parseInt(categories[category._id])
                  : ''
              }
              fieldName={category._id}
              maxLength={7}
              errorText={formErrors[category._id]}
            />
          </div>
        ),
      }
    })
  }

  return (
    <>
      {showConfirmPopup && (
        <ConfirmationPopup
          onClose={() => setShowConfirmPopup(false)}
          onAction={modifyStudentFeeCategories}
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
          title={t('modifyDueAmountWarningTitle')}
          primaryBtnText={t('noCancelButton')}
          secondaryBtnText={t('yesModifyButton')}
        />
      )}
      <SliderScreen setOpen={() => setSliderScreen(null)} width={width}>
        <>
          <SliderScreenHeader
            icon={
              <img
                className={styles.img}
                src={studentDetails.img_url || userProfileImg}
                alt="User Image"
              />
            }
            title={
              <>
                <div className={styles.title}>{studentDetails.full_name}</div>
                {studentDetails.phone_number && (
                  <div className={styles.title}>
                    {studentDetails.phone_number}
                  </div>
                )}
              </>
            }
          />
          {modifyPreviousYearDuesError && (
            <div className={styles.error}>
              <ErrorOverlay>
                <div>{GENERIC_ERROR_MESSAGE}</div>
              </ErrorOverlay>
            </div>
          )}
          <ErrorBoundary>
            {modifyPreviousYearDuesLoading ? (
              <div className="loading"></div>
            ) : (
              <form className={styles.categories} onSubmit={handleSubmit}>
                {data.timestamps.map(({categories, timestamp}) => {
                  return (
                    <div key={timestamp} className={styles.asdas}>
                      {DateTime.fromSeconds(timestamp).toFormat('MMMM yyyy')}
                      <Table cols={cols} rows={getCategoryRows(categories)} />
                    </div>
                  )
                })}
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

export default CustomStructure
