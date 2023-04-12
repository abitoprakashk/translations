import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const getTemplateList = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-web/standard/templates`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getTemplateFieldList = async (params) => {
  try {
    let res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-web/template`,
      params,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getPreviewTemplate = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}institute/update`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const generateTemplate = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}report-card-web/upsert/template`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getStudents = async (params) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-web/section/result`,
      params,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const generateReportCards = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}report-card-web/generate/report/card`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const pollingAPI = async (data) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-web/reports/by/filters`,
      params: data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const sectionEvaluationStructure = async (data) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-evaluation/section/structure`,
      params: data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const sectionEvaluationCount = async (data) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-evaluation/section/cards`,
      params: data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const sectionEvaluationDetails = async (data) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-evaluation/section/scholastic/details`,
      params: data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const updateScholasticTotalMetric = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}report-card-evaluation/section/update/total/marks`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const updateSectionScholasticDetails = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}report-card-evaluation/section/scholastic/upsert/details`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const sectionOthersDetails = async (data) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-evaluation/section/others/details`,
      params: data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getCSVCurrentMarksheet = async (params) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}bulk-csv/download/csv`,
      params,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const validateCSV = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}bulk-csv/validate/csv`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const sendErroValidationResultBack = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}bulk-csv/downloaded/error/list`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const updateMarksFromCSV = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}bulk-csv/upload/csv`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getSectionExamStructure = async (data) => {
  try {
    // const res =
    await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card/student/evalution/fetch/structure`,
      params: data,
    })
    // return res.data
    return {
      status: true,
      obj: {
        _id: '6393418334472',
        section_id: '2ef7be77-4505-47ea-b601-8fd76e039cf9',
        class_id: '6393418334472',

        terms: [
          {
            _id: '6393444167ed6b34dd1f8a2',
            name: 'Term 1',
          },
          {
            _id: '6393444167ed6b34dd1f8a72',
            name: 'Term 2',
          },
        ],

        scholistic: [
          {
            _id: 'asdasd443ds',
            name: 'PT 1',
            term_id: '6393444167ed6b34dd1f8a72',
            order: 1,
          },
          {
            _id: 'asdasd443ds',
            name: 'PT 1',
            term_id: '6393444167ed6b34dd1f8a72',
            order: 2,
          },
          {
            _id: 'asdasd443ds',
            name: 'PT 1',
            term_id: '6393444167ed6b34dd1f8a2',
            order: 3,
          },
          {
            _id: 'asdasd443ds',
            name: 'PT 1',
            term_id: '6393444167ed6b34dd1f8a72',
            order: 4,
          },
        ],

        additional: {
          co_scholastic: 2,
          attendance: 2,
          remark: 1,
          result: 0,
        },
      },
    }
  } catch (e) {
    return {error: e}
  }
}

export const getStudentExamMarks = async (data) => {
  try {
    // const res =
    await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card/student/evalution/fetch/counts`,
      params: data,
    })
    // return res.data
    return {
      status: true,
      obj: {
        _id: 'asdasd443ds',
        scholastic: {
          subjects: [
            {
              assessment_id: 'asdasd443ds',
              name: 'English',
              is_present: 1,
              evaluated_marks: 60,
              total: 100,
            },
            {
              assessment_id: 'asdasd443ds',
              name: 'Maths',
              is_present: 0,
              evaluated_marks: 0,
              total: 100,
            },
            {
              assessment_id: 'asdasd443ds',
              name: 'Science',
              is_present: 1,
              evaluated_marks: 60,
              total: 100,
            },
            {
              assessment_id: 'asdasd443ds',
              name: 'SST',
              is_present: 1,
              evaluated_marks: 60,
              total: 100,
            },
          ],
        },
      },
    }
  } catch (e) {
    return {error: e}
  }
}

export const updateSectionOthersDetails = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}report-card-evaluation/section/others/upsert/details`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const updateAttendanceTotalMetric = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}report-card-evaluation/section/update/attendance/total/days`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const saveAsDraftOrPublish = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}report-card-web/template`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getClassSectionSubjects = async (params) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-web/all/section/subjects`,
      params,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getClassSectionDataCounts = async (params) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-web/nodetype/count`,
      params,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const importReportCardTemplate = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}report-card-web/copy`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const sendScholasticNotification = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}report-card-evaluation/send/scholastic/single/notification`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const sendOthersNotification = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}report-card-evaluation/send/other/single/notification`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getStudentDetailFields = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-web/student/profile/settings`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}
