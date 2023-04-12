import {Icon, ICON_CONSTANTS, Para, PARA_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {SORT_TYPE} from '../../AttendanceReport.constant'
import styles from './TableHeaderLabel.module.css'
import {Tooltip} from '@teachmint/krayon'

function TableHeaderLabel({sort, setsort, label, key, info}) {
  return (
    <div
      className={styles.tableHeading}
      onClick={() => {
        setsort({
          key,
          type: sort?.type === SORT_TYPE.ASC ? SORT_TYPE.DESC : SORT_TYPE.ASC,
        })
      }}
    >
      <Para type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}>{label}</Para>

      <span className={styles.bothIcon}>
        <Icon
          version={'outlined'}
          name="upArrow"
          size={ICON_CONSTANTS.SIZES.XXX_SMALL}
          className={
            sort?.key === key && sort?.type === SORT_TYPE.ASC
              ? styles.selected
              : styles.icon
          }
        />
        <Icon
          version={'outlined'}
          name="downArrow"
          size={ICON_CONSTANTS.SIZES.XXX_SMALL}
          className={classNames(
            sort?.key === key && sort?.type === SORT_TYPE.DESC
              ? styles.selected
              : styles.icon
          )}
        />
      </span>
      {info ? (
        <a data-for={label} data-tip>
          <Icon
            name={'info'}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
          />
        </a>
      ) : null}
      <Tooltip
        classNames={{
          wrapper: styles.tooltipWrapper,
          toolTipBody: styles.toolTipBody,
        }}
        effect="float"
        place="bottom"
        toolTipBody={info}
        toolTipId={label}
      />
    </div>
  )
}

export default TableHeaderLabel
