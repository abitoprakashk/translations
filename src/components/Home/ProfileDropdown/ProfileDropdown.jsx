import {React} from 'react'
import {useSelector} from 'react-redux'
import {
  setAdminSpecificToLocalStorage,
  getAdminSpecificFromLocalStorage,
} from '../../../utils/Helpers'
import instituteDefaultImg from '../../../assets/images/icons/sidebar/institute-default.svg'
import {
  BROWSER_STORAGE_KEYS,
  ORGANISATION_TYPES,
} from '../../../constants/institute.constants'
// import {utilsGetCurrentAdmin} from '../../../routes/dashboard'
import {DASHBOARD} from '../../../utils/SidebarItems'
import classNames from 'classnames'
import styles from '../Navbar/Navbar.module.css'
import {
  Divider,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {Trans} from 'react-i18next'
import useSendEvent from '../../../pages/AttendanceReport/hooks/useSendEvent'
import {events} from '../../../utils/EventsConstants'

export default function ProfileDropdown({setShowDetails}) {
  const {instituteInfo, instituteListInfo, organisationInfo} = useSelector(
    (state) => state
  )
  const sendEvent = useSendEvent()

  const CurrentOrgId = getAdminSpecificFromLocalStorage(
    BROWSER_STORAGE_KEYS.CURRENT_ORG_ID
  )

  const handleShowDashboard = async (
    institute,
    type = ORGANISATION_TYPES.INSTITUTE
  ) => {
    sendEvent(events.INSTITUTE_DROP_DOWN_INSTI_SELECTED_TFI, {
      type: organisationInfo?._id
        ? 'multi institute dashboard'
        : 'institute dashboard',
    })

    if (institute?._id) {
      const storageKeyToUpdate =
        type === ORGANISATION_TYPES.ORGANISATION
          ? BROWSER_STORAGE_KEYS.CURRENT_ORG_ID
          : BROWSER_STORAGE_KEYS.CURRENT_INSTITUTE_ID

      const storageKeyToRemove =
        type === ORGANISATION_TYPES.ORGANISATION
          ? BROWSER_STORAGE_KEYS.CURRENT_INSTITUTE_ID
          : BROWSER_STORAGE_KEYS.CURRENT_ORG_ID

      setAdminSpecificToLocalStorage(storageKeyToUpdate, institute._id)
      setAdminSpecificToLocalStorage(storageKeyToRemove, null)

      // Whenever user moves between institutes, redirect to dashboard and then reload
      location.pathname = DASHBOARD
    }
  }
  return (
    <div className={styles.profileDropdownContainer}>
      {organisationInfo?._id && (
        <div
          className={classNames(
            styles.instituteInfoContainerInactive,
            CurrentOrgId ? styles.activeOrgItem : styles.inactiveOrgItem
          )}
          onClick={() =>
            handleShowDashboard(
              organisationInfo,
              ORGANISATION_TYPES.ORGANISATION
            )
          }
        >
          <img
            src={organisationInfo?.org_logo || instituteDefaultImg}
            className={classNames(
              styles.instituteInfoIcon,
              styles.roundedBorder
            )}
            alt=""
          />
          <div>
            <div className={styles.instituteInfoName}>
              {organisationInfo?.name}
            </div>
            <Para
              weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
              className={styles.orgInfoSubTitle}
            >
              <Trans i18nKey={'orgId'}>ID: {organisationInfo._id} </Trans>
              <Trans i18nKey={'branchCount'}>
                - {`${instituteListInfo?.length || '0'}`} branches
              </Trans>
            </Para>
          </div>
        </div>
      )}
      {organisationInfo?._id && (
        <Divider spacing={CurrentOrgId ? '0' : '16px'} />
      )}

      {instituteInfo?._id && !CurrentOrgId && (
        <div className={classNames(styles.instituteInfoContainerActive)}>
          <div className={styles.instituteInfoNameContainer}>
            <img
              src={instituteInfo?.ins_logo || instituteDefaultImg}
              className={classNames(
                styles.instituteInfoIcon,
                styles.roundedBorder
              )}
              alt=""
            />
            <div className={classNames(styles.instituteInfoName)}>
              {instituteInfo?.name}
            </div>
            {!organisationInfo?._id && (
              <div className={styles.instituteInfoCheckIcon}>
                <Icon
                  name="checkCircle1"
                  type={ICON_CONSTANTS.TYPES.SUCCESS}
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                />
              </div>
            )}
          </div>
          <div
            onClick={(e) => {
              setShowDetails(true)
              e.stopPropagation()
            }}
            className={styles.instituteInfoGearIcon}
          >
            <Icon
              name="settings"
              type={ICON_CONSTANTS.TYPES.BASIC}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
          </div>
        </div>
      )}

      {instituteListInfo
        ?.filter(({_id}) => (CurrentOrgId ? true : _id !== instituteInfo?._id))
        ?.map((item) => (
          <div
            className={styles.instituteInfoContainerInactive}
            key={item?._id}
            onClick={() => handleShowDashboard(item)}
          >
            <img
              src={item?.ins_logo || instituteDefaultImg}
              className={classNames(
                styles.instituteInfoIcon,
                styles.roundedBorder
              )}
              alt=""
            />
            <div className={styles.instituteInfoName}>
              {item?.name}
              {organisationInfo?._id && (
                <div
                  className={classNames(
                    styles.instituteInfoContainerOrgInactive
                  )}
                >
                  <Para
                    weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
                    className={styles.orgInfoSubTitle}
                  >
                    <Trans i18nKey={'tfiId'}>ID: {item._id} </Trans>
                  </Para>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  )
}
