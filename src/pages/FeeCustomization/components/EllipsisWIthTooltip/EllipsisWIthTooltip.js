import React, {useEffect, useMemo, useRef, useState} from 'react'
import {v4} from 'uuid'
import {Tooltip, TOOLTIP_CONSTANTS} from '@teachmint/krayon'
import styles from './EllipsisWIthTooltip.module.css'
import classNames from 'classnames'

function EllipsisWithTooltip({width = 300, children}) {
  const uuid = useMemo(() => v4(), [])
  const [showTooltip, setshowTooltip] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current.offsetWidth < ref.current.scrollWidth) {
      setshowTooltip(true)
    }
  }, [])
  return (
    <>
      <div
        ref={ref}
        style={{maxWidth: width}}
        className={classNames(styles.ellipsis, {
          'cursor-pointer': showTooltip,
        })}
        data-tip
        data-for={uuid}
      >
        {children}

        {showTooltip ? (
          <Tooltip
            toolTipBody={children}
            toolTipId={uuid}
            place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.TOP}
          />
        ) : null}
      </div>
    </>
  )
}

export default EllipsisWithTooltip
