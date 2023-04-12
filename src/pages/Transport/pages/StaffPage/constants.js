import {
  Icon,
  ICON_CONSTANTS,
  Para,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import {t} from 'i18next'
import styles from './staffPage.module.css'

export const STAFF_OPTIONS = [
  {
    label: t('driver'),
    value: 'Driver',
  },
  {
    label: t('attendant'),
    value: 'Attendant',
  },
  {
    label: t('busIncharge'),
    value: 'Transport Manager',
  },
]

export const NEW_STAFF_DATA = {
  name: '',
  role: '',
  countryCode: '91',
  contact: '',
  idProof: null,
  isCheckboxSelected: true,
}

export const NEW_STAFF_ERROR = {
  name: '',
  role: '',
  contact: '',
}

export const STAFF_TABLE_COLUMNS = [
  {key: 'name', label: t('staffName')},
  {key: 'type', label: t('role')},
  {key: 'phoneNumber', label: t('phoneNumber1')},
  {
    key: 'route',
    label: (
      <div className={styles.routeHeader}>
        <Para>{t('route')}</Para>

        <div>
          <div
            data-tip
            data-for="extraInfo"
            className={styles.routeHeaderIconWrapper}
          >
            <Icon
              name="info"
              version={ICON_CONSTANTS.VERSION.OUTLINED}
              type={ICON_CONSTANTS.TYPES.SECONDARY}
              size={ICON_CONSTANTS.SIZES.XXX_SMALL}
            />
          </div>

          <Tooltip
            toolTipId="extraInfo"
            place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.LEFT}
            toolTipBody={t('routeHeaderTooltipDesc')}
            classNames={{toolTipBody: styles.routeTooltipBody}}
          ></Tooltip>
        </div>
      </div>
    ),
  },

  {key: 'idProof', label: t('idProof')},
  {key: 'kebabMenu', label: ''},
]

export const MAX_STAFF_DOCUMENT_SIZE = 4000000
