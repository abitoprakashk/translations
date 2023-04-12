import axios from 'axios'
import {REACT_APP_API_URL} from '../../../../constants'

export const getAttendanceWidgetData = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}manual-attendance/widget/trend`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}
