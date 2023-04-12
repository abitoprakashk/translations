import {t} from 'i18next'
import {
  Alert,
  Heading,
  HEADING_CONSTANTS,
  Input,
  INPUT_TYPES,
  RequiredSymbol,
} from '@teachmint/krayon'
import styles from './Session.module.css'
import InstituteHierarchy, {
  INSTITUTE_HIERARCHY_TYPES,
} from '../../Common/InstituteHierarchy/InstituteHierarchy'
import {useAllSessionHierarchies} from '../../../redux/admissionManagement.selectors'
import classNames from 'classnames'

export default function Session({formData, setFormData}) {
  const allSessionHierarchies = useAllSessionHierarchies()
  const academicSessions = Object.values(allSessionHierarchies.data).map(
    (session) => ({
      label: session.name,
      value: session.id,
    })
  )

  const handleChange = ({fieldName, value}) => {
    let newFormData = {...formData}
    newFormData[fieldName] = value
    // Clear class selection on change of CRM session
    if (fieldName === 'session_id') {
      newFormData.enabled_node_ids = []
    }
    setFormData(newFormData)
  }

  const handleHierarchyChange = (selectedNodes) => {
    const selectedClasses = Object.values(selectedNodes)
      .filter((node) => node.type === INSTITUTE_HIERARCHY_TYPES.STANDARD)
      .map((standard) => standard.id)
    handleChange({
      fieldName: 'enabled_node_ids',
      value: selectedClasses,
    })
  }

  return (
    <div className={styles.bodyContent}>
      <Alert
        content={t('createNewSessionNoteAlert')}
        className={styles.sessionAlert}
        hideClose
      />
      <div className={styles.formContent}>
        <div>
          <Input
            isRequired={true}
            type={INPUT_TYPES.DROPDOWN}
            fieldName="session_id"
            placeholder={t('sessionFieldPlaceholder')}
            title={t('sessionFieldLabel')}
            value={formData.session_id}
            options={academicSessions}
            onChange={handleChange}
          />
        </div>
        {formData.session_id && (
          <div className={styles.classesForm}>
            <Heading
              className={classNames(
                styles.setupCardHeading,
                styles.setupCardHeading2
              )}
              textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
            >
              {t('classesFieldLabel')}
              <RequiredSymbol />
            </Heading>
            <InstituteHierarchy
              instituteHierarchy={
                allSessionHierarchies.data?.[formData.session_id]
              }
              allChecked={
                !formData.session_id && !formData.enabled_node_ids.length
              }
              selectedIds={formData.enabled_node_ids}
              handleChange={handleHierarchyChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
