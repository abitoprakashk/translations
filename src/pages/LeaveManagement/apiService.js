import axios from 'axios'
import {REACT_APP_API_URL} from '../../constants'
export const checkLogin = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}institute-admin/check/login`,
  })
  return res.data.obj
}

export const getLeaveBalanceApi = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}leave/session/balance`,
  })
  return res.data
}

export const setLeaveBalanceApi = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}admin-leave/set/session/balance`,
    data: payload,
  })
  return res.data
}

export const getPendingLeavesApi = async ({u, count, iid, _ids}) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}leave/pending`,
    data: {
      count,
      ...(u ? {u} : {}),
      ...(iid ? {iid} : {}),
      ...(_ids ? {_ids} : {}),
    },
  })
  return res.data
}

export const getPastLeavesApi = async ({u, count, iid, _ids}) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}leave/history`,
    data: {
      count,
      ...(u ? {u} : {}),
      ...(iid ? {iid} : {}),
      ...(_ids ? {_ids} : {}),
    },
  })
  return res.data
}
export const updateLeaveStatusApi = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}admin-leave/update/status`,
    data: payload,
  })
  return res.data
}

export const cancelLeaveStaffApi = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}leave/cancel`,
    data: payload,
  })
  return res.data
}

export const getStaffStatsApi = async (iid) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}leave/staff/stats?iid=${iid}`,
  })
  return res.data
}

export const getStaffListApi = async () => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}admin-leave/user/list`,
  })
  return res.data
}
export const getStaffLeaveBalanceApi = async (iid) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}leave/staff/balance?iid=${iid}`,
  })
  return res.data
}

export const getSelectedLeaveCountApi = async ({
  from,
  to,
  from_slot,
  to_slot,
}) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}leave/no/of/days`,
    params: {from, to, from_slot, to_slot},
  })
  return res.data
}

export const createLeaveApi = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}admin-leave/create`,
    data: payload,
  })
  return res.data
}

export const requestLeaveApi = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}leave/request`,
    data: payload,
  })
  return res.data
}

export const editLeaveApi = async ({self, ...payload}) => {
  const res = await axios({
    method: 'POST',
    url: self
      ? `${REACT_APP_API_URL}leave/update`
      : `${REACT_APP_API_URL}admin-leave/update`,
    data: payload,
  })
  return res.data
}

export const getTotalLeaveStatsApi = async (iid) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}leave/request/stats`,
    data: {...(iid ? {iid} : {})},
  })
  return res.data
}

export const downloadLeaveReportApi = async (params) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}admin-leave/report`,
    params,
  })
  return res.data
}

export const getStaffUpcomingLeavesApi = async (params) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}/leave/staff/upcoming/leaves`,
    params,
  })
  return res.data
}
