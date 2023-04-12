import {
  BUTTON_CONSTANTS,
  Checkbox,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  Stepper,
} from '@teachmint/krayon'
import React, {useEffect, useReducer, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import ComponentSwitcher from '../../../../../components/Common/ComponentSwitcher/ComponentSwitcher'
import {
  idCardCheckoutReducer,
  IDCheckoutActions,
  initialState,
} from '../IdCardCheckoutStates/IdCardCheckout.reducer'
import StudentStaffListWrapper from '../StudentStaffListWrapper/StudentStaffListWrapper'
import {STEPPER_STEPS} from './OrderIdCardModal.constant'
import {IdCardCheckoutContext} from '../IdCardCheckoutStates/IdCardCheckout.context'
import VerifyIDCardBeforePrintOrder from '../VerifyIDCardBeforePrintOrder/VerifyIDCardBeforePrintOrder'
import {STAFF, STUDENT} from '../../../CustomId.constants'
import styles from './OrderIdCardModal.module.css'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import CheckoutStep from '../CheckoutStep/CheckoutStep'
import CardConfiguration from '../CardConfiguration/CardConfiguration'
import {idCardAccessoriesConfigSelector} from '../../../redux/CustomId.selector'
import Loader from '../../../../../components/Common/Loader/Loader'
import {events} from '../../../../../utils/EventsConstants'

const OrderIdCardModal = ({toggleOrderModal}) => {
  const {t} = useTranslation()
  const [activeStep, setActiveStep] = useState(0)
  const [stepperProgress, updateStepperProgress] = useState(
    JSON.parse(JSON.stringify(STEPPER_STEPS))
  )
  const dispatch = useDispatch()
  const stageOneSteps = useRef(1) // assuming the first step has index 0
  const {data: idConfig, isLoading} = idCardAccessoriesConfigSelector()
  const eventManager = useSelector((state) => state.eventManager)
  const {error} = useSelector((store) => store.globalData.generateBulkIdCard)

  const [idCardCheckoutData, internalDispatch] = useReducer(
    idCardCheckoutReducer,
    initialState
  )

  useEffect(() => {
    internalDispatch({
      type: IDCheckoutActions.TOGGLE_NEXT_BUTTON_DISABILITY,
      data: !idCardCheckoutData.footerCheckboxSelected,
    })
  }, [idCardCheckoutData.footerCheckboxSelected])

  useEffect(() => {
    if (
      idCardCheckoutData.selectedStaff.length > 0 &&
      idCardCheckoutData.selectedStudents.length > 0
    )
      stageOneSteps.current = 2
  }, [idCardCheckoutData.selectedStaff, idCardCheckoutData.selectedStudents])

  useEffect(() => {
    const {selectedStudents, selectedStaff, idCardConfig} = idCardCheckoutData

    let eventName = ''
    let eventOptions = {}

    // Selection
    if (activeStep === 1) {
      eventName = events.IDCARD_ORDER_POPUP_USER_SELECTION_CLICKED_TFI
      eventOptions.students = selectedStudents
      eventOptions.staff = selectedStaff
      eventOptions.userCount =
        (selectedStudents?.length || 0) + (selectedStaff?.length || 0)
    }

    // Preview event
    if (selectedStudents?.length > 0) {
      if (activeStep === 2) {
        eventName = events.IDCARD_ORDER_POPUP_CARD_PREVIEW_CLICKED_TFI
        eventOptions.screen_name = 'student'
      } else if (activeStep === 3 && selectedStaff?.length > 0) {
        eventName = events.IDCARD_ORDER_POPUP_CARD_PREVIEW_CLICKED_TFI
        eventOptions.screen_name = 'staff'
      }
    } else {
      if (activeStep === 2) {
        eventName = events.IDCARD_ORDER_POPUP_CARD_PREVIEW_CLICKED_TFI
        eventOptions.screen_name = 'staff'
      }
    }

    // Card Selection
    if (activeStep === stageOneSteps.current + 2) {
      eventName = events.IDCARD_ORDER_POPUP_CARD_TYPE_SELECTION_CLICKED_TFI
      eventOptions.card_type = idCardConfig?.card_type_id
    }

    // Lenynard Selection
    if (activeStep === stageOneSteps.current + 3) {
      eventName = events.IDCARD_ORDER_POPUP_LEYNARD_SELECTION_CLICKED_TFI
      eventOptions.laynard_type = idCardConfig?.lanyard_id
    }

    // Card Holder selection
    if (activeStep === stageOneSteps.current + 4) {
      eventName = events.IDCARD_ORDER_POPUP_CARD_HOLDER_SELECTION_CLICKED_TFI
      eventOptions.holder_type = idCardConfig?.holder_id
    }

    eventManager.send_event(eventName, eventOptions)
  }, [activeStep])

  const updateStep = (isIncrement) => {
    const currentStepperProgress = [...stepperProgress]
    if (isIncrement) setActiveStep(activeStep + 1)
    else setActiveStep(activeStep - 1)
    if (
      (isIncrement && activeStep > stageOneSteps.current) ||
      (!isIncrement && activeStep - 1 > stageOneSteps.current)
    ) {
      const step = isIncrement
        ? activeStep - stageOneSteps.current
        : activeStep - stageOneSteps.current - 2
      currentStepperProgress[step].status = 'IN_PROGRESS'
      for (let i = 0; i < currentStepperProgress.length; i++) {
        if (i < step) currentStepperProgress[i].status = 'COMPLETED'
        else if (i > step) currentStepperProgress[i].status = 'NOT_STARTED'
      }
    }
    updateStepperProgress(currentStepperProgress)
  }

  return (
    <>
      <Loader show={isLoading} />
      <Modal
        showCloseIcon
        header={t('customId.orderModalHeader')}
        isOpen={true}
        size={MODAL_CONSTANTS.SIZE.X_LARGE}
        classes={{content: styles.modalContent}}
        onClose={() => {
          dispatch(globalActions.idCardCheckoutPreviewUrls.reset())
          dispatch(globalActions.generateIdCardsForCheckoutRequestId.reset())
          toggleOrderModal()
        }}
        shouldCloseOnOverlayClick={false}
        actionButtons={[
          {
            onClick: () => {
              updateStep(false)
            },
            body: t('back'),
            isDisabled: idCardCheckoutData.backButtonDisabled,
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
          },
          {
            body: idCardCheckoutData?.isFinalStep
              ? t('customId.makePayment')
              : t('next'),
            onClick: () => {
              if (idCardCheckoutData?.isFinalStep)
                internalDispatch({
                  type: IDCheckoutActions.MAKE_PAYMENT_ACTION,
                  data: true,
                })
              else updateStep(true)
            },
            isDisabled: error || idCardCheckoutData.nextButtonDisabled,
          },
        ]}
        footerLeftElement={
          <div className={styles.footerWrapper}>
            {idCardCheckoutData.showFooterCheckBox && (
              <Checkbox
                classes={{label: styles.checkBoxLabel}}
                label={t('customId.verifiedIDCards')}
                isSelected={idCardCheckoutData.footerCheckboxSelected}
                onClick={() =>
                  internalDispatch({
                    type: IDCheckoutActions.TOGGLE_FOOTER_CHECKBOX,
                    data: !idCardCheckoutData.footerCheckboxSelected,
                  })
                }
              />
            )}
            {activeStep === 0 && (
              <div className={styles.footerWarning}>
                <Icon
                  name="info"
                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                />
                <Para>{t('customId.printWarning')}</Para>
              </div>
            )}
          </div>
        }
      >
        <IdCardCheckoutContext.Provider
          value={{idCardCheckoutData, internalDispatch}}
        >
          <ComponentSwitcher test={activeStep > stageOneSteps.current}>
            <div value={false}>
              <ComponentSwitcher test={activeStep}>
                <div value={0}>
                  <StudentStaffListWrapper />
                </div>
                <div value={1}>
                  <VerifyIDCardBeforePrintOrder
                    userType={
                      idCardCheckoutData?.selectedStudents?.length > 0
                        ? STUDENT
                        : STAFF
                    }
                    selectedIds={
                      idCardCheckoutData?.selectedStudents?.length > 0
                        ? idCardCheckoutData.selectedStudents
                        : idCardCheckoutData.selectedStaff
                    }
                  />
                </div>
                <div value={2}>
                  <VerifyIDCardBeforePrintOrder
                    userType={STAFF}
                    selectedIds={idCardCheckoutData.selectedStaff}
                  />
                </div>
              </ComponentSwitcher>
            </div>
            <div value={true}>
              <div className={styles.modalBody}>
                <Stepper
                  steps={stepperProgress}
                  classes={{wrapper: styles.stepperWrapper}}
                />

                <div className={styles.contentArea}>
                  <ComponentSwitcher test={activeStep}>
                    <div value={stageOneSteps.current + 1}>
                      <CardConfiguration
                        config={idConfig?.['card_type']}
                        fieldName="card_type_id"
                        label="Choose an ID Card type"
                      />
                    </div>
                    <div value={stageOneSteps.current + 2}>
                      <CardConfiguration
                        config={idConfig?.['lanyard']}
                        fieldName="lanyard_id"
                        label="Choose lanyard type"
                        subFields={true}
                      />
                    </div>
                    <div value={stageOneSteps.current + 3}>
                      <CardConfiguration
                        config={idConfig?.['holder']}
                        fieldName="holder_id"
                        label="Choose card holder type"
                      />
                    </div>
                    <div value={stageOneSteps.current + 4}>
                      <CheckoutStep closeModal={toggleOrderModal} />
                    </div>
                  </ComponentSwitcher>
                </div>
              </div>
            </div>
          </ComponentSwitcher>
        </IdCardCheckoutContext.Provider>
      </Modal>
    </>
  )
}

export default OrderIdCardModal
