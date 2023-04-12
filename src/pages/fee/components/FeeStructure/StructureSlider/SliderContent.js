import React, {useCallback, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  Button,
  ErrorBoundary,
  ErrorOverlay,
  Icon,
  StickyFooter,
} from '@teachmint/common'
import styles from './SliderContent.module.css'
import DeleteRecieptsModalStyles from '../../../../../components/Common/DeleteRecieptsModal/DeleteRecieptsModal.module.css'
import {
  CUSTOM_CATEGORY,
  FEE_STRUCTURE_SLIDER_TABS_IDS,
  FEE_STRUCTURE_TYPES_IDS,
  getStructureFeeType,
  INSTITUTE_HIERARCHY_TYPES,
  MASTER_ID,
} from '../../../fees.constants'
import classNames from 'classnames'
import {FEE_STRUCTURE} from '../../../intl'
import Classes from '../SliderTabs/Classes'
import FeeType from '../SliderTabs/FeeType'
import DueDates from '../SliderTabs/DueDates'
import Amount from '../SliderTabs/Amount'
import {events} from '../../../../../utils/EventsConstants'
import {validate} from '../StructureValidations/FeeStructureValidations'
import feeStructureActionTypes from '../../../redux/feeStructure/feeStructureActionTypes'
import {setCustomCategoryStateAction} from '../../../redux/feeStructure/feeStructureActions'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import CustomCategoryModal from '../SliderTabs/CustomCategoryModal/CustomCategoryModal'
import {useFeeStructure} from '../../../redux/feeStructure/feeStructureSelectors'
import {
  calculateGrandTotal,
  handleStructureValueChange,
  isLastTab,
  isSubmitDisabled,
  sendSubmitEvents,
  switchToNextTab,
} from './Slider.helpers'
import {
  STEP_STATUS,
  UPDATE_FEE_STRUCTURE_STEP_IDS,
  FEE_STRUCTURE_EDIT_STEPS,
  DEPENDANCY_CASES,
  DELETE_RECEIPT_CLICK_EVENT,
} from '../../../../user-profile/components/Student/studentConstants'
import AlertModal from '../../../../../components/Common/AlertModal/AlertModal'
import DeleteRecieptsModal from '../../../../../components/Common/DeleteRecieptsModal/DeleteRecieptsModal'
import {
  deleteAllReceiptsConfirmationTransText,
  getDependancyStepsData,
  getStepsDataAfterDeleteReceipts,
  toastOnCloseClick,
} from '../../../helpers/helpers'

export default function SliderContent({
  currentTab,
  setCurrentTab,
  formValues,
  setFormValues,
  formErrors,
  setFormErrors,
}) {
  const {t} = useTranslation()
  const deleteAllReceiptsTransText = t('deleteAllReceipts')
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const {
    customCategoryName,
    indexOfcustomCategorySelect,
    showAddCustomCategoryPopup,
  } = useSelector((state) => state.feeStructure.customCategoryState)
  const {structureSliderLoading, feeStructureError} = useFeeStructure()
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [showCustomInstallmentPopup, setShowCustomInstallmentPopup] =
    useState(false)
  const [alertModalProps, setAlertModalProps] = useState({
    isOpen: false,
    header: t('cannotPublishStructure'),
    text: '',
  })
  const [deleteReceiptsModalProps, setDeleteReceiptsModalProps] = useState({
    isOpen: false,
    header: t('deleteReceiptsToPublishEditedStructure'),
    steps: {...FEE_STRUCTURE_EDIT_STEPS},
  })
  const dispatch = useDispatch()

  const createFeeStructureData = () => {
    setShowConfirmPopup(false)
    dispatch({
      type: feeStructureActionTypes.CREATE_FEE_STRUCTURE_REQUESTED,
      payload: formValues,
    })
    eventManager.send_event(events.PUBLISH_FEE_STRUCTURE_POPUP_CLICKED_TFI, {
      fee_type: getStructureFeeType(formValues),
      action: 'confirm',
    })
    eventManager.send_event(events.FEE_STRUCTURE_PUBLISHED_TFI, {
      fee_type: getStructureFeeType(formValues),
    })
  }

  const toastOnCloseClickFn = (toastId) => {
    toastOnCloseClick(setDeleteReceiptsModalProps, toastId)
  }

  const handleAlertModalClose = () => {
    setAlertModalProps((prev) => {
      return {...prev, isOpen: false}
    })
  }

  const onEditDependancy = ({transactions}) => {
    let newSteps = getDependancyStepsData({
      DependancyCase: DEPENDANCY_CASES.UPDATE,
      transactions,
      steps: deleteReceiptsModalProps?.steps,
    })
    setDeleteReceiptsModalProps((prev) => {
      return {...prev, transactions, isOpen: true, steps: newSteps}
    })
  }

  const dispatchUpdateFeeStructure = () => {
    function onFailed(params) {
      eventManager.send_event(events.CANNOT_EDIT_STRUCTURE_CLICKED_TFI, {
        reason: params?.eventReason,
      })
      setAlertModalProps({
        ...alertModalProps,
        isOpen: true,
        heading: t('cannotPublishStructure'),
        actionButtons: [
          {
            body: t('gotIt'),
            onClick: handleAlertModalClose,
          },
        ],
        ...params,
      })
    }

    function onSuccess() {
      eventManager.send_event(events.PUBLISH_FEE_STRUCTURE_CLICKED_TFI, {
        fee_type: getStructureFeeType(formValues),
        no_of_fees: formValues.fee_categories.length,
        type: 'edited',
        strucutre_id: formValues?._id,
      })
    }
    dispatch({
      type: feeStructureActionTypes.UPDATE_FEE_STRUCTURE_REQUESTED,
      payload: {formValues, onFailed, onEditDependancy, onSuccess},
    })
  }

  const updateFeeStructureData = () => {
    setShowConfirmPopup(false)
    setShowCustomInstallmentPopup(false)
    dispatchUpdateFeeStructure()
  }

  const checkForCustomInstallment = () => {
    let customInstallmentFound = false
    if (formValues.fee_type !== FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE) {
      customInstallmentFound = Object.values(formValues.fee_categories).some(
        (category) => {
          if (category.schedule) {
            const amounts = Object.values(category.schedule)
            return amounts.some((amount) => amount !== amounts[0])
          } else {
            return false
          }
        }
      )
    }
    customInstallmentFound
      ? setShowCustomInstallmentPopup(true)
      : dispatchUpdateFeeStructure()
  }

  const handleCustomCategorySelection = (index, value) => {
    if (value === 'custom_category') {
      dispatch(
        setCustomCategoryStateAction({
          showAddCustomCategoryPopup: true,
          indexOfcustomCategorySelect: index,
        })
      )
    } else {
      dispatch(
        setCustomCategoryStateAction({
          showAddCustomCategoryPopup: false,
        })
      )
    }
  }

  const handleChange = ({fieldName, value, event}, index = null) => {
    handleStructureValueChange(
      {name: fieldName, value, event},
      index,
      formValues,
      setFormValues,
      handleCustomCategorySelection
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const checkForLastTab = isLastTab(formValues, currentTab)
    const errors = checkForLastTab
      ? validate(formValues)
      : validate(formValues, currentTab)
    setFormErrors(errors)
    if (Object.keys(errors).length === 0) {
      if (checkForLastTab) {
        !formValues._id
          ? setShowConfirmPopup(true)
          : checkForCustomInstallment()
      } else {
        setCurrentTab(switchToNextTab(formValues, currentTab))
      }
    }
    sendSubmitEvents(formValues, currentTab, eventManager)
  }

  const handleSetValueAndResetCustomCategoryStates = (_id) => {
    formValues.fee_categories[indexOfcustomCategorySelect][MASTER_ID] = _id
    setFormValues(formValues)
  }

  const handleAddCustomCategory = () => {
    if (
      customCategoryName.trim() === '' ||
      customCategoryName.trim().length > 40
    )
      return

    dispatch({
      type: feeStructureActionTypes.ADD_NEW_CUSTOM_CATEGORY_REQUEST,
      payload: {
        data: {
          name: customCategoryName,
          type: INSTITUTE_HIERARCHY_TYPES.STANDARD,
        },
        handleSetValueAndResetCustomCategoryStates,
      },
    })
  }

  const handleDeclineAddCustomCategory = () => {
    formValues.fee_categories[indexOfcustomCategorySelect][MASTER_ID] = ''
    dispatch(
      setCustomCategoryStateAction({
        showAddCustomCategoryPopup: false,
        indexOfcustomCategorySelect: null,
        customCategoryName: '',
      })
    )
  }

  const handleChangeAddnewCustomCategory = (evnt) => {
    let {value} = evnt.target
    dispatch(setCustomCategoryStateAction({customCategoryName: value}))
  }

  const handleCloseDeleteRecieptsModal = () => {
    eventManager.send_event(events.DELETE_ALL_RECEIPTS_CANCEL_CLICKED_TFI, {
      tnx_id: deleteReceiptsModalProps?.transactions.map(
        (item) => item.transaction_id
      ),
      type: DELETE_RECEIPT_CLICK_EVENT.TYPE.EDIT,
      structure_id: formValues?._id,
    })
    setDeleteReceiptsModalProps((prev) => {
      return {
        ...prev,
        isOpen: false,
      }
    })
  }

  const handleConfirmDeleteAllReciepts = () => {
    eventManager.send_event(events.DELETE_ALL_RECEIPTS_POPUP_CLICKED_TFI, {
      tnx_id: deleteReceiptsModalProps?.transactions.map(
        (item) => item.transaction_id
      ),
      type: DELETE_RECEIPT_CLICK_EVENT.TYPE.EDIT,
      structure_id: formValues?._id,
      action: DELETE_RECEIPT_CLICK_EVENT.ACTION.DELETE,
    })

    setAlertModalProps({...alertModalProps, isOpen: false})
    setDeleteReceiptsModalProps((prev) => {
      return {
        ...prev,
        buttonLoader: true,
      }
    })

    let data = {is_cancelled: false, receipts: {}, pending_transactions: []}
    deleteReceiptsModalProps?.transactions.forEach((item) => {
      if (item?.receipt_no) {
        if (data.receipts[item.academic_session_id]) {
          data.receipts[item.academic_session_id].push(item?.receipt_no)
        } else {
          data.receipts[item.academic_session_id] = [item?.receipt_no]
        }
      }
    })

    data.pending_transactions = deleteReceiptsModalProps?.transactions
      .filter((item) => !item.receipt_no)
      .map((item) => item.transaction_id)

    const onSuccess = () => {
      eventManager.send_event(events.ALL_RECEIPTS_DELETED_TFI, {
        tnx_id: deleteReceiptsModalProps?.transactions.map(
          (item) => item.transaction_id
        ),
        type: DELETE_RECEIPT_CLICK_EVENT.TYPE.EDIT,
        structure_id: formValues?._id,
      })
      let newData = getStepsDataAfterDeleteReceipts({
        DependancyCase: DEPENDANCY_CASES.UPDATE,
        steps: deleteReceiptsModalProps?.steps,
      })
      setDeleteReceiptsModalProps((prev) => {
        return {...prev, ...newData}
      })
    }

    const onFailed = (errorMsg) => {
      let newData = {
        buttonLoader: false,
        toasts: [
          {content: errorMsg || t('genericErrorMessage'), type: 'error'},
        ],
      }
      setDeleteReceiptsModalProps((prev) => {
        return {...prev, ...newData}
      })
    }

    dispatch({
      type: feeStructureActionTypes.REVOKE_FEE_RECEIPTS_TRANSACTIONS_REQUEST,
      payload: {data, onSuccess, onFailed},
    })
  }

  const handleCancleDeleteReceipts = () => {
    eventManager.send_event(events.DELETE_ALL_RECEIPTS_POPUP_CLICKED_TFI, {
      tnx_id: deleteReceiptsModalProps?.transactions.map(
        (item) => item.transaction_id
      ),
      type: DELETE_RECEIPT_CLICK_EVENT.TYPE.EDIT,
      structure_id: formValues?._id,
      action: DELETE_RECEIPT_CLICK_EVENT.ACTION.CANCEL,
    })
    setAlertModalProps((prev) => {
      return {...prev, isOpen: false}
    })
  }

  const handleDeleteAllReciepts = () => {
    eventManager.send_event(events.DELETE_ALL_RECEIPTS_CLICKED_TFI, {
      tnx_id: deleteReceiptsModalProps?.transactions.map(
        (item) => item.transaction_id
      ),
      type: DELETE_RECEIPT_CLICK_EVENT.TYPE.EDIT,
      structure_id: formValues?._id,
    })
    let transactionCount =
      (deleteReceiptsModalProps?.transactions &&
        deleteReceiptsModalProps?.transactions.length) ||
      0
    let text = deleteAllReceiptsConfirmationTransText({
      transactionCount,
      structureName: formValues?.name,
    })

    setAlertModalProps({
      ...alertModalProps,
      isOpen: true,
      header: deleteAllReceiptsTransText,
      text,
      handleCloseModal: handleCancleDeleteReceipts,
      actionButtons: [
        {
          body: t('cancel'),
          onClick: handleCancleDeleteReceipts,
          type: 'outline',
        },
        {
          body: t('delete'),
          onClick: handleConfirmDeleteAllReciepts,
          category: 'destructive',
        },
      ],
    })
  }

  const deleteReceiptModalButtons = useCallback(() => {
    let actionBtn = {}
    Object.values(deleteReceiptsModalProps?.steps).forEach((ele) => {
      if (
        ele.id === UPDATE_FEE_STRUCTURE_STEP_IDS.deleteReceipt &&
        ele.status === STEP_STATUS.IN_PROGRESS
      ) {
        actionBtn = {
          text: deleteAllReceiptsTransText,
          onClick: handleDeleteAllReciepts,
        }
      } else if (
        ele.id === UPDATE_FEE_STRUCTURE_STEP_IDS.updateFeeStructure &&
        ele.status === STEP_STATUS.IN_PROGRESS
      ) {
        actionBtn = {
          text: t('publishFeeStructureText'),
          onClick: handleSubmit,
          type: 'primary',
        }
      }
    })

    return [
      {
        body: t('cancel'),
        onClick: handleCloseDeleteRecieptsModal,
        type: 'outline',
        isDisabled: deleteReceiptsModalProps?.buttonLoader,
      },
      {
        body: (
          <div className={DeleteRecieptsModalStyles.buttonLoadingSection}>
            {deleteReceiptsModalProps?.buttonLoader && (
              <div
                className={classNames(
                  'loading',
                  DeleteRecieptsModalStyles.buttonLoading
                )}
              ></div>
            )}
            {actionBtn.text}
          </div>
        ),
        onClick: actionBtn.onClick,
        type: actionBtn?.type ? actionBtn?.type : 'destructive',
        isDisabled: deleteReceiptsModalProps?.buttonLoader,
      },
    ]
  }, [
    formValues,
    Object.keys(deleteReceiptsModalProps).map(
      (item) => deleteReceiptsModalProps[item]
    ),
  ])

  const showTotalAnnualFees =
    isLastTab(formValues, currentTab) &&
    formValues.fee_type !== FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE &&
    formValues.fee_categories.filter((category) => {
      return !category.isDelete
    }).length > 0

  if (structureSliderLoading) {
    return <div className="loading"></div>
  }

  return (
    <>
      {alertModalProps?.isOpen && (
        <div className={DeleteRecieptsModalStyles.alertModalSection}>
          <AlertModal
            {...alertModalProps}
            handleCloseModal={handleAlertModalClose}
            actionButtons={alertModalProps?.actionButtons || []}
          />
        </div>
      )}

      {deleteReceiptsModalProps?.isOpen && (
        <DeleteRecieptsModal
          {...deleteReceiptsModalProps}
          classes={{stepper: {description: styles.stepperDesc}}}
          handleCloseModal={handleCloseDeleteRecieptsModal}
          handleDeleteAllReciepts={handleDeleteAllReciepts}
          actionButtons={deleteReceiptModalButtons()}
          toastOnCloseClick={toastOnCloseClickFn}
          eventManager={eventManager}
          strutureInfo={{
            ...formValues,
            clickEventType: DELETE_RECEIPT_CLICK_EVENT.TYPE.EDIT,
          }}
        />
      )}
      {showCustomInstallmentPopup && (
        <ConfirmationPopup
          onClose={() => setShowCustomInstallmentPopup(false)}
          onAction={updateFeeStructureData}
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
          title={t('customInstallmentModalTitle')}
          desc={t('customInstallmentModalDesc')}
          primaryBtnText={t('btnTextCancel')}
          secondaryBtnText={t('btnTextConfirm')}
        />
      )}
      {showConfirmPopup && (
        <ConfirmationPopup
          onClose={() => {
            eventManager.send_event(
              events.PUBLISH_FEE_STRUCTURE_POPUP_CLICKED_TFI,
              {
                fee_type: formValues.fee_type,
                action: 'decline',
              }
            )
            setShowConfirmPopup(false)
          }}
          onAction={createFeeStructureData}
          icon={
            <Icon
              name="checkCircle"
              color="success"
              className={classNames(
                styles.higherSpecificityFontSize,
                styles.higherSpecificityIcon,
                styles.infoIcon
              )}
            />
          }
          title={t('areYouSureYouWantToPublishFeeStructure')}
          desc={t('feeStructurePublishConfirmModalDesc')}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('publish')}
        />
      )}
      {showAddCustomCategoryPopup && (
        <CustomCategoryModal
          showAddCustomCategoryPopup={showAddCustomCategoryPopup}
          handleDeclineAddCustomCategory={handleDeclineAddCustomCategory}
          handleAddCustomCategory={handleAddCustomCategory}
          title={CUSTOM_CATEGORY.addNewPopup.title}
          handleChangeAddnewCustomCategory={handleChangeAddnewCustomCategory}
          customCategoryName={customCategoryName}
        />
      )}
      <div
        className={classNames(
          styles.sliderHeader,
          'show-scrollbar show-scrollbar-big'
        )}
      >
        <ErrorBoundary>
          <form onSubmit={handleSubmit}>
            <div className={styles.sliderContent}>
              <Classes
                formValues={formValues}
                formErrors={formErrors}
                setFormValues={setFormValues}
                handleChange={handleChange}
                hidden={currentTab !== FEE_STRUCTURE_SLIDER_TABS_IDS.CLASSES}
                showAdvancedFilter={showAdvancedFilter}
                setShowAdvancedFilter={setShowAdvancedFilter}
              />
              <FeeType
                formValues={formValues}
                formErrors={formErrors}
                handleChange={handleChange}
                setFormValues={setFormValues}
                hidden={
                  currentTab !== FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_TYPE &&
                  currentTab !== FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_STRUCTURE
                }
              />
              {formValues.fee_type !== FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE && (
                <DueDates
                  formValues={formValues}
                  formErrors={formErrors}
                  handleChange={handleChange}
                  hidden={
                    currentTab !== FEE_STRUCTURE_SLIDER_TABS_IDS.DUE_DATES
                  }
                />
              )}
              {formValues.fee_type ===
                FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE && (
                <Amount
                  formValues={formValues}
                  formErrors={formErrors}
                  handleChange={handleChange}
                  hidden={currentTab !== FEE_STRUCTURE_SLIDER_TABS_IDS.AMOUNT}
                />
              )}
              <div className={styles.footerSection}>
                <StickyFooter forSlider={true}>
                  <div className={styles.footerContent}>
                    {showTotalAnnualFees &&
                      calculateGrandTotal(
                        formValues,
                        styles,
                        instituteInfo.currency
                      )}
                    <Button
                      size={'big'}
                      className={
                        isSubmitDisabled(formValues, currentTab)
                          ? styles.submitBtnDisabled
                          : styles.submitBtn
                      }
                      disabled={isSubmitDisabled(formValues, currentTab)}
                    >
                      {isLastTab(formValues, currentTab)
                        ? FEE_STRUCTURE.btnTextPublish
                        : FEE_STRUCTURE.btnTextNext}
                    </Button>
                  </div>
                </StickyFooter>
              </div>
            </div>
          </form>
        </ErrorBoundary>
        {feeStructureError && (
          <div className={styles.errorOverlay}>
            <ErrorOverlay>
              <div>{FEE_STRUCTURE.failedToSaveConfigurations}</div>
            </ErrorOverlay>
          </div>
        )}
      </div>
    </>
  )
}
