import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import styles from './stopsListing.module.css'
import {Button, EmptyState, Para} from '@teachmint/krayon'
import {events} from '../../../../../../utils/EventsConstants'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

export default function StopsListingEmptyState({setShowAddModal}) {
  const {t} = useTranslation()

  const schoolTransportSettings = useSelector(
    (state) => state?.globalData?.schoolTransportSettings
  )
  const eventManager = useSelector((state) => state?.eventManager)

  return (
    <>
      {schoolTransportSettings?.data?.is_school_address_set ? (
        <EmptyState
          iconName="pinDropLocation"
          content={
            <Para>
              {t('emptyStopListDesc')}
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.transportPickupPointController_updateRoute_update
                }
              >
                <Button
                  onClick={() => {
                    eventManager.send_event(events.ADD_STOPS_CLICKED_TFI, {
                      screen_name: 'stops_tab',
                    })
                    setShowAddModal(true)
                  }}
                  classes={{button: styles.buttonWrapper}}
                >
                  {t('addStop')}
                </Button>
              </Permission>
            </Para>
          }
          button={null}
          classes={{
            wrapper: styles.emptyStateWrapper,
            iconFrame: styles.emptyStateIconFrame,
          }}
        />
      ) : null}
    </>
  )
}
