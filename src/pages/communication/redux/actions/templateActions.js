import {TemplateActionTypes} from '../actionTypes'

export const getTemplateAction = () => {
  return {
    type: TemplateActionTypes.GET_TEMPLATES,
  }
}
