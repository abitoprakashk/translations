import styles from './FeeStructure.module.css'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../../utils/Helpers'
import {useSelector} from 'react-redux'

export default function DiscountAmount({
  rowData,
  isPreviousSession,
  handleAddAdHocDiscountValue,
  isAdHocDiscountApplied,
}) {
  const instituteInfo = useSelector((state) => state.instituteInfo)
  return (
    <span className={styles.installmentType}>
      {getAmountFixDecimalWithCurrency(
        rowData.discount + (rowData.adHocDiscountAmount || 0),
        instituteInfo.currency
      )}
      {rowData.type == 'childLevel' &&
        (!isAdHocDiscountApplied(rowData) ? (
          <Icon
            name={'circledClose'}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.BASIC}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
            className={classNames(styles.icon, styles.addIcon)}
            onClick={() =>
              handleAddAdHocDiscountValue(isPreviousSession, rowData)
            }
          />
        ) : (
          <Icon
            name={'edit1'}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.BASIC}
            className={styles.icon}
            onClick={() =>
              handleAddAdHocDiscountValue(isPreviousSession, rowData)
            }
          />
        ))}
    </span>
  )
}
