import {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './OverviewPage.module.css'
import {createPortal} from 'react-dom'
import {t} from 'i18next'
import {useLocation} from 'react-router-dom'
import history from '../../../../../history'
import {
  Alert,
  ALERT_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import ShiftCard from '../ShiftCard/ShiftCard'
import Loader from '../../../../../components/Common/Loader/Loader'
import Permission from '../../../../../components/Common/Permission/Permission'
import AddEditShiftModal from '../AddEditShfitModal/AddEditShiftModal'
import {fetchStaffListRequestAction} from '../../../../../components/Attendance/components/StaffAttendance/redux/actions/StaffAttendanceActions'
import {getQRCodeUrl, getStaffGroups} from '../../utils/shift.utils'
import globalActions from '../../../../../redux/actions/global.actions'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {STAFF_TYPE, CREATE_SHIFT_MODEL} from '../../constants/shift.constants'
import {events} from '../../../../../utils/EventsConstants'
import QRCodeModal from '../QRCodeModal/QRCodeModal'
import EmptyLandingPageView from '../EmptyLandingPageView/EmptyLandingPageView'

export default function OverviewPage() {
  const location = useLocation()
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const {staffListData} = useSelector((state) => state.staffAttendance)
  const {data: staffListMapping, isLoading: isStaffListMappingLoading} =
    useSelector((state) => state.globalData.staffShiftMap)
  const {data: shiftList, isLoading: isShiftListLoading} = useSelector(
    (state) => state.globalData.shiftList
  )
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const sessionId = useSelector(
    (state) => state.instituteActiveAcademicSessionId
  )
  const {data: biometricMachineList, isLoading: isBiometricMachineListLoading} =
    useSelector((state) => state.globalData.fetchBiometricMachinesList)
  const [alertStaffCountMsg, setAlertStaffCountMsg] = useState('')
  const [showCreateShiftModal, setShowCreateShiftModal] = useState(false)
  const [showQRCodeModal, setShowQRCodeModal] = useState(false)
  const portalContainer = useRef(null)
  if (!portalContainer.current) {
    portalContainer.current = document.getElementById(
      'shift-configuration-header'
    )
  }

  useEffect(() => {
    dispatch(globalActions?.fetchShiftList?.request())
    dispatch(globalActions?.fetchStaffShiftMapping?.request())
    if (!biometricMachineList) {
      dispatch(globalActions.fetchBiometricMachinesList.request())
    }
    dispatch(fetchStaffListRequestAction())
  }, [])

  useEffect(() => {
    if (instituteInfo?._id && sessionId) {
      const url = getQRCodeUrl(instituteInfo?._id, sessionId)
      dispatch(
        globalActions?.fetchShiftQRCode?.request({
          data: url,
          size: 5,
        })
      )
    }
  }, [instituteInfo, sessionId])

  useEffect(() => {
    if (location.state) {
      setShowCreateShiftModal(location.state.showCreateShiftModal)
      history.replace()
    }
  }, [location.state])

  const setStaffAlertMessage = () => {
    const staffNotAddedToShift = staffListData.filter((staff) => {
      return !staffListMapping.find((mapping) => mapping.iid === staff._id)
    })
    if (staffNotAddedToShift.length === 0) {
      setAlertStaffCountMsg('')
      return
    }
    const staffGroups = getStaffGroups(staffNotAddedToShift)
    const teacherCount = staffGroups?.[STAFF_TYPE.TEACHING]?.length
    const staffCount = staffGroups?.[STAFF_TYPE.NON_TEACHING]?.length

    setAlertStaffCountMsg(
      `${teacherCount > 0 ? `${teacherCount} ${t('teachers')}` : ''} 
      ${teacherCount && staffCount ? ` ${t('and')}` : ''}
      ${staffCount > 0 ? `${staffCount} ${t('staffMembers')}` : ''} ${t(
        'notAddedToAnyShift'
      )}`
    )
  }

  useEffect(() => {
    if (staffListData && staffListMapping && shiftList) {
      setStaffAlertMessage()
    }
  }, [staffListMapping, staffListData, shiftList])

  return (
    <div>
      <Loader
        show={
          isShiftListLoading ||
          isStaffListMappingLoading ||
          isBiometricMachineListLoading
        }
      />
      {shiftList?.length === 0 ? (
        <EmptyLandingPageView />
      ) : (
        <>
          {portalContainer.current &&
            createPortal(
              <div className={styles.shiftHeaderBtnWrapper}>
                <Button
                  type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                  category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
                  onClick={() => setShowQRCodeModal(true)}
                  prefixIcon={'download'}
                >
                  {t('downloadQRCode')}
                </Button>
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.InstituteShiftController_update_route_create
                  }
                >
                  <Button
                    type={BUTTON_CONSTANTS.TYPE.FILLED}
                    category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
                    onClick={() => {
                      setShowCreateShiftModal(true)
                      eventManager.send_event(
                        events.CREATE_NEW_SHIFT_CLICKED_TFI,
                        {screen_name: 'attendance_shifts'}
                      )
                    }}
                  >
                    {t('createNewShift')}
                  </Button>
                </Permission>
              </div>,
              portalContainer.current
            )}
          {alertStaffCountMsg && !isStaffListMappingLoading ? ( //should mount on every staff mapping request
            <Alert
              type={ALERT_CONSTANTS.TYPE.WARNING}
              content={alertStaffCountMsg}
              className={styles.alertMsg}
            />
          ) : null}
          <div className={styles.shiftCardContainer}>
            {shiftList?.map((shift) => {
              return <ShiftCard key={shift._id} shift={shift} />
            })}
          </div>
        </>
      )}
      {/* Add or edit a shift modal */}
      {showCreateShiftModal && (
        <AddEditShiftModal
          showModal={showCreateShiftModal}
          setShowModal={setShowCreateShiftModal}
          header={t('setupAttendanceConfiguration')}
          shift={CREATE_SHIFT_MODEL}
          isEdit={false}
        />
      )}
      {/* QR code download modal */}
      {showQRCodeModal && (
        <QRCodeModal
          isOpen={showQRCodeModal}
          onClose={() => setShowQRCodeModal(false)}
        />
      )}
    </div>
  )
}
