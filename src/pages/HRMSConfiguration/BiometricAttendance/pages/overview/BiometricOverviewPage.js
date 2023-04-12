import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import StatsSection from './components/overviewCards/StatsSection'
import AttendanceLogs from './components/attendanceLogs/AttendanceLogs'
import {DateTime} from 'luxon'
import {
  HeaderTemplate,
  Divider,
  Table,
  Para,
  Button,
  Icon,
  ICON_CONSTANTS,
  BUTTON_CONSTANTS,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import styles from './biometricOverview.module.css'
import {fetchStaffListRequestAction} from '../../../../../components/Attendance/components/StaffAttendance/redux/actions/StaffAttendanceActions'
import {Trans, useTranslation} from 'react-i18next'
import globalActions from '../../../../../redux/actions/global.actions'
import {useCallback} from 'react'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {createAndDownloadCSV, JSObjectToCSV} from '../../../../../utils/Helpers'
import {events} from '../../../../../utils/EventsConstants'
import InstructionsForSetup from './components/instructionsForSetup/instructionsForSetup'
import {ATTENDANCE_METHOD} from '../../../AttendanceShifts/constants/shift.constants'
import SetupCard from '../../../../../components/Common/SetupCard/SetupCard'
import history from '../../../../../history'
import {sidebarData} from '../../../../../utils/SidebarItems'
import RequestBiometricModal from './components/requestBiometricModal/RequestBiometricModal'
import Loader from '../../../../../components/Common/Loader/Loader'
import {getUTCTimeStamp} from '../../../../../components/Attendance/components/StaffAttendance/commonFunctions'

export default function BiometricOverviewPage() {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)
  const [selectedDate, setSelectedDate] = useState(
    DateTime.now().toFormat('yyyy-MM-dd')
  )

  // required part
  const {data: biometricMachines, isLoading: isBiometricMachinesListLoading} =
    useSelector((state) => state?.globalData?.fetchBiometricMachinesList)

  const {
    data: fetchBiometricAttendance,
    isLoading: isBiometricAttendanceListLoading,
  } = useSelector((state) => state?.globalData?.fetchBiometricAttendance)

  const {data: biometricUserMapping, isLoading: isBiometricUsersListLoading} =
    useSelector((state) => state?.globalData?.fetchBiometricUsersList)

  const {data: fetchBiometricSettings, isLoading: isBiometricSettingsLoading} =
    useSelector((state) => state?.globalData?.fetchBiometricSettings)

  const {
    data: fetchBiometricAggregates,
    isLoading: isBiometricAggregatesLoading,
  } = useSelector((state) => state?.globalData?.fetchBiometricAggregates)

  const {data: shiftList, isLoading: isShiftListLoading} = useSelector(
    (state) => state?.globalData?.shiftList
  )

  const [lastUpdatedTime, setLastUpdatedTime] = useState('--')
  const [biometricRequestError, setBiometricRequestError] = useState({
    question1Option1: '',
    question1Option2: '',
    question2Option1: '',
    question2Option2: '',
  })

  const [allRows, setAllRows] = useState([])

  const [session, setSession] = useState({
    startDate: null,
    endDate: null,
  })

  const [dateObj, setDateObj] = useState(new Date())

  const instituteActiveAcademicSessionId = useSelector(
    (state) => state.instituteActiveAcademicSessionId
  )

  const {start_time, end_time} = useSelector((state) =>
    state.instituteAcademicSessionInfo.find(
      ({_id}) => _id === instituteActiveAcademicSessionId
    )
  )

  const {staffListData} = useSelector((state) => state.staffAttendance)
  const [biometricStaffIds, setBiometricStaffIds] = useState([])
  const [showRequestBiometricModal, setShowRequestBiometricModal] =
    useState(false)

  const mapAttendanceLogWithUser = () => {
    let iids_list = []

    biometricUserMapping?.forEach((user) => {
      iids_list.push(user.iid)
    })

    let InfoMappingDict = {}

    staffListData?.forEach((staff) => {
      if (iids_list.includes(staff._id)) {
        InfoMappingDict[staff._id] = {
          name: staff.name,
          role_name: staff.role_name,
          phone_number: staff.phone_number,
          email_id: staff.email,
          employee_id: staff.employee_id,
        }
      }
    })

    let rows = []

    let staffShiftNameMap = {}
    shiftList?.map((shift) => {
      if (shift?.staffs?.length > 0) {
        shift?.staffs?.map((staff) => (staffShiftNameMap[staff] = shift?.name))
      }
    })

    fetchBiometricAttendance?.attendance_log?.forEach((log) => {
      if (InfoMappingDict?.[log?.iid]) {
        rows.push({
          user_details: rowItemPreview(
            InfoMappingDict?.[log?.iid]?.name,
            InfoMappingDict?.[log?.iid]?.employee_id
          ),
          shift_name: staffShiftNameMap?.[log?.iid],
          employee_id: InfoMappingDict?.[log?.iid]?.employee_id,
          name: InfoMappingDict?.[log?.iid]?.name,
          phone_number_or_email:
            InfoMappingDict?.[log?.iid]?.phone_number ||
            InfoMappingDict?.[log?.iid]?.email_id,
          phone_number: InfoMappingDict?.[log?.iid]?.phone_number,
          email_id: InfoMappingDict?.[log?.iid]?.email_id,
          role: InfoMappingDict?.[log?.iid]?.role_name,
          punch_in_time: log?.punch_in_time
            ? DateTime.fromSeconds(log.punch_in_time).toFormat('hh:mm:ss a')
            : '-',
          punch_out_time: log?.punch_out_time
            ? DateTime.fromSeconds(log.punch_out_time).toFormat('hh:mm:ss a')
            : '-',
        })
      }
    })

    return rows
  }

  useEffect(() => {
    setDateObj(new Date(selectedDate))
  }, [selectedDate])

  useEffect(() => {
    const startDate = DateTime.fromMillis(Number(start_time))
    const endDate = DateTime.min(
      DateTime.local(),
      DateTime.fromMillis(Number(end_time))
    )

    setSession({
      startDate: startDate.toJSDate(),
      endDate: endDate.toJSDate(),
    })

    if (dateObj > endDate) {
      setDateObj(endDate.toJSDate())
      handleCalendarChange(endDate.toFormat('yyyy-MM-dd'))
    }
  }, [start_time, end_time])

  // Fetch Attendance List
  useEffect(() => {
    let payload = {
      from_date: getUTCTimeStamp(selectedDate),
      to_date: getUTCTimeStamp(selectedDate),
    }
    dispatch(globalActions?.fetchBiometricAttendance?.request(payload))
    dispatch(fetchStaffListRequestAction())
  }, [selectedDate, instituteActiveAcademicSessionId])

  const rowItemPreview = (dataInFirstRow, dataInSecondRow) => (
    <div>
      <Para
        type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
        className={styles.phoneNumber}
      >
        {dataInFirstRow}
      </Para>
      {dataInSecondRow && (
        <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
          {dataInSecondRow}
        </Para>
      )}
    </div>
  )

  useEffect(() => {
    let mappedAttendanceLogs = mapAttendanceLogWithUser()
    setAllRows(mappedAttendanceLogs)
    if (fetchBiometricAttendance?.last_received_at) {
      setLastUpdatedTime(
        DateTime.fromSeconds(
          fetchBiometricAttendance?.last_received_at
        ).toFormat('hh:mm:ss a')
      )
    }
  }, [biometricUserMapping, fetchBiometricAttendance, staffListData])

  const handleCalendarChange = useCallback(
    (formattedDate) => {
      setSelectedDate(formattedDate)
    },
    [selectedDate]
  )

  useEffect(() => {
    dispatch(globalActions?.fetchBiometricMachinesList?.request())
    dispatch(globalActions?.fetchBiometricUsersList?.request())
    dispatch(globalActions?.fetchBiometricAggregates?.request())
    dispatch(globalActions?.fetchBiometricSettings?.request())
    dispatch(fetchStaffListRequestAction())
  }, [])

  const ATTENDANCE_TABLE_COLUMNS = [
    {key: 'user_details', label: t('userDetails1')},
    {key: 'shift_name', label: t('shiftName')},
    {key: 'phone_number_or_email', label: t('phoneNumberOrEmailID')},
    {key: 'role', label: t('userRolesPlaceholder')},
    {key: 'punch_in_time', label: t('punchInTime')},
    {key: 'punch_out_time', label: t('punchOutTime')},
  ]

  const handleDownloadAttendanceLog = () => {
    let headers = ATTENDANCE_TABLE_COLUMNS.map((obj) => obj.label)
    headers.splice(1,0,t('employeeIdSm'));
    let downloadedCSVData = []

    allRows?.forEach((user) => {
      let tempData = {}
      tempData[t('userDetails1')] = user?.name
      tempData[t('employeeIdSm')] = user?.employee_id
      tempData[t('shiftName')] = user?.shift_name || '-'
      tempData[t('phoneNumberOrEmailID')] =
        user?.phone_number || user?.email_id || 'NA'
      tempData[t('userRolesPlaceholder')] = user?.role
      tempData[t('punchInTime')] = user?.punch_in_time
      tempData[t('punchOutTime')] = user?.punch_out_time
      downloadedCSVData.push(tempData)
    })

    let title = `Biometric Attendance Logs ${DateTime.fromFormat(
      selectedDate,
      'yyyy-MM-dd'
    ).toFormat('dd-MM-yyyy')}`
    createAndDownloadCSV(`${title}`, JSObjectToCSV(headers, downloadedCSVData))
  }

  useEffect(() => {
    dispatch(globalActions?.fetchShiftList?.request())
  }, [])

  useEffect(() => {
    if (shiftList) {
      const staffInBiometricShifts = shiftList
        .filter(
          (shift) =>
            shift?.setting?.attendance_method === ATTENDANCE_METHOD.BIOMETRIC
        )
        .reduce(
          (acc, shift) => Array.from(new Set([...acc, ...shift?.staffs])),
          []
        )
      setBiometricStaffIds([...staffInBiometricShifts])
    }
  }, [shiftList])

  const getAutomatedAttendanceSetupCard = () => {
    return (
      <SetupCard
        heading={t('setupAutomatedAttendance')}
        text={t('setupSchoolTimings')}
        actionBtn={t('setupNow')}
        onClick={() => {
          eventManager.send_event(
            events.SETUP_AUTOMATED_ATTENDANCE_CLICKED_TFI,
            {screen_name: 'biometric_configuration'}
          )
          history.push({
            pathname: `${sidebarData.HRMS_CONFIGURATION.subRoutes[0]}`, //go to attendance shifts
            state: {
              showCreateShiftModal: true,
            },
          })
        }}
        permissionId={
          PERMISSION_CONSTANTS.InstituteShiftController_update_route_create
        }
      />
    )
  }

  return (
    <div className={styles.mainWrapper}>
      <Loader
        show={
          isBiometricMachinesListLoading ||
          isBiometricAttendanceListLoading ||
          isBiometricUsersListLoading ||
          isBiometricSettingsLoading ||
          isBiometricAggregatesLoading ||
          isShiftListLoading
        }
      />

      {!fetchBiometricSettings?.requested_biometric &&
      !fetchBiometricAggregates?.total_machines &&
      !fetchBiometricAggregates?.total_users_mapped ? (
        biometricStaffIds?.length === 0 ? (
          getAutomatedAttendanceSetupCard()
        ) : (
          <SetupCard
            heading={t('biometricIntegration')}
            text={t('biometricIntegrationSubText')}
            actionBtn={t('request')}
            onClick={() => {
              eventManager.send_event(
                events.HRMS_BIOMETRIC_CONFIGURATION_REQUEST_CLICKED_TFI
              )
              setShowRequestBiometricModal(true)
            }}
            permissionId={
              PERMISSION_CONSTANTS.BiometricSettingsController_request__biometric_update
            }
          />
        )
      ) : (
        <div>
          {biometricStaffIds?.length === 0
            ? getAutomatedAttendanceSetupCard()
            : null}
          <StatsSection biometricStaffIds={biometricStaffIds} />

          {biometricMachines?.some((value) => value?.verified) &&
          biometricUserMapping?.some((value) => value?.registered) &&
          biometricStaffIds?.length > 0 ? (
            <>
              <Divider
                spacing="25px"
                classes={{
                  wrapper: styles.divider,
                }}
              />
              <div className={styles.container}>
                <div>
                  <HeaderTemplate
                    showBreadcrumb={false}
                    mainHeading={t('attendanceLogs')}
                    subHeading={
                      <Trans i18nKey="lastUpdatedAt">
                        Last updated at {{lastUpdatedTime}}
                      </Trans>
                    }
                    classes={{
                      divider: styles.hideDivider,
                      subHeading: styles.subHeading,
                    }}
                  />
                </div>
                <div className={styles.downloadCSVButton}>
                  <Permission
                    permissionId={
                      PERMISSION_CONSTANTS.BiometricAttendanceController_list_read
                    }
                  >
                    <Button
                      onClick={() => {
                        handleDownloadAttendanceLog()
                        eventManager.send_event(
                          events.HRMS_DOWNLOAD_ATTENDANCE_LOG_CLICKED_TFI
                        )
                      }}
                      prefixIcon={
                        <Icon
                          name="download"
                          type={ICON_CONSTANTS.TYPES.INVERTED}
                          size={ICON_CONSTANTS.SIZES.XX_SMALL}
                        />
                      }
                      width={BUTTON_CONSTANTS.WIDTH.FULL}
                      type={BUTTON_CONSTANTS.TYPE.FILLED}
                      classes={{
                        label: styles.marginRight,
                      }}
                    >
                      <span className={styles.marginLeft}>{t('download')}</span>
                    </Button>
                  </Permission>
                </div>
              </div>
              <div className={styles.marginForCalendar}>
                {session.startDate && (
                  <AttendanceLogs
                    session={session}
                    selectedDate={dateObj}
                    handleCalendarChange={handleCalendarChange}
                  />
                )}
              </div>
              <div className={styles.marginForCalendar}>
                <Table rows={allRows || []} cols={ATTENDANCE_TABLE_COLUMNS} />
              </div>
            </>
          ) : (
            <InstructionsForSetup />
          )}
        </div>
      )}
      <RequestBiometricModal
        showModal={showRequestBiometricModal}
        setShowModal={setShowRequestBiometricModal}
        biometricRequestError={biometricRequestError}
        setBiometricRequestError={setBiometricRequestError}
      />
    </div>
  )
}
