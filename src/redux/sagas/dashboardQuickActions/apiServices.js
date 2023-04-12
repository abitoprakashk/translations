import axios from 'axios'
import {Trans} from 'react-i18next'
import {BACKEND_HEADERS, REACT_APP_API_URL} from '../../../constants'

const erroMsg = (
  <Trans i18nKey={'somethingWentWrong'}>something went wrong</Trans>
)

export const fetchTodayCollectedFee = async (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${REACT_APP_API_URL}fee-module/report/download/request`,
      headers: BACKEND_HEADERS,
      data,
    })
      .then((res) => {
        if (res?.data?.status) {
          let data = res.data
          resolve(data)
        } else {
          reject({msg: erroMsg})
        }
      })
      .catch(() => {
        reject({errorOccured: true})
      })
  })
}
