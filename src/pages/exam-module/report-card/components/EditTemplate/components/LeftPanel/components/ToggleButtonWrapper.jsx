import {Toggle} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import commonStyles from '../LeftPanel.module.css'

const ToggleButtonWrapper = ({
  label,
  fieldName,
  methodName,
  isSelected,
  handleChange,
}) => {
  const {t} = useTranslation()
  return (
    <Toggle
      label={label || t('showInReportCard')}
      fieldName={fieldName}
      handleChange={(obj) => handleChange(obj, methodName)}
      isSelected={isSelected}
      classes={{
        wrapper: commonStyles.toggleWrapper,
        toggle: commonStyles.toggle,
        icon: commonStyles.toggleIcon,
        label: commonStyles.toggleLabel,
      }}
    />
  )
}

export default ToggleButtonWrapper
