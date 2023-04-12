import globalActions from '../../redux/actions/global.actions'

const getInstitutePersonaSettingsAction = (persona) => {
  return {
    type: globalActions.institutePersonaSettings.REQUEST,
    payload: persona,
  }
}

const getInstitutePersonaMembersAction = (persona) => {
  return {type: globalActions.institutePersonaMembers.REQUEST, payload: persona}
}

const addPersonaMembersAction = (data) => {
  return {
    type: globalActions.addPersonaMembers.REQUEST,
    payload: data,
  }
}

const updatePersonaMembersAction = (data) => {
  return {
    type: globalActions.updatePersonaMembers.REQUEST,
    payload: data,
  }
}

const resetPersonaSettingsAction = () => {
  return {
    type: globalActions.institutePersonaSettings.RESET,
  }
}

const resetPersonaMembersAction = () => {
  return {
    type: globalActions.institutePersonaMembers.RESET,
  }
}

export {
  addPersonaMembersAction,
  updatePersonaMembersAction,
  getInstitutePersonaSettingsAction,
  getInstitutePersonaMembersAction,
  resetPersonaSettingsAction,
  resetPersonaMembersAction,
}
