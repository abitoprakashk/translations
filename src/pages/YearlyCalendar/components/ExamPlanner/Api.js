import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'

export const fetchExistingExams = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}exam/structure/associations`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const postExistingExamSchedule = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}academic-planner/upsert`,
      data: payload,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getSubjects = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}exam/add/subjects`,
      data: payload,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getSubjectsWithoutStructure = async (payload) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}exam/withoutstructure/subjects?class_id=${payload.class_id}&exam_id=${payload.exam_id}`,
      data: payload,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}
