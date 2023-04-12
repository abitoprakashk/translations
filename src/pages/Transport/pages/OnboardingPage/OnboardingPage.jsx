import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {useHistory, useRouteMatch} from 'react-router-dom'
import {Divider, HeaderTemplate, ProgressTrackerCard} from '@teachmint/krayon'
import styles from './onboardingPage.module.css'
import OnboardingCard from './components/OnboardingCard/OnboardingCard'
import VehicleFormModal from '../VehiclesPage/components/VehicleFormModal/VehicleFormModal'
import StaffFormModal from '../StaffPage/components/StaffFormModal/StaffFormModal'
import RouteFormModal from '../TransportRoutePage/components/RouteFormModal/RouteFormModal'
import ManualAdditionModal from '../StopsPage/components/ManualAdditionModal/ManualAdditionModal'
import SchoolAddressModal from '../StopsPage/components/SchoolAddressModal/SchoolAddressModal'
import {ONBOARDING_CARD_STATE} from './constants'
import useTransportSetupPercentage from '../../utils/CustomHooks/getTransportSetupPercentageHook'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

export default function OnboardingPage() {
  const [selectedModal, setSelectedModal] = useState(null)

  const {t} = useTranslation()

  const setupPercentage = useTransportSetupPercentage()

  const {transportStops, transportAggregates, schoolTransportSettings} =
    useSelector((state) => state?.globalData)

  let {path} = useRouteMatch()
  let history = useHistory()

  const onTransportManagementClick = () => {
    let pathList = path.split('/')
    pathList.pop()
    history.push(pathList.join('/'))
  }

  const breadCrumbPaths = [
    {
      label: (
        <span className={styles.cursorPointer}>{t('transportManagement')}</span>
      ),
      onClick: onTransportManagementClick,
    },
    {
      label: t('setupConfiguration'),
    },
  ]

  const getAllotedPassengersIds = () => {
    let allotedPassengers = []
    transportStops?.data?.forEach(({_id, passenger_ids}) => {
      if (passenger_ids)
        allotedPassengers = [...allotedPassengers, ...passenger_ids]
    })

    return allotedPassengers
  }

  const getRouteOnboardingCardState = () => {
    if (
      !(
        transportAggregates?.data?.total_pickup_points &&
        transportAggregates?.data?.total_vehicles &&
        transportAggregates?.data?.total_staff &&
        schoolTransportSettings?.data?.is_school_address_set
      )
    )
      return ONBOARDING_CARD_STATE.DISABLED
    if (transportAggregates?.data?.total_routes)
      return ONBOARDING_CARD_STATE.COMPLETED
    return ONBOARDING_CARD_STATE.TODO
  }

  const onboardingCardsData = [
    {
      title: t('schoolAddress'),
      desc: t('schoolAddressOnboardingCardDesc'),
      iconName: 'gpsNotFixed',
      classes: {iconFrame: styles.schoolAddressIconFrame},
      onClick: () => setSelectedModal('SCHOOL_ADDRESS'),
      state: schoolTransportSettings?.data?.is_school_address_set
        ? ONBOARDING_CARD_STATE.COMPLETED
        : ONBOARDING_CARD_STATE.TODO,
      permissionId:
        PERMISSION_CONSTANTS.transportSettingsController_updateSchoolAddress_update,
    },
    {
      title: t('stops'),
      desc: t('stopsOnboardingCardDesc'),
      iconName: 'pinDropLocation',
      classes: {iconFrame: styles.stopsIconFrame},
      onClick: () => setSelectedModal('STOP'),
      state: schoolTransportSettings?.data?.is_school_address_set
        ? transportAggregates?.data?.total_pickup_points
          ? ONBOARDING_CARD_STATE.COMPLETED
          : ONBOARDING_CARD_STATE.TODO
        : ONBOARDING_CARD_STATE.DISABLED,
      permissionId:
        PERMISSION_CONSTANTS.transportPickupPointController_updateRoute_update,
    },
    {
      title: t('vehicles'),
      desc: t('vehiclesOnboardingCardDesc'),
      iconName: 'bus1',
      classes: {iconFrame: styles.vehiclesIconFrame},
      onClick: () => setSelectedModal('VEHICLE'),
      state: schoolTransportSettings?.data?.is_school_address_set
        ? transportAggregates?.data?.total_vehicles
          ? ONBOARDING_CARD_STATE.COMPLETED
          : ONBOARDING_CARD_STATE.TODO
        : ONBOARDING_CARD_STATE.DISABLED,
      permissionId:
        PERMISSION_CONSTANTS.transportVehicleController_updateRoute_update,
    },
    {
      title: t('transportStaff'),
      desc: t('transportStaffOnboardingCardDesc'),
      iconName: 'people',
      classes: {iconFrame: styles.staffIconFrame},
      onClick: () => setSelectedModal('STAFF'),
      state: schoolTransportSettings?.data?.is_school_address_set
        ? transportAggregates?.data?.total_staff
          ? ONBOARDING_CARD_STATE.COMPLETED
          : ONBOARDING_CARD_STATE.TODO
        : ONBOARDING_CARD_STATE.DISABLED,
      permissionId:
        PERMISSION_CONSTANTS.transportStaffController_updateRoute_update,
    },
    {
      title: t('createRoute'),
      desc: t('routeOnboardingCardDesc'),
      iconName: 'swapCalls',
      classes: {iconFrame: styles.routesIconFrame},
      onClick: () => setSelectedModal('ROUTE'),
      state: getRouteOnboardingCardState(),
      permissionId:
        PERMISSION_CONSTANTS.transportRouteController_updateRoute_update,
    },
  ]

  const getSeletedModal = () => {
    switch (selectedModal) {
      case 'SCHOOL_ADDRESS':
        return (
          <SchoolAddressModal
            showModal={true}
            setShowModal={setSelectedModal}
          />
        )
      case 'STOP':
        return (
          <ManualAdditionModal
            showModal={true}
            setShowModal={setSelectedModal}
            isOnboarding={true}
            allotedPassengerIds={getAllotedPassengersIds()}
          />
        )
      case 'VEHICLE':
        return (
          <VehicleFormModal showModal={true} setShowModal={setSelectedModal} />
        )
      case 'STAFF':
        return (
          <StaffFormModal showModal={true} setShowModal={setSelectedModal} />
        )
      case 'ROUTE':
        return (
          <RouteFormModal
            showModal={true}
            setShowModal={setSelectedModal}
            isOnboarding={true}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.onboarding}>
      <div className={styles.header}>
        <HeaderTemplate
          breadcrumbObj={{paths: breadCrumbPaths}}
          mainHeading={t('setupConfiguration')}
          subHeading={t('setupTransportDesc')}
          classes={{divider: styles.headerTemplateDivider}}
        />
        <ProgressTrackerCard progressPercentage={setupPercentage} />
      </div>
      <Divider spacing="16px" />
      <div className={styles.onboardingCardsWrapper}>
        {onboardingCardsData.map((cardObj) => (
          <Permission key={cardObj.title} permissionId={cardObj.permissionId}>
            <OnboardingCard
              title={cardObj.title}
              desc={cardObj.desc}
              iconName={cardObj.iconName}
              classes={cardObj.classes}
              onClick={
                cardObj.state === ONBOARDING_CARD_STATE.DISABLED
                  ? null
                  : cardObj.onClick
              }
              state={cardObj.state}
            />
          </Permission>
        ))}
      </div>
      {getSeletedModal()}
    </div>
  )
}
