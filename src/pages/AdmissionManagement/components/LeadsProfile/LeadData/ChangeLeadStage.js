import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import {
  Modal,
  Para,
  Heading,
  Icon,
  ICON_CONSTANTS,
  HEADING_CONSTANTS,
  Divider,
  Button,
  MODAL_CONSTANTS,
  PARA_CONSTANTS,
  Badges,
  BADGES_CONSTANTS,
  Input,
  INPUT_TYPES,
} from '@teachmint/krayon'
import {
  updateLeadStageFromLeadProfile,
  useAdmissionCrmSettings,
  useLeadList,
} from '../../../redux/admissionManagement.selectors'
import styles from './ChangeLeadStage.module.css'
import globalActions from '../../../../../redux/actions/global.actions'
import {events} from '../../../../../utils/EventsConstants'
import {updateLeadList} from '../../../utils/helpers'

export default function ChangeLeadStage({
  leadData,
  showModal,
  setShowModal,
  setShowConfirmAdmissionPopup,
  setShowConfirmAdmissionModal,
}) {
  const dispatch = useDispatch()
  const admissionFormFields = useAdmissionCrmSettings()
  const leadList = useLeadList()
  const updateLeadStage = updateLeadStageFromLeadProfile()
  const leadStages = Object.values(admissionFormFields?.data?.lead_stages)
  const [selectedStage, setSelectedStage] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const admissionConfirmedStageId = leadStages[leadStages.length - 1]._id
  const eventManager = useSelector((state) => state.eventManager)

  const changeLeadStage = () => {
    setErrorMessage('')
    if (selectedStage === admissionConfirmedStageId) {
      leadData.status_adm_fee === 'PAID'
        ? setShowConfirmAdmissionModal(true)
        : setShowConfirmAdmissionPopup(true)
      return
    }

    const successAction = () => {
      eventManager.send_event(
        events.ADMISSION_LEAD_PROFILE_CHANGE_CONFIRM_CLICKED_TFI,
        {
          from_lead_stage_id: leadData?.lead_stage_id,
          to_lead_stage: selectedStage,
        }
      )

      dispatch(
        globalActions.getLeadList.success(
          updateLeadList(leadList?.data, leadData._id, {
            lead_stage_id: selectedStage,
          })
        )
      )
      setShowModal(false)
    }

    dispatch(
      globalActions.updateLeadStageFromLeadProfile.request(
        {
          lead_id: leadData._id,
          lead_stage_id: selectedStage,
        },
        successAction,
        (error) => setErrorMessage(error)
      )
    )
  }

  const getModalHeader = () => {
    return (
      <div>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
              {t('changeLeadStage')}
            </Heading>
          </div>
          <div>
            <Icon
              name="close"
              onClick={() => setShowModal(!showModal)}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              className={styles.modalClickable}
            />
          </div>
        </div>
        <Divider spacing="0" />
      </div>
    )
  }

  const getModalFooter = () => {
    return (
      <div>
        <Divider spacing="0" />
        <div className={styles.modalFooter}>
          <div className={styles.modalErrorSection}>
            {errorMessage && (
              <>
                <Icon name="info" type={ICON_CONSTANTS.TYPES.ERROR} />
                <div>{errorMessage}</div>
              </>
            )}
          </div>
          <Button
            onClick={changeLeadStage}
            isDisabled={!selectedStage || updateLeadStage.isLoading}
            classes={{button: styles.changeLeadStageButton}}
          >
            {t('change')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen={showModal}
      header={getModalHeader()}
      footer={getModalFooter()}
      classes={{modal: styles.modal}}
      size={MODAL_CONSTANTS.SIZE.SMALL}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      onClose={() => setShowModal(!showModal)}
    >
      <div className={styles.modalContent}>
        {updateLeadStage.isLoading ? (
          <div className="loading" />
        ) : (
          <>
            <div className={styles.currentLeadStage}>
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                {t('currentLeadStage')}
              </Para>
              <div className={styles.leadStageBadge}>
                <Badges
                  showIcon={false}
                  type={BADGES_CONSTANTS.TYPE.SUCCESS}
                  size={BADGES_CONSTANTS.SIZE.LARGE}
                  label={
                    leadStages?.find(
                      (stage) => stage._id === leadData.lead_stage_id
                    )?.name
                  }
                />
              </div>
            </div>
            <div className={styles.selectLeadStagePara}>
              <Input
                isRequired={true}
                type={INPUT_TYPES.DROPDOWN}
                title={t('changeLeadStageDropdownPlaceholder')}
                fieldName="selectedStage"
                value={selectedStage}
                placeholder={t('selectChangeLeadStagePlaceholder')}
                options={leadStages
                  ?.filter((stage) => stage._id !== leadData.lead_stage_id)
                  ?.map((stage) => ({
                    label: stage.name,
                    value: stage._id,
                  }))}
                onChange={({value}) => {
                  setSelectedStage(value)
                }}
                classes={{
                  wrapperClass: styles.dropDownSize,
                  optionsClass: styles.dropDownOptions,
                }}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
