import {Button, Icon, Table} from '@teachmint/common'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import SubjectTooltipOptions from '../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {getAmountFixDecimalWithCurrency} from '../../../../../utils/Helpers'
import {
  DISCOUNTS_TYPES,
  DISCOUNTS_TYPES_IDS,
  DISCOUNT_TOOLTIP_OPTIONS,
  DISCOUNT_TOOLTIP_OPTION_IDS,
  HELP_VIDEOS,
  SliderScreens,
} from '../../../fees.constants'
import {DISCOUNT} from '../../../intl'
import feeCollectionActionTypes from '../../../redux/feeCollectionActionTypes'
import feeDiscountsTypes from '../../../redux/feeDiscountsActionTypes'
import {useFeeDiscount} from '../../../redux/feeDiscounts.selectors'
import {fetchFeeTypesRequestedAction} from '../../../redux/feeStructure/feeStructureActions'
import styles from './Dashboard.module.css'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {events} from '../../../../../utils/EventsConstants'
import {
  useFeeStructure,
  useInstituteId,
} from '../../../redux/feeStructure/feeStructureSelectors'
import {useActiveAcademicSessionId} from '../../../../../utils/CustomHooks/AcademicSessionHook'
import {useTranslation} from 'react-i18next'
import Radio from '../../tfi-common/Radio/Radio'
import AdhocDiscount from '../Adhoc/AdhocDiscount'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

const Dashboard = () => {
  const {t} = useTranslation()

  const initialValues = {
    name: '',
    is_absolute_value: '',
    value: '',
    fee_types: [],
    students: [],
  }
  const instituteId = useInstituteId()
  const academicSessionId = useActiveAcademicSessionId()
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [discountToDelete, setDiscountToDelete] = useState(null)
  const dispatch = useDispatch()
  const {
    discounts,
    discountsLoading,
    adHocDiscountStudentListLoader,
    adHocDiscountStudentList,
  } = useFeeDiscount()
  const {feeTypes} = useFeeStructure()
  const studentsList = useSelector((state) => state.instituteStudentList)
  const {instituteInfo} = useSelector((state) => state)
  const eventManager = useSelector((state) => state.eventManager)
  const [discountType, setDiscountType] = useState(
    DISCOUNTS_TYPES_IDS.STANDARD_DISCOUNT
  )

  const [searchTerms, setSearchterms] = useState('')

  const deleteDiscountConfirmed = (discount) => {
    dispatch({
      type: feeDiscountsTypes.DELETE_DISCOUNT_REQUESTED,
      payload: discount,
    })
    setShowConfirmPopup(false)
  }

  const handleChange = (action, discountItem) => {
    switch (action) {
      case DISCOUNT_TOOLTIP_OPTION_IDS.ACT_DISCOUNT_EDIT: {
        dispatch({
          type: feeDiscountsTypes.EDIT_DISCOUNT_REQUESTED,
          payload: discountItem,
        })
        break
      }
      case DISCOUNT_TOOLTIP_OPTION_IDS.ACT_DOWNLOAD_STUDENT_LIST: {
        dispatch({
          type: feeDiscountsTypes.DOWNLOAD_DISCOUNT_REQUESTED,
          payload: {
            discountItem: discountItem,
            instituteInfo: instituteInfo,
            feeTypes: feeTypes,
            studentsList: studentsList,
            eventManager: eventManager,
          },
        })
        break
      }
      case DISCOUNT_TOOLTIP_OPTION_IDS.ACT_DISCOUNT_DELETE: {
        setShowConfirmPopup(true)
        setDiscountToDelete(discountItem)
        break
      }
      default:
        break
    }
  }

  useEffect(() => {
    dispatch({
      type: feeDiscountsTypes.FETCH_DISCOUNTS_REQUESTED,
      payload: null,
    })
    dispatch(fetchFeeTypesRequestedAction())
  }, [instituteId, academicSessionId])

  if (discountsLoading) {
    return <div className="loading"></div>
  }

  const handleClick = () => {
    eventManager.send_event(events.ADD_NEW_DISCOUNT_CLICKED_TFI)
    dispatch({
      type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
      payload: {
        name: SliderScreens.DISCOUNT_SLIDER,
        data: {
          initialValues: initialValues,
        },
      },
    })
  }

  const handleAdHocStudentListSearch = (event) => {
    setSearchterms(event.target.value)
  }

  const cols = [
    {key: 'discount', label: t('tableFieldsdiscountName')},
    {key: 'amount', label: t('tableFieldsAmount')},
    {key: 'fee_types', label: t('tableFieldsFeeType')},
    {key: 'actions', label: ' '},
  ]

  const rows = discounts.map((discount) => {
    return {
      discount: discount.name,
      amount: (
        <div className="tm-color-red">
          {discount.is_absolute_value
            ? getAmountFixDecimalWithCurrency(
                discount.value,
                instituteInfo.currency
              )
            : discount.value + ' %'}
        </div>
      ),
      fee_types: (
        <>
          {discount.fee_types
            .slice(0, 2)
            .map((name) => {
              return name
            })
            .join(', ')}
          &nbsp;
          {discount.fee_types.length > 2 && (
            <span className={styles.desc}>
              +{discount.fee_types.length - 2} {` ${t('more')}`}
            </span>
          )}
        </>
      ),
      actions: (
        <SubjectTooltipOptions
          subjectItem={discount._id}
          options={DISCOUNT_TOOLTIP_OPTIONS}
          trigger={
            <img
              src="https://storage.googleapis.com/tm-assets/icons/secondary/settings-dots-secondary.svg"
              alt=""
              className="w-4 h-4"
            />
          }
          handleChange={handleChange}
        />
      ),
    }
  })

  return (
    <div className={styles.mainContainer}>
      {showConfirmPopup && (
        <ConfirmationPopup
          onClose={() => setShowConfirmPopup(false)}
          onAction={() => deleteDiscountConfirmed(discountToDelete)}
          icon={
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
          }
          title={t('deleteDiscountConfirmModalTitle')}
          desc={t('deleteDiscountConfirmModalDesc')}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('delete')}
          secondaryBtnStyle={styles.modalDeleteBtn}
        />
      )}

      <div className={styles.headingSection}>
        <div>
          <Radio
            type={'heading'}
            onChange={(value) => {
              let eventName = events.AD_HOC_DISCOUNT_VIEW_CLICKED_TFI
              if (value === DISCOUNTS_TYPES_IDS.STANDARD_DISCOUNT) {
                eventName = events.STANDARD_DISCOUNT_VIEW_CLICKED_TFI
              }
              eventManager.send_event(eventName)
              setDiscountType(value)
            }}
          >
            {DISCOUNTS_TYPES.map((types) => {
              return (
                <option
                  key={types.value}
                  selected={discountType === types.value}
                  value={types.value}
                >
                  {types.originalLabel}
                </option>
              )
            })}
          </Radio>
        </div>
        <div>
          {discounts.length !== 0 &&
            discountType === DISCOUNTS_TYPES_IDS.STANDARD_DISCOUNT && (
              <>
                <div className={styles.section}>
                  <Permission
                    permissionId={
                      PERMISSION_CONSTANTS.feeModuleController_addFeeDiscount_create
                    }
                  >
                    <Button
                      className={styles.addNew}
                      size="big"
                      type="primary"
                      onClick={handleClick}
                    >
                      {t('addNewDiscount')}
                    </Button>
                  </Permission>
                </div>
              </>
            )}

          {discounts.length !== 0 &&
            discountType === DISCOUNTS_TYPES_IDS.AD_HOC_DISCOUNT && (
              <div className={styles.searchInputDiv}>
                <Icon
                  color="secondary"
                  name={'search'}
                  size="xs"
                  type="outlined"
                />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder={t('searchPlaceholder')}
                  onChange={handleAdHocStudentListSearch}
                />
              </div>
            )}
        </div>
      </div>
      {discounts.length === 0 &&
        discountType === DISCOUNTS_TYPES_IDS.STANDARD_DISCOUNT && (
          <div className={styles.mainContainer}>
            <div className={styles.noDiscount}>
              <span>{DISCOUNT.noDiscountText}</span>
              <div>
                <iframe
                  width="560"
                  height="315"
                  src={HELP_VIDEOS.DISCOUNTS}
                  title="How to Use the Offers and Discounts Feature"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.feeModuleController_addFeeDiscount_create
                }
              >
                <Button
                  className={styles.createNew}
                  size="big"
                  type="primary"
                  onClick={handleClick}
                >
                  {t('addNewDiscount')}
                </Button>
              </Permission>
            </div>
          </div>
        )}
      {discounts.length > 0 && (
        <>
          {discountType === DISCOUNTS_TYPES_IDS.STANDARD_DISCOUNT && (
            <Table className={styles.tableWrapper} cols={cols} rows={rows} />
          )}
        </>
      )}

      {discountType === DISCOUNTS_TYPES_IDS.AD_HOC_DISCOUNT && (
        <AdhocDiscount
          adHocDiscountStudentListLoader={adHocDiscountStudentListLoader}
          adHocDiscountStudentList={adHocDiscountStudentList}
          studentsList={studentsList}
          searchTerms={searchTerms}
        />
      )}
    </div>
  )
}

export default Dashboard
