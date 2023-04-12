import {organisationInfoActionTypes} from '../actionTypes'

export const organisationInfoAction = (info) => {
  return {
    type: organisationInfoActionTypes.ORGANISATION_INFO,
    payload: info,
  }
}
