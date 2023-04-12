import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'

export const getLeaveWidget = async () => {
  const res = await axios.get(`${REACT_APP_API_URL}leave/widget/onleave`)
  return res
}
