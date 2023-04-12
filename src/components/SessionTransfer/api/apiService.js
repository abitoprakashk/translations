import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'
import {utilsGetInstituteHierarchy} from '../../../routes/instituteSystem'

const SESSION_ID_HEADER = 'x-academicsessionid'

export const getSessionFeeStructures = async (sessionId, targetSession) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}fee-module/session/structures`,
    data: {selected_session_id: sessionId, importing_in_session: targetSession},
  })

  return res.data
}

export const checkNonDueTransactions = async (sessionId) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}fee-module/check/non/due/transactions`,
    data: {selected_session_id: sessionId},
  })

  return res.data
}

export const transferSession = async (
  sourceSessionId,
  targetSessionId,
  shouldCloneFee
) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}institute/transfer/session`,
    data: {
      old_session_id: sourceSessionId,
      new_session_id: targetSessionId,
      clone_fee: shouldCloneFee,
    },
  })

  return res.data
}

export const getInstituteHierarchy = async (instituteId, sessionId) =>
  utilsGetInstituteHierarchy(instituteId, null, sessionId)

export const getNonCategorizedClasses = async (sessionId) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}institute-class/uncategorized/classroom`,
    headers: {
      [SESSION_ID_HEADER]: sessionId,
    },
  })

  return res.data
}
