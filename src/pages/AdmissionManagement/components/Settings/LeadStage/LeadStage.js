import {useEffect, useState} from 'react'
import {t} from 'i18next'
import produce from 'immer'
import {Trans} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {
  Alert,
  Button,
  BUTTON_CONSTANTS,
  IconFrame,
  ICON_FRAME_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Input,
  INPUT_TYPES,
  Para,
  PARA_CONSTANTS,
  Popup,
} from '@teachmint/krayon'
import classNames from 'classnames'
import styles from './LeadStage.module.css'
import FormPreview from '../FormPreview/FormPreview'
import {getSequencedStages} from '../../../utils/helpers'
import {leadStageData, onboardingFlowStepsId} from '../../../utils/constants'
import globalActions from '../../../../../redux/actions/global.actions'
import {alphaNumericRegex} from '../../../../../utils/Validations'
import {useAdmissionCrmSettings} from '../../../redux/admissionManagement.selectors'

export default function LeadStage({formData, setFormData}) {
  const dispatch = useDispatch()
  const admissionCrmSettings = useAdmissionCrmSettings()
  const [deleteStageId, setDeleteStageId] = useState(null)
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  const formatStages = (leads) => {
    let sequencedSteps = {}
    const leadData = typeof leads === 'object' ? Object.values(leads) : leads
    getSequencedStages(leadData).forEach((step, index) => {
      sequencedSteps[index + 1] = step
    })
    return sequencedSteps
  }

  useEffect(() => {
    setFormData(formatStages(formData))
  }, [])

  const isDefaultStage = (index) => {
    // Non-editable stages
    return [
      0, // Enquiry Stage
      Object.values(formData).length - 2, // Rejected Stage
      Object.values(formData).length - 1, // Admission Confirmed Stage
    ].includes(index)
  }

  const handleChange = (e, index) => {
    if (alphaNumericRegex(e.value)) {
      let newFormData = {...formData}
      newFormData[index + 1] = {...newFormData[index + 1], name: e.value}
      setFormData(newFormData)
    }
  }

  const handleAddStageClick = (index) => {
    let newFormData = []
    newFormData.push({
      name: '',
      sequence_no: index,
    })
    Object.values(formData).forEach((stage) => {
      newFormData.push({
        ...stage,
        sequence_no:
          stage.sequence_no < index ? stage.sequence_no : stage.sequence_no + 1,
      })
    })
    setFormData(formatStages(newFormData))
  }

  const deleteLeadStage = (index) => {
    const newFormData = produce(formData, (draft) => {
      delete draft[index]
      Object.keys(draft).forEach((no) => {
        draft[no].sequence_no = no > index ? no - 1 : draft[no].sequence_no
      })
    })
    setFormData(formatStages(newFormData))
  }

  const handleDeleteClick = (stage, index) => {
    if (stage._id) {
      setDeleteStageId({stage, index})
      setShowDeletePopup(true)
    } else {
      deleteLeadStage(index)
    }
  }

  const handleDeleteConfirmationClick = () => {
    const successAction = () => {
      deleteLeadStage(deleteStageId.index)
      // Remove the stage from CRM settings so that it removes from Kanban Board
      const newSettings = produce(admissionCrmSettings.data, (draft) => {
        delete draft.lead_stages[deleteStageId.stage._id]
      })
      dispatch(globalActions.getAdmissionCrmSettings.success(newSettings))
    }
    dispatch(
      globalActions.deleteLeadStage.request(
        {
          setting_key: leadStageData.settingsKey,
          lead_stage_id: deleteStageId.stage._id,
        },
        successAction
      )
    )
    setShowDeletePopup(false)
  }

  return (
    <div className={styles.bodyContent}>
      {showDeletePopup && (
        <Popup
          isOpen
          onClose={() => setShowDeletePopup(false)}
          header={t('deleteLeadStageConfirmationTitle')}
          actionButtons={[
            {
              onClick: () => setShowDeletePopup(false),
              body: t('cancel'),
              type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            },
            {
              onClick: handleDeleteConfirmationClick,
              body: t('delete'),
              category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
            },
          ]}
        >
          <br />
          <Para>{t('deleteLeadStageConfirmationDescription')}</Para>
        </Popup>
      )}
      <div className={styles.formContent}>
        <Alert
          hideClose
          content={t('maxLeadStageLimit')}
          className={classNames(styles.sessionAlert, styles.widthFitContent)}
        />
        <div className={styles.leadStages}>
          {Object.values(formData).map((stage, index) => {
            return (
              <div
                className={styles.leadStage}
                key={`${stage?._id}${index}${stage.sequence_no}`}
              >
                {isDefaultStage(index) ? (
                  <>
                    <div className={styles.titleContainer}>
                      {index === 0
                        ? t('enquiryStageLabel')
                        : index === Object.values(formData).length - 2
                        ? t('rejectedStageLabel')
                        : t('confirmedStageLabel')}
                    </div>
                    <div className={styles.defaultStage}>
                      <Para
                        type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                        weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                      >
                        {stage.name}
                      </Para>
                    </div>
                  </>
                ) : (
                  <div className={styles.editableSection}>
                    <Input
                      type={INPUT_TYPES.TEXT}
                      title={
                        <Trans i18nKey="leadStageSequenceLabel">
                          Name Stage {{sequenceNo: index + 1}}
                        </Trans>
                      }
                      fieldName="leadStages"
                      isRequired={true}
                      value={stage.name}
                      maxLength={20}
                      onChange={(obj) => handleChange(obj, index)}
                    />
                    <div onClick={() => handleDeleteClick(stage, index + 1)}>
                      <IconFrame
                        size={ICON_FRAME_CONSTANTS.SIZES.LARGE}
                        type={ICON_FRAME_CONSTANTS.TYPES.PRIMARY}
                      >
                        <Icon
                          name="delete1"
                          size={ICON_CONSTANTS.SIZES.XX_SMALL}
                        />
                      </IconFrame>
                    </div>
                  </div>
                )}
                {Object.values(formData).length - 1 !== index && (
                  <div
                    className={classNames(styles.addStageDivision, {
                      [styles.noDivision]:
                        index !== Object.values(formData).length - 2,
                    })}
                  >
                    {Object.values(formData).length < 8 &&
                      index !== Object.values(formData).length - 2 && (
                        <Button
                          prefixIcon="add"
                          type={BUTTON_CONSTANTS.TYPE.TEXT}
                          onClick={() => handleAddStageClick(index + 2)}
                        >
                          {t('addLeadStage')}
                        </Button>
                      )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <FormPreview type={onboardingFlowStepsId.LEAD_STAGES} />
    </div>
  )
}
