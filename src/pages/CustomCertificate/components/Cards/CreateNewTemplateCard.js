import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import styles from './Cards.module.css'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {generatePath, useHistory, useParams} from 'react-router-dom'
import {CUSTOM_CERTIFICATE_SUB_ROUTES} from '../../CustomCertificates.routes'
import {eventManagerSelector} from '../../redux/CustomCertificate.selectors'
import {CERTIFICATE_EVENTS} from '../../CustomCertificate.events'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

const CreateNewTemplateCard = ({category}) => {
  const {userType, type} = useParams()
  const history = useHistory()
  const {t} = useTranslation()
  const eventManager = eventManagerSelector()

  const redirect = () => {
    eventManager.send_event(
      CERTIFICATE_EVENTS.CERTIFICATE_CREATE_NEW_TEMPLATE_CLICKED_TFI,
      {user_screen: userType}
    )
    if (category)
      history.push({
        pathname: generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.CREATE, {
          type: category,
          userType,
        }),
        search: `templateType=certificate_${userType}`,
      })
    else
      history.push({
        pathname: generatePath(CUSTOM_CERTIFICATE_SUB_ROUTES.CREATE, {
          userType,
          type,
        }),
        search: `templateType=certificate_${userType}`,
      })
  }

  return (
    <Permission
      permissionId={
        PERMISSION_CONSTANTS.documentTemplateController_createRoute_create
      }
    >
      <PlainCard
        className={classNames(styles.card, styles.newCard)}
        onClick={redirect}
      >
        <div className={styles.cardContent}>
          <Icon name="add" type={ICON_CONSTANTS.TYPES.PRIMARY} />
          <Heading
            type={HEADING_CONSTANTS.TYPE.PRIMARY}
            weight={HEADING_CONSTANTS.WEIGHT.SEMIBOLD}
            textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
          >
            {t('customCertificate.createNew')}
          </Heading>
        </div>
      </PlainCard>
    </Permission>
  )
}

export default CreateNewTemplateCard
