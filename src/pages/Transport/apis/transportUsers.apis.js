import axios from 'axios'
import {REACT_APP_API_URL} from '../../../constants'

export const fetchTransportUsers = async ({
  limit,
  next,
  referenceId,
  possibleAllocationIds,
  searchText,
  filters,
}) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-passengers/list`,
    data: {
      paginate: true,
      limit,
      next,
      ...(referenceId ? {reference_id: referenceId} : null),
      ...(possibleAllocationIds === null
        ? null
        : {possible_allocation_ids: possibleAllocationIds}),
      ...(searchText ? {search_text: searchText} : null),
      ...(filters ? {filters: filters} : null),
    },
  })
  return res
}

export const deleteTransportUsers = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-passengers/delete`,
    data: payload,
  })
  return res
}

export const userWiseTransportInfo = async (payload) => {
  const res = await axios({
    method: 'GET',
    url: `${REACT_APP_API_URL}transport-passengers/info`,
    params: payload,
  })
  return res
}

export const updateUserWiseTransport = async (payload) => {
  const res = await axios({
    method: 'POST',
    url: `${REACT_APP_API_URL}transport-passengers/update`,
    data: payload,
  })
  return res
}
