import styles from './FeeStructure.module.css'
import {Icon, Checkbox, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'

export default function InstallmentFeeTypes({
  rowData,
  toggleCheckBox,
  isPreviousSession,
  collapseInstallment,
  index,
}) {
  return (
    <span
      className={
        rowData.type == 'childLevel'
          ? classNames(styles.paddingLeft, styles.installmentType)
          : classNames(styles.installmentType)
      }
    >
      {rowData.icon && (
        <Icon
          name={rowData.icon}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type={ICON_CONSTANTS.TYPES.BASIC}
          className={styles.icon}
          onClick={() => collapseInstallment(index)}
        />
      )}
      <Checkbox
        onClick={() => toggleCheckBox(isPreviousSession, index)}
        fieldName="TBA"
        handleChange={() => {}}
        isSelected={rowData.selected}
      />
      {rowData.name}
    </span>
  )
}
