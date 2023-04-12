import {t} from 'i18next'
import {useSelector} from 'react-redux'
import {biometricUsersRoutesList} from '../../utils/routing.constants'
import {ATTENDANCE_METHOD} from '../../../AttendanceShifts/constants/shift.constants'

export const BiometricUsersTablist = () => {
  const biometricUserMapping = useSelector(
    (state) => state?.globalData?.fetchBiometricUsersList?.data
  )
  const {staffListData} = useSelector((state) => state.staffAttendance)
  const shiftList = useSelector((state) => state?.globalData?.shiftList?.data)

  let staffInBiometricShifts = []
  if (shiftList) {
    staffInBiometricShifts = shiftList
      .filter(
        (shift) =>
          shift?.setting?.attendance_method === ATTENDANCE_METHOD.BIOMETRIC
      )
      .reduce(
        (acc, shift) => Array.from(new Set([...acc, ...shift?.staffs])),
        []
      )
  }

  const usersMappedToShifts =
    staffListData?.filter((obj) => {
      if (staffInBiometricShifts.includes(obj?._id)) {
        return obj
      }
    }) || []

  return {
    all: {
      id: 1,
      route: biometricUsersRoutesList.all,
      label: `${t('allUsers')} (${
        usersMappedToShifts?.length ? usersMappedToShifts.length : 0
      })`,
    },
    registered: {
      id: 2,
      route: biometricUsersRoutesList.registered,
      label: `${t('registeredUsers')} (${
        biometricUserMapping
          ? biometricUserMapping.filter((user) => user?.registered === true)
              .length
          : 0
      })`,
    },
    unregistered: {
      id: 3,
      route: biometricUsersRoutesList.unregistered,
      label: `${t('unregisteredUsers')} (${
        biometricUserMapping && usersMappedToShifts?.length
          ? usersMappedToShifts.length -
            biometricUserMapping.filter((user) => user?.registered === true)
              .length
          : 0
      })`,
    },
  }
}
