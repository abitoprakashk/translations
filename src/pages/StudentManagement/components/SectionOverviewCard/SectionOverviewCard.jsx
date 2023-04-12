import {
  Button,
  BUTTON_CONSTANTS,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import Permission from '../../../../components/Common/Permission/Permission'
import styles from './SectionOverviewCard.module.css'

export default function SectionOverviewCard({
  cardLabel,
  icon,
  actionLabel,
  actionHandle,
  actionPermissionId,
  actionShowInMobile = true,
  children,
  classes,
}) {
  const actionButton = (
    <Button
      type={BUTTON_CONSTANTS.TYPE.TEXT}
      onClick={actionHandle}
      classes={{button: actionShowInMobile ? '' : styles.hideInMobile}}
    >
      {actionLabel}
    </Button>
  )

  return (
    <PlainCard className={classNames(styles.wrapper, classes?.wrapper)}>
      <div className={classNames(styles.header, classes?.header)}>
        <div className={styles.content}>
          <IconFrame
            className={classNames(styles.iconFrame, classes?.iconFrame)}
            size={ICON_FRAME_CONSTANTS.SIZES.MEDIUM}
          >
            <Icon
              name={icon}
              type={ICON_CONSTANTS.TYPES.INVERTED}
              size={ICON_CONSTANTS.SIZES.X_SMALL}
            />
          </IconFrame>
          {typeof cardLabel === 'string' ? (
            <Para
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              className={styles.cardLabel}
            >
              {cardLabel}
            </Para>
          ) : (
            cardLabel
          )}
        </div>

        {actionPermissionId ? (
          <Permission permissionId={actionPermissionId}>
            {actionButton}
          </Permission>
        ) : (
          actionButton
        )}
      </div>

      {children && (
        <>
          <div className={classNames(styles.body, classes?.body)}>
            {children}
          </div>
        </>
      )}
    </PlainCard>
  )
}
