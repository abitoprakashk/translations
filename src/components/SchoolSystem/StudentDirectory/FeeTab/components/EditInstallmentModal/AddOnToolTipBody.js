import {Icon, ICON_CONSTANTS, Tooltip} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {getAmountWithCurrency} from '../../../../../../utils/Helpers'
import styles from './EditInstallmentModal.module.css'

export default function AddOnToolTipBody({uniqueIdentifier, logs, currency}) {
  const {t} = useTranslation()
  const getToolTipBody = (logs) => {
    return (
      <div className={styles.tooltipSection}>
        {logs.map((obj, index) => (
          <React.Fragment key={index}>
            <div className={styles.tooltipAmount}>
              {getAmountWithCurrency(obj.amount, currency)}
            </div>
            <div className={styles.tooltipText}>
              {`${t('addedByLower')} ${obj.added_by}`}
            </div>
            <div className={styles.tooltipText}>
              {new Date(obj.timestamp * 1000).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
            {index !== logs.length - 1 && (
              <hr style={{marginTop: '4px', marginBottom: '4px'}} />
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <>
      <a data-for={`extraInfo${uniqueIdentifier}`} data-tip>
        {logs.length > 0 && (
          <Icon
            name="info"
            version={ICON_CONSTANTS.VERSION.OUTLINED}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
          />
        )}
      </a>
      <Tooltip
        effect="float"
        place="top"
        toolTipBody={getToolTipBody(logs)}
        toolTipId={`extraInfo${uniqueIdentifier}`}
      />
    </>
  )
}
