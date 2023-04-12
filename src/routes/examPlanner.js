import axios from 'axios'
import {REACT_APP_API_URL, BACKEND_HEADERS} from '../constants'

// Create Exam Schedule
export const utilsCreateExamSchedule = (
  examName,
  classList,
  startDate,
  endDate
) => {
  const fd = new FormData()
  fd.append('exam_name', examName)
  fd.append('start_date', startDate)
  fd.append('end_date', endDate)
  fd.append('node_ids', JSON.stringify(classList))

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}create/exam/schedule`,
      headers: BACKEND_HEADERS,
      data: fd,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Get Exam Schedule List
export const utilsGetExamScheduleList = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}v1/get/academic/events/2`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data?.status && response?.data?.obj)
          resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Update Exam Schedule
export const utilsUpdateExamSchedule = (
  examName,
  classList,
  startDate,
  endDate,
  examId
) => {
  const fd = new FormData()
  fd.append('exam_id', examId)
  fd.append('exam_name', examName)
  fd.append('start_date', startDate)
  fd.append('end_date', endDate)
  fd.append('node_ids', JSON.stringify(classList))

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}update/exam/scheduled`,
      headers: BACKEND_HEADERS,
      data: fd,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Delete Exam
export const utilsDeleteExam = (examId) => {
  const fd = new FormData()
  fd.append('exam_id', examId)

  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}delete/exam`,
      headers: BACKEND_HEADERS,
      data: fd,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Get Exam Schedule List
export const utilsGetExamSubjectDetails = (instituteId, examId) => {
  const fd = new FormData()
  fd.append('institute_id', instituteId)
  fd.append('exam_id', examId)

  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}exam/scheduled/calendar?exam_id=${examId}`,
      headers: BACKEND_HEADERS,
      // data: {exam_id: examId, institute_id: instituteId},
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Update Exam Subject Details
export const utilsUpdateExamSubjectDetails = (examId, subjectDetails) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}exam/update/subjects/details`,
      headers: BACKEND_HEADERS,
      data: {exam_id: examId, subject_details: subjectDetails},
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({
          errorOccured: true,
          error: response?.data.error_code === 7021 ? response.data.msg : null,
        })
      })
      .catch(() => reject({errorOccured: true}))
  })
}

// Get result of a particular assessment
export const utilsGetExamAssessmentResult = (assessmentId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}exam/assessment/result?assessment_id=${assessmentId}`,
      headers: BACKEND_HEADERS,
    })
      .then((response) => {
        if (response?.data?.status) resolve({...response?.data})
        reject({errorOccured: true})
      })
      .catch(() => reject({errorOccured: true}))
  })
}
