import {useSelector} from 'react-redux'
import {checkPermission} from '../../../utils/Permssions'
import styles from './Permission.module.css'
import classNames from 'classnames'
import {
  Tooltip,
  PARA_CONSTANTS,
  Para,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import {v4 as uuidv4} from 'uuid'
import {useTranslation} from 'react-i18next'

export default function Permission({
  permissionId,
  children,
  showOpacity = true,
}) {
  const {t} = useTranslation()
  const uuid = uuidv4()
  const {globalData} = useSelector((state) => state)
  if (checkPermission(globalData?.userRolePermission, permissionId)) {
    return children
  } else if (showOpacity) {
    return (
      <>
        <div
          className={classNames(styles.opacity)}
          data-for={`${uuid}-permission`}
          data-tip
          onClickCapture={(e) => {
            e.preventDefault()
            e.stopPropagation()
            return
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            return
          }}
        >
          {children}
        </div>
        {
          <Tooltip
            place="top"
            toolTipBody={
              <Para
                className={styles.tooltipBody}
                weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
              >
                <Icon
                  size={ICON_CONSTANTS.SIZES.X_SMALL}
                  name="caution"
                  type={ICON_CONSTANTS.TYPES.WARNING}
                  version={ICON_CONSTANTS.VERSION.OUTLINED}
                />
                {t('noPermissionAlert')}
              </Para>
            }
            toolTipId={`${uuid}-permission`}
            effect="solid"
            classNames={{
              toolTipBody: styles.tooltipBody,
              wrapper: styles.tooltipWrapper,
            }}
          />
        }
      </>
    )
  } else {
    return (
      <>
        <div
          className={styles.userInput}
          onClickCapture={(e) => {
            e.preventDefault()
            e.stopPropagation()
            return
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            return
          }}
        >
          {children}
        </div>
      </>
    )
  }
}
