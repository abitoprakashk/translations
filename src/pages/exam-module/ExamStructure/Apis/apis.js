import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'

export const fetchClassesExamStructures = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}exam-structure/list`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const fetchExamStructureForClass = async (payload) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}exam-structure/class/structure?class_id=${payload}`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const fetchGradeCriteria = async (payload) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}exam-structure/grading/criteria?class_id=${payload}`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const updatedGradeCriteria = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}exam-structure/update/grading/criteria`,
      data,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const editOrCreateExamStructureForClass = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}exam-structure/upsert/class/structure`,
      data: payload,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const postAddToTerm = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}exam-structure/add-to-term`,
      data: {
        exam_planner_id: payload.examId,
        tfile_id: payload.termId,
        class_id: payload.classId,
      },
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const importExamStructureForClass = async (payload) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}exam-structure/copy`,
      data: {
        copy_from_class_id: payload.copyFromClassId,
        copy_to_class_id: payload.copyToClassId,
      },
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}

export const getImportStatusInfo = async (params) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}report-card-evaluation/class/scholastic/already/evaluated`,
      params,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}
