import {useSelector} from 'react-redux'
import {t} from 'i18next'
import {Button, BUTTON_CONSTANTS} from '@teachmint/krayon'
import {
  updateLeadStage,
  useAdmissionCrmSettings,
  useCrmInstituteHierarchy,
} from '../../../redux/admissionManagement.selectors'
import {
  IMIS_SETTING_TYPES,
  downloadReportLeadListHiddenFields,
  modifiedImisFieldLabelsForDownloadReportLeadList,
} from '../../../utils/constants'
import {createAndDownloadCSV, JSObjectToCSV} from '../../../../../utils/Helpers'
import {getClassName} from '../../../utils/helpers'
import {DateTime} from 'luxon'
import {events} from '../../../../../utils/EventsConstants'

export default function DownloadReportButton({filteredLeadList}) {
  const admissionCrmSettings = useAdmissionCrmSettings()
  const instituteHierarchy = useCrmInstituteHierarchy()
  const leadUpdate = updateLeadStage()

  const {categorizedFields, admissionFormFields, enquiryFormFields} =
    admissionCrmSettings.data

  const leadStages = Object.values(admissionCrmSettings?.data?.lead_stages)
  const eventManager = useSelector((state) => state.eventManager)

  const getAdmissionFields = () => {
    let categorywiseNonVisibleFields = {}
    Object.values(categorizedFields)
      ?.filter((field) => field.setting_type === IMIS_SETTING_TYPES.CATEGORY)
      ?.forEach((admissionFields) => {
        admissionFields.fields.forEach((field) => {
          if (
            (admissionFormFields.profile_fields[field.key_id]?.enabled ||
              enquiryFormFields.profile_fields[field.key_id]?.enabled) &&
            !downloadReportLeadListHiddenFields.includes(field.key_id)
          ) {
            if (
              field.key_id in modifiedImisFieldLabelsForDownloadReportLeadList
            ) {
              categorywiseNonVisibleFields[field.key_id] =
                modifiedImisFieldLabelsForDownloadReportLeadList[field.key_id]
            } else {
              categorywiseNonVisibleFields[field.key_id] = field.label
            }
          }
        })
      })
    return categorywiseNonVisibleFields
  }

  const getAdmissionFieldData = (fieldsObject, leadData) => {
    const admissionDataObj = {}
    for (const key in fieldsObject) {
      if (key in leadData.profile_data) {
        if (key === 'date_of_birth') {
          admissionDataObj[key] = DateTime.fromSeconds(
            leadData.profile_data[key]
          ).toFormat('dd LLL, yyyy')
        } else {
          admissionDataObj[key] = leadData.profile_data[key]
        }
      } else {
        admissionDataObj[key] = ''
      }
    }
    return admissionDataObj
  }

  const getDownloadList = () => {
    const admissionFormFields = getAdmissionFields()
    const rows = {
      lead_id: 'Lead Id',
      student_name: 'Student Name',
      mobile: 'Mobile Number',
      email: 'Email',
      class: 'Class',
      enquiry_date: 'Enquiry Date',
      enquiry_type: 'Enquiry Type',
      lead_stage: 'Lead Stage',
      admission_form: 'Admission Form',
      form_fee: 'Form Fee',
      admission_fee: 'Admission Fee',
      ...admissionFormFields,
    }
    const download_rows = filteredLeadList?.map((rowData) => {
      const leadName = `${rowData.profile_data?.name ?? ''} ${
        rowData.profile_data?.last_name ?? ''
      }`
      const isFeeNotApplicable =
        (!admissionCrmSettings?.data.fee_settings.form_fees_required &&
          !admissionCrmSettings?.data.fee_settings.admission_fees_required) ||
        (!admissionCrmSettings?.data.fee_settings?.form_fees?.class_fees?.[
          rowData.profile_data.standard
        ]?.fee_amount &&
          !admissionCrmSettings?.data.fee_settings?.admission_fees
            ?.class_fees?.[rowData.profile_data.standard]?.fee_amount)

      const leadDataObj = getAdmissionFieldData(admissionFormFields, rowData)
      return {
        lead_id: rowData.ext_lead_id,
        student_name: leadName,
        mobile: rowData?.phone_number,
        email: rowData?.profile_data.email,
        class: getClassName(instituteHierarchy, rowData.class_id),
        enquiry_date: DateTime.fromSeconds(rowData.c).toFormat('dd LLL, yyyy'),
        enquiry_type: rowData?.lead_from,
        lead_stage: leadStages.find(
          (stage) => stage._id === rowData.lead_stage_id
        )?.name,
        admission_form: rowData?.status_adm_form,
        form_fee: isFeeNotApplicable ? 'NA' : rowData.status_form_fee,
        admission_fee: isFeeNotApplicable ? 'NA' : rowData.status_adm_fee,
        ...leadDataObj,
      }
    })
    download_rows.splice(0, 0, rows)
    return download_rows
  }

  const handleDownload = () => {
    eventManager.send_event(events.ADMISSION_REPORT_DOWNLOAD_CLICKED_TFI, {
      screen_name: 'lead_list',
    })
    const reportName = 'Lead-List Report'
    createAndDownloadCSV(reportName, JSObjectToCSV([], getDownloadList()))
  }

  return (
    <Button
      type={BUTTON_CONSTANTS.TYPE.OUTLINE}
      prefixIcon="download"
      children={t('downloadReportLeadListTransactionFollowup')}
      onClick={handleDownload}
      isDisabled={filteredLeadList?.length === 0 || leadUpdate.isLoading}
    />
  )
}
