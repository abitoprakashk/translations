import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {t} from 'i18next'
import {DateTime} from 'luxon'
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
  Alert,
  ALERT_CONSTANTS,
  PARA_CONSTANTS,
  Input,
  Datepicker,
  INPUT_TYPES,
  RequiredSymbol,
  Checkbox,
} from '@teachmint/krayon'
import {
  getAdmitCardGenerated,
  getAdmitCardStudentListSectionWise,
} from '../../../admitCard.selectors'
import globalActions from '../../../../../redux/actions/global.actions'
import {events} from '../../../../../utils/EventsConstants'
import styles from './FormDataModal.module.css'

export default function FormDataModal({showModal, setShowModal, sectionId}) {
  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)

  const admitCardData = getAdmitCardStudentListSectionWise()

  const currentData = admitCardData?.data?.section_results
  const data =
    currentData?.length > 0
      ? {
          examName:
            admitCardData?.data?.section_results[0]?.task_params?.exam_name,
          termName:
            admitCardData?.data?.section_results[0]?.task_params?.term_name,
          startDate: DateTime.fromFormat(
            admitCardData?.data?.section_results[0]?.task_params?.start_date,
            'dd LLL, yyyy'
          ).toJSDate(),
          endDate: DateTime.fromFormat(
            admitCardData?.data?.section_results[0]?.task_params?.end_date,
            'dd LLL, yyyy'
          ).toJSDate(),
          principalSelected: true,
          academicHeadSelected: true,
        }
      : {
          examName: '',
          termName: '',
          startDate: DateTime.now().toJSDate(),
          endDate: DateTime.now().toJSDate(),
          principalSelected: true,
          academicHeadSelected: true,
        }

  const [formData, setFormData] = useState(data)

  const {instituteHierarchy} = useSelector((state) => state)
  const admitCardBulkGenerate = getAdmitCardGenerated()

  const handleChange = ({fieldName, value}) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    })
  }

  const generateAdmitCard = () => {
    dispatch(
      globalActions.generateAdmitCards.request({
        section_id: sectionId,
        exam_name: formData.examName,
        term_name: formData.termName,
        start_date: DateTime.fromJSDate(formData.startDate).toFormat(
          'dd LLL, yyyy'
        ),
        end_date: DateTime.fromJSDate(formData.endDate).toFormat(
          'dd LLL, yyyy'
        ),
        session: instituteHierarchy?.name,
        academic_head: formData.principalSelected,
        principal: formData.academicHeadSelected,
      })
    )
    eventManager.send_event(events.ADMIT_CARD_SUBMIT_CLICKED_TFI, {
      section_id: sectionId,
      exam_name: formData.examName,
      term_name: formData.termName,
      start_date: DateTime.fromJSDate(formData.startDate).toFormat(
        'dd LLL, yyyy'
      ),
      end_date: DateTime.fromJSDate(formData.endDate).toFormat('dd LLL, yyyy'),
      academic_head_sign: formData.principalSelected,
      principal_sign: formData.academicHeadSelected,
    })

    setShowModal(!showModal)
  }

  const getModalHeader = () => {
    return (
      <div>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
              {t('admitCardDetailsExamDetails')}
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
          <div className={styles.modalErrorSection}></div>
          <Button
            onClick={generateAdmitCard}
            isDisabled={formData.examName.length === 0}
            classes={{button: styles.changeLeadStageButton}}
          >
            {t('admitCardDetailsSubmit')}
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
      {admitCardBulkGenerate.isLoading ? (
        <div className="loading" />
      ) : (
        <div>
          <Alert
            type={ALERT_CONSTANTS.TYPE.INFO}
            content={t('admitCardDetailsAlertMsg')}
            hideClose="true"
            className={styles.alert}
          />

          <div className={styles.examName}>
            <Input
              type={INPUT_TYPES.TEXT}
              fieldName="examName"
              title={t('admitCardDetailsExamName')}
              value={formData.examName}
              isRequired="true"
              placeholder={t('admitCardDetailsExamNamePlaceholder')}
              onChange={handleChange}
              maxLength={30}
            />
          </div>
          <div className={styles.examName}>
            <Input
              type={INPUT_TYPES.TEXT}
              fieldName="termName"
              title={t('admitCardDetailsTermName')}
              value={formData.termName}
              placeholder={t('admitCardDetailsTermNamePlaceholder')}
              onChange={handleChange}
              maxLength={30}
            />
          </div>
          <div className={styles.examDate}>
            <div>
              <div className={styles.datePickerLabel}>
                <Para
                  children={t('admitCardDetailsStartDate')}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                />
                <RequiredSymbol className={styles.required} />
              </div>
              <Datepicker
                closeOnChange={true}
                value={formData.startDate}
                showMonthAndYearPickers={false}
                className={{calendarWrapper: styles.calendar}}
                onChange={(date) =>
                  handleChange({fieldName: 'startDate', value: date})
                }
              />
            </div>
            <div>
              <div className={styles.datePickerLabel}>
                <Para
                  children={t('admitCardDetailsEndDate')}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                />
                <RequiredSymbol className={styles.required} />
              </div>
              <Datepicker
                closeOnChange={true}
                value={formData.endDate}
                showMonthAndYearPickers={false}
                classes={{
                  calendar: styles.calendar,
                }}
                minDate={formData.startDate}
                className={{calendarWrapper: styles.calendar}}
                onChange={(date) =>
                  handleChange({fieldName: 'endDate', value: date})
                }
              />
            </div>
          </div>
          <div className={styles.signature}>
            <Para
              children={t('admitCardDetailsSignature')}
              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            />
            <div className={styles.checkbox}>
              <Checkbox
                isSelected={formData.principalSelected}
                label={t('admitCardDetailsAcademicHead')}
                fieldName="principalSelected"
                handleChange={handleChange}
              />
              <Checkbox
                isSelected={formData.academicHeadSelected}
                label={t('admitCardDetailsPrincipal')}
                fieldName="academicHeadSelected"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
