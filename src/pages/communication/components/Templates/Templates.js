import {Icon} from '@teachmint/krayon'
import {useDispatch, useSelector} from 'react-redux'
import {SliderActionTypes, TemplateActionTypes} from '../../redux/actionTypes'
import styles from '../../Communication.module.css'
import {DefaultSegmentType} from '../../redux/actionTypes'
import {useTranslation} from 'react-i18next'
import {TemplatesConstants} from './Templates.constants'
import {events} from '../../../../utils/EventsConstants'
import {getPostTypeInText} from '../../commonFunctions'
import Permission from '../../../../components/Common/Permission/Permission'
import {checkPermission} from '../../../../utils/Permssions'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {useEffect} from 'react'
export default function Templates({editDraft, priorityParam}) {
  const comm_templates = useSelector(
    (state) => state.communicationInfo.comm_templates.comm_templates
  )
  const announcement_type = useSelector(
    (state) => state.communicationInfo.common.announcement_type
  )
  const userRolePermission = useSelector(
    (state) => state.globalData?.userRolePermission
  )
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const {t} = useTranslation()
  const tabClick = (tab) => {
    editDraft({
      announcement_type: 0,
      title: tab?.announcement_title,
      message: tab?.announcement_message,
      channels: ['notification'],
      segments: TemplatesConstants.reciever_mapping[tab.receivers],
      attachment_url: tab?.attachment_url,
      selected_users: [],
      node_ids: [],
      duration: 0,
      is_anonymous: false,
      voice: null,
      voice_note_duration: 0,
    })
    dispatch({type: SliderActionTypes.SET_SLIDER, payload: true})
    dispatch({
      type: DefaultSegmentType.SET_DEFAULT_SEGMENT,
      payload: TemplatesConstants.reciever_mapping[tab.receivers],
    })
    eventManager.send_event(events.COMMS_QUICK_ACTION_TEMPLATE_CLICKED, {
      post_type: getPostTypeInText(announcement_type),
      template_type: tab?.template_name,
    })
    dispatch({
      type: TemplateActionTypes.SET_CURRENT_TEMPLATE,
      payload: tab?.template_name,
    })
  }
  useEffect(() => {
    if (priorityParam) {
      if (
        comm_templates &&
        checkPermission(
          userRolePermission,
          PERMISSION_CONSTANTS.communicationController_announcement_create
        )
      ) {
        const selectedTemplate = comm_templates.filter((item) => {
          return item.priority === +priorityParam
        })
        if (selectedTemplate.length) {
          tabClick(selectedTemplate[0])
        }
      }
    }
  }, [comm_templates])
  const convert_template = (template) => {
    return {
      ...template,
      label: (
        <div className={styles.template_button}>
          <Icon
            size="xx_s"
            name={TemplatesConstants.iconMap[template['template_type']]['name']}
            version={
              TemplatesConstants.iconMap[template['template_type']]['type']
            }
            className={
              TemplatesConstants.iconMap[template['template_type']]['style']
            }
          />
          {template['template_name']}
        </div>
      ),
    }
  }
  return (
    <div className={styles.template_body}>
      <p className={styles.template_text}>
        {t('communicationTemplatesHeader')}
      </p>
      <div className={styles.templateList}>
        {comm_templates?.length ? (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.communicationController_announcement_create
            }
          >
            {comm_templates.map((template, index) => {
              return (
                <div
                  key={index}
                  onClick={() => tabClick(convert_template(template))}
                >
                  {convert_template(template).label}
                </div>
              )
            })}
          </Permission>
        ) : null}
      </div>
    </div>
  )
}
