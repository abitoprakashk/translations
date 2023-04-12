import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const getSetupProgressWidget = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${REACT_APP_API_URL}class-setup/widget/all`,
    })
    return res.data
  } catch (e) {
    return {error: e}
  }
}
