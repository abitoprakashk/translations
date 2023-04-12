import React, {useState, useEffect} from 'react'
import {
  CERTIFICATE_LABELS,
  certificateTypeMap,
} from '../../Certificates.constants'
import s from './CreateCertificate.module.css'
import cx from 'classnames'
import {header} from '../../Certificates.module.css'
import PDFViewer from '../../../../components/Common/PdfViewer/PdfViewer'
import {Button, Icon, Modal} from '@teachmint/common'
import ConfirmationPopup from '../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import CommonCertificate from '../CertificateInputContainers/CommonCertificate'
import {useDispatch, useSelector} from 'react-redux'
import {CertificateActions} from '../../redux/actionTypes'
import {createCertificateItem} from '../../redux/actions/certificateActions'
import TransferCertificate from '../CertificateInputContainers/TransferCertificate'
import Loader from '../../../../components/Common/Loader/Loader'
import isEqual from 'lodash.isequal'
import {checkIfValid} from '../../commonFunctions'
import {saveAs} from 'file-saver'
import {Redirect} from 'react-router'
import RefreshIcon from '../../../../assets/images/icons/refresh.svg'
import BreadCrumbWrapper from '../BreadCrumb/BreadCrumbWrapper'
import {
  getDateObjFromString,
  getScreenWidth,
  pdfPrint,
} from '../../../../utils/Helpers'
import {events} from '../../../../utils/EventsConstants'
import SuccessIcon from '../../../../assets/images/icons/green-right.svg'
import moment from 'moment'

const CreateCertificate = () => {
  const {
    instituteActiveAcademicSessionId,
    instituteAcademicSessionInfo,
    eventManager,
    certificate: {
      certificateData: {
        selectedStudent,
        selectedStudentBackup,
        selectedType,
        pdfUrl,
        tcAndRemarks,
        loading,
      },
    },
  } = useSelector((store) => store)
  const [pdfModalOpen, setPdfModal] = useState(false)
  const [confirmPopup, showConfirmPopup] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [initialPreviewTriggered, setInitialPreview] = useState(false)
  const [date_of_birth, setDateOfBirth] = useState(
    selectedStudent?.date_of_birth
  )
  const [date_of_issue, setDateOfIssue] = useState('')
  const [date_of_admission, setDateOfAdmission] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (!(selectedType || Object.keys(selectedStudent).keys().length))
      setRedirect('/institute/dashboard/certificate')
    return function () {
      dispatch({
        type: CertificateActions.SET_STUDENT_INFO,
        payload: {},
      })
    }
  }, [])

  useEffect(() => {
    if (
      !initialPreviewTriggered &&
      selectedStudent?.name &&
      instituteAcademicSessionInfo?.length
    ) {
      let admission_time = selectedStudent?.admission_timestamp || ''
      const session_name = instituteAcademicSessionInfo.find(
        (item) => item._id == instituteActiveAcademicSessionId
      ).name
      if (admission_time) {
        admission_time = admission_time.toString()
        if (admission_time.includes('.'))
          admission_time = admission_time.split('.').join('').substring(0, 13)
        else admission_time = admission_time + '000'
        admission_time = parseInt(admission_time)
        admission_time = moment(admission_time).format('DD/MM/YYYY')
      }
      setDateOfBirth(selectedStudent.date_of_birth)
      setDateOfAdmission(admission_time)
      dispatch({
        type: CertificateActions.SET_STUDENT_INFO,
        payload: {
          ...selectedStudent,
          session_name,
        },
      })
      setInitialPreview(true)
      if (window.innerWidth > 600)
        submit('preview', {session_name, admission_time})
    }
  }, [selectedStudent])

  useEffect(() => {
    if (pdfUrl) {
      const tag = pdfUrl.split('_')
      if (tag[tag.length - 1] == 'generate') {
        showConfirmPopup(true)
        eventManager.send_event(events.CERTIFICATE_GENERATED_TFI, {
          certificate_type: certificateTypeMap[selectedType],
        })
      }
    }
  }, [pdfUrl])

  const handleInputChange = (fieldName, value) => {
    dispatch({
      type: CertificateActions.SET_STUDENT_INFO,
      payload: {
        ...selectedStudent,
        date_of_birth: date_of_birth,
        [fieldName]: value,
      },
    })
  }

  const handleInputChangeTCAndRemark = (fieldName, value, type) => {
    let data = {tc: {...tcAndRemarks.tc}, remarks: {...tcAndRemarks.remarks}}
    if (fieldName === 'promoted_to_higher_class' && !value) {
      data.tc.promoted_to_class_in_words = ''
      data.tc.promoted_to_class = ''
    }
    data[type] = {...data[type], [fieldName]: value}
    dispatch({
      type: CertificateActions.SET_TC_INFO,
      payload: data,
    })
  }

  const handleDateChange = (dateFieldName, value) => {
    if (dateFieldName == 'date_of_birth') setDateOfBirth(value)
    else if (dateFieldName == 'date_of_issue') setDateOfIssue(value)
    else if (dateFieldName == 'date_of_admission') setDateOfAdmission(value)
  }

  const triggerEventOnBlur = () => {
    const {
      name,
      middle_name,
      last_name,
      enrollment_number,
      father_name,
      mother_name,
      class_room,
      session_name,
    } = selectedStudent
    eventManager.send_event(events.ENTER_STUDENT_DETAILS_TFI, {
      first_name: name,
      middle_name,
      last_name,
      admission_no: enrollment_number,
      dob: date_of_birth,
      class: class_room,
      father_name,
      mother_name,
      session: session_name,
    })
  }

  const handlePrint = async () => {
    pdfPrint(pdfUrl, () => {
      setRedirect('/institute/dashboard/certificate')
      eventManager.send_event(events.PRINT_CERTIFICATE_CLICKED_TFI, {
        certificate_type: certificateTypeMap[selectedType],
      })
      showConfirmPopup(false)
    })
  }

  const handleDownload = async () => {
    const {name, middle_name, last_name} = selectedStudent
    const fullname = `${name} ${middle_name ? middle_name : ''} ${
      last_name ? last_name : ''
    }`
    let blob = await fetch(pdfUrl).then((r) => r.blob())
    const filename = `${fullname}-${certificateTypeMap[selectedType]}.pdf`
    showConfirmPopup(false)
    saveAs(blob, filename)
    eventManager.send_event(events.DOWNLOAD_CERTIFICATE_CLICKED_TFI, {
      certificate_type: certificateTypeMap[selectedType],
    })
    location.href = '/institute/dashboard/certificate'
  }

  const submit = async (tag, {session_name, admission_time} = {}) => {
    const studentProfileLatestData = {...selectedStudent}
    delete studentProfileLatestData.session_name
    const admission_timestamp =
      moment(getDateObjFromString(date_of_admission)).valueOf() / 1000
    studentProfileLatestData.admission_timestamp = admission_timestamp
    const data = {
      type: selectedType,
      tag: tag,
      profile_updated: false,
      profile: {
        ...selectedStudent,
        imember_id: selectedStudent._id,
        date_of_birth: date_of_birth || selectedStudent.date_of_birth,
        admission_timestamp,
        session_name: selectedStudent.session_name || session_name || '',
      },
      iid: selectedStudent._id,
      date: new Date().toLocaleDateString('en-UK'),
    }
    if (selectedType === 3) {
      data.tc = {...tcAndRemarks.tc}
      data.tc.subject = tcAndRemarks.tc?.subject?.split(',')
      data.tc.date_of_admission = date_of_admission || admission_time || ''
      data.tc.date_of_issue = date_of_issue
      data.remarks = tcAndRemarks.remarks
      data.tc.promoted_to_higher_class = data.tc.promoted_to_higher_class
        ? 'Yes'
        : 'No'
    }
    if (selectedType == 2) data.remarks = tcAndRemarks.remarks
    if (tag == 'generate') {
      data.profile_updated = !isEqual(
        studentProfileLatestData,
        selectedStudentBackup
      )
    }
    let eventType =
      tag === 'preview'
        ? events.PREVIEW_CLICKED_TFI
        : events.CERTIFICATE_GENERATE_CLICKED_TFI
    eventManager.send_event(eventType, {
      certificate_type: certificateTypeMap[selectedType],
    })
    dispatch(createCertificateItem(data))
  }

  const isValid = () => {
    if (selectedType) {
      const {tc, remarks} = tcAndRemarks
      return checkIfValid(selectedType, {
        ...selectedStudent,
        ...tc,
        date_of_admission,
        ...remarks,
      })
    }
  }
  if (redirect) return <Redirect to={redirect} />
  return (
    <div className={s.wrapper}>
      <Loader show={loading} />
      {getScreenWidth() > 700 && (
        <BreadCrumbWrapper
          selectedType={selectedType}
          selectedStudent={selectedStudentBackup}
        />
      )}
      <h1 className={cx(header, 'tm-h1')}>
        {CERTIFICATE_LABELS.GENERATE_CERTIFICATE}
      </h1>
      <div id="input_preview_container" className={s.inner_wrapper}>
        {/* <div className={s.reason}>
          <span>Reason for Request: </span>
          <span>
            Some invalid reasonads ghvasdb gvhjbkn
            vjhbknmnsadsakjdnaskldnaslkdnaslkdnaslk sakndlkasdnaslkdnaskldn
            dsandkasndlkasdmlaskdn
          </span>
        </div> */}
        <div className={s.inner_container}>
          <div className={s.input_container}>
            <div className={s.info_div}>
              <p>Required student information for certificate generation</p>
              <div className={s.info}>
                <p>
                  <Icon
                    name="error"
                    type="outlined"
                    color="success"
                    size="xxxs"
                  />
                </p>
                <p>
                  The infomation available is editable and will be auto-updated
                  in student’s profile
                </p>
              </div>
            </div>
            {(selectedType == 1 || selectedType == 2) && (
              <CommonCertificate
                profileData={selectedStudent}
                handleInputChange={handleInputChange}
                handleInputChangeTCAndRemark={handleInputChangeTCAndRemark}
                tcAndRemarksData={tcAndRemarks}
                certificateType={selectedType}
                handleDateChange={handleDateChange}
                date_of_birth={date_of_birth}
                triggerEventOnBlur={triggerEventOnBlur}
              />
            )}
            {selectedType == 3 && (
              <TransferCertificate
                profileData={selectedStudent}
                handleInputChange={handleInputChange}
                handleInputChangeTCAndRemark={handleInputChangeTCAndRemark}
                tcAndRemarks={tcAndRemarks}
                handleDateChange={handleDateChange}
                date_of_birth={date_of_birth}
                date_of_admission={date_of_admission}
                date_of_issue={date_of_issue}
                triggerEventOnBlur={triggerEventOnBlur}
              />
            )}
            <button
              onClick={() => {
                submit('preview')
                setPdfModal(true)
                document
                  .getElementById('input_preview_container')
                  .scrollTo(0, 0)
              }}
              className={cx(s.preview_button, 'tm-btn2-white-blue')}
            >
              <span>
                <img src={RefreshIcon} alt="" />
              </span>
              <span> Show changes in preview</span>
            </button>
          </div>
          <div className={cx(s.pdf_wrapper, s.desktop_wrapper)}>
            <PDFViewer file={pdfUrl} scale={0.9} />
          </div>
        </div>
        <div className={s.modal_container}>
          <Modal show={pdfModalOpen}>
            <div className={s.preview_modal}>
              <div className={s.pill}>
                <p onClick={() => setPdfModal(false)}></p>
              </div>
              <div className={s.modal_header}>
                <p>Preview</p>
                <div onClick={() => setPdfModal(false)}>
                  <Icon
                    name="close"
                    size="xs"
                    onClick={() => setPdfModal(false)}
                  />
                </div>
              </div>
              <div className={s.pdf_wrapper}>
                <PDFViewer scale={1.1} file={pdfUrl} />
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className={s.footer}>
        <Button
          disabled={!isValid()}
          onClick={() => submit('generate')}
          size="big"
        >
          Generate
        </Button>
      </div>
      {confirmPopup && (
        <ConfirmationPopup
          desc={``}
          icon={
            <img
              className={s.successIcon}
              src={SuccessIcon}
              color="success"
              size="4xl"
            />
          }
          onAction={handlePrint}
          onClose={handleDownload}
          primaryBtnText="Download"
          primaryBtnStyle="w-9/10  tm-btn2-white-blue"
          secondaryBtnStyle="tm-btn2-blue"
          secondaryBtnText="Print"
          title={`Certificate Generated Successfully`}
          closeOnBackgroundClick={false}
        />
      )}
    </div>
  )
}

export default CreateCertificate
