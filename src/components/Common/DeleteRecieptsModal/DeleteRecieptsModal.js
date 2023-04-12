import React from 'react'
import styles from './DeleteRecieptsModal.module.css'
import {
  Heading,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  PlainCard,
  Stepper,
  Toast,
} from '@teachmint/krayon'
import AlertModal from '../AlertModal/AlertModal'
import {
  STEP_STATUS,
  STEPS_IDS,
} from '../../../pages/user-profile/components/Student/studentConstants'
import DeleteReceiptsInfo from './DeleteReceiptsInfo/DeleteReceiptsInfo'

export default function DeleteRecieptsModal({
  isCsvDownloadBtn = true,
  handleCloseModal = () => {},
  isOpen = false,
  header = null,
  steps = [],
  confirmationAlertProps = {},
  toasts = [],
  buttonLoader = false,
  actionButtons = [],
  transactions = [],
  toastOnCloseClick = () => {},
  eventManager = {},
  strutureInfo = {},
}) {
  return (
    <>
      {confirmationAlertProps?.isOpen && (
        <div className={styles.alertModalSection}>
          <AlertModal {...confirmationAlertProps} />
        </div>
      )}
      <Modal
        onClose={(event) => {
          if (buttonLoader) return
          event?.stopPropagation?.()
          event?.stopImmediatepropagation?.()
          handleCloseModal()
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        isOpen={isOpen}
        actionButtons={actionButtons}
        header={header}
        size={MODAL_CONSTANTS.SIZE.LARGE}
        classes={{modal: styles.positionRelativeForToast}}
      >
        <div className={styles.section}>
          {toasts.length > 0 && (
            <div className={styles.toastSection}>
              {toasts.map((item) => {
                return (
                  <Toast
                    autoClose
                    onCloseClick={() => toastOnCloseClick(item.id)}
                    key={`deleteReceiptModalToast${item.id}`}
                    content={item?.content}
                    type={item?.type}
                  />
                )
              })}
            </div>
          )}
          <Stepper
            isVertical={false}
            onClickOfStep={() => {}}
            steps={Object.values(steps)}
            classes={{description: styles.stepperDesc}}
          />
          {Object.keys(steps).map((key) => {
            let step = steps[key]
            return (
              <div key={step.id}>
                {/* STEP 1 */}
                {key === STEPS_IDS.STEP_1 &&
                  step?.status === STEP_STATUS.IN_PROGRESS && (
                    <DeleteReceiptsInfo
                      isCsvDownloadBtn={isCsvDownloadBtn}
                      summaryInfoText={step?.summaryInfoText}
                      summaryInfo={step?.summaryInfo}
                      deleteHeading={step?.deleteHeading}
                      transactions={transactions}
                      eventManager={eventManager}
                      strutureInfo={strutureInfo}
                    />
                  )}

                {/* STEP 2 */}
                {key === STEPS_IDS.STEP_2 &&
                  step?.status === STEP_STATUS.IN_PROGRESS && (
                    <PlainCard className={styles.secondSection}>
                      <div className={styles.secondSectionHeadingDiv}>
                        <Heading textSize="xx_s">{step?.deleteHeading}</Heading>
                      </div>
                      <div className={styles.secondContentSection}>
                        <Icon
                          name={step?.info?.icon?.name || 'delete1'}
                          size={ICON_CONSTANTS.SIZES.XX_SMALL}
                          type={
                            step?.info?.icon?.type || ICON_CONSTANTS.TYPES.ERROR
                          }
                          className={styles.secondSectionIcon}
                        />
                        {step?.info &&
                          step?.info?.messages &&
                          step?.info?.messages.map((item, idx) => (
                            <div key={`stepInfoMsg${idx}`}>{item}</div>
                          ))}
                      </div>
                    </PlainCard>
                  )}
              </div>
            )
          })}
        </div>
      </Modal>
    </>
  )
}
