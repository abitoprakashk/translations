import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import StatsCard from '../../../../../../../components/Common/StatsCard/StatsCard'
import styles from './statsSection.module.css'
import {events} from '../../../../../../../utils/EventsConstants'
import {Tooltip, TOOLTIP_CONSTANTS} from '@teachmint/krayon'

export default function StatsSection({biometricStaffIds}) {
  const {t} = useTranslation()

  const fetchBiometricAggregates = useSelector(
    (state) => state?.globalData?.fetchBiometricAggregates?.data
  )

  const {eventManager} = useSelector((state) => state)

  const onCardsClick = {
    machines: () => {},
    users: () => {
      eventManager.send_event(
        events.HRMS_USER_MAPPING_ALL_USERS_TAB_CLICKED_TFI
      )
    },
  }

  const cardsList = {
    machines: {
      route: 'biometric-machines',
      label: t('biometricMachines'),
    },
    users: {
      route: 'biometric-users',
      label: t('usersMapped'),
    },
  }

  const cardData = [
    {
      id: 'machines',
      title: cardsList.machines.label,
      value: fetchBiometricAggregates?.total_machines || 0,
      iconName: 'fingerprint',
      classes: {iconFrame: styles.machinesIconFrame},
      link: cardsList.machines.route,
      handleClick: onCardsClick['machines'],
      isDisabled: false,
      tooltip: '',
    },
    {
      id: 'users',
      title: cardsList.users.label,
      value:
        biometricStaffIds?.length > 0
          ? `${fetchBiometricAggregates?.total_users_mapped || 0} / ${
              biometricStaffIds?.length
            }`
          : '0 / 0',
      iconName: 'people',
      classes: {
        iconFrame: styles.usersIconFrame,
        card: biometricStaffIds.length === 0 ? styles.isDisabled : '',
      },
      link: biometricStaffIds.length > 0 ? cardsList.users.route : '',
      handleClick: onCardsClick['users'],
      isDisabled: biometricStaffIds.length === 0,
      tooltip: t('pleaseCreateBiometricShift'),
    },
  ]

  return (
    <div className={styles.wrapper}>
      {cardData?.map(
        ({
          id,
          title,
          value,
          iconName,
          classes,
          link,
          subTitleIcon,
          subTitleText,
          tooltip,
          isDisabled,
        }) => (
          <div data-tip data-for={id} key={id}>
            <StatsCard
              title={title}
              value={value}
              iconName={iconName}
              classes={classes}
              link={link}
              subTitleIcon={subTitleIcon}
              subTitleText={subTitleText}
            />
            {tooltip && isDisabled && (
              <Tooltip
                toolTipId={id}
                toolTipBody={tooltip}
                place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
                effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.SOLID}
              />
            )}
          </div>
        )
      )}
    </div>
  )
}
