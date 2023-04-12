import globalActions from '../../../redux/actions/global.actions'

const getInstitutePersonaSettingsAction = (persona) => {
  return {
    type: globalActions.institutePersonaSettings.REQUEST,
    payload: persona,
  }
}

const getDocumentPersonaMemberAction = (_id) => {
  return {
    type: globalActions.documentPersonaMember.REQUEST,
    payload: {imember_id: [String(_id)]},
  }
}

const resetPersonaSettings = () => {
  return {type: globalActions.institutePersonaSettings.RESET}
}

const resetDocumentPersona = () => {
  return {type: globalActions.documentPersonaMember.RESET}
}

const updateMemberDocAction = (payload) => {
  return {type: globalActions.updateMemberDocument.REQUEST, payload: payload}
}

const uploadLinkAction = (payload) => {
  return {type: globalActions.uploadLink.REQUEST, payload: payload}
}

export {
  getInstitutePersonaSettingsAction,
  getDocumentPersonaMemberAction,
  resetPersonaSettings,
  resetDocumentPersona,
  updateMemberDocAction,
  uploadLinkAction,
}
