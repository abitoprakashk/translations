import React from 'react'
import classNames from 'classnames'

export default function NormalCard({
  title,
  desc,
  children,
  className,
  classes,
  cardTag = null,
}) {
  return (
    <div className={classNames('bg-white rounded-lg w-full mb-6', className)}>
      {(title || desc || cardTag) && (
        <div className="p-4 tm-bdr-b-gy-3">
          {cardTag}
          <div className="tm-hdg tm-hdg-14 lg:tm-hdg-16">{title}</div>
          <div className="tm-para tm-para-12 lg:tm-para-14 mt-1">{desc}</div>
        </div>
      )}

      <div className={classes.childrenWrapper}>{children}</div>
    </div>
  )
}

NormalCard.defaultProps = {
  className: '',
  classes: {childrenWrapper: ''},
}
