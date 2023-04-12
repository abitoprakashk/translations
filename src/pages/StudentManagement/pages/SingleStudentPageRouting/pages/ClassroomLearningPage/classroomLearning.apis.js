import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../../../constants'

const URL = REACT_APP_API_URL

export const fetchStudentWiseHomeworkData = async (iid) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${URL}homework/summary`,
      params: {iid},
    })
    return res.data
  } catch (error) {
    return {error}
  }
}

export const fetchStudentWiseTestData = async (iid) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${URL}test/summary`,
      params: {iid},
    })
    return res.data
  } catch (error) {
    return {error}
  }
}
