import {useDispatch, useSelector} from 'react-redux'
import {Alert, ALERT_CONSTANTS, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {Trans} from 'react-i18next'
import styles from './sosSection.module.css'
import globalActions from '../../../../../../redux/actions/global.actions'

function VehicleWithoutRouteSOSAlert({vehicleDetails, readableTime, onClose}) {
  const Content = ({hide}) => (
    <div className={styles.displayFlex}>
      <Trans
        i18nKey="vehicleWithoutRouteSOSMessage"
        values={{
          vehicleNumber: vehicleDetails.number,
          time: readableTime,
        }}
      />
      <div
        className={styles.cursorPointer}
        onClick={() => {
          onClose()
          hide()
        }}
      >
        <Icon
          name="close"
          version={ICON_CONSTANTS.VERSION.OUTLINED}
          size={ICON_CONSTANTS.SIZES.XXX_SMALL}
          className={styles.closeIcon}
        />
      </div>
    </div>
  )
  return (
    <Alert
      type={ALERT_CONSTANTS.TYPE.ERROR}
      content={<Content />}
      className={styles.alertWrapper}
      hideClose={true}
    />
  )
}

function VehicleWithRouteSOSAlert({
  vehicleDetails,
  readableTime,
  routeIndex,
  onClose,
}) {
  const staffContactsArr = vehicleDetails?.route_details[
    routeIndex
  ]?.staff_details?.map((obj) => `${obj.name}:${obj.phone_number}`)

  const Content = ({hide}) => (
    <div className={styles.displayFlex}>
      <Trans
        i18nKey="vehicleWithRouteSOSMessage"
        values={{
          vehicleNumber: vehicleDetails.number,
          routeName: vehicleDetails?.route_details[routeIndex]?.name,
          time: readableTime,
        }}
      />{' '}
      {staffContactsArr.length > 0 && (
        <Trans
          i18nKey="pleaseContactStaff"
          values={{
            staffContactDetails: staffContactsArr.join(', '),
          }}
        />
      )}
      <div
        className={styles.cursorPointer}
        onClick={() => {
          onClose()
          hide()
        }}
      >
        <Icon
          name="close"
          version={ICON_CONSTANTS.VERSION.OUTLINED}
          size={ICON_CONSTANTS.SIZES.XXX_SMALL}
          className={styles.closeIcon}
        />
      </div>
    </div>
  )
  return (
    <Alert
      type={ALERT_CONSTANTS.TYPE.ERROR}
      content={<Content />}
      className={styles.alertWrapper}
      hideClose={true}
    />
  )
}

export default function SosSection() {
  const dispatch = useDispatch()

  const transportLiveTrackingData = useSelector(
    (state) => state?.globalData?.transportLiveTracking.data
  )
  const transportVehicles = useSelector(
    (state) => state?.globalData?.transportVehicles?.data
  )
  const instituteTimeZone = useSelector(
    (state) => state?.instituteInfo?.timezone
  )

  const epochToLocaleTimeSring = (epochTime) => {
    return new Date(epochTime * 1000).toLocaleString('en-US', {
      timeZone: instituteTimeZone,
      dateStyle: 'short',
      timeStyle: 'short',
    })
  }

  return (
    <>
      {transportLiveTrackingData?.map((vehicleObj) => {
        if (vehicleObj?.SOS == undefined || !vehicleObj.SOS) return
        let vehicleDetails = transportVehicles?.find(
          (obj) => obj.number == vehicleObj.number
        )
        vehicleDetails = {...vehicleDetails, ...vehicleObj}

        return vehicleDetails?.SOS_received_at?.map((sosTime) => {
          let readableTime = epochToLocaleTimeSring(sosTime)
          const onClose = () => {
            const payload = {
              data: {
                gps_imei: vehicleDetails.gps_imei,
                received_at: sosTime,
              },
            }
            dispatch(globalActions.acknowledgeVehicleSOS.request(payload))
          }
          if (
            !vehicleDetails?.route_details ||
            vehicleDetails?.route_details.length === 0
          ) {
            return (
              <VehicleWithoutRouteSOSAlert
                key={vehicleDetails.number}
                vehicleDetails={vehicleDetails}
                readableTime={readableTime}
                onClose={onClose}
              />
            )
          } else {
            return vehicleDetails?.route_details.map((routeObj, index) => (
              <VehicleWithRouteSOSAlert
                key={vehicleDetails.number}
                vehicleDetails={vehicleDetails}
                readableTime={readableTime}
                routeIndex={index}
                onClose={onClose}
              />
            ))
          }
        })
      })}
    </>
  )
}
