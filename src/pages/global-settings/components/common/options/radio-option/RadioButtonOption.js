import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import styles from './RadioButtonOption.module.css'

const RadioButtonOption = ({handleAction, optionsList}) => {
  return (
    <>
      {optionsList &&
        optionsList.map(({id, label, status}) => (
          <div key={id} className={styles.radioOptionWrapper}>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.classroomSettingController_updateGlobalclassroomsettings_update
              }
            >
              <label
                onClick={() => {
                  handleAction(id)
                }}
              >
                <input type="radio" checked={status} />
                <span className={styles.radioOptionLabel}>{label}</span>
              </label>
            </Permission>
          </div>
        ))}
    </>
  )
}

export default RadioButtonOption
