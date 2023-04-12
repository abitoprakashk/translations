import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Tooltip,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React, {useMemo} from 'react'
import {v4} from 'uuid'
import styles from '../RenderEditorCategory.module.css'

function CommonTitle({title, tooltip, rightJSX = null}) {
  const uuid = useMemo(() => v4(), [])

  return (
    <div className={classNames('flex justify-between items-center')}>
      <Heading
        className={styles.heading}
        textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
      >
        <div className={classNames('flex items-center gap-2')}>
          <span>{title}</span>
          {tooltip ? (
            <div className={styles.icon}>
              <span data-tip data-for={uuid}>
                <Icon
                  name="info"
                  version={ICON_CONSTANTS.VERSION.OUTLINED}
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                />
              </span>
              <Tooltip
                title={tooltip.title}
                toolTipBody={tooltip.desc}
                toolTipId={uuid}
              />
            </div>
          ) : null}
        </div>
      </Heading>
      {rightJSX}
    </div>
  )
}

export default CommonTitle
