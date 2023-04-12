import React, {useCallback} from 'react'
import {
  AVATAR_CONSTANTS,
  Divider,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import {generatePath, useHistory} from 'react-router-dom'
import UserInfo from '../../../../../../../components/Common/Krayon/UserInfo'
import REPORT_CARD_ROUTES from '../../../../ReportCard.routes'
import styles from './SectionCard.module.css'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../../utils/EventsConstants'

const SectionCard = ({section, standard}) => {
  const {t} = useTranslation()
  const history = useHistory()
  const eventManager = useSelector((state) => state.eventManager)

  const handleClick = useCallback(() => {
    eventManager.send_event(
      events.REPORT_CARD_SECTION_REPORT_CARD_VIEW_CLICKED_TFI,
      {
        class_id: standard.id,
        section_id: section._id,
      }
    )

    history.replace(`${REPORT_CARD_ROUTES.BASE_ROUTE}?open=${standard.id}`)
    history.push(
      generatePath(REPORT_CARD_ROUTES.SECTION_VIEW, {
        standardId: standard.id,
        sectionId: section._id,
      })
    )
  }, [standard, section])

  const teacher = section?.class_teacher || {}

  return (
    <PlainCard className={styles.card} onClick={handleClick}>
      <div className={classNames(styles.flex, styles.spaceBetween, styles.top)}>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.sectionName}
          textSize={PARA_CONSTANTS.TEXT_SIZE.X_LARGE}
        >
          {standard.name} - {section.name}
        </Para>
        <Icon
          name="chevronRight"
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          className={styles.arrowIcon}
        />
      </div>
      <Divider spacing={0} />
      <div
        className={classNames(styles.flex, styles.alignCenter, styles.bottom)}
      >
        {teacher?._id ? (
          <UserInfo
            name={teacher.name}
            profilePic={teacher.img_url}
            avatarSize={AVATAR_CONSTANTS.SIZE.SMALL}
          />
        ) : (
          <Para
            textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
            type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
            className={styles.noTeacher}
          >
            {t('classTeacherNotAssigned')}
          </Para>
        )}
      </div>
    </PlainCard>
  )
}

export default React.memo(SectionCard)
